#!/usr/bin/env python3
"""Local CREDO archive. No network API credentials required."""
import base64, csv, hashlib, io, json, logging, math, os, re, signal, sqlite3, threading, time
from pathlib import Path
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs, urljoin
import legacy
from PIL import Image

ROOT = Path(__file__).parent
# CREDO_MAC_LOCALHOST_BIND_V1
DATA = Path(os.environ.get('CREDO_DATA_DIR', legacy.CFG['CACHE_DIR']))
DB = DATA / 'archive.sqlite3'
IMAGES = DATA / 'images'
CLASSES = ['SPOT','TRACK','WORM','WORM / TRACK','ARTEFAKT','BRAK DANYCH']
LOCK = threading.Lock()
STOP = threading.Event()

# CREDO_FEATURES_20260914
ARCHIVE_LOCK = threading.Lock()

def connect():
    c = sqlite3.connect(DB, timeout=30)
    c.row_factory = sqlite3.Row
    return c

def meta(key, default=None):
    with connect() as c:
        r = c.execute('SELECT value FROM meta WHERE key=?',(key,)).fetchone()
    return json.loads(r[0]) if r else default

def setmeta(c, key, value):
    c.execute('INSERT OR REPLACE INTO meta VALUES (?,?)',(key,json.dumps(value,ensure_ascii=False)))

def analyse(raw):
    if not raw: return {'class':'BRAK DANYCH','clusters':[], 'active_pixels':None}
    with Image.open(io.BytesIO(raw)) as im:
        if im.width * im.height > 1048576: raise ValueError('Obraz zbyt duży')
        im = im.convert('L')
        w,h = im.size
        pixels = list(im.getdata())
    values = sorted(pixels)
    bg = values[len(values)//2]
    mad = sorted(abs(v-bg) for v in values)[len(values)//2]
    threshold = max(bg+12, bg+8*max(1,mad))
    active = {i for i,v in enumerate(pixels) if v >= threshold}
    result = dict(active_pixels=len(active), threshold=threshold, background=bg,
                  peak=max(pixels), crop_width=w, crop_height=h, clusters=[])
    if len(active)>max(300,w*h*.08):
        return dict(result, **{'class':'ARTEFAKT'})
    remaining = set(active)
    while remaining:
        start=remaining.pop(); stack=[start]; component=[start]
        while stack:
            i=stack.pop(); x=i%w; y=i//w
            for yy in range(max(0,y-1),min(h,y+2)):
                for xx in range(max(0,x-1),min(w,x+2)):
                    j=yy*w+xx
                    if j in remaining:
                        remaining.remove(j); stack.append(j); component.append(j)
        xs=[i%w for i in component]; ys=[i//w for i in component]; n=len(xs)
        mx=sum(xs)/n; my=sum(ys)/n
        a=sum((x-mx)**2 for x in xs)/n
        b=sum((x-mx)*(y-my) for x,y in zip(xs,ys))/n
        d=sum((y-my)**2 for y in ys)/n
        delta=math.sqrt((a-d)**2+4*b*b)
        l1=(a+d+delta)/2; l2=max(.01,(a+d-delta)/2)
        elong=math.sqrt(max(0,l1)/l2)
        angle=math.degrees(.5*math.atan2(2*b,a-d))%180 if n>1 else None
        bw=max(xs)-min(xs)+1; bh=max(ys)-min(ys)+1
        length=math.hypot(bw-1,bh-1)+1
        label='SPOT' if max(bw,bh)<=4 else 'TRACK' if elong>=2.1 and n>=5 else 'WORM / TRACK'
        result['clusters'].append(dict(pixels=n,bbox=[bw,bh],length_px=round(length,2),
                                      angle_deg=round(angle,1) if angle is not None else None,
                                      elongation=round(elong,2), **{'class':label}))
    result['clusters'].sort(key=lambda a:a['pixels'],reverse=True)
    dominant=result['clusters'][0] if result['clusters'] else {}
    result['class']=dominant.get('class','BRAK DANYCH')
    result['bbox']=dominant.get('bbox')
    result['elongation']=dominant.get('elongation')
    return result

class ProfileParser(legacy.PublicProfileParser):
    def handle_starttag(self,tag,attrs):
        super().handle_starttag(tag,attrs)
        if self._row is not None:
            self._row.attrs_text += ' ' + self._attrs_text(attrs)
    def handle_data(self,data):
        self.all_text.append(data)
        if self._cell is not None: self._cell.append(data)
        if self._row is not None: self._row.attrs_text += ' ' + data + ' '

def parse_page(raw):
    p=ProfileParser(); source=raw.decode('utf-8',errors='replace'); p.feed(source)
    txt=legacy.clean_text(' '.join(p.all_text))
    count=re.search(r'Number of detections\s*:\s*(\d+)',txt,re.I)
    runtime=legacy.parse_duration_seconds(txt)
    records=[]
    for row in p.rows:
        full=' '.join(row.cells)+' '+row.attrs_text
        dates=legacy.DATE_RE.findall(full)
        if not dates: continue
        # Prefer exact time over a second-only data-sort attribute.
        date=max(dates,key=len).replace('T',' ')
        x,y=legacy.extract_xy(full)
        records.append(dict(timestamp=date,x=x,y=y,src=row.image_src))
    if count is None and not records:
        raise ValueError('Nie rozpoznano profilu CREDO; poprzednie dane zachowane')
    links=re.findall(r'href=[\"\']([^\"\']+)[\"\']',source,re.I)
    paging=[u for u in links if re.search(r'[?&](page|offset|start)=',u)]
    return records,dict(accepted=int(count[1]) if count else None, runtime=runtime,
                       visible=len(records),pagination_links=paging[:30],
                       coverage='Niepotwierdzona kompletność publicznej historii')

def store_record(c, record, raw=None, source='public'):
    timestamp=str(record['timestamp']).replace('T',' ')
    datetime.fromisoformat(timestamp)
    x=record.get('x'); y=record.get('y')
    for v in (x,y):
        if v is not None and (type(v) is not int or not 0<=v<100000):
            raise ValueError('Nieprawidłowe współrzędne')
    digest=hashlib.sha256(raw).hexdigest() if raw else None
    image_name=None
    if raw:
        metrics=analyse(raw)
        # Store the exact original PNG, without resampling.
        if not raw.startswith(b'\x89PNG'): raise ValueError('Wymagany obraz PNG')
        image_name=digest+'.png'
        target=IMAGES/image_name
        if not target.exists(): target.write_bytes(raw)
    else: metrics={'class':'BRAK DANYCH','clusters':[]}
    # Match migrated second-only timestamps with the precise public timestamp.
    matches=c.execute('SELECT * FROM events WHERE substr(timestamp,1,19)=? AND x IS ? AND y IS ?',
                      (timestamp[:19],x,y)).fetchall()
    match=next((r for r in matches if r['digest']==digest and digest and
                (r['timestamp']==timestamp or len(r['timestamp'])==19 or len(timestamp)==19)),None)
    if not match and raw:
        candidates=[r for r in matches if not r['digest'] and (r['timestamp']==timestamp or len(r['timestamp'])==19)]
        if len(candidates)==1:
            match=candidates[0]
            c.execute('UPDATE events SET digest=?,image=?,metrics=? WHERE id=?',(digest,image_name,json.dumps(metrics),match['id']))
    if not match and not raw and len(matches)==1:
        match=matches[0]
    if match:
        if len(timestamp)>len(match['timestamp']):
            c.execute('UPDATE events SET timestamp=? WHERE id=?',(timestamp,match['id']))
        return False
    identity='|'.join([timestamp,str(x),str(y),digest or str(record.get('src',''))])
    eid=hashlib.sha256(identity.encode()).hexdigest()[:32]
    c.execute('INSERT OR IGNORE INTO events(id,timestamp,x,y,digest,image,metrics,source,seen) VALUES(?,?,?,?,?,?,?,?,?)',
              (eid,timestamp,x,y,digest,image_name,json.dumps(metrics),source,legacy.now_iso()))
    return c.execute('SELECT changes()').fetchone()[0]>0

def init():
    DATA.mkdir(parents=True,exist_ok=True); IMAGES.mkdir(exist_ok=True)
    with connect() as c:
        c.executescript('''CREATE TABLE IF NOT EXISTS meta(key TEXT PRIMARY KEY,value TEXT);
        CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY,timestamp TEXT,x INTEGER,y INTEGER,
        digest TEXT,image TEXT,metrics TEXT,source TEXT,seen TEXT,manual TEXT,note TEXT DEFAULT '');
        CREATE INDEX IF NOT EXISTS events_time ON events(timestamp);
        CREATE INDEX IF NOT EXISTS events_xy ON events(x,y);
        CREATE TABLE IF NOT EXISTS edits(at TEXT,event_id TEXT,old_class TEXT,new_class TEXT,note TEXT);

        -- CREDO_EVENTS_REVISION_V1
        --
        -- Jeden trwały licznik zmiany tabeli events.
        -- Frontend może dzięki temu sprawdzić, czy musi
        -- ponownie pobierać pełne /api/events.
        --
        INSERT OR IGNORE INTO meta(key,value)
        VALUES('events_revision','0');

        CREATE TRIGGER IF NOT EXISTS
        events_revision_after_insert
        AFTER INSERT ON events
        BEGIN
            UPDATE meta
            SET value=CAST(value AS INTEGER)+1
            WHERE key='events_revision';
        END;

        CREATE TRIGGER IF NOT EXISTS
        events_revision_after_update
        AFTER UPDATE ON events
        BEGIN
            UPDATE meta
            SET value=CAST(value AS INTEGER)+1
            WHERE key='events_revision';
        END;

        CREATE TRIGGER IF NOT EXISTS
        events_revision_after_delete
        AFTER DELETE ON events
        BEGIN
            UPDATE meta
            SET value=CAST(value AS INTEGER)+1
            WHERE key='events_revision';
        END;

        -- CREDO_RESEARCH_JOURNAL_V1
        --
        -- Osobny dziennik badawczy.
        -- UPDATE i DELETE są blokowane triggerami.
        --
        CREATE TABLE IF NOT EXISTS research_journal(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            at TEXT NOT NULL,
            kind TEXT NOT NULL,
            subject_type TEXT NOT NULL,
            subject_id TEXT,
            title TEXT NOT NULL DEFAULT '',
            note TEXT NOT NULL DEFAULT '',
            algorithm_version TEXT,
            snapshot TEXT,
            prev_hash TEXT NOT NULL DEFAULT '',
            entry_hash TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS research_journal_at
        ON research_journal(at);

        CREATE INDEX IF NOT EXISTS research_journal_kind
        ON research_journal(kind);

        CREATE INDEX IF NOT EXISTS research_journal_subject
        ON research_journal(subject_type,subject_id);

        CREATE TRIGGER IF NOT EXISTS research_journal_no_update
        BEFORE UPDATE ON research_journal
        BEGIN
            SELECT RAISE(
                ABORT,
                'research_journal is append-only'
            );
        END;

        CREATE TRIGGER IF NOT EXISTS research_journal_no_delete
        BEFORE DELETE ON research_journal
        BEGIN
            SELECT RAISE(
                ABORT,
                'research_journal is append-only'
            );
        END;''')
        columns={r[1] for r in c.execute('PRAGMA table_info(events)')}
        if 'favorite' not in columns:
            c.execute('ALTER TABLE events ADD COLUMN favorite INTEGER NOT NULL DEFAULT 0')
    if not meta('migration_done',False):
        old=DATA/'status.json'
        with connect() as c:
            if old.exists():
                data=json.loads(old.read_text())
                for r in data.get('detections',[]):
                    name=r.get('image'); f=IMAGES/Path(name).name if name else None
                    store_record(c,r,f.read_bytes() if f and f.exists() else None,'v1-cache')
                setmeta(c,'profile',dict(accepted=data.get('accepted_detections'),runtime=data.get('detector_seconds'),visible=data.get('visible_detections'),updated=data.get('updated_at'),coverage='Migracja ostatniej listy v1; wcześniejsza historia może być niepełna'))
            setmeta(c,'migration_done',True)

def public_pages(raw, base):
    from html import unescape
    root=base.rstrip('/')
    parsed=urlparse(root)
    out=[]
    for link in re.findall(r'href=[\"\']([^\"\']+)[\"\']',raw.decode('utf-8',errors='replace'),re.I):
        u=urlparse(urljoin(base,unescape(link)))
        if u.scheme!=parsed.scheme or u.netloc!=parsed.netloc: continue
        suffix=u.path.removeprefix(parsed.path)
        if u.path==parsed.path or u.path==parsed.path+'/':
            target=root+'/'
        elif u.path.startswith(parsed.path+'/') and re.fullmatch(r'/[0-9]+/?',suffix):
            n=int(suffix.strip('/'));target=root+'/' if n==1 else root+'/'+str(n)
        else: continue
        if target not in out:out.append(target)
    return out

def refresh():
    if not LOCK.acquire(blocking=False): return
    try:
        base=str(legacy.CFG['PROFILE_URL']).rstrip('/')+'/'
        queue=[base]; visited=set(); new=0; image_errors=0; visible=0; summary={}; seenrows=set()
        while queue and len(visited)<50:
            url=queue.pop(0)
            if url in visited:continue
            # CREDO_SYNC_RESILIENCE_V1
            #
            # Publiczny profil potrafi chwilowo zwrócić 403/429 albo timeout
            # podczas przechodzenia przez wiele stron. Nie przerywamy
            # synchronizacji po pierwszym przejściowym błędzie.
            last_exc=None

            for attempt,delay in enumerate(
                (0,5,15,30),
                start=1
            ):
                if delay:
                    time.sleep(delay)

                try:
                    raw,_=legacy.fetch_bytes(
                        url,
                        25
                    )
                    last_exc=None
                    break

                except Exception as exc:
                    last_exc=exc
                    code=getattr(
                        exc,
                        'code',
                        None
                    )

                    if code is not None:
                        retryable=(
                            code in (
                                403,
                                429,
                                500,
                                502,
                                503,
                                504
                            )
                        )
                    else:
                        retryable=isinstance(
                            exc,
                            (
                                TimeoutError,
                                OSError
                            )
                        )

                    logging.warning(
                        (
                            "CREDO: retry strony "
                            "%d/4 url=%s "
                            "HTTP=%s error=%s"
                        ),
                        attempt,
                        url,
                        code,
                        exc
                    )

                    if (
                        not retryable
                        or attempt==4
                    ):
                        raise

            if last_exc is not None:
                raise last_exc
            records,current=parse_page(raw)
            if not summary:summary=current
            visited.add(url)
            for r in records:seenrows.add((r["timestamp"],r["x"],r["y"],r.get("src")))
            visible=len(seenrows)
            for link in public_pages(raw,base):
                if link not in visited and link not in queue:queue.append(link)
            with connect() as c:
                for r in records:
                    #
                    # Najpierw zapis/rozpoznanie rekordu BEZ pobierania PNG.
                    # Dla istniejących zdarzeń oszczędza to ponowne pobieranie
                    # setek tych samych obrazów przy każdym refreshu.
                    #
                    inserted=store_record(
                        c,
                        r,
                        None
                    )

                    if inserted:
                        new+=1

                    timestamp=(
                        str(
                            r['timestamp']
                        )
                        .replace(
                            'T',
                            ' '
                        )
                    )

                    has_image=c.execute(
                        '''
                        SELECT 1
                        FROM events
                        WHERE substr(timestamp,1,19)=?
                          AND x IS ?
                          AND y IS ?
                          AND image IS NOT NULL
                        LIMIT 1
                        ''',
                        (
                            timestamp[:19],
                            r.get('x'),
                            r.get('y')
                        )
                    ).fetchone()

                    #
                    # Obraz pobieramy tylko:
                    # - dla nowej detekcji
                    # - albo gdy istniejąca detekcja nie ma PNG.
                    #
                    if (
                        r.get('src')
                        and not has_image
                    ):
                        image=legacy.image_bytes(
                            r['src'],
                            url,
                            25
                        )

                        if not image:
                            image_errors+=1
                        else:
                            store_record(
                                c,
                                r,
                                image
                            )
            if url==base:(DATA/'last-profile.html').write_bytes(raw)

            # Łagodniejsze przechodzenie po publicznych stronach CREDO.
            # 24 strony = około 17 s zamiast serii natychmiastowych requestów.
            time.sleep(0.7)
        summary.update(updated=legacy.now_iso(),new=new,image_errors=image_errors,
                       visible=visible,pages=len(visited),pagination_links=sorted(visited),
                       coverage=('Osiągnięto limit 50 stron; historia niepełna' if queue else
                                 'Pobrano wszystkie znalezione strony publicznego profilu; nie jest to pełny eksport API'))
        with connect() as c:
            setmeta(c,'profile',summary);setmeta(c,'error',None)
        logging.info('CREDO: %d stron, %d wpisów, %d nowych',len(visited),visible,new)
    except Exception as exc:
        logging.exception('Pobranie nie powiodło się')
        with connect() as c:setmeta(c,'error',str(exc))
    finally:LOCK.release()


def schedule():
    while not STOP.wait(3600-time.time()%3600): refresh()

def rows(query):
    start=query.get('from',[''])[0]; end=query.get('to',[''])[0]
    cls=query.get('class',[''])[0]
    sql='SELECT * FROM events WHERE 1=1'; params=[]
    if start: sql+=' AND substr(timestamp,1,10)>=?'; params.append(start)
    if end: sql+=' AND substr(timestamp,1,10)<=?'; params.append(end)
    sql+=' ORDER BY timestamp DESC'
    with connect() as c:
        found=c.execute(sql,params).fetchall()
        repeats={(r[0],r[1]):r[2] for r in c.execute('SELECT x,y,count(*) FROM events WHERE x IS NOT NULL AND y IS NOT NULL GROUP BY x,y')}
    out=[]
    for r in found:
        item=dict(r); metrics=json.loads(item.pop('metrics')); item.update(metrics)
        item['auto_class']=metrics.get('class','BRAK DANYCH'); item['class']=item['manual'] or item['auto_class']
        item['repeats']=repeats.get((item['x'],item['y']),0)
        if not cls or item['class']==cls: out.append(item)
    return out


# CREDO_MP4_V1
VIDEO_LOCK = threading.Lock()

def convert_mp4(handler):
    import subprocess
    import tempfile
    import shutil

    origin = handler.headers.get("Origin")
    if (handler.headers.get("X-Credo-Video") != "1" or
        (origin and urlparse(origin).netloc != handler.headers.get("Host"))):
        return handler.send({"error":"Nieprawidłowe źródło żądania"},code=403)

    try:
        size = int(handler.headers.get("Content-Length","0"))
    except ValueError:
        size = 0
    if not 0 < size <= 100*1024*1024:
        return handler.send({"error":"Limit filmu: 100 MB"},code=413)
    if not shutil.which("ffmpeg"):
        return handler.send({"error":"Brakuje ffmpeg na Pi"},code=503)
    if not VIDEO_LOCK.acquire(blocking=False):
        return handler.send({"error":"Trwa już konwersja. Spróbuj później."},code=409)

    try:
        handler.connection.settimeout(120)
        with tempfile.TemporaryDirectory(prefix="credo-video-",dir=DATA) as folder:
            source = Path(folder)/"input.webm"
            output = Path(folder)/"output.mp4"
            remaining = size
            with source.open("wb") as f:
                while remaining:
                    chunk = handler.rfile.read(min(65536,remaining))
                    if not chunk:
                        raise ValueError("Przerwany transfer filmu")
                    f.write(chunk)
                    remaining -= len(chunk)

            command = [
                "/usr/bin/nice","-n","19",
                shutil.which("ffmpeg"),
                "-nostdin","-hide_banner","-loglevel","error",
                "-protocol_whitelist","file,pipe",
                "-threads","1","-i",str(source),
                "-map","0:v:0","-an","-t","125",
                "-vf",
                "scale=1920:1080:force_original_aspect_ratio=decrease,"
                "pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1",
                "-filter_threads","1",
                "-r","30","-c:v","libx264",
                "-threads","1","-preset","ultrafast",
                "-crf","23","-pix_fmt","yuv420p",
                "-profile:v","baseline","-level:v","4.0",
                "-movflags","+faststart",str(output)
            ]
            result = subprocess.run(
                command,stdout=subprocess.DEVNULL,
                stderr=subprocess.PIPE,timeout=600
            )
            if result.returncode or not output.exists():
                logging.error("MP4: %s",result.stderr.decode(errors="replace")[-1500:])
                raise ValueError("Konwersja nie powiodła się; szczegóły w logu usługi.")

            handler.send_response(200)
            handler.send_header("Content-Type","video/mp4")
            handler.send_header("Content-Length",str(output.stat().st_size))
            handler.send_header("Content-Disposition",'attachment; filename="CREDO.mp4"')
            handler.send_header("Cache-Control","no-store")
            handler.end_headers()
            with output.open("rb") as f:
                shutil.copyfileobj(f,handler.wfile,65536)
    except subprocess.TimeoutExpired:
        handler.send({"error":"Przekroczono limit 10 minut konwersji."},code=504)
    except (ValueError,OSError) as exc:
        logging.exception("Eksport MP4")
        try:
            handler.send({"error":str(exc)},code=500)
        except OSError:
            pass
    finally:
        VIDEO_LOCK.release()



def export_archive(handler):
    import shutil
    import tempfile
    import zipfile

    if not ARCHIVE_LOCK.acquire(blocking=False):
        return handler.send(
            {'error':'Trwa już tworzenie kopii archiwum'},
            code=409
        )

    try:
        with tempfile.TemporaryDirectory(
            prefix='credo-archive-'
        ) as folder:

            folder=Path(folder)

            snapshot=folder/'archive.sqlite3'

            output=folder/'CREDO-archive.zip'

            with connect() as source, \
                 sqlite3.connect(snapshot) as target:

                source.backup(target)

            manifest={
                'created_at':legacy.now_iso(),
                'database':'archive.sqlite3',
                'images':'images/',
                'note':
                    'Spójna kopia lokalnego archiwum CREDO Analyzer'
            }

            (folder/'manifest.json').write_text(
                json.dumps(
                    manifest,
                    ensure_ascii=False,
                    indent=2
                ),
                encoding='utf-8'
            )

            with zipfile.ZipFile(
                output,
                'w',
                compression=zipfile.ZIP_DEFLATED,
                compresslevel=1
            ) as z:

                z.write(
                    snapshot,
                    'archive.sqlite3'
                )

                z.write(
                    folder/'manifest.json',
                    'manifest.json'
                )

                for path in DATA.rglob('*'):

                    if (
                        not path.is_file() or
                        path==DB
                    ):
                        continue

                    if any(
                        part.startswith('credo-video-')
                        for part in path.parts
                    ):
                        continue

                    try:
                        rel=path.relative_to(DATA)

                    except ValueError:
                        continue

                    z.write(
                        path,
                        str(rel)
                    )

            handler.send_response(200)

            handler.send_header(
                'Content-Type',
                'application/zip'
            )

            handler.send_header(
                'Content-Length',
                str(output.stat().st_size)
            )

            handler.send_header(
                'Content-Disposition',
                'attachment; filename="CREDO-archive.zip"'
            )

            handler.send_header(
                'Cache-Control',
                'no-store'
            )

            handler.send_header(
                'X-Content-Type-Options',
                'nosniff'
            )

            handler.end_headers()

            with output.open('rb') as f:
                shutil.copyfileobj(
                    f,
                    handler.wfile,
                    65536
                )

    except (
        OSError,
        sqlite3.Error,
        zipfile.BadZipFile
    ) as exc:

        logging.exception(
            'Eksport archiwum CREDO'
        )

        try:
            handler.send(
                {'error':str(exc)},
                code=500
            )

        except OSError:
            pass

    finally:
        ARCHIVE_LOCK.release()



# ============================================================
# CREDO_GIF_SERVER_V10_9
# Server-side animated GIF using Pillow.
# One detection = exactly 1500 ms.
# ============================================================

GIF_LOCK = threading.Lock()


def export_gif(handler, query):
    from PIL import ImageDraw

    if not GIF_LOCK.acquire(blocking=False):
        return handler.send(
            {
                "error":
                "Trwa już generowanie GIF. Spróbuj ponownie za chwilę."
            },
            code=409
        )

    try:
        start = (
            query.get("from", [""])[0]
            .strip()
            .replace("T", " ")
        )

        end = (
            query.get("to", [""])[0]
            .strip()
            .replace("T", " ")
        )

        wanted_class = (
            query.get("class", [""])[0]
            .strip()
        )

        # rows({}) zwraca również manualną / automatyczną klasę
        # oraz nazwę lokalnego PNG.
        selected = []

        for event in rows({}):
            timestamp = (
                str(event.get("timestamp") or "")
                .strip()
                .replace("T", " ")
            )

            if start and timestamp < start:
                continue

            if end and timestamp > end:
                continue

            if (
                wanted_class and
                event.get("class") != wanted_class
            ):
                continue

            selected.append(event)

        selected.sort(
            key=lambda e:
                str(e.get("timestamp") or "")
                .replace("T", " ")
        )

        if not selected:
            return handler.send(
                {
                    "error":
                    "Brak detekcji w wybranym okresie."
                },
                code=404
            )

        # Ochrona hosta przed przypadkowym GIF-em
        # z tysięcy klatek.
        if len(selected) > 500:
            return handler.send(
                {
                    "error":
                    "Wybrano więcej niż 500 detekcji. "
                    "Zawęź zakres czasu."
                },
                code=413
            )

        WIDTH = 512
        HEIGHT = 512
        DURATION_MS = 1000

        frames = []

        for index, event in enumerate(selected):
            frame = Image.new(
                "RGB",
                (WIDTH, HEIGHT),
                (0, 0, 0)
            )

            image_name = event.get("image")

            image_path = None

            if image_name:
                image_path = (
                    IMAGES /
                    Path(image_name).name
                )

            if (
                image_path is not None and
                image_path.is_file()
            ):
                try:
                    with Image.open(image_path) as source:
                        source.load()

                        source = source.convert("RGB")

                        # CREDO = obraz pikselowy:
                        # NEAREST nie rozmywa śladu cząstki.
                        # CREDO_GIF_RENDER_V10_10
                        #
                        # thumbnail() tylko POMNIEJSZA obraz.
                        # Oryginalne detekcje CREDO mają zwykle
                        # około 64x64, więc poprzednio pozostawały
                        # maleńkie na canvasie 512x512.
                        #
                        # Tutaj skalujemy zarówno w górę,
                        # jak i w dół, zachowując proporcje.
                        scale = min(
                            WIDTH / source.width,
                            HEIGHT / source.height
                        )

                        target_w = max(
                            1,
                            round(source.width * scale)
                        )

                        target_h = max(
                            1,
                            round(source.height * scale)
                        )

                        source = source.resize(
                            (target_w, target_h),
                            Image.Resampling.NEAREST
                        )

                        x = (
                            WIDTH -
                            target_w
                        ) // 2

                        y = (
                            HEIGHT -
                            target_h
                        ) // 2

                        frame.paste(
                            source,
                            (x, y)
                        )

                except Exception:
                    logging.exception(
                        "GIF: problem z obrazem %s",
                        image_path
                    )

                    draw = ImageDraw.Draw(frame)

                    draw.text(
                        (WIDTH // 2, HEIGHT // 2),
                        "BRAK OBRAZU",
                        fill=(220, 220, 220),
                        anchor="mm"
                    )

            else:
                # Detekcji NIE pomijamy.
                # Jeżeli nie ma PNG, nadal dostaje
                # własną klatkę 1.5 s.
                draw = ImageDraw.Draw(frame)

                draw.text(
                    (WIDTH // 2, HEIGHT // 2),
                    "BRAK OBRAZU",
                    fill=(220, 220, 220),
                    anchor="mm"
                )

            # Zostawiamy klatkę w RGB.
            #
            # Nie tworzymy osobnej adaptacyjnej palety
            # dla każdej klatki. Pillow zrobi poprawne
            # kodowanie GIF podczas save().
            frames.append(frame)

        if not frames:
            raise ValueError(
                "Nie udało się przygotować żadnej klatki GIF."
            )

        output = io.BytesIO()

        frames[0].save(
            output,
            format="GIF",
            save_all=True,
            append_images=frames[1:],

            # Każda detekcja dokładnie 1.5 s.
            duration=[
                DURATION_MS
            ] * len(frames),

            # Zapętlenie bez końca.
            loop=0,

            # Nie czyścimy klatki kolorem
            # globalnej palety. Każda następna
            # klatka prawidłowo zastępuje poprzednią.
            disposal=1,

            optimize=False
        )

        payload = output.getvalue()

        if not payload.startswith(b"GIF8"):
            raise ValueError(
                "Pillow nie zwrócił prawidłowego GIF."
            )

        def stamp(value):
            return re.sub(
                r"[^0-9]",
                "",
                str(value or "")
            )

        first_stamp = stamp(
            selected[0].get("timestamp")
        )

        last_stamp = stamp(
            selected[-1].get("timestamp")
        )

        filename = (
            "CREDO_GIF_"
            + first_stamp
            + "_"
            + last_stamp
            + ".gif"
        )

        logging.info(
            "CREDO GIF: frames=%d duration=%dms size=%d",
            len(frames),
            DURATION_MS,
            len(payload)
        )

        return handler.send(
            payload,
            "image/gif",
            download=filename
        )

    except Exception as exc:
        logging.exception(
            "Eksport GIF"
        )

        try:
            return handler.send(
                {
                    "error":
                    "Nie udało się utworzyć GIF: "
                    + str(exc)
                },
                code=500
            )
        except OSError:
            return None

    finally:
        GIF_LOCK.release()



# ============================================================
# CREDO_RESEARCH_V11
#
# BADANIA:
# - lokalne koincydencje czasowe
# - NOAA SWPC current + history
# - Kp vs częstość detekcji
# - detekcje blisko rozbłysków X-ray
# - ranking nietypowych detekcji
# - miejsce na sieć CREDO
#
# Timestamp CREDO interpretujemy jako lokalny Europe/Warsaw.
# ============================================================

_RESEARCH_HTTP_CACHE = {}
_RESEARCH_HTTP_LOCK = threading.Lock()


# ============================================================
# CREDO_RESEARCH_HTTP_SWR_V17
#
# HTTP cache dla danych badawczych / NOAA:
#
# 1. świeży cache:
#       zwróć natychmiast
#
# 2. wygasły cache:
#       zwróć STARE dane natychmiast
#       i odśwież je w daemon thread
#
# 3. brak cache:
#       pierwszy fetch synchroniczny,
#       ale timeout tylko 4 s
#
# 4. po błędzie:
#       60 s cooldown dla danego URL
#
# Cel:
# zewnętrzny NOAA nie może blokować BADANIA
# przez kilkadziesiąt sekund.
# ============================================================

_RESEARCH_HTTP_REFRESHING_V17=set()
_RESEARCH_HTTP_FAIL_UNTIL_V17={}


def _research_http_fetch_v17(
    url,
    timeout=4
):

    import urllib.request as _urllib_request
    import json as _json


    request=_urllib_request.Request(
        url,
        headers={
            "User-Agent":
                "CREDO-Analyzer/17"
        }
    )


    with _urllib_request.urlopen(
        request,
        timeout=timeout
    ) as response:

        raw=response.read()


    return _json.loads(
        raw.decode(
            "utf-8"
        )
    )


def _research_http_refresh_worker_v17(
    url
):

    import time as _time
    import logging as _logging


    try:

        data=_research_http_fetch_v17(
            url,
            timeout=4
        )


        with _RESEARCH_HTTP_LOCK:

            _RESEARCH_HTTP_CACHE[
                url
            ]=(
                _time.time(),
                data
            )

            _RESEARCH_HTTP_FAIL_UNTIL_V17.pop(
                url,
                None
            )


    except Exception as exc:

        with _RESEARCH_HTTP_LOCK:

            _RESEARCH_HTTP_FAIL_UNTIL_V17[
                url
            ]=(
                _time.time()
                +60.0
            )


        _logging.warning(
            "Research HTTP background refresh %s: %s",
            url,
            exc
        )


    finally:

        with _RESEARCH_HTTP_LOCK:

            _RESEARCH_HTTP_REFRESHING_V17.discard(
                url
            )


def _research_json_url(
    url,
    ttl=300
):

    import time as _time
    import threading as _threading


    now=_time.time()

    stale=None
    launch_background=False


    with _RESEARCH_HTTP_LOCK:

        cached=_RESEARCH_HTTP_CACHE.get(
            url
        )

        fail_until=float(
            _RESEARCH_HTTP_FAIL_UNTIL_V17.get(
                url,
                0.0
            )
            or 0.0
        )


        if cached:

            age=(
                now
                -float(
                    cached[0]
                )
            )


            if age < ttl:

                return cached[1]


            stale=cached[1]


            if (
                now >= fail_until
                and
                url
                not in
                _RESEARCH_HTTP_REFRESHING_V17
            ):

                _RESEARCH_HTTP_REFRESHING_V17.add(
                    url
                )

                launch_background=True


    # ---------------------------------------------------------
    # STALE-WHILE-REVALIDATE
    # ---------------------------------------------------------

    if stale is not None:

        if launch_background:

            worker=_threading.Thread(
                target=
                    _research_http_refresh_worker_v17,
                args=(
                    url,
                ),
                daemon=True,
                name=
                    "credo-http-refresh"
            )

            worker.start()


        return stale


    # ---------------------------------------------------------
    # COLD START
    #
    # Brak jakichkolwiek wcześniejszych danych.
    # Próbujemy synchronizować tylko maks. 4 s.
    # ---------------------------------------------------------

    if now < fail_until:

        raise RuntimeError(
            "Research HTTP cooldown active"
        )


    try:

        data=_research_http_fetch_v17(
            url,
            timeout=4
        )


    except Exception:

        with _RESEARCH_HTTP_LOCK:

            _RESEARCH_HTTP_FAIL_UNTIL_V17[
                url
            ]=(
                _time.time()
                +60.0
            )

        raise


    with _RESEARCH_HTTP_LOCK:

        _RESEARCH_HTTP_CACHE[
            url
        ]=(
            _time.time(),
            data
        )

        _RESEARCH_HTTP_FAIL_UNTIL_V17.pop(
            url,
            None
        )


    return data


def _research_float(value):
    try:
        result = float(value)

        if math.isfinite(result):
            return result

    except (TypeError, ValueError):
        pass

    return None


def _research_dt(value):
    from datetime import datetime, timezone

    if value is None:
        return None

    s = str(value).strip()

    if not s:
        return None

    s = s.replace("Z", "+00:00")

    try:
        dt = datetime.fromisoformat(
            s.replace(" ", "T")
        )

        if dt.tzinfo is None:
            dt = dt.replace(
                tzinfo=timezone.utc
            )

        return dt.astimezone(
            timezone.utc
        )

    except ValueError:
        return None


def _research_credo_utc(value):
    """
    CREDO Analyzer przechowuje czas źródłowy,
    który w naszym panelu jest czasem lokalnym.
    Interpretujemy go jako Europe/Warsaw,
    a do NOAA porównujemy po UTC.
    """
    from datetime import datetime, timezone
    from zoneinfo import ZoneInfo

    if not value:
        return None

    s = str(value).strip()

    try:
        dt = datetime.fromisoformat(
            s.replace(" ", "T")
        )
    except ValueError:
        return None

    if dt.tzinfo is None:
        dt = dt.replace(
            tzinfo=ZoneInfo(
                "Europe/Warsaw"
            )
        )

    return dt.astimezone(
        timezone.utc
    )


def _research_credo_local_naive(value):
    from datetime import datetime

    if not value:
        return None

    try:
        return datetime.fromisoformat(
            str(value)
            .strip()
            .replace(" ", "T")
        ).replace(
            tzinfo=None
        )
    except ValueError:
        return None


def _research_noaa_kp():
    """
    Oficjalny 3-godzinny produkt NOAA.
    Obsługa zarówno formatu tablicowego,
    jak i obiektowego.
    """
    url = (
        "https://services.swpc.noaa.gov/"
        "products/noaa-planetary-k-index.json"
    )

    raw = _research_json_url(
        url,
        ttl=300
    )

    result = []

    if not isinstance(raw, list):
        return result

    if raw and isinstance(raw[0], list):
        rows_data = raw[1:]

        for row in rows_data:
            if (
                not isinstance(row, list)
                or len(row) < 2
            ):
                continue

            dt = _research_dt(
                row[0]
            )

            kp = _research_float(
                row[1]
            )

            if dt is not None and kp is not None:
                result.append(
                    {
                        "time": dt,
                        "kp": kp
                    }
                )

    else:
        for row in raw:
            if not isinstance(row, dict):
                continue

            dt = _research_dt(
                row.get("time_tag")
                or row.get("time")
                or row.get("timestamp")
            )

            # CREDO_RESEARCH_NOAA_FIX_V11_1
            # NOAA noaa-planetary-k-index.json używa "Kp".
            kp = _research_float(
                row.get("Kp")
                if "Kp" in row
                else (
                    row.get("kp_index")
                    if "kp_index" in row
                    else row.get("kp")
                )
            )

            if dt is not None and kp is not None:
                result.append(
                    {
                        "time": dt,
                        "kp": kp
                    }
                )

    result.sort(
        key=lambda r: r["time"]
    )

    return result


def _research_scales():
    url = (
        "https://services.swpc.noaa.gov/"
        "products/noaa-scales.json"
    )

    raw = _research_json_url(
        url,
        ttl=300
    )

    current = {}

    if isinstance(raw, dict):
        current = (
            raw.get("0")
            or raw.get(0)
            or {}
        )

    result = {}

    for key in ("G", "S", "R"):
        block = (
            current.get(key)
            if isinstance(current, dict)
            else None
        )

        if not isinstance(block, dict):
            block = {}

        result[key] = {
            "scale":
                block.get("Scale"),
            "text":
                block.get("Text")
        }

    if isinstance(current, dict):
        result["timestamp"] = (
            str(
                current.get("DateStamp")
                or ""
            )
            + " "
            + str(
                current.get("TimeStamp")
                or ""
            )
        ).strip()

    return result


def _research_dst():
    url = (
        "https://services.swpc.noaa.gov/"
        "products/kyoto-dst.json"
    )

    raw = _research_json_url(
        url,
        ttl=600
    )

    parsed = []

    if isinstance(raw, list):

        if raw and isinstance(raw[0], list):
            for row in raw[1:]:
                if (
                    not isinstance(row, list)
                    or len(row) < 2
                ):
                    continue

                dt = _research_dt(
                    row[0]
                )

                value = _research_float(
                    row[1]
                )

                if dt is not None and value is not None:
                    parsed.append(
                        (dt, value)
                    )

        else:
            for row in raw:
                if not isinstance(row, dict):
                    continue

                dt = _research_dt(
                    row.get("time_tag")
                    or row.get("time")
                    or row.get("timestamp")
                )

                value = None

                for key in (
                    "dst",
                    "Dst",
                    "value"
                ):
                    if key in row:
                        value = _research_float(
                            row[key]
                        )
                        break

                if dt is not None and value is not None:
                    parsed.append(
                        (dt, value)
                    )

    if not parsed:
        return None

    parsed.sort(
        key=lambda x: x[0]
    )

    dt, value = parsed[-1]

    return {
        "value": value,
        "time": dt.isoformat()
    }


def _research_flares():
    url = (
        "https://services.swpc.noaa.gov/"
        "json/goes/primary/"
        "xray-flares-7-day.json"
    )

    raw = _research_json_url(
        url,
        ttl=300
    )

    result = []

    if not isinstance(raw, list):
        return result

    for row in raw:
        if not isinstance(row, dict):
            continue

        begin = _research_dt(
            row.get("begin_time")
        )

        maximum = _research_dt(
            row.get("max_time")
        )

        end = _research_dt(
            row.get("end_time")
        )

        # NOAA xray-flares-7-day.json używa max_class
        # dla klasy w chwili maksimum rozbłysku.
        cls = (
            row.get("max_class")
            or row.get("class_type")
            or row.get("class")
            or ""
        )

        if maximum is None:
            maximum = begin

        if maximum is None:
            continue

        result.append(
            {
                "begin": begin,
                "max": maximum,
                "end": end,
                "class": str(cls)
            }
        )

    result.sort(
        key=lambda r: r["max"]
    )

    return result


def _research_space_weather():
    output = {
        "source": "NOAA SWPC",
        "timezone":
            "CREDO: Europe/Warsaw → NOAA: UTC"
    }

    errors = []

    kp_rows = []

    try:
        kp_rows = _research_noaa_kp()

        if kp_rows:
            latest = kp_rows[-1]

            output["kp"] = round(
                latest["kp"],
                2
            )

            output["kp_time"] = (
                latest["time"]
                .isoformat()
            )

    except Exception as exc:
        logging.warning(
            "Research NOAA Kp: %s",
            exc
        )

        errors.append(
            "Kp"
        )

    try:
        output["scales"] = (
            _research_scales()
        )

    except Exception as exc:
        logging.warning(
            "Research NOAA scales: %s",
            exc
        )

        errors.append(
            "G/S/R"
        )

    try:
        output["dst"] = (
            _research_dst()
        )

    except Exception as exc:
        logging.warning(
            "Research NOAA Dst: %s",
            exc
        )

        errors.append(
            "Dst"
        )

    try:
        flares = _research_flares()

        if flares:
            latest = flares[-1]

            output["latest_flare"] = {
                "class":
                    latest["class"],
                "time":
                    latest["max"]
                    .isoformat()
            }

    except Exception as exc:
        logging.warning(
            "Research NOAA flares: %s",
            exc
        )

        errors.append(
            "X-ray"
        )

    if errors:
        output["errors"] = errors

    return output, kp_rows


def _research_coincidences(events):
    timed = []

    for event in events:
        dt = _research_credo_local_naive(
            event.get("timestamp")
        )

        if dt is not None:
            timed.append(
                (dt, event)
            )

    timed.sort(
        key=lambda x: x[0]
    )

    counts = {
        "10ms": 0,
        "100ms": 0,
        "1s": 0,
        "10s": 0
    }

    pairs = []

    # CREDO_DIAGNOSTIC_TRACE_NEARMISS_BACKEND_V1
    #
    # Dla każdego e1 zachowujemy WYŁĄCZNIE pierwszą parę,
    # która przekroczy istniejący próg 10 s.
    #
    # Ponieważ timed jest posortowane po czasie, jest to
    # najbliższa wykluczona para dla danego e1.
    #
    # To nie tworzy nowego progu naukowego.
    near_misses = []

    n = len(timed)

    for i in range(n):

        t1, e1 = timed[i]

        j = i + 1

        while j < n:

            t2, e2 = timed[j]

            delta_ms = (
                t2 - t1
            ).total_seconds() * 1000.0

            if delta_ms > 10000:

                near_misses.append(
                    {
                        "delta_ms":
                            round(
                                delta_ms,
                                3
                            ),

                        "margin_ms":
                            round(
                                delta_ms - 10000.0,
                                3
                            ),

                        "threshold_ms":
                            10000,

                        "a": {
                            "id":
                                e1.get("id"),

                            "timestamp":
                                e1.get("timestamp"),

                            "class":
                                e1.get("class")
                        },

                        "b": {
                            "id":
                                e2.get("id"),

                            "timestamp":
                                e2.get("timestamp"),

                            "class":
                                e2.get("class")
                        }
                    }
                )

                break

            if delta_ms <= 10:
                counts["10ms"] += 1

            if delta_ms <= 100:
                counts["100ms"] += 1

            if delta_ms <= 1000:
                counts["1s"] += 1

            counts["10s"] += 1

            pairs.append(
                {
                    "delta_ms":
                        round(delta_ms, 3),

                    "a": {
                        "id":
                            e1.get("id"),
                        "timestamp":
                            e1.get("timestamp"),
                        "class":
                            e1.get("class")
                    },

                    "b": {
                        "id":
                            e2.get("id"),
                        "timestamp":
                            e2.get("timestamp"),
                        "class":
                            e2.get("class")
                    }
                }
            )

            j += 1

    pairs.sort(
        key=lambda r: r["delta_ms"]
    )

    near_misses.sort(
        key=lambda r: (
            r["margin_ms"],
            r["delta_ms"]
        )
    )

    return {
        "counts": counts,
        "pairs": pairs[:200],

        "near_misses":
            near_misses[:25],

        "near_miss_cutoff_ms":
            10000,

        "near_miss_total_candidates":
            len(near_misses),

        "near_miss_method":
            (
                "first excluded pair >10s for each event; "
                "sorted by excess over existing 10s cutoff"
            ),

        "total_pairs_10s":
            len(pairs)
    }


def _research_median(values):
    values = sorted(
        v for v in values
        if v is not None
        and math.isfinite(v)
    )

    if not values:
        return None

    n = len(values)

    m = n // 2

    if n % 2:
        return values[m]

    return (
        values[m - 1]
        + values[m]
    ) / 2.0


def _research_robust_scale(values):
    med = _research_median(
        values
    )

    if med is None:
        return None, None

    deviations = [
        abs(v - med)
        for v in values
        if v is not None
        and math.isfinite(v)
    ]

    mad = _research_median(
        deviations
    )

    if mad is None:
        return med, None

    scale = 1.4826 * mad

    if scale < 1e-9:
        scale = None

    return med, scale


# CREDO_BASELINE_ARCHIVE_V1
#
# To jest BASELINE ARCHIWUM, a nie pomiar rate detektora.
#
# Nie mamy jeszcze wiarygodnego uptime/ping/exposure,
# więc godzin bez zdarzeń NIE traktujemy automatycznie
# jako godzin aktywnej ekspozycji.
#
def _research_baseline_archive(events):
    from datetime import timedelta

    timed = []
    class_counts = {}

    active_pixels = []
    peaks = []
    cluster_counts = []

    daily = {}
    hourly = {}


    for event in events:

        dt = _research_credo_local_naive(
            event.get("timestamp")
        )

        if dt is not None:

            timed.append(dt)

            day = dt.date().isoformat()

            daily[day] = (
                daily.get(day, 0)
                + 1
            )

            hour = dt.replace(
                minute=0,
                second=0,
                microsecond=0
            )

            hourly[hour] = (
                hourly.get(hour, 0)
                + 1
            )


        cls = str(
            event.get("class")
            or "BRAK DANYCH"
        )

        class_counts[cls] = (
            class_counts.get(cls, 0)
            + 1
        )


        ap = _research_float(
            event.get("active_pixels")
        )

        if ap is not None:
            active_pixels.append(ap)


        peak = _research_float(
            event.get("peak")
        )

        if peak is not None:
            peaks.append(peak)


        clusters = event.get(
            "clusters"
        )

        if isinstance(
            clusters,
            list
        ):
            cluster_counts.append(
                float(
                    len(clusters)
                )
            )

        elif isinstance(
            clusters,
            (int, float)
        ):
            cluster_counts.append(
                float(clusters)
            )


    timed.sort()


    def feature_summary(values):

        clean = [
            float(v)
            for v in values
            if v is not None
            and math.isfinite(float(v))
        ]

        if not clean:
            return {
                "n": 0,
                "min": None,
                "median": None,
                "mean": None,
                "max": None,
                "mad": None,
                "robust_scale": None
            }

        med = _research_median(
            clean
        )

        deviations = [
            abs(v - med)
            for v in clean
        ]

        mad = _research_median(
            deviations
        )

        scale = (
            1.4826 * mad
            if mad is not None
            else None
        )

        return {
            "n":
                len(clean),

            "min":
                round(
                    min(clean),
                    4
                ),

            "median":
                round(
                    med,
                    4
                ),

            "mean":
                round(
                    sum(clean)
                    / len(clean),
                    4
                ),

            "max":
                round(
                    max(clean),
                    4
                ),

            "mad":
                round(
                    mad,
                    4
                )
                if mad is not None
                else None,

            "robust_scale":
                round(
                    scale,
                    4
                )
                if scale is not None
                else None
        }


    total = len(events)

    class_distribution = []

    for cls, count in sorted(
        class_counts.items(),
        key=lambda item:
            (
                -item[1],
                item[0]
            )
    ):

        class_distribution.append(
            {
                "class":
                    cls,

                "count":
                    count,

                "percent":
                    round(
                        100.0 * count
                        / max(1, total),
                        2
                    )
            }
        )


    daily_rows = [
        {
            "date":
                day,

            "count":
                count
        }
        for day, count in sorted(
            daily.items()
        )
    ]


    nonzero_hour_counts = list(
        hourly.values()
    )

    if nonzero_hour_counts:

        nonzero_hour_median = (
            _research_median(
                nonzero_hour_counts
            )
        )

        nonzero_hour_mean = (
            sum(nonzero_hour_counts)
            / len(nonzero_hour_counts)
        )

        nonzero_hour_max = max(
            nonzero_hour_counts
        )

    else:

        nonzero_hour_median = None
        nonzero_hour_mean = None
        nonzero_hour_max = None


    first_event = (
        timed[0]
        if timed
        else None
    )

    last_event = (
        timed[-1]
        if timed
        else None
    )


    calendar_hours = 0
    zero_event_calendar_hours = 0
    span_hours = None
    span_days = None


    if first_event is not None and last_event is not None:

        span_seconds = (
            last_event
            - first_event
        ).total_seconds()

        span_hours = (
            span_seconds
            / 3600.0
        )

        span_days = (
            span_seconds
            / 86400.0
        )


        cursor = first_event.replace(
            minute=0,
            second=0,
            microsecond=0
        )

        end = last_event.replace(
            minute=0,
            second=0,
            microsecond=0
        )


        while cursor <= end:

            calendar_hours += 1

            if hourly.get(
                cursor,
                0
            ) == 0:

                zero_event_calendar_hours += 1


            cursor += timedelta(
                hours=1
            )


    latest_24h_events = None

    if last_event is not None:

        cutoff = (
            last_event
            - timedelta(
                hours=24
            )
        )

        latest_24h_events = sum(
            1
            for dt in timed
            if dt >= cutoff
        )


    return {
        "version":
            "1.0",

        "scope":
            "archive_only",

        "status":
            "provisional",

        "uptime_normalized":
            False,

        "exposure_normalized":
            False,

        "limitations": [
            (
                "Brak danych uptime/ping/exposure; "
                "baseline nie jest jeszcze przeliczony "
                "na jednostkę czasu aktywnej pracy detektora."
            ),
            (
                "Godzina bez detekcji nie oznacza automatycznie "
                "godziny aktywnej pracy bez zdarzeń."
            ),
            (
                "Aktualny zakres archiwum jest krótki, "
                "więc baseline będzie dojrzewał wraz z napływem danych."
            )
        ],

        "coverage": {
            "event_count":
                total,

            "first_event":
                (
                    first_event.isoformat(
                        timespec="milliseconds"
                    )
                    if first_event is not None
                    else None
                ),

            "last_event":
                (
                    last_event.isoformat(
                        timespec="milliseconds"
                    )
                    if last_event is not None
                    else None
                ),

            "span_hours":
                round(
                    span_hours,
                    2
                )
                if span_hours is not None
                else None,

            "span_days":
                round(
                    span_days,
                    2
                )
                if span_days is not None
                else None,

            "nonzero_hours":
                len(
                    nonzero_hour_counts
                ),

            "calendar_hours":
                calendar_hours,

            "zero_event_calendar_hours":
                zero_event_calendar_hours
        },

        "activity": {
            "nonzero_hour_median":
                round(
                    nonzero_hour_median,
                    3
                )
                if nonzero_hour_median is not None
                else None,

            "nonzero_hour_mean":
                round(
                    nonzero_hour_mean,
                    3
                )
                if nonzero_hour_mean is not None
                else None,

            "nonzero_hour_max":
                nonzero_hour_max,

            "latest_24h_events":
                latest_24h_events,

            "per_day":
                daily_rows
        },

        "classes":
            class_distribution,

        "features": {
            "active_pixels":
                feature_summary(
                    active_pixels
                ),

            "peak":
                feature_summary(
                    peaks
                ),

            "clusters":
                feature_summary(
                    cluster_counts
                )
        },

        "interpretation":
            (
                "Opisowy baseline lokalnego archiwum CREDO. "
                "Nie jest to jeszcze rate detektora skorygowany "
                "o uptime ani ekspozycję."
            )
    }


def _research_unusual(events):
    prepared = []

    class_counts = {}

    for e in events:
        cls = str(
            e.get("class")
            or "BRAK DANYCH"
        )

        class_counts[cls] = (
            class_counts.get(cls, 0)
            + 1
        )

        ap = _research_float(
            e.get("active_pixels")
        )

        peak = _research_float(
            e.get("peak")
        )

        clusters = e.get(
            "clusters"
        )

        cluster_count = (
            len(clusters)
            if isinstance(clusters, list)
            else 0
        )

        prepared.append(
            {
                "event": e,
                "active_pixels":
                    math.log1p(ap)
                    if ap is not None
                    and ap >= 0
                    else None,
                "peak": peak,
                "clusters":
                    float(cluster_count)
            }
        )

    if not prepared:
        return []

    fields = (
        "active_pixels",
        "peak",
        "clusters"
    )

    stats = {}

    for field in fields:
        values = [
            p[field]
            for p in prepared
            if p[field] is not None
        ]

        stats[field] = (
            _research_robust_scale(
                values
            )
        )

    total = len(prepared)

    output = []

    for p in prepared:
        event = p["event"]

        score = 0.0
        reasons = []

        # CREDO_RESEARCH_AUDIT_TRAIL_V1_1
        #
        # Audit Trail nie zmienia score.
        # Rejestruje również cechy, których nie można
        # było punktować (np. MAD=0 -> scale=None).
        #
        audit_components = []

        for field, weight in (
            ("active_pixels", 1.0),
            ("peak", 0.45),
            ("clusters", 0.8)
        ):
            value = p[field]

            med, scale = stats[field]

            if field == "active_pixels":
                observed = event.get(
                    "active_pixels"
                )

                transform = "log1p"

                label = (
                    "Aktywne piksele"
                )

            elif field == "peak":
                observed = event.get(
                    "peak"
                )

                transform = "identity"

                label = (
                    "Jasność maksymalna"
                )

            else:
                observed = (
                    len(
                        event.get(
                            "clusters"
                        )
                    )
                    if isinstance(
                        event.get(
                            "clusters"
                        ),
                        list
                    )
                    else 0
                )

                transform = "identity"

                label = (
                    "Liczba klastrów"
                )


            #
            # Dokładnie taki sam warunek jak wcześniej:
            # brak value/median/scale => brak wkładu do score.
            #

            if (
                value is None
                or med is None
                or scale is None
            ):

                if value is None:
                    skip_reason = (
                        "brak wartości cechy"
                    )

                elif med is None:
                    skip_reason = (
                        "brak mediany odniesienia"
                    )

                else:
                    skip_reason = (
                        "brak zmienności w archiwum "
                        "(MAD=0 lub skala zbyt mała)"
                    )

                audit_components.append(
                    {
                        "key":
                            field,

                        "label":
                            label,

                        "observed":
                            observed,

                        "transform":
                            transform,

                        "value_used":
                            (
                                round(
                                    value,
                                    6
                                )
                                if value is not None
                                else None
                            ),

                        "median":
                            (
                                round(
                                    med,
                                    6
                                )
                                if med is not None
                                else None
                            ),

                        "robust_scale":
                            (
                                round(
                                    scale,
                                    6
                                )
                                if scale is not None
                                else None
                            ),

                        "z":
                            None,

                        "abs_z_clipped":
                            None,

                        "weight":
                            weight,

                        "contribution":
                            0.0,

                        "scored":
                            False,

                        "skip_reason":
                            skip_reason,

                        "reason_threshold":
                            False
                    }
                )

                continue


            z = (
                value - med
            ) / scale

            az = min(
                8.0,
                abs(z)
            )

            contribution = (
                weight
                * az
            )

            score += contribution


            audit_components.append(
                {
                    "key":
                        field,

                    "label":
                        label,

                    "observed":
                        observed,

                    "transform":
                        transform,

                    "value_used":
                        round(
                            value,
                            6
                        ),

                    "median":
                        round(
                            med,
                            6
                        ),

                    "robust_scale":
                        round(
                            scale,
                            6
                        ),

                    "z":
                        round(
                            z,
                            4
                        ),

                    "abs_z_clipped":
                        round(
                            az,
                            4
                        ),

                    "weight":
                        weight,

                    "contribution":
                        round(
                            contribution,
                            4
                        ),

                    "scored":
                        True,

                    "skip_reason":
                        None,

                    "reason_threshold":
                        bool(
                            abs(z) >= 2.0
                        )
                }
            )


            if abs(z) >= 2.0:

                if field == "active_pixels":
                    reasons.append(
                        "nietypowa liczba aktywnych pikseli"
                    )

                elif field == "peak":
                    reasons.append(
                        "nietypowa jasność maksymalna"
                    )

                elif field == "clusters":
                    reasons.append(
                        "nietypowa liczba klastrów"
                    )

        cls = str(
            event.get("class")
            or "BRAK DANYCH"
        )

        frequency = (
            class_counts.get(cls, 1)
            / max(1, total)
        )

        rarity = (
            -math.log2(
                max(
                    frequency,
                    1.0 / total
                )
            )
        )

        rarity_weight = 0.35

        rarity_contribution = (
            rarity_weight
            * rarity
        )

        score += rarity_contribution

        if frequency <= 0.10:
            reasons.append(
                "rzadka klasa w Twoim archiwum"
            )

        repeats = event.get(
            "repeats"
        )

        if (
            isinstance(repeats, int)
            and repeats > 2
        ):
            reasons.append(
                "współrzędne powtarzają się"
            )

        output.append(
            {
                "id":
                    event.get("id"),

                "timestamp":
                    event.get("timestamp"),

                "class":
                    event.get("class"),

                "active_pixels":
                    event.get("active_pixels"),

                "peak":
                    event.get("peak"),

                "clusters":
                    len(
                        event.get("clusters")
                    )
                    if isinstance(
                        event.get("clusters"),
                        list
                    )
                    else 0,

                "score":
                    round(score, 2),

                "reasons":
                    reasons[:4]
                    or [
                        "kombinacja cech różni się od typowych detekcji"
                    ],

                "audit": {
                    "version":
                        "1.1",

                    "method":
                        "robust MAD + class rarity",

                    "components":
                        audit_components,

                    "class_rarity": {
                        "class":
                            cls,

                        "count":
                            class_counts.get(
                                cls,
                                0
                            ),

                        "total":
                            total,

                        "frequency":
                            round(
                                frequency,
                                6
                            ),

                        "rarity_bits":
                            round(
                                rarity,
                                4
                            ),

                        "weight":
                            rarity_weight,

                        "contribution":
                            round(
                                rarity_contribution,
                                4
                            ),

                        "scored":
                            True,

                        "rare_class_reason":
                            bool(
                                frequency <= 0.10
                            )
                    },

                    "additional": {
                        "repeats":
                            (
                                repeats
                                if isinstance(
                                    repeats,
                                    int
                                )
                                else None
                            ),

                        "repeated_coordinates":
                            bool(
                                isinstance(
                                    repeats,
                                    int
                                )
                                and repeats > 2
                            ),

                        "repeats_affect_score":
                            False
                    },

                    "score_unrounded":
                        round(
                            score,
                            6
                        ),

                    "score_display":
                        round(
                            score,
                            2
                        ),

                    "interpretation":
                        (
                            "Względny wynik nietypowości. "
                            "Nie jest prawdopodobieństwem, "
                            "energią cząstki ani identyfikacją "
                            "jej rodzaju."
                        )
                }
            }
        )

    output.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return output[:25]


def _research_space_comparison_base(
    events,
    kp_rows
):
    from datetime import timedelta

    event_times = []

    for event in events:
        dt = _research_credo_utc(
            event.get("timestamp")
        )

        if dt is not None:
            event_times.append(
                (dt, event)
            )

    result = {
        "kp_coverage": 0,
        "kp_mean_at_detections": None,
        "kp_max_at_detection": None,
        "kp_ge5_detections": 0,
        "pearson_r": None,
        "pearson_bins": 0,
        "flare_matches": [],
        "flare_match_count": 0
    }

    kp_at_events = []

    if kp_rows and event_times:

        for event_time, event in event_times:

            nearest = min(
                kp_rows,
                key=lambda row:
                    abs(
                        (
                            row["time"]
                            - event_time
                        ).total_seconds()
                    )
            )

            distance = abs(
                (
                    nearest["time"]
                    - event_time
                ).total_seconds()
            )

            if distance <= 2 * 3600:
                kp_at_events.append(
                    nearest["kp"]
                )

        if kp_at_events:
            result["kp_coverage"] = (
                len(kp_at_events)
            )

            result[
                "kp_mean_at_detections"
            ] = round(
                sum(kp_at_events)
                / len(kp_at_events),
                2
            )

            result[
                "kp_max_at_detection"
            ] = round(
                max(kp_at_events),
                2
            )

            result[
                "kp_ge5_detections"
            ] = sum(
                1
                for value in kp_at_events
                if value >= 5
            )

        #
        # Eksploracyjna korelacja:
        # liczba detekcji w 3-godzinnym oknie
        # vs Kp tego samego okna.
        #
        xs = []
        ys = []

        if event_times:
            first_event = min(
                t for t, _ in event_times
            )

            last_event = max(
                t for t, _ in event_times
            )

            for row in kp_rows:

                start = row["time"]

                end = (
                    start
                    + timedelta(hours=3)
                )

                if (
                    end < first_event
                    or start > last_event
                ):
                    continue

                count = sum(
                    1
                    for t, _ in event_times
                    if start <= t < end
                )

                xs.append(
                    float(count)
                )

                ys.append(
                    float(row["kp"])
                )

        if len(xs) >= 4:

            mx = sum(xs) / len(xs)
            my = sum(ys) / len(ys)

            numerator = sum(
                (x - mx) * (y - my)
                for x, y in zip(xs, ys)
            )

            dx = sum(
                (x - mx) ** 2
                for x in xs
            )

            dy = sum(
                (y - my) ** 2
                for y in ys
            )

            denominator = math.sqrt(
                dx * dy
            )

            if denominator > 0:
                result["pearson_r"] = (
                    round(
                        numerator
                        / denominator,
                        3
                    )
                )

                result["pearson_bins"] = (
                    len(xs)
                )

    #
    # CREDO_FLARE_WINDOWS_V11_3
    #
    # Analiza rozbłysków GOES:
    #
    # - jeden timestamp CREDO = jedna chwila pomiarowa
    # - wiele rekordów o tym samym czasie nie zwiększa statystyki
    # - każdą chwilę przypisujemy tylko do najbliższego maksimum flare
    # - trzy skale czasowe:
    #       ±5 min
    #       ±15 min
    #       ±30 min
    #

    result["flare_window_counts"] = {
        "5m": 0,
        "15m": 0,
        "30m": 0
    }

    result["flare_window_percent"] = {
        "5m": 0.0,
        "15m": 0.0,
        "30m": 0.0
    }

    result["flare_unique_timestamps"] = 0
    result["flare_collapsed_records"] = 0

    try:
        flares = _research_flares()

        #
        # Grupowanie rekordów CREDO po timestampie.
        #
        grouped = {}

        for event_time, event in event_times:

            key = str(
                event.get("timestamp")
                or event_time.isoformat()
            )

            if key not in grouped:
                grouped[key] = {
                    "time": event_time,
                    "timestamp": key,
                    "events": []
                }

            grouped[key]["events"].append(
                event
            )

        unique_events = list(
            grouped.values()
        )

        result["flare_unique_timestamps"] = (
            len(unique_events)
        )

        result["flare_collapsed_records"] = max(
            0,
            len(event_times)
            - len(unique_events)
        )

        matches = []

        counts = {
            "5m": 0,
            "15m": 0,
            "30m": 0
        }

        if flares:

            for group in unique_events:

                event_time = group["time"]

                nearest = min(
                    flares,
                    key=lambda flare:
                        abs(
                            (
                                event_time
                                - flare["max"]
                            ).total_seconds()
                        )
                )

                signed_delta = (
                    event_time
                    - nearest["max"]
                ).total_seconds()

                delta = abs(
                    signed_delta
                )

                #
                # Statystyki są kumulacyjne:
                # <=5 min zawiera się też w <=15 i <=30.
                #
                if delta <= 300:
                    counts["5m"] += 1

                if delta <= 900:
                    counts["15m"] += 1

                if delta <= 1800:
                    counts["30m"] += 1

                    if delta <= 300:
                        window = "±5 min"

                    elif delta <= 900:
                        window = "±15 min"

                    else:
                        window = "±30 min"

                    events_here = (
                        group["events"]
                    )

                    classes = sorted(
                        {
                            str(
                                e.get("class")
                                or "BRAK"
                            )
                            for e in events_here
                        }
                    )

                    ids = [
                        e.get("id")
                        for e in events_here
                        if e.get("id")
                    ]

                    matches.append(
                        {
                            "event_id":
                                ids[0]
                                if ids
                                else None,

                            "event_ids":
                                ids,

                            "event_time":
                                group["timestamp"],

                            "event_count":
                                len(events_here),

                            "event_classes":
                                classes,

                            "event_class":
                                " + ".join(
                                    classes
                                ),

                            "flare_class":
                                nearest["class"],

                            "flare_time":
                                nearest["max"]
                                .isoformat(),

                            "delta_seconds":
                                round(
                                    delta,
                                    1
                                ),

                            "signed_delta_seconds":
                                round(
                                    signed_delta,
                                    1
                                ),

                            "window":
                                window
                        }
                    )

        matches.sort(
            key=lambda x:
                x["delta_seconds"]
        )

        result[
            "flare_window_counts"
        ] = counts

        total_unique = max(
            1,
            len(unique_events)
        )

        result[
            "flare_window_percent"
        ] = {
            key: round(
                100.0
                * value
                / total_unique,
                1
            )
            for key, value
            in counts.items()
        }

        result["flare_matches"] = (
            matches[:100]
        )

        #
        # Zachowujemy stare pole dla kompatybilności.
        # Od teraz oznacza liczbę UNIKALNYCH timestampów <=30 min.
        #
        result["flare_match_count"] = (
            counts["30m"]
        )

    except Exception as exc:

        result["flare_error"] = (
            str(exc)
        )

    return result



# ============================================================
# CREDO_NETWORK_V11_4
# ============================================================

_NETWORK_DB = str(DATA / "network.sqlite3")

_NETWORK_EXPORT_DIR = str(DATA / "credo-data-export")


def _network_time_local(ms):

    from datetime import (
        datetime,
        timezone
    )

    from zoneinfo import (
        ZoneInfo
    )

    try:

        dt = datetime.fromtimestamp(
            int(ms) / 1000.0,
            tz=timezone.utc
        )

        return (
            dt.astimezone(
                ZoneInfo(
                    "Europe/Warsaw"
                )
            )
            .strftime(
                "%Y-%m-%d %H:%M:%S.%f"
            )[:-3]
        )

    except Exception:
        return None


def _network_local_event_ms(event):

    dt = _research_credo_utc(
        event.get(
            "timestamp"
        )
    )

    if dt is None:
        return None

    return int(
        round(
            dt.timestamp()
            * 1000.0
        )
    )



# ============================================================
# CREDO_RESEARCH_SPACE_DASHBOARD_V16
#
# Rozszerzenie istniejącej analizy wyłącznie dla:
# BADANIA -> Pogoda kosmiczna
#
# Dotychczasowe wyniki pozostają bez zmian.
# ============================================================

def _research_space_comparison(events, kp_rows):

    result = _research_space_comparison_base(
        events,
        kp_rows
    )

    if not isinstance(result, dict):
        result = {}

    event_times = []

    for event in events:

        try:

            if hasattr(event, "get"):
                raw = event.get("timestamp")
            else:
                raw = event["timestamp"]

        except Exception:
            continue


        dt = _research_credo_utc(raw)

        if dt is None:
            continue


        event_times.append(
            dt.isoformat()
        )


    event_times.sort()


    result["analytics_event_times"] = (
        event_times
    )

    result["analytics_event_count"] = (
        len(event_times)
    )


    #
    # Dotychczasowe flare_matches zostają takie jak były.
    # Dodajemy tylko jednoznaczną chwilę CREDO w UTC.
    #

    matches = result.get(
        "flare_matches"
    )


    if isinstance(matches, list):

        for match in matches:

            if not isinstance(match, dict):
                continue


            dt = _research_credo_utc(
                match.get("event_time")
            )


            if dt is not None:

                match["event_time_utc"] = (
                    dt.isoformat()
                )


    return result



def _research_network(events):

    import glob
    import os
    import sqlite3

    export_files = glob.glob(
        os.path.join(
            _NETWORK_EXPORT_DIR,
            "detections",
            "export_*.json"
        )
    )

    output = {
        "engine_ready": True,
        "enabled": False,
        "data_present": False,

        "export_files":
            len(
                export_files
            ),

        "network_rows": 0,
        "network_devices": 0,

        "local_unique_times": 0,

        "local_device_ids": [],

        "local_device_match_count":
            0,

        "matched_local_times": 0,

        "external_devices": 0,

        "pair_count": 0,

        "counts": {
            "same_ms": 0,
            "1_10ms": 0,
            "10_100ms": 0,
            "100ms_1s": 0,
            "1_10s": 0
        },

        "matches": [],

        "export_dir":
            _NETWORK_EXPORT_DIR,

        "reason":
            "Silnik jest gotowy. "
            "Brak jeszcze zaimportowanych "
            "danych innych urządzeń CREDO."
    }


    #
    # Lokalne rekordy grupujemy po czasie.
    #
    groups = {}

    detailed = []

    for event in events:

        ms = _network_local_event_ms(
            event
        )

        if ms is None:
            continue

        ts = str(
            event.get(
                "timestamp"
            )
            or ""
        )

        key = (
            ms,
            ts
        )

        group = groups.setdefault(
            key,
            {
                "ms": ms,
                "timestamp": ts,
                "ids": [],
                "classes": set(),
                "xy": set()
            }
        )

        if event.get("id"):

            group["ids"].append(
                event.get(
                    "id"
                )
            )

        if event.get("class"):

            group[
                "classes"
            ].add(
                str(
                    event.get(
                        "class"
                    )
                )
            )

        x = event.get("x")
        y = event.get("y")

        if (
            x is not None
            and
            y is not None
        ):
            group[
                "xy"
            ].add(
                (
                    x,
                    y
                )
            )

        detailed.append(
            (
                ms,
                x,
                y
            )
        )


    output[
        "local_unique_times"
    ] = len(
        groups
    )


    if not os.path.isfile(
        _NETWORK_DB
    ):
        return output


    try:

        con = sqlite3.connect(
            "file:"
            + _NETWORK_DB
            + "?mode=ro",
            uri=True,
            timeout=10
        )

        con.row_factory = (
            sqlite3.Row
        )

    except Exception as exc:

        output[
            "engine_ready"
        ] = False

        output["reason"] = (
            "Nie można otworzyć "
            "lokalnego indeksu sieciowego: "
            + str(exc)
        )

        return output


    try:

        tables = {
            row[0]
            for row in con.execute(
                """
                SELECT name
                FROM sqlite_master
                WHERE type='table'
                """
            )
        }

        if (
            "network_detections"
            not in tables
        ):
            return output


        row = con.execute(
            """
            SELECT
                COUNT(*) AS total,

                COUNT(
                    DISTINCT device_id
                ) AS devices,

                MIN(
                    timestamp_ms
                ) AS first_ms,

                MAX(
                    timestamp_ms
                ) AS last_ms

            FROM network_detections
            """
        ).fetchone()


        total = int(
            row["total"]
            or 0
        )

        device_count = int(
            row["devices"]
            or 0
        )

        output[
            "network_rows"
        ] = total

        output[
            "network_devices"
        ] = device_count


        output[
            "first_network_time"
        ] = (
            _network_time_local(
                row["first_ms"]
            )
            if row["first_ms"]
            is not None
            else None
        )


        output[
            "last_network_time"
        ] = (
            _network_time_local(
                row["last_ms"]
            )
            if row["last_ms"]
            is not None
            else None
        )


        if total <= 0:
            return output


        output["enabled"] = True
        output[
            "data_present"
        ] = True


        #
        # Rozpoznanie własnego device_id.
        #
        candidates = {}


        for ms, x, y in detailed:

            if (
                x is None
                or
                y is None
            ):
                continue

            rows2 = con.execute(
                """
                SELECT device_id
                FROM network_detections

                WHERE timestamp_ms
                      BETWEEN ? AND ?

                  AND x=?
                  AND y=?

                  AND device_id
                      IS NOT NULL
                """,
                (
                    ms - 1,
                    ms + 1,
                    x,
                    y
                )
            ).fetchall()


            for row2 in rows2:

                dev = int(
                    row2[
                        "device_id"
                    ]
                )

                candidates[
                    dev
                ] = (
                    candidates.get(
                        dev,
                        0
                    )
                    + 1
                )


        own_devices = []


        if candidates:

            best = max(
                candidates.values()
            )

            #
            # Dwie lub więcej dokładnych zgodności
            # timestamp+XY daje mocne rozpoznanie.
            #
            if best >= 2:

                own_devices = [
                    dev
                    for dev, count
                    in candidates.items()
                    if count == best
                ]

            #
            # Jeżeli w danych występuje tylko
            # jeden kandydat device_id, też można
            # go użyć jako ostrożne rozpoznanie.
            #
            elif len(
                candidates
            ) == 1:

                own_devices = [
                    next(
                        iter(
                            candidates
                        )
                    )
                ]


        output[
            "local_device_ids"
        ] = sorted(
            own_devices
        )


        output[
            "local_device_match_count"
        ] = (
            max(
                candidates.values()
            )
            if candidates
            else 0
        )


        matches = []

        external_devices = set()
        matched_local = set()

        counts = {
            "same_ms": 0,
            "1_10ms": 0,
            "10_100ms": 0,
            "100ms_1s": 0,
            "1_10s": 0
        }


        for group in groups.values():

            local_ms = group[
                "ms"
            ]


            query_rows = con.execute(
                """
                SELECT
                    nd.detection_id,
                    nd.timestamp_ms,
                    nd.device_id,
                    nd.user_id,
                    nd.team_id,
                    nd.x,
                    nd.y,
                    nd.visible,
                    nd.source,

                    d.user_id AS device_user_id,
                    d.team_id AS device_team_id,

                    d.device_type,
                    d.device_model,

                    u.username,
                    u.display_name,

                    t.name AS team_name

                FROM network_detections nd

                LEFT JOIN devices d
                    ON d.id =
                       nd.device_id

                LEFT JOIN users u
                    ON u.id =
                       COALESCE(
                           nd.user_id,
                           d.user_id
                       )

                LEFT JOIN teams t
                    ON t.id =
                       COALESCE(
                           nd.team_id,
                           d.team_id
                       )

                WHERE
                    nd.timestamp_ms
                    BETWEEN ? AND ?

                    AND COALESCE(
                        nd.visible,
                        1
                    ) = 1

                ORDER BY
                    nd.timestamp_ms
                """,
                (
                    local_ms - 10000,
                    local_ms + 10000
                )
            ).fetchall()


            #
            # Jedno urządzenie może mieć kilka
            # detekcji z tym samym timestampem.
            # Dla statystyki sieci liczymy to jako
            # jeden DEVICE-TIME EVENT.
            #
            external_groups = {}


            for row2 in query_rows:

                device_id = (
                    int(
                        row2[
                            "device_id"
                        ]
                    )
                    if row2[
                        "device_id"
                    ] is not None
                    else None
                )


                if (
                    device_id
                    in own_devices
                ):
                    continue


                net_ms = int(
                    row2[
                        "timestamp_ms"
                    ]
                )


                #
                # Awaryjne self-match:
                # jeżeli nie znamy jeszcze
                # własnego device_id.
                #
                if (
                    net_ms == local_ms
                    and
                    (
                        row2["x"],
                        row2["y"]
                    ) in group["xy"]
                ):
                    continue


                if device_id is not None:

                    ext_key = (
                        device_id,
                        net_ms
                    )

                else:

                    ext_key = (
                        "unknown:"
                        + str(
                            row2[
                                "detection_id"
                            ]
                        ),
                        net_ms
                    )


                ext = external_groups.setdefault(
                    ext_key,
                    {
                        "row": row2,
                        "count": 0
                    }
                )

                ext["count"] += 1


            for ext in external_groups.values():

                row2 = ext["row"]

                device_id = (
                    int(
                        row2[
                            "device_id"
                        ]
                    )
                    if row2[
                        "device_id"
                    ] is not None
                    else None
                )

                net_ms = int(
                    row2[
                        "timestamp_ms"
                    ]
                )

                delta_ms = (
                    net_ms
                    - local_ms
                )

                ad = abs(
                    delta_ms
                )

                if ad > 10000:
                    continue


                if ad == 0:

                    bucket = (
                        "same_ms"
                    )

                elif ad <= 10:

                    bucket = (
                        "1_10ms"
                    )

                elif ad <= 100:

                    bucket = (
                        "10_100ms"
                    )

                elif ad <= 1000:

                    bucket = (
                        "100ms_1s"
                    )

                else:

                    bucket = (
                        "1_10s"
                    )


                counts[
                    bucket
                ] += 1


                matched_local.add(
                    group[
                        "timestamp"
                    ]
                )


                if device_id is not None:

                    external_devices.add(
                        device_id
                    )


                display_name = (
                    row2[
                        "display_name"
                    ]
                    or
                    row2[
                        "username"
                    ]
                )


                user_id = (
                    row2["user_id"]
                    if row2[
                        "user_id"
                    ] is not None
                    else row2[
                        "device_user_id"
                    ]
                )


                team_id = (
                    row2["team_id"]
                    if row2[
                        "team_id"
                    ] is not None
                    else row2[
                        "device_team_id"
                    ]
                )


                matches.append(
                    {
                        "local_time":
                            group[
                                "timestamp"
                            ],

                        "local_id":
                            (
                                group[
                                    "ids"
                                ][0]
                                if group[
                                    "ids"
                                ]
                                else None
                            ),

                        "local_count":
                            len(
                                group[
                                    "ids"
                                ]
                            ),

                        "local_classes":
                            sorted(
                                group[
                                    "classes"
                                ]
                            ),

                        "external_time":
                            _network_time_local(
                                net_ms
                            ),

                        "delta_ms":
                            int(
                                delta_ms
                            ),

                        "abs_delta_ms":
                            int(
                                ad
                            ),

                        "bucket":
                            bucket,

                        "detection_id":
                            row2[
                                "detection_id"
                            ],

                        "external_detection_count":
                            ext[
                                "count"
                            ],

                        "device_id":
                            device_id,

                        "device_type":
                            row2[
                                "device_type"
                            ],

                        "device_model":
                            row2[
                                "device_model"
                            ],

                        "user_id":
                            user_id,

                        "user":
                            display_name,

                        "team_id":
                            team_id,

                        "team":
                            row2[
                                "team_name"
                            ]
                    }
                )


        matches.sort(
            key=lambda item: (
                item[
                    "abs_delta_ms"
                ],
                item[
                    "local_time"
                ]
            )
        )


        output[
            "counts"
        ] = counts


        output[
            "matched_local_times"
        ] = len(
            matched_local
        )


        output[
            "external_devices"
        ] = len(
            external_devices
        )


        output[
            "pair_count"
        ] = len(
            matches
        )


        output[
            "matches"
        ] = matches[:250]


        if own_devices:

            output["reason"] = (
                "Aktywne. Własne "
                "device_id zostało "
                "rozpoznane i wyłączone "
                "z porównań sieciowych."
            )

        else:

            output["reason"] = (
                "Aktywne. Dane sieciowe "
                "są obecne, ale własnego "
                "device_id nie udało się "
                "jeszcze jednoznacznie "
                "rozpoznać. Identyczne "
                "timestamp+X+Y są nadal "
                "odfiltrowywane."
            )


        if (
            "network_meta"
            in tables
        ):

            meta = con.execute(
                """
                SELECT value
                FROM network_meta
                WHERE key=
                    'last_import_unix'
                """
            ).fetchone()

            if meta:

                from datetime import (
                    datetime,
                    timezone
                )

                output[
                    "last_import"
                ] = (
                    datetime.fromtimestamp(
                        int(
                            meta[0]
                        ),
                        timezone.utc
                    )
                    .isoformat()
                )


        return output


    except Exception as exc:

        output[
            "engine_ready"
        ] = False

        output["reason"] = (
            "Błąd analizy sieci CREDO: "
            + str(exc)
        )

        return output


    finally:

        con.close()



# ============================================================
# CREDO_SPACE_HISTORY_V15
# Historia pogody kosmicznej.
# ============================================================

def _sw15_dst_history():

    raw=_research_json_url(
        "https://services.swpc.noaa.gov/"
        "products/kyoto-dst.json",
        ttl=600
    )

    parsed=[]

    if isinstance(raw,list):

        if raw and isinstance(raw[0],list):

            for row in raw[1:]:

                if not isinstance(row,list) or len(row)<2:
                    continue

                dt=_research_dt(row[0])
                value=_research_float(row[1])

                if dt is not None and value is not None:
                    parsed.append({
                        "time":dt,
                        "dst":value
                    })

        else:

            for row in raw:

                if not isinstance(row,dict):
                    continue

                dt=_research_dt(
                    row.get("time_tag")
                    or row.get("time")
                    or row.get("timestamp")
                )

                value=None

                for key in ("dst","Dst","value"):

                    if key in row:
                        value=_research_float(row[key])
                        break

                if dt is not None and value is not None:
                    parsed.append({
                        "time":dt,
                        "dst":value
                    })

    parsed.sort(
        key=lambda item:item["time"]
    )

    return parsed


def _sw15_g_from_kp(kp):

    if kp is None:
        return None

    if kp >= 9:
        return 5
    if kp >= 8:
        return 4
    if kp >= 7:
        return 3
    if kp >= 6:
        return 2
    if kp >= 5:
        return 1

    return 0


def _sw15_r_from_flare(value):

    if not value:
        return 0

    text=str(value).strip().upper()

    try:
        number=float(text[1:])
    except Exception:
        number=0.0

    if text.startswith("X"):

        if number >= 20:
            return 5

        if number >= 10:
            return 4

        return 3

    if text.startswith("M"):

        if number >= 5:
            return 2

        if number >= 1:
            return 1

    return 0


def _sw15_flare_rank(value):

    if not value:
        return -1

    text=str(value).strip().upper()

    if not text:
        return -1

    base={
        "A":0,
        "B":100,
        "C":200,
        "M":300,
        "X":400
    }.get(text[0],-100)

    try:
        number=float(text[1:])
    except Exception:
        number=0.0

    return base+number


def _sw15_last_value(rows,moment,key):

    value=None

    for row in rows:

        if row["time"] <= moment:
            value=row.get(key)
        else:
            break

    return value


def _sw15_scale(scales,name):

    if not isinstance(scales,dict):
        return None

    block=scales.get(name)

    if not isinstance(block,dict):
        return None

    value=_research_float(
        block.get("scale")
    )

    if value is None:
        return None

    return int(value)


def _sw15_status(kp,g,solar,radio,dst):

    if (
        kp is None
        and dst is None
        and g is None
        and solar is None
    ):
        return "Brak danych"

    levels=[
        x
        for x in (g,solar,radio)
        if x is not None
    ]

    strongest=max(levels or [0])

    if (
        strongest >= 4
        or (kp is not None and kp >= 8)
        or (dst is not None and dst <= -200)
    ):
        return "Silna aktywność"

    if (
        strongest >= 2
        or (kp is not None and kp >= 6)
        or (dst is not None and dst <= -100)
    ):
        return "Burza / zaburzenia"

    if (
        strongest >= 1
        or (kp is not None and kp >= 5)
        or (dst is not None and dst <= -50)
    ):
        return "Aktywność umiarkowana"

    if (
        (kp is not None and kp >= 4)
        or (dst is not None and dst <= -30)
    ):
        return "Lekko podwyższona"

    return "Spokojnie"


def _sw15_history_payload(query):

    import datetime

    raw_hours=query.get(
        "hours",
        ["24"]
    )

    if isinstance(raw_hours,list):
        raw_hours=raw_hours[0]

    try:
        requested=int(raw_hours)
    except Exception:
        requested=24

    if requested <= 24:
        hours=24
    elif requested <= 72:
        hours=72
    else:
        hours=168

    kp_rows=_research_noaa_kp()
    dst_rows=_sw15_dst_history()
    flares=_research_flares()

    current_result=_research_space_weather()

    if isinstance(current_result,tuple):
        current=current_result[0] if current_result else {}
    else:
        current=current_result

    if not isinstance(current,dict):
        current={}

    scales=current.get("scales") or {}

    current_g=_sw15_scale(scales,"G")
    current_s=_sw15_scale(scales,"S")
    current_r=_sw15_scale(scales,"R")

    now=datetime.datetime.now(
        datetime.timezone.utc
    ).replace(
        minute=0,
        second=0,
        microsecond=0
    )

    start=now-datetime.timedelta(
        hours=hours-1
    )

    points=[]

    for index in range(hours):

        bucket=start+datetime.timedelta(
            hours=index
        )

        bucket_end=bucket+datetime.timedelta(
            hours=1
        )

        kp=_sw15_last_value(
            kp_rows,
            bucket_end,
            "kp"
        )

        dst=_sw15_last_value(
            dst_rows,
            bucket_end,
            "dst"
        )

        bucket_flares=[
            flare
            for flare in flares
            if bucket <= flare["max"] < bucket_end
        ]

        flare_class=None

        if bucket_flares:

            strongest=max(
                bucket_flares,
                key=lambda flare:
                    _sw15_flare_rank(
                        flare.get("class")
                    )
            )

            flare_class=strongest.get(
                "class"
            )

        g=_sw15_g_from_kp(kp)

        # Nie rekonstruujemy historycznego S.
        solar=None

        radio=_sw15_r_from_flare(
            flare_class
        )

        # Najnowszy punkt: aktualne oficjalne G/S/R.
        if index == hours-1:

            if current_g is not None:
                g=current_g

            if current_s is not None:
                solar=current_s

            if current_r is not None:
                radio=current_r

        points.append({
            "time":
                bucket.isoformat()
                .replace("+00:00","Z"),

            "kp":kp,
            "g":g,
            "s":solar,
            "r":radio,
            "dst":dst,
            "xray":flare_class,

            "status":
                _sw15_status(
                    kp,
                    g,
                    solar,
                    radio,
                    dst
                )
        })

    return {
        "version":
            "CREDO_SPACE_HISTORY_V15",

        "source":
            "NOAA SWPC",

        "hours":
            hours,

        "points":
            points,

        "coverage":{
            "kp_records":len(kp_rows),
            "dst_records":len(dst_rows),
            "flare_records":len(flares)
        }
    }




# ============================================================
# CREDO_BASELINE_DRIFT_V2
#
# Diagnostyczne porównanie:
#
#   reference:
#       wszystkie zdarzenia starsze niż ostatnie 24 h
#
#   recent:
#       ostatnie 24 h względem czasu ostatniego zdarzenia
#
# To NIE jest:
# - pomiar strumienia cząstek,
# - normalizacja uptime,
# - normalizacja ekspozycji,
# - kalibracja bezwzględna detektora.
#
# Progi STABILNIE / OBSERWUJ / WYRAŹNA ZMIANA są
# wyłącznie progami diagnostycznymi aplikacji.
# ============================================================

def _research_baseline_drift_v2():

    import statistics
    from datetime import timedelta


    def parse_ts(value):

        if not value:
            return None

        try:

            return datetime.fromisoformat(
                str(value)
                .strip()
                .replace(
                    "Z",
                    "+00:00"
                )
            ).replace(
                tzinfo=None
            )

        except Exception:

            return None


    def number(value):

        if isinstance(
            value,
            bool
        ):
            return None

        if isinstance(
            value,
            (int,float)
        ):
            return float(value)

        return None


    def clusters_value(value):

        if isinstance(
            value,
            (list,tuple)
        ):
            return float(
                len(value)
            )

        return number(
            value
        )


    def median(values):

        values=[
            float(x)
            for x in values
            if x is not None
        ]

        if not values:
            return None

        return float(
            statistics.median(
                values
            )
        )


    def mean(values):

        values=[
            float(x)
            for x in values
            if x is not None
        ]

        if not values:
            return None

        return float(
            statistics.fmean(
                values
            )
        )


    def mad(values):

        values=[
            float(x)
            for x in values
            if x is not None
        ]

        if not values:
            return None

        med=statistics.median(
            values
        )

        return float(
            statistics.median(
                abs(x-med)
                for x in values
            )
        )


    def delta_percent(
        new,
        old
    ):

        if (
            new is None
            or
            old is None
            or
            old == 0
        ):
            return None

        return round(
            (
                new-old
            )
            /abs(old)
            *100.0,
            4
        )


    def robust_shift(
        new,
        old,
        old_mad
    ):

        if (
            new is None
            or
            old is None
            or
            old_mad is None
            or
            old_mad <= 0
        ):
            return None

        scale=(
            1.4826
            *old_mad
        )

        if scale <= 0:
            return None

        return round(
            (
                new-old
            )
            /scale,
            4
        )


    def feature_level(
        shift,
        ref_median,
        recent_median
    ):

        if shift is None:

            if (
                ref_median
                is not None
                and
                recent_median
                is not None
                and
                ref_median
                ==recent_median
            ):
                return "stable"

            return "not_scored"

        value=abs(
            shift
        )

        if value >= 3.0:
            return "clear_change"

        if value >= 1.5:
            return "watch"

        return "stable"


    def class_level(delta_pp):

        value=abs(
            delta_pp
        )

        if value >= 10.0:
            return "clear_change"

        if value >= 5.0:
            return "watch"

        return "stable"


    with connect() as c:

        rows=c.execute(
            """
            SELECT
                timestamp,
                manual,
                metrics
            FROM events
            WHERE timestamp IS NOT NULL
            ORDER BY timestamp
            """
        ).fetchall()


    events=[]

    parse_errors=0


    for row in rows:

        ts=parse_ts(
            row["timestamp"]
        )

        if ts is None:
            continue


        try:

            metrics=json.loads(
                row["metrics"]
                or "{}"
            )

            if not isinstance(
                metrics,
                dict
            ):
                metrics={}

        except Exception:

            metrics={}
            parse_errors+=1


        automatic_class=str(
            metrics.get(
                "class",
                "BRAK DANYCH"
            )
            or
            "BRAK DANYCH"
        )


        effective_class=str(
            row["manual"]
            or
            automatic_class
        )


        events.append(
            {
                "timestamp":
                    ts,

                "class":
                    effective_class,

                "active_pixels":
                    number(
                        metrics.get(
                            "active_pixels"
                        )
                    ),

                "peak":
                    number(
                        metrics.get(
                            "peak"
                        )
                    ),

                "clusters":
                    clusters_value(
                        metrics.get(
                            "clusters"
                        )
                    )
            }
        )


    if not events:

        return {
            "version":
                "2.0",

            "available":
                False,

            "state":
                "insufficient",

            "maturity":
                "provisional",

            "reason":
                "Brak zdarzeń w archiwum.",

            "scope":
                "archive_only",

            "uptime_normalized":
                False,

            "exposure_normalized":
                False
        }


    first=min(
        e["timestamp"]
        for e in events
    )

    last=max(
        e["timestamp"]
        for e in events
    )

    recent_start=(
        last
        -timedelta(
            hours=24
        )
    )


    reference=[
        e
        for e in events
        if e["timestamp"]
        <recent_start
    ]


    recent=[
        e
        for e in events
        if e["timestamp"]
        >=recent_start
        and
        e["timestamp"]
        <=last
    ]


    span_days=(
        (
            last-first
        ).total_seconds()
        /86400.0
    )


    def activity_summary(data):

        hourly={}

        for event in data:

            bucket=event[
                "timestamp"
            ].replace(
                minute=0,
                second=0,
                microsecond=0
            )

            hourly[bucket]=(
                hourly.get(
                    bucket,
                    0
                )
                +1
            )


        counts=list(
            hourly.values()
        )


        return {
            "active_hours":
                len(counts),

            "nonzero_hour_median":
                (
                    round(
                        median(counts),
                        4
                    )
                    if counts
                    else None
                ),

            "nonzero_hour_mean":
                (
                    round(
                        mean(counts),
                        4
                    )
                    if counts
                    else None
                ),

            "nonzero_hour_max":
                (
                    max(counts)
                    if counts
                    else None
                )
        }


    feature_labels={
        "active_pixels":
            "Aktywne piksele",

        "peak":
            "Jasność maksymalna",

        "clusters":
            "Liczba klastrów"
    }


    feature_output={}


    for key,label in feature_labels.items():

        ref_values=[
            e[key]
            for e in reference
            if e[key] is not None
        ]

        recent_values=[
            e[key]
            for e in recent
            if e[key] is not None
        ]


        ref_med=median(
            ref_values
        )

        recent_med=median(
            recent_values
        )

        ref_mad=mad(
            ref_values
        )

        shift=robust_shift(
            recent_med,
            ref_med,
            ref_mad
        )


        feature_output[key]={
            "label":
                label,

            "reference_n":
                len(ref_values),

            "recent_n":
                len(recent_values),

            "reference_median":
                ref_med,

            "recent_median":
                recent_med,

            "reference_mad":
                ref_mad,

            "reference_robust_scale":
                (
                    round(
                        1.4826*ref_mad,
                        4
                    )
                    if (
                        ref_mad
                        is not None
                        and
                        ref_mad > 0
                    )
                    else None
                ),

            "delta":
                (
                    round(
                        recent_med-ref_med,
                        4
                    )
                    if (
                        ref_med is not None
                        and
                        recent_med is not None
                    )
                    else None
                ),

            "delta_percent":
                delta_percent(
                    recent_med,
                    ref_med
                ),

            "robust_shift":
                shift,

            "level":
                feature_level(
                    shift,
                    ref_med,
                    recent_med
                )
        }


    def class_percentages(data):

        counts={}

        for event in data:

            name=str(
                event["class"]
                or
                "BRAK DANYCH"
            )

            counts[name]=(
                counts.get(
                    name,
                    0
                )
                +1
            )


        total=len(data)


        return {
            name:
                {
                    "count":
                        count,

                    "percent":
                        (
                            100.0
                            *count
                            /total
                            if total
                            else 0.0
                        )
                }

            for name,count
            in counts.items()
        }


    ref_classes=class_percentages(
        reference
    )

    recent_classes=class_percentages(
        recent
    )


    class_output=[]


    for name in sorted(
        set(ref_classes)
        |
        set(recent_classes)
    ):

        ref=ref_classes.get(
            name,
            {
                "count":0,
                "percent":0.0
            }
        )

        cur=recent_classes.get(
            name,
            {
                "count":0,
                "percent":0.0
            }
        )


        delta_pp=round(
            cur["percent"]
            -ref["percent"],
            4
        )


        class_output.append(
            {
                "class":
                    name,

                "reference_count":
                    ref["count"],

                "recent_count":
                    cur["count"],

                "reference_percent":
                    round(
                        ref["percent"],
                        4
                    ),

                "recent_percent":
                    round(
                        cur["percent"],
                        4
                    ),

                "delta_pp":
                    delta_pp,

                "level":
                    class_level(
                        delta_pp
                    )
            }
        )


    feature_levels=[
        item.get(
            "level"
        )
        for item
        in feature_output.values()
    ]


    class_levels=[
        item.get(
            "level"
        )
        for item
        in class_output
    ]


    enough_data=(
        len(reference) >= 20
        and
        len(recent) >= 20
    )


    if not enough_data:

        state="insufficient"

    elif (
        "clear_change"
        in feature_levels
        or
        "clear_change"
        in class_levels
    ):

        state="clear_change"

    elif (
        "watch"
        in feature_levels
        or
        "watch"
        in class_levels
    ):

        state="watch"

    else:

        state="stable"


    maturity=(
        "mature"
        if (
            span_days >= 7.0
            and
            enough_data
        )
        else
        "provisional"
    )


    return {
        "version":
            "2.0",

        "available":
            True,

        "scope":
            "archive_only",

        "window":
            {
                "method":
                    (
                        "all earlier events "
                        "vs latest 24h"
                    ),

                "reference":
                    "all_events_before_latest_24h",

                "recent_hours":
                    24,

                "reference_count":
                    len(reference),

                "recent_count":
                    len(recent),

                "recent_start":
                    recent_start.isoformat(),

                "last_event":
                    last.isoformat()
            },

        "coverage":
            {
                "event_count":
                    len(events),

                "first_event":
                    first.isoformat(),

                "last_event":
                    last.isoformat(),

                "span_days":
                    round(
                        span_days,
                        4
                    )
            },

        "state":
            state,

        "maturity":
            maturity,

        "features":
            feature_output,

        "classes":
            class_output,

        "activity":
            {
                "reference":
                    activity_summary(
                        reference
                    ),

                "recent":
                    activity_summary(
                        recent
                    )
            },

        "metrics_parse_errors":
            parse_errors,

        "uptime_normalized":
            False,

        "exposure_normalized":
            False,

        "rules":
            {
                "feature_watch_abs_robust_shift":
                    1.5,

                "feature_clear_change_abs_robust_shift":
                    3.0,

                "class_watch_abs_delta_pp":
                    5.0,

                "class_clear_change_abs_delta_pp":
                    10.0,

                "minimum_reference_events":
                    20,

                "minimum_recent_events":
                    20,

                "mature_after_span_days":
                    7.0
            },

        "interpretation":
            (
                "Diagnostyka stabilności archiwum. "
                "Progi są regułami aplikacji, "
                "nie progami fizycznymi ani "
                "kalibracją bezwzględną detektora."
            )
    }



# ============================================================
# CREDO_BASELINE_HISTORY_V3
#
# Historia snapshotów Baseline Drift V2.
#
# Oddzielna baza:
#   $CREDO_DATA_DIR/baseline_history.sqlite3
#
# Snapshot jest zapisywany tylko raz na unikalny last_event.
# archive.sqlite3 nie jest modyfikowana przez ten moduł.
# ============================================================

_BASELINE_HISTORY_LOCK_V3=threading.Lock()


def _research_baseline_history_v3(
    current_drift
):

    import sqlite3 as _sqlite3
    import json as _json
    import os as _os

    from pathlib import Path as _Path
    from datetime import datetime as _datetime
    from datetime import timezone as _timezone


    data_dir=_Path(
        _os.environ.get(
            "CREDO_DATA_DIR",
            str(DATA)
        )
    )


    db_path=(
        data_dir
        /
        "baseline_history.sqlite3"
    )


    con=None


    try:

        data_dir.mkdir(
            parents=True,
            exist_ok=True
        )


        with _BASELINE_HISTORY_LOCK_V3:

            con=_sqlite3.connect(
                str(db_path),
                timeout=5.0
            )

            con.row_factory=_sqlite3.Row


            con.execute(
                """
                CREATE TABLE IF NOT EXISTS
                baseline_drift_history
                (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,

                    last_event TEXT NOT NULL UNIQUE,

                    captured_at TEXT NOT NULL,

                    event_count INTEGER,

                    state TEXT,

                    maturity TEXT,

                    payload TEXT NOT NULL
                )
                """
            )


            con.execute(
                """
                CREATE INDEX IF NOT EXISTS
                idx_baseline_history_captured
                ON baseline_drift_history(
                    captured_at
                )
                """
            )


            if (
                isinstance(
                    current_drift,
                    dict
                )
                and
                current_drift.get(
                    "available"
                )
            ):

                window=(
                    current_drift.get(
                        "window"
                    )
                    or {}
                )

                coverage=(
                    current_drift.get(
                        "coverage"
                    )
                    or {}
                )

                last_event=window.get(
                    "last_event"
                )


                if last_event:

                    features=(
                        current_drift.get(
                            "features"
                        )
                        or {}
                    )


                    snapshot={
                        "captured_at":
                            _datetime.now(
                                _timezone.utc
                            ).isoformat(),

                        "last_event":
                            last_event,

                        "event_count":
                            coverage.get(
                                "event_count"
                            ),

                        "span_days":
                            coverage.get(
                                "span_days"
                            ),

                        "reference_count":
                            window.get(
                                "reference_count"
                            ),

                        "recent_count":
                            window.get(
                                "recent_count"
                            ),

                        "state":
                            current_drift.get(
                                "state"
                            ),

                        "maturity":
                            current_drift.get(
                                "maturity"
                            ),

                        "features":
                            {
                                key:{
                                    "reference_median":
                                        (
                                            value
                                            or {}
                                        ).get(
                                            "reference_median"
                                        ),

                                    "recent_median":
                                        (
                                            value
                                            or {}
                                        ).get(
                                            "recent_median"
                                        ),

                                    "delta_percent":
                                        (
                                            value
                                            or {}
                                        ).get(
                                            "delta_percent"
                                        ),

                                    "robust_shift":
                                        (
                                            value
                                            or {}
                                        ).get(
                                            "robust_shift"
                                        ),

                                    "level":
                                        (
                                            value
                                            or {}
                                        ).get(
                                            "level"
                                        )
                                }

                                for key,value
                                in features.items()
                            },

                        "classes":
                            current_drift.get(
                                "classes"
                            )
                            or [],

                        "uptime_normalized":
                            False,

                        "exposure_normalized":
                            False
                    }


                    payload=_json.dumps(
                        snapshot,
                        ensure_ascii=False,
                        separators=(
                            ",",
                            ":"
                        )
                    )


                    con.execute(
                        """
                        INSERT OR IGNORE INTO
                        baseline_drift_history
                        (
                            last_event,
                            captured_at,
                            event_count,
                            state,
                            maturity,
                            payload
                        )
                        VALUES
                        (
                            ?,
                            ?,
                            ?,
                            ?,
                            ?,
                            ?
                        )
                        """,
                        (
                            snapshot[
                                "last_event"
                            ],

                            snapshot[
                                "captured_at"
                            ],

                            snapshot[
                                "event_count"
                            ],

                            snapshot[
                                "state"
                            ],

                            snapshot[
                                "maturity"
                            ],

                            payload
                        )
                    )


                    con.commit()


            total=con.execute(
                """
                SELECT COUNT(*)
                FROM baseline_drift_history
                """
            ).fetchone()[0]


            rows=con.execute(
                """
                SELECT payload
                FROM baseline_drift_history
                ORDER BY id DESC
                LIMIT 168
                """
            ).fetchall()


            con.close()
            con=None


        snapshots=[]
        parse_errors=0


        for row in reversed(rows):

            try:

                value=_json.loads(
                    row["payload"]
                )

                if isinstance(
                    value,
                    dict
                ):

                    snapshots.append(
                        value
                    )

            except Exception:

                parse_errors+=1


        return {
            "version":
                "3.0",

            "available":
                True,

            "storage":
                "separate_sqlite",

            "snapshot_key":
                "last_event",

            "total_snapshots":
                int(total),

            "returned_snapshots":
                len(snapshots),

            "api_limit":
                168,

            "snapshots":
                snapshots,

            "parse_errors":
                parse_errors,

            "uptime_normalized":
                False,

            "exposure_normalized":
                False,

            "interpretation":
                (
                    "Historia diagnostycznych "
                    "snapshotów Baseline Drift. "
                    "Nie jest pomiarem strumienia "
                    "cząstek ani kalibracją "
                    "bezwzględną."
                )
        }


    except Exception as exc:

        if con is not None:

            try:
                con.close()
            except Exception:
                pass


        return {
            "version":
                "3.0",

            "available":
                False,

            "storage":
                "separate_sqlite",

            "error":
                str(exc),

            "snapshots":
                [],

            "uptime_normalized":
                False,

            "exposure_normalized":
                False
        }



def research_payload(query):
    mode = (
        query.get(
            "mode",
            [""]
        )[0]
        if query
        else ""
    )

    space, kp_rows = (
        _research_space_weather()
    )

    if mode == "space":
        return {
            "version":
                "CREDO_RESEARCH_V11",

            "space_weather":
                space
        }

    local_query = {}

    if query:
        cls = (
            query.get(
                "class",
                [""]
            )[0]
        )

        if cls:
            local_query[
                "class"
            ] = [cls]

    events = rows(
        local_query
    )

    return {
        "baseline_drift": (baseline_drift_v2 := _research_baseline_drift_v2()),
        "baseline_history": _research_baseline_history_v3(baseline_drift_v2),
        "version":
            "CREDO_RESEARCH_V11",

        "event_count":
            len(events),

        "space_weather":
            space,

        "coincidences":
            _research_coincidences(
                events
            ),

        "space_comparison":
            _research_space_comparison(
                events,
                kp_rows
            ),

        "baseline_archive":
            _research_baseline_archive(
                events
            ),

        "unusual":
            _research_unusual(
                events
            ),

        "network_credo":
            _research_network(
                events
            )
    }



# ============================================================
# CREDO_SYSTEM_HEALTH_V1
#
# Lekki monitoring aplikacji.
# NOAA i czas /api/research pochodzą z ostatniego
# rzeczywistego wywołania /api/research — bez dodatkowego
# odpytywania NOAA.
# ============================================================

_SYSTEM_HEALTH_RESEARCH = {
    "updated_epoch": None,
    "duration_ms": None,
    "space_weather": None,
}



# ============================================================
# CREDO_OPERATOR_ALERTS_V1
#
# Alerty techniczne/operatora.
#
# Zasady:
# - INFO nie podnosi stanu systemu do WARNING.
# - brak detekcji NIE jest alertem:
#   nie mamy jeszcze wiarygodnego uptime/exposure.
# - brak automatycznych restartów i samonaprawiania.
# ============================================================

def _operator_alerts_v1(
    *,
    credo_status,
    credo_detail,
    credo_updated,
    credo_busy,
    db_status,
    disk_free_gb,
    disk_free_pct,
    cpu_temp_c,
    duration_ms,
    research_age,
    noaa_status
):

    import sqlite3

    from datetime import (
        datetime,
        timezone
    )

    from pathlib import Path


    now=datetime.now(
        timezone.utc
    )

    alerts=[]


    def add(
        severity,
        key,
        title,
        detail,
        value=None,
        threshold=None
    ):

        alerts.append(
            {
                "severity":
                    severity,

                "key":
                    key,

                "title":
                    title,

                "detail":
                    detail,

                "value":
                    value,

                "threshold":
                    threshold
            }
        )


    def parse_time(value):

        if not value:
            return None

        try:

            dt=datetime.fromisoformat(
                str(value)
                .replace(
                    "Z",
                    "+00:00"
                )
            )

            if dt.tzinfo is None:

                dt=dt.replace(
                    tzinfo=timezone.utc
                )

            return dt.astimezone(
                timezone.utc
            )

        except Exception:

            return None


    # --------------------------------------------------------
    # CREDO synchronizacja
    # --------------------------------------------------------

    sync_age_min=None

    updated_dt=parse_time(
        credo_updated
    )


    if credo_status=="error":

        add(
            "error",
            "credo_error",
            "Synchronizacja CREDO",
            str(
                credo_detail
                or
                "Błąd synchronizacji CREDO"
            ),
            None,
            "brak błędu"
        )

    elif updated_dt is None:

        add(
            "warning",
            "credo_sync_unknown",
            "Synchronizacja CREDO",
            "Brak wiarygodnego czasu ostatniej synchronizacji.",
            None,
            "aktualizacja co około 1 h"
        )

    else:

        sync_age_min=max(
            0.0,
            (
                now-updated_dt
            ).total_seconds()/60.0
        )


        if sync_age_min > 180:

            add(
                "error",
                "credo_sync_stale",
                "Synchronizacja CREDO",
                "Dane profilu CREDO nie były odświeżane od ponad 3 godzin.",
                round(
                    sync_age_min,
                    1
                ),
                "> 180 min"
            )

        elif sync_age_min > 90:

            add(
                "warning",
                "credo_sync_stale",
                "Synchronizacja CREDO",
                "Ostatnia synchronizacja jest starsza niż 90 minut.",
                round(
                    sync_age_min,
                    1
                ),
                "> 90 min"
            )


    if credo_busy:

        add(
            "info",
            "credo_sync_busy",
            "Synchronizacja CREDO",
            "W tej chwili trwa pobieranie danych.",
            None,
            None
        )


    # --------------------------------------------------------
    # Stan bazy + quick_check archiwum
    # --------------------------------------------------------

    archive_check=None
    network_check=None
    journal_chain_ok=None
    baseline_span_days=None
    baseline_events=None


    if db_status=="error":

        add(
            "error",
            "archive_database",
            "Baza archiwum",
            "Backend zgłasza błąd dostępu do archive.sqlite3.",
            None,
            "status = ok"
        )

    else:

        try:

            with connect() as c:

                row=c.execute(
                    "PRAGMA quick_check"
                ).fetchone()

                archive_check=(
                    row[0]
                    if row
                    else None
                )


                if archive_check!="ok":

                    add(
                        "error",
                        "archive_integrity",
                        "Integralność archive.sqlite3",
                        "SQLite quick_check nie zwrócił 'ok'.",
                        archive_check,
                        "ok"
                    )


                chain=_journal_chain_state(c)

                journal_chain_ok=bool(
                    chain.get("ok")
                )


                if not journal_chain_ok:

                    add(
                        "error",
                        "journal_chain",
                        "Research Journal",
                        (
                            "Łańcuch SHA-256 Journalu jest niespójny. "
                            "Wpis: "
                            +str(
                                chain.get(
                                    "broken_at_id"
                                )
                            )
                            +". "
                            +str(
                                chain.get(
                                    "reason"
                                )
                                or ""
                            )
                        ),
                        False,
                        "chain_ok = true"
                    )


                row=c.execute(
                    """
                    SELECT
                        MIN(timestamp),
                        MAX(timestamp),
                        COUNT(*)
                    FROM events
                    WHERE timestamp IS NOT NULL
                    """
                ).fetchone()


                if row:

                    first_dt=parse_time(
                        row[0]
                    )

                    last_dt=parse_time(
                        row[1]
                    )

                    baseline_events=int(
                        row[2]
                        or 0
                    )


                    if (
                        first_dt is not None
                        and
                        last_dt is not None
                    ):

                        baseline_span_days=max(
                            0.0,
                            (
                                last_dt-first_dt
                            ).total_seconds()
                            /86400.0
                        )


                        if baseline_span_days < 7:

                            add(
                                "info",
                                "baseline_provisional",
                                "Baseline archiwum",
                                (
                                    "Baseline nadal jest wstępny. "
                                    "Nie jest znormalizowany względem "
                                    "uptime ani ekspozycji."
                                ),
                                round(
                                    baseline_span_days,
                                    2
                                ),
                                "< 7 dni"
                            )


        except Exception as exc:

            add(
                "warning",
                "archive_check_failed",
                "Kontrola archiwum",
                (
                    "Nie udało się wykonać pełnej "
                    "kontroli operatorskiej: "
                    +str(exc)[:180]
                ),
                None,
                None
            )


    # --------------------------------------------------------
    # Network DB
    # --------------------------------------------------------

    try:

        con=sqlite3.connect(
            f"file:{_NETWORK_DB}?mode=ro",
            uri=True
        )

        try:

            row=con.execute(
                "PRAGMA quick_check"
            ).fetchone()

            network_check=(
                row[0]
                if row
                else None
            )

        finally:

            con.close()


        if network_check!="ok":

            add(
                "error",
                "network_integrity",
                "Integralność network.sqlite3",
                "SQLite quick_check nie zwrócił 'ok'.",
                network_check,
                "ok"
            )


    except Exception as exc:

        if not Path(_NETWORK_DB).exists():

            add(
                "info",
                "network_db_optional",
                "Sieć CREDO",
                (
                    "Opcjonalna baza network.sqlite3 nie jest "
                    "skonfigurowana na tym Macu."
                ),
                None,
                None
            )

        else:

            add(
                "warning",
                "network_check_failed",
                "Kontrola network.sqlite3",
                (
                    "Nie udało się sprawdzić bazy sieciowej: "
                    +str(exc)[:180]
                ),
                None,
                None
            )


    # --------------------------------------------------------
    # Dysk
    # --------------------------------------------------------

    if isinstance(
        disk_free_gb,
        (int,float)
    ):

        if (
            disk_free_gb < 2
            or
            (
                isinstance(
                    disk_free_pct,
                    (int,float)
                )
                and
                disk_free_pct < 5
            )
        ):

            add(
                "error",
                "disk_space",
                "Wolne miejsce",
                "Krytycznie mało wolnego miejsca na karcie systemowej.",
                disk_free_gb,
                "< 2 GB lub < 5%"
            )

        elif (
            disk_free_gb < 5
            or
            (
                isinstance(
                    disk_free_pct,
                    (int,float)
                )
                and
                disk_free_pct < 15
            )
        ):

            add(
                "warning",
                "disk_space",
                "Wolne miejsce",
                "Kończy się wolne miejsce na karcie systemowej.",
                disk_free_gb,
                "< 5 GB lub < 15%"
            )


    # --------------------------------------------------------
    # CPU
    # --------------------------------------------------------

    if isinstance(
        cpu_temp_c,
        (int,float)
    ):

        if cpu_temp_c >= 80:

            add(
                "error",
                "cpu_temperature",
                "Temperatura hosta",
                "Temperatura CPU osiągnęła poziom krytyczny.",
                cpu_temp_c,
                ">= 80 °C"
            )

        elif cpu_temp_c >= 70:

            add(
                "warning",
                "cpu_temperature",
                "Temperatura hosta",
                "Temperatura CPU jest podwyższona.",
                cpu_temp_c,
                ">= 70 °C"
            )


    # --------------------------------------------------------
    # RAM
    # --------------------------------------------------------

    ram_available_mb=None

    try:

        mem={}

        for line in Path(
            "/proc/meminfo"
        ).read_text(
            encoding="ascii"
        ).splitlines():

            if ":" not in line:
                continue

            key,value=line.split(
                ":",
                1
            )

            raw=value.strip().split()

            if raw:

                mem[key]=float(
                    raw[0]
                )


        if "MemAvailable" in mem:

            ram_available_mb=(
                mem["MemAvailable"]
                /1024.0
            )


            if ram_available_mb < 128:

                add(
                    "error",
                    "ram_available",
                    "Pamięć RAM",
                    "Krytycznie mało dostępnej pamięci RAM.",
                    round(
                        ram_available_mb,
                        1
                    ),
                    "< 128 MB"
                )

            elif ram_available_mb < 256:

                add(
                    "warning",
                    "ram_available",
                    "Pamięć RAM",
                    "Mało dostępnej pamięci RAM.",
                    round(
                        ram_available_mb,
                        1
                    ),
                    "< 256 MB"
                )


    except Exception:

        pass


    # --------------------------------------------------------
    # /api/research — wydajność
    # --------------------------------------------------------

    if isinstance(
        duration_ms,
        (int,float)
    ):

        if duration_ms >= 5000:

            add(
                "error",
                "research_duration",
                "/api/research",
                "Ostatnie generowanie danych BADANIA było bardzo wolne.",
                duration_ms,
                ">= 5000 ms"
            )

        elif duration_ms >= 2000:

            add(
                "warning",
                "research_duration",
                "/api/research",
                "Ostatnie generowanie danych BADANIA było wolniejsze niż zwykle.",
                duration_ms,
                ">= 2000 ms"
            )


    # --------------------------------------------------------
    # Wiek cache BADANIA / NOAA
    #
    # 15 min NIE jest awarią.
    # Cache nie musi być odświeżany, jeśli użytkownik
    # nie korzysta aktualnie z BADANIA.
    # --------------------------------------------------------

    if research_age is None:

        add(
            "info",
            "research_cache_empty",
            "Cache BADANIA",
            "Po restarcie cache nie został jeszcze zasilony.",
            None,
            None
        )

    elif research_age > 21600:

        add(
            "warning",
            "research_cache_stale",
            "Cache BADANIA / NOAA",
            "Lokalny cache BADANIA jest starszy niż 6 godzin.",
            round(
                research_age/3600.0,
                2
            ),
            "> 6 h"
        )

    elif research_age > 3600:

        add(
            "info",
            "research_cache_age",
            "Cache BADANIA / NOAA",
            "Lokalny cache nie był odświeżany od ponad godziny.",
            round(
                research_age/3600.0,
                2
            ),
            "> 1 h"
        )


    # NOAA unknown po restarcie jest informacją,
    # nie alarmem technicznym.

    if (
        noaa_status=="unknown"
        and
        research_age is None
    ):

        add(
            "info",
            "noaa_waiting",
            "NOAA SWPC",
            "Oczekiwanie na pierwsze zasilenie cache BADANIA.",
            None,
            None
        )


    # --------------------------------------------------------
    # Podsumowanie
    # --------------------------------------------------------

    order={
        "error":0,
        "warning":1,
        "info":2
    }

    alerts.sort(
        key=lambda item:
            (
                order.get(
                    item["severity"],
                    99
                ),
                item["key"]
            )
    )


    errors=sum(
        1
        for item in alerts
        if item["severity"]=="error"
    )

    warnings=sum(
        1
        for item in alerts
        if item["severity"]=="warning"
    )

    infos=sum(
        1
        for item in alerts
        if item["severity"]=="info"
    )


    if errors:

        overall="error"

    elif warnings:

        overall="warning"

    else:

        overall="ok"


    return {
        "version":
            "1.0",

        "overall":
            overall,

        "active_count":
            errors+warnings,

        "counts":{
            "error":
                errors,

            "warning":
                warnings,

            "info":
                infos
        },

        "items":
            alerts,

        "checks":{
            "archive_quick_check":
                archive_check,

            "network_quick_check":
                network_check,

            "journal_chain_ok":
                journal_chain_ok,

            "credo_sync_age_min":
                (
                    round(
                        sync_age_min,
                        1
                    )
                    if sync_age_min is not None
                    else None
                ),

            "baseline_span_days":
                (
                    round(
                        baseline_span_days,
                        2
                    )
                    if baseline_span_days is not None
                    else None
                ),

            "baseline_events":
                baseline_events,

            "ram_available_mb":
                (
                    round(
                        ram_available_mb,
                        1
                    )
                    if ram_available_mb is not None
                    else None
                )
        },

        "thresholds":{
            "credo_sync_warning_min":
                90,

            "credo_sync_error_min":
                180,

            "disk_warning_gb":
                5,

            "disk_error_gb":
                2,

            "cpu_warning_c":
                70,

            "cpu_error_c":
                80,

            "ram_warning_mb":
                256,

            "ram_error_mb":
                128,

            "research_warning_ms":
                2000,

            "research_error_ms":
                5000,

            "cache_info_seconds":
                3600,

            "cache_warning_seconds":
                21600,

            "baseline_info_days":
                7
        },

        "generated_at":
            now.isoformat(),

        "note":
            (
                "Brak detekcji nie jest alertem, "
                "dopóki nie ma wiarygodnego uptime/exposure."
            )
    }


def system_health_payload():
    import shutil

    now_epoch=time.time()

    # --------------------------------------------------------
    # CREDO / synchronizacja profilu
    # --------------------------------------------------------

    profile=meta("profile",{}) or {}
    credo_error=meta("error")

    if credo_error:
        credo_status="error"
        credo_detail=str(credo_error)[:180]
    elif LOCK.locked():
        credo_status="warning"
        credo_detail="Trwa pobieranie danych CREDO"
    else:
        credo_status="ok"
        updated=profile.get("updated")
        credo_detail=(
            "Ostatnia synchronizacja: "+str(updated)
            if updated
            else "Archiwum dostępne"
        )

    # --------------------------------------------------------
    # Baza + ostatnia detekcja
    # --------------------------------------------------------

    db_status="ok"
    db_detail=None
    db_events=None
    latest_detection=None

    try:
        with connect() as c:
            db_events=c.execute(
                "SELECT count(*) FROM events"
            ).fetchone()[0]

            row=c.execute(
                """
                SELECT timestamp
                FROM events
                WHERE timestamp IS NOT NULL
                ORDER BY timestamp DESC
                LIMIT 1
                """
            ).fetchone()

            latest_detection=(
                row[0]
                if row
                else None
            )

        db_detail=f"{db_events} zdarzeń"

    except Exception as exc:
        db_status="error"
        db_detail=str(exc)[:180]

    # --------------------------------------------------------
    # Dysk
    # --------------------------------------------------------

    disk_status="unknown"
    disk_free_gb=None
    disk_free_pct=None

    try:
        usage=shutil.disk_usage(
            str(DATA)
        )

        disk_free_gb=round(
            usage.free / (1024**3),
            1
        )

        disk_free_pct=round(
            usage.free / usage.total * 100,
            1
        )

        if disk_free_pct < 5:
            disk_status="error"
        elif disk_free_pct < 15:
            disk_status="warning"
        else:
            disk_status="ok"

    except Exception:
        pass

    # --------------------------------------------------------
    # Temperatura hosta
    # --------------------------------------------------------

    cpu_status="unknown"
    cpu_temp_c=None

    try:
        raw=Path(
            "/sys/class/thermal/thermal_zone0/temp"
        ).read_text(
            encoding="ascii"
        ).strip()

        cpu_temp_c=round(
            float(raw)/1000.0,
            1
        )

        if cpu_temp_c >= 80:
            cpu_status="error"
        elif cpu_temp_c >= 70:
            cpu_status="warning"
        else:
            cpu_status="ok"

    except Exception:
        pass

    # --------------------------------------------------------
    # Ostatni rzeczywisty /api/research
    # --------------------------------------------------------

    research=dict(
        _SYSTEM_HEALTH_RESEARCH
    )

    research_age=None

    if research.get("updated_epoch"):
        research_age=round(
            max(
                0.0,
                now_epoch
                -research["updated_epoch"]
            ),
            1
        )

    duration_ms=research.get(
        "duration_ms"
    )

    if duration_ms is None:
        research_status="unknown"
    elif research_age is not None and research_age > 21600:
        research_status="warning"
    elif duration_ms >= 10000:
        research_status="error"
    elif duration_ms >= 2000:
        research_status="warning"
    else:
        research_status="ok"

    # --------------------------------------------------------
    # NOAA — tylko dane zapamiętane z /api/research
    # --------------------------------------------------------

    sw=research.get(
        "space_weather"
    )

    noaa_status="unknown"
    noaa_detail="Oczekiwanie na dane BADANIA"

    if isinstance(sw,dict):
        useful=[
            sw.get("kp"),
            sw.get("g"),
            sw.get("s"),
            sw.get("r"),
            sw.get("dst"),
            sw.get("xray"),
        ]

        if any(
            value is not None
            for value in useful
        ):
            noaa_status=(
                "warning"
                if research_age is not None
                and research_age > 21600
                else "ok"
            )

            parts=[]

            if sw.get("kp") is not None:
                parts.append(
                    "Kp "+str(sw.get("kp"))
                )

            if sw.get("g") is not None:
                parts.append(
                    "G"+str(sw.get("g"))
                )

            if sw.get("s") is not None:
                parts.append(
                    "S"+str(sw.get("s"))
                )

            if sw.get("r") is not None:
                parts.append(
                    "R"+str(sw.get("r"))
                )

            # CREDO_NOAA_DETAIL_FIX_V1
            #
            # /api/research może zwracać Dst jako:
            # {"value": -2.0, "time": "..."}
            #
            # Do małego kafla SYSTEM HEALTH trafia wyłącznie
            # wartość liczbowa, nie reprezentacja całego dict.
            #
            dst_raw=sw.get("dst")

            if isinstance(dst_raw,dict):
                dst_value=dst_raw.get("value")
            else:
                dst_value=dst_raw

            if dst_value is not None:

                try:
                    dst_text=f"{float(dst_value):g}"

                except (TypeError,ValueError):
                    dst_text=str(dst_value)

                parts.append(
                    "Dst "+dst_text+" nT"
                )

            noaa_detail=(
                " · ".join(parts)
                if parts
                else "NOAA SWPC — dane dostępne"
            )

    # --------------------------------------------------------
    # Operator Alerts V1
    # --------------------------------------------------------

    operator_alerts=_operator_alerts_v1(
        credo_status=credo_status,
        credo_detail=credo_detail,
        credo_updated=profile.get("updated"),
        credo_busy=LOCK.locked(),
        db_status=db_status,
        disk_free_gb=disk_free_gb,
        disk_free_pct=disk_free_pct,
        cpu_temp_c=cpu_temp_c,
        duration_ms=duration_ms,
        research_age=research_age,
        noaa_status=noaa_status
    )


    # --------------------------------------------------------
    # Status zbiorczy
    # --------------------------------------------------------

    states=[
        credo_status,
        db_status,
        disk_status,
        cpu_status,
        research_status,
        noaa_status,
        operator_alerts.get("overall"),
    ]

    if "error" in states:
        overall="error"
    elif "warning" in states:
        overall="warning"
    else:
        overall="ok"

    return {
        "version":"1.0",
        "overall":overall,

        "operator_alerts":
            operator_alerts,

        "credo":{
            "status":credo_status,
            "detail":credo_detail,
            "updated":profile.get("updated"),
            "busy":LOCK.locked(),
        },

        "database":{
            "status":db_status,
            "detail":db_detail,
            "events":db_events,
            "latest_detection":latest_detection,
        },

        "research":{
            "status":research_status,
            "duration_ms":duration_ms,
            "age_seconds":research_age,
        },

        "noaa":{
            "status":noaa_status,
            "detail":noaa_detail,
            "age_seconds":research_age,
        },

        "cpu":{
            "status":cpu_status,
            "temp_c":cpu_temp_c,
        },

        "disk":{
            "status":disk_status,
            "free_gb":disk_free_gb,
            "free_pct":disk_free_pct,
        },

        "generated_at":
            datetime.now(
                timezone.utc
            ).isoformat(),
    }



# ============================================================
# CREDO_RESEARCH_JOURNAL_V1
# ============================================================

_JOURNAL_LOCK=threading.Lock()

_JOURNAL_KINDS={
    "candidate_review",
    "coincidence_review",
    "baseline_snapshot",
    "manual_note"
}

_JOURNAL_SUBJECT_TYPES={
    "event",
    "pair",
    "baseline",
    "general"
}


def _journal_canonical(data):

    return json.dumps(
        data,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",",":")
    )


def _journal_hash_payload(
    at,
    kind,
    subject_type,
    subject_id,
    title,
    note,
    algorithm_version,
    snapshot_text,
    prev_hash
):

    payload={
        "at":
            at,

        "kind":
            kind,

        "subject_type":
            subject_type,

        "subject_id":
            subject_id,

        "title":
            title,

        "note":
            note,

        "algorithm_version":
            algorithm_version,

        "snapshot":
            snapshot_text,

        "prev_hash":
            prev_hash
    }

    return hashlib.sha256(
        _journal_canonical(
            payload
        ).encode("utf-8")
    ).hexdigest()


def _journal_chain_state(c):

    rows=c.execute(
        """
        SELECT
            id,
            at,
            kind,
            subject_type,
            subject_id,
            title,
            note,
            algorithm_version,
            snapshot,
            prev_hash,
            entry_hash
        FROM research_journal
        ORDER BY id ASC
        """
    ).fetchall()

    previous=""

    for row in rows:

        stored_prev=(
            row["prev_hash"]
            or ""
        )

        if stored_prev != previous:

            return {
                "ok":
                    False,

                "broken_at_id":
                    row["id"],

                "reason":
                    "prev_hash mismatch"
            }


        expected=_journal_hash_payload(
            row["at"],
            row["kind"],
            row["subject_type"],
            row["subject_id"],
            row["title"],
            row["note"],
            row["algorithm_version"],
            row["snapshot"],
            stored_prev
        )


        if (
            row["entry_hash"]
            != expected
        ):

            return {
                "ok":
                    False,

                "broken_at_id":
                    row["id"],

                "reason":
                    "entry_hash mismatch"
            }


        previous=row["entry_hash"]


    return {
        "ok":
            True,

        "broken_at_id":
            None,

        "reason":
            None,

        "last_hash":
            previous
    }


def _journal_row(row):

    snapshot=None

    raw_snapshot=row["snapshot"]

    if raw_snapshot:

        try:

            snapshot=json.loads(
                raw_snapshot
            )

        except Exception:

            snapshot={
                "_raw":
                    raw_snapshot
            }


    return {
        "id":
            row["id"],

        "at":
            row["at"],

        "kind":
            row["kind"],

        "subject_type":
            row["subject_type"],

        "subject_id":
            row["subject_id"],

        "title":
            row["title"],

        "note":
            row["note"],

        "algorithm_version":
            row["algorithm_version"],

        "snapshot":
            snapshot,

        "prev_hash":
            row["prev_hash"],

        "entry_hash":
            row["entry_hash"]
    }


def _journal_payload(query):

    raw_limit=(
        query.get(
            "limit",
            ["100"]
        )[0]
        if query
        else "100"
    )

    try:

        limit=int(
            raw_limit
        )

    except Exception:

        limit=100


    limit=max(
        1,
        min(
            500,
            limit
        )
    )


    kind=None

    if query:

        raw_kind=query.get(
            "kind",
            [None]
        )[0]

        if raw_kind:

            kind=str(
                raw_kind
            ).strip()


    with connect() as c:

        chain=_journal_chain_state(c)

        total=c.execute(
            """
            SELECT COUNT(*)
            FROM research_journal
            """
        ).fetchone()[0]


        if kind:

            rows=c.execute(
                """
                SELECT
                    id,
                    at,
                    kind,
                    subject_type,
                    subject_id,
                    title,
                    note,
                    algorithm_version,
                    snapshot,
                    prev_hash,
                    entry_hash
                FROM research_journal
                WHERE kind=?
                ORDER BY id DESC
                LIMIT ?
                """,
                (
                    kind,
                    limit
                )
            ).fetchall()

        else:

            rows=c.execute(
                """
                SELECT
                    id,
                    at,
                    kind,
                    subject_type,
                    subject_id,
                    title,
                    note,
                    algorithm_version,
                    snapshot,
                    prev_hash,
                    entry_hash
                FROM research_journal
                ORDER BY id DESC
                LIMIT ?
                """,
                (
                    limit,
                )
            ).fetchall()


    return {
        "version":
            "1.0",

        "append_only":
            True,

        "hash_chain":
            "sha256",

        "chain_ok":
            bool(
                chain.get("ok")
            ),

        "chain_error":
            (
                None
                if chain.get("ok")
                else {
                    "id":
                        chain.get(
                            "broken_at_id"
                        ),

                    "reason":
                        chain.get(
                            "reason"
                        )
                }
            ),

        "total":
            total,

        "returned":
            len(rows),

        "entries":[
            _journal_row(row)
            for row in rows
        ]
    }


def _journal_append(data):

    if not isinstance(
        data,
        dict
    ):

        raise ValueError(
            "Nieprawidłowy wpis dziennika"
        )


    kind=str(
        data.get("kind")
        or ""
    ).strip()


    if kind not in _JOURNAL_KINDS:

        raise ValueError(
            "Nieznany typ wpisu Research Journal"
        )


    subject_type=str(
        data.get("subject_type")
        or "general"
    ).strip()


    if (
        subject_type
        not in _JOURNAL_SUBJECT_TYPES
    ):

        raise ValueError(
            "Nieznany typ obiektu Research Journal"
        )


    subject_id=data.get(
        "subject_id"
    )

    if subject_id is not None:

        subject_id=str(
            subject_id
        ).strip()[:256]

        if not subject_id:
            subject_id=None


    title=str(
        data.get("title")
        or ""
    ).strip()[:160]


    note=str(
        data.get("note")
        or ""
    ).strip()[:4000]


    if not title and not note:

        raise ValueError(
            "Wpis musi zawierać tytuł lub notatkę"
        )


    algorithm_version=data.get(
        "algorithm_version"
    )

    if algorithm_version is not None:

        algorithm_version=str(
            algorithm_version
        ).strip()[:160]

        if not algorithm_version:
            algorithm_version=None


    snapshot=data.get(
        "snapshot"
    )


    if snapshot is None:

        snapshot_text=None

    else:

        if not isinstance(
            snapshot,
            (dict,list)
        ):

            raise ValueError(
                "Snapshot musi być obiektem lub tablicą JSON"
            )


        snapshot_text=_journal_canonical(
            snapshot
        )


        if len(
            snapshot_text.encode(
                "utf-8"
            )
        ) > 6000:

            raise ValueError(
                "Snapshot jest zbyt duży"
            )


    at=legacy.now_iso()


    with _JOURNAL_LOCK:

        with connect() as c:

            previous=c.execute(
                """
                SELECT entry_hash
                FROM research_journal
                ORDER BY id DESC
                LIMIT 1
                """
            ).fetchone()


            prev_hash=(
                previous[0]
                if previous
                else ""
            )


            entry_hash=_journal_hash_payload(
                at,
                kind,
                subject_type,
                subject_id,
                title,
                note,
                algorithm_version,
                snapshot_text,
                prev_hash
            )


            cursor=c.execute(
                """
                INSERT INTO research_journal(
                    at,
                    kind,
                    subject_type,
                    subject_id,
                    title,
                    note,
                    algorithm_version,
                    snapshot,
                    prev_hash,
                    entry_hash
                )
                VALUES(
                    ?,?,?,?,?,?,?,?,?,?
                )
                """,
                (
                    at,
                    kind,
                    subject_type,
                    subject_id,
                    title,
                    note,
                    algorithm_version,
                    snapshot_text,
                    prev_hash,
                    entry_hash
                )
            )


            entry_id=cursor.lastrowid


            row=c.execute(
                """
                SELECT
                    id,
                    at,
                    kind,
                    subject_type,
                    subject_id,
                    title,
                    note,
                    algorithm_version,
                    snapshot,
                    prev_hash,
                    entry_hash
                FROM research_journal
                WHERE id=?
                """,
                (
                    entry_id,
                )
            ).fetchone()


    return {
        "ok":
            True,

        "append_only":
            True,

        "entry":
            _journal_row(row)
    }


class Handler(BaseHTTPRequestHandler):
    def send(self,body,ctype='application/json; charset=utf-8',code=200,download=None):
        if not isinstance(body,bytes): body=json.dumps(body,ensure_ascii=False).encode()
        self.send_response(code); self.send_header('Content-Type',ctype)
        self.send_header('Content-Length',str(len(body))); self.send_header('Cache-Control','no-store')
        self.send_header('X-Content-Type-Options','nosniff')
        if download: self.send_header('Content-Disposition','attachment; filename="'+download+'"')
        self.end_headers(); self.wfile.write(body)
    def do_GET(self):
        u=urlparse(self.path); q=parse_qs(u.query)
        if u.path=='/': return self.send((ROOT/'index.html').read_bytes(),'text/html; charset=utf-8')
        if u.path in ['/app.js','/style.css','/timelapse.js','/features.js']:
            return self.send((ROOT/u.path[1:]).read_bytes(),'text/javascript' if u.path.endswith('.js') else 'text/css')
        if u.path=='/healthz': return self.send(b'ok\n','text/plain')
        if u.path=='/api/space-history': return self.send(_sw15_history_payload(q))

        if u.path=='/api/research':
            started=time.perf_counter()

            payload=research_payload(q)

            _SYSTEM_HEALTH_RESEARCH[
                "updated_epoch"
            ]=time.time()

            _SYSTEM_HEALTH_RESEARCH[
                "duration_ms"
            ]=round(
                (
                    time.perf_counter()
                    -started
                )*1000,
                1
            )

            _SYSTEM_HEALTH_RESEARCH[
                "space_weather"
            ]=(
                payload.get("space_weather")
                if isinstance(payload,dict)
                else None
            )

            return self.send(payload)

        if u.path=='/api/system-health':
            return self.send(
                system_health_payload()
            )

        if u.path=='/api/research-journal':
            return self.send(
                _journal_payload(q)
            )

        if u.path=='/api/status':
            with connect() as c: total=c.execute('SELECT count(*) FROM events').fetchone()[0]
            return self.send(dict(version='2.0',profile=meta('profile',{}),error=meta('error'),total=total,
                                  busy=LOCK.locked(),next_refresh=datetime.fromtimestamp((int(time.time())//3600+1)*3600,timezone.utc).isoformat(),
                                  dimensions=meta('dimensions'),classes=CLASSES))
        if u.path=='/api/events-revision':
            with connect() as c:
                r=c.execute(
                    "SELECT value FROM meta "
                    "WHERE key='events_revision'"
                ).fetchone()

            try:
                revision=int(r[0]) if r else 0
            except (TypeError,ValueError):
                revision=0

            return self.send({
                'revision':revision
            })

        if u.path=='/api/events': return self.send(rows(q))
        if u.path=='/export.gif': return export_gif(self,q)
        if u.path=='/export/archive.zip': return export_archive(self)
        if u.path=='/export.csv':
            f=io.StringIO(); writer=csv.writer(f)
            writer.writerow(['id','czas źródłowy','x','y','klasa','klasa automatyczna','piksele','klastry','powtórzenia XY','notatka'])
            for r in rows(q):
                note=r['note'] or ''
                if note.startswith(('=','+','-','@')): note="'"+note
                writer.writerow([r['id'],r['timestamp'],r['x'],r['y'],r['class'],r['auto_class'],r.get('active_pixels'),len(r.get('clusters',[])),r['repeats'],note])
            return self.send(('\ufeff'+f.getvalue()).encode(),'text/csv; charset=utf-8',download='credo-pomiary.csv')
        if u.path.startswith('/image/'):
            eid=u.path.split('/')[-1]
            with connect() as c: r=c.execute('SELECT image FROM events WHERE id=?',(eid,)).fetchone()
            if r and r[0]: return self.send((IMAGES/r[0]).read_bytes(),'image/png',download='credo-'+eid+'.png' if 'download' in q else None)
        self.send({'error':'Nie znaleziono'},code=404)
    def do_POST(self):
        if self.path == "/api/video/mp4":
            return convert_mp4(self)

        try:
            # JSON requests only, same origin; no cross-site form changes.
            if self.headers.get('Content-Type','').split(';')[0]!='application/json': raise ValueError('Wymagany JSON')
            origin=self.headers.get('Origin')
            if origin and urlparse(origin).netloc!=self.headers.get('Host'): raise ValueError('Obce źródło żądania')
            size=int(self.headers.get('Content-Length','0'))
            if size>8192: raise ValueError('Żądanie zbyt duże')
            d=json.loads(self.rfile.read(size) or b'{}')

            if self.path=='/api/research-journal':
                return self.send(
                    _journal_append(d),
                    code=201
                )

            if self.path=='/api/refresh':
                threading.Thread(target=refresh,daemon=True).start(); return self.send({'ok':True},code=202)
            if self.path=='/api/class':
                choice=d.get('class') or None
                if choice and choice not in CLASSES: raise ValueError('Nieznana klasa')
                with connect() as c:
                    r=c.execute('SELECT manual FROM events WHERE id=?',(d['id'],)).fetchone()
                    if not r: raise ValueError('Nieznany pomiar')
                    note=str(d.get('note',''))[:2000]
                    c.execute('UPDATE events SET manual=?,note=? WHERE id=?',(choice,note,d['id']))
                    c.execute('INSERT INTO edits VALUES(?,?,?,?,?)',(legacy.now_iso(),d['id'],r[0],choice,note))
                return self.send({'ok':True})
            if self.path=='/api/favorite':
                favorite=1 if bool(d.get('favorite')) else 0
                with connect() as c:
                    r=c.execute(
                        'SELECT id FROM events WHERE id=?',
                        (d['id'],)
                    ).fetchone()
                    if not r:
                        raise ValueError('Nieznany pomiar')
                    c.execute(
                        'UPDATE events SET favorite=? WHERE id=?',
                        (favorite,d['id'])
                    )
                return self.send({
                    'ok':True,
                    'favorite':bool(favorite)
                })
            if self.path=='/api/dimensions':
                if d.get('reset'):
                    dims=None
                else:
                    w=int(d['width']); h=int(d['height'])
                    if not 2<=w<=50000 or not 2<=h<=50000: raise ValueError('Wymiary poza zakresem')
                    with connect() as c:
                        maximum=c.execute('SELECT max(x),max(y) FROM events').fetchone()
                    if (maximum[0] or 0)>=w or (maximum[1] or 0)>=h: raise ValueError('Wymiary nie obejmują zapisanych punktów')
                    dims={'width':w,'height':h,'source':'Ustawione ręcznie przez użytkownika'}
                with connect() as c: setmeta(c,'dimensions',dims)
                return self.send({'ok':True})
            self.send({'error':'Nie znaleziono'},code=404)
        except (ValueError,KeyError,TypeError) as exc: self.send({'error':str(exc)},code=400)

if __name__=='__main__':
    logging.basicConfig(level=logging.INFO)
    init()
    threading.Thread(target=schedule,daemon=True).start()
    port=int(os.environ.get('CREDO_PORT','8091'))
    http=ThreadingHTTPServer((os.environ.get('CREDO_HOST',"127.0.0.1"),port),Handler)
    def end(*_):
        STOP.set(); threading.Thread(target=http.shutdown,daemon=True).start()
    signal.signal(signal.SIGTERM,end); signal.signal(signal.SIGINT,end)
    http.serve_forever()
