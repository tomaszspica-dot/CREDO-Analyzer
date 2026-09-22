#!/usr/bin/env python3
"""CREDO Analyzer - lightweight public-profile dashboard."""

from __future__ import annotations

import base64
import hashlib
import html
import io
import json
import logging
import os
import re
import signal
import ssl
import threading
import time
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from datetime import datetime, timezone
from html.parser import HTMLParser
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

try:
    from PIL import Image, ImageStat
except Exception:  # pragma: no cover - the UI still works without Pillow
    Image = None
    ImageStat = None


APP_VERSION = "1.0.0"
CONFIG_PATH = Path(os.environ.get("CREDO_ANALYZER_CONFIG", "/etc/credo-analyzer.conf"))


def load_config(path: Path = CONFIG_PATH) -> dict[str, Any]:
    cfg: dict[str, Any] = {
        "USERNAME": "KoszalinCredo",
        "PROFILE_URL": "https://api.credo.science/web/user/KoszalinCredo/",
        "HOST": "0.0.0.0",
        "PORT": 8091,
        "REFRESH_SECONDS": 300,
        "CACHE_DIR": os.environ.get(
            "CREDO_DATA_DIR",
            str(
                Path(__file__)
                .resolve()
                .parent
                .parent
                / "data"
            )
        ),
        "HTTP_TIMEOUT": 25,
    }
    if path.exists():
        for raw in path.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            value = value.strip().strip('"').strip("'")
            if key.strip() in cfg:
                cfg[key.strip()] = value
    for key in ("PORT", "REFRESH_SECONDS", "HTTP_TIMEOUT"):
        cfg[key] = int(cfg[key])
    return cfg


CFG = load_config()
CACHE_DIR = Path(str(CFG["CACHE_DIR"]))
IMAGE_DIR = CACHE_DIR / "images"
CACHE_FILE = CACHE_DIR / "status.json"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


@dataclass
class TableRow:
    cells: list[str] = field(default_factory=list)
    attrs_text: str = ""
    image_src: str | None = None


class PublicProfileParser(HTMLParser):
    """Tolerant parser for the public CREDO profile table."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.all_text: list[str] = []
        self.rows: list[TableRow] = []
        self._row: TableRow | None = None
        self._cell: list[str] | None = None

    @staticmethod
    def _attrs_text(attrs: list[tuple[str, str | None]]) -> str:
        return " ".join(f"{k}={v or ''}" for k, v in attrs)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_dict = dict(attrs)
        if tag.lower() == "tr":
            self._row = TableRow(attrs_text=self._attrs_text(attrs))
        elif tag.lower() in ("td", "th") and self._row is not None:
            self._cell = []
        elif tag.lower() == "img" and self._row is not None:
            src = attrs_dict.get("src") or attrs_dict.get("data-src")
            if src:
                self._row.image_src = src
            self._row.attrs_text += " " + self._attrs_text(attrs)

    def handle_data(self, data: str) -> None:
        self.all_text.append(data)
        if self._cell is not None:
            self._cell.append(data)
        if self._row is not None:
            self._row.attrs_text += " " + data

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() in ("td", "th") and self._row is not None and self._cell is not None:
            self._row.cells.append(clean_text("".join(self._cell)))
            self._cell = None
        elif tag.lower() == "tr" and self._row is not None:
            self.rows.append(self._row)
            self._row = None
            self._cell = None


DATE_RE = re.compile(r"\b(20\d{2}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?)\b")


def extract_xy(text: str) -> tuple[int | None, int | None]:
    patterns = (
        r"\bx\s*[:=]\s*[\"']?(\d{1,5}).{0,50}?\by\s*[:=]\s*[\"']?(\d{1,5})",
        r"\bdata-x\s*=\s*[\"']?(\d{1,5}).{0,80}?\bdata-y\s*=\s*[\"']?(\d{1,5})",
        r"\bx\D{0,4}(\d{1,5})\D{1,20}y\D{0,4}(\d{1,5})",
    )
    for pattern in patterns:
        m = re.search(pattern, text, flags=re.I | re.S)
        if m:
            return int(m.group(1)), int(m.group(2))
    # Some CREDO versions pass x and y as the final two JS callback arguments.
    onclick = re.search(r"onclick\s*=\s*[^\n>]*?\(([^)]*)\)", text, re.I)
    if onclick:
        nums = [int(x) for x in re.findall(r"(?<![\w.])(\d{1,5})(?![\w.])", onclick.group(1))]
        if len(nums) >= 2:
            return nums[-2], nums[-1]
    return None, None


def fetch_bytes(url: str, timeout: int) -> tuple[bytes, str]:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": f"CREDO-Analyzer/{APP_VERSION} (public-profile-reader)",
            "Accept": "text/html,application/xhtml+xml,image/png,image/*;q=0.8,*/*;q=0.5",
        },
    )
    context = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=timeout, context=context) as response:
        content_type = response.headers.get_content_type()
        return response.read(8 * 1024 * 1024), content_type


def image_bytes(src: str, page_url: str, timeout: int) -> bytes | None:
    try:
        if src.startswith("data:image/"):
            _, encoded = src.split(",", 1)
            return base64.b64decode(encoded, validate=False)
        url = urllib.parse.urljoin(page_url, src)
        data, content_type = fetch_bytes(url, timeout)
        if content_type.startswith("image/") or data.startswith(b"\x89PNG"):
            return data
    except Exception:
        logging.exception("Nie udało się pobrać miniatury")
    return None


def analyse_image(data: bytes | None) -> dict[str, Any]:
    result: dict[str, Any] = {
        "class": "BRAK DANYCH",
        "confidence": "niska",
        "active_pixels": None,
        "bbox": None,
        "elongation": None,
    }
    if not data or Image is None:
        return result
    try:
        image = Image.open(io.BytesIO(data)).convert("L")
        width, height = image.size
        values = list(image.getdata())
        if not values:
            return result
        ordered = sorted(values)
        background = ordered[len(ordered) // 2]
        deviations = sorted(abs(v - background) for v in values)
        mad = deviations[len(deviations) // 2]
        threshold = min(245, max(background + 12, background + 8 * max(1, mad)))
        points = [(i % width, i // width, v) for i, v in enumerate(values) if v >= threshold]
        if not points:
            return result
        xs = [p[0] for p in points]
        ys = [p[1] for p in points]
        bw, bh = max(xs) - min(xs) + 1, max(ys) - min(ys) + 1
        active = len(points)
        area = bw * bh
        result.update(active_pixels=active, bbox=[bw, bh])
        if active > max(300, int(width * height * 0.08)):
            result.update({"class": "ARTEFAKT", "confidence": "wysoka"})
            return result
        mean_x = sum(xs) / active
        mean_y = sum(ys) / active
        cxx = sum((x - mean_x) ** 2 for x in xs) / active
        cyy = sum((y - mean_y) ** 2 for y in ys) / active
        cxy = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys)) / active
        disc = max(0.0, ((cxx - cyy) / 2) ** 2 + cxy**2) ** 0.5
        l1 = max(0.0, (cxx + cyy) / 2 + disc)
        l2 = max(0.01, (cxx + cyy) / 2 - disc)
        elongation = (l1 / l2) ** 0.5 if l1 else 1.0
        result["elongation"] = round(elongation, 2)
        fill = active / max(1, area)
        major = max(bw, bh)
        if major <= 4 and active <= 12:
            result.update({"class": "SPOT", "confidence": "wysoka"})
        elif major >= 5 and elongation >= 2.1 and fill >= 0.18:
            result.update({"class": "TRACK", "confidence": "średnia"})
        elif major >= 6 and active >= 6:
            result.update({"class": "WORM / TRACK", "confidence": "niska"})
        else:
            result.update({"class": "SPOT", "confidence": "średnia"})
    except Exception:
        logging.exception("Analiza obrazu nie powiodła się")
    return result


def parse_duration_seconds(page_text: str) -> int | None:
    m = re.search(
        r"Time looking for particles\s*:\s*(?:(\d+)\s*d)?\s*(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?",
        page_text,
        flags=re.I,
    )
    if not m:
        return None
    days, hours, minutes = (int(x or 0) for x in m.groups())
    return days * 86400 + hours * 3600 + minutes * 60


def duration_pl(seconds: int | None) -> str:
    if seconds is None:
        return "—"
    days, rem = divmod(seconds, 86400)
    hours, rem = divmod(rem, 3600)
    minutes = rem // 60
    parts = []
    if days:
        parts.append(f"{days} d")
    if hours or days:
        parts.append(f"{hours} h")
    parts.append(f"{minutes} min")
    return " ".join(parts)


def parse_profile(page: bytes, profile_url: str, cache_dir: Path) -> dict[str, Any]:
    text = page.decode("utf-8", errors="replace")
    parser = PublicProfileParser()
    parser.feed(text)
    page_text = clean_text(" ".join(parser.all_text))
    count_match = re.search(r"Number of detections\s*:\s*(\d+)", page_text, re.I)
    accepted = int(count_match.group(1)) if count_match else None
    duration_seconds = parse_duration_seconds(page_text)
    detections: list[dict[str, Any]] = []
    seen: set[str] = set()
    image_dir = cache_dir / "images"
    image_dir.mkdir(parents=True, exist_ok=True)
    for index, row in enumerate(parser.rows):
        row_text = " ".join(row.cells) + " " + row.attrs_text
        date_match = DATE_RE.search(row_text)
        if not date_match:
            continue
        timestamp = date_match.group(1).replace("T", " ")
        x, y = extract_xy(row_text)
        raw_image = image_bytes(row.image_src, profile_url, int(CFG["HTTP_TIMEOUT"])) if row.image_src else None
        digest_input = f"{timestamp}|{x}|{y}|{index}".encode() + (raw_image or b"")
        detection_id = hashlib.sha256(digest_input).hexdigest()[:20]
        if detection_id in seen:
            continue
        seen.add(detection_id)
        image_name = None
        if raw_image and raw_image.startswith(b"\x89PNG"):
            image_name = f"{detection_id}.png"
            (image_dir / image_name).write_bytes(raw_image)
        metrics = analyse_image(raw_image)
        detections.append(
            {
                "id": detection_id,
                "timestamp": timestamp,
                "x": x,
                "y": y,
                "image": image_name,
                **metrics,
            }
        )
    detections.sort(key=lambda item: item["timestamp"], reverse=True)
    rate = None
    if accepted is not None and duration_seconds and duration_seconds > 0:
        rate = round(accepted / (duration_seconds / 3600), 2)
    return {
        "ok": True,
        "source": "public-profile",
        "username": str(CFG["USERNAME"]),
        "profile_url": profile_url,
        "accepted_detections": accepted,
        "detector_seconds": duration_seconds,
        "detector_time": duration_pl(duration_seconds),
        "rate_per_hour": rate,
        "visible_detections": len(detections),
        "detections": detections,
        "last_detection": detections[0]["timestamp"] if detections else None,
        "updated_at": now_iso(),
        "error": None,
        "version": APP_VERSION,
    }


STATE_LOCK = threading.Lock()
STATE: dict[str, Any] = {
    "ok": False,
    "source": "public-profile",
    "username": str(CFG["USERNAME"]),
    "profile_url": str(CFG["PROFILE_URL"]),
    "accepted_detections": None,
    "detector_seconds": None,
    "detector_time": "—",
    "rate_per_hour": None,
    "visible_detections": 0,
    "detections": [],
    "last_detection": None,
    "updated_at": None,
    "error": "Oczekiwanie na pierwsze pobranie danych",
    "version": APP_VERSION,
}


def save_state(data: dict[str, Any]) -> None:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    temp = CACHE_FILE.with_suffix(".tmp")
    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    temp.replace(CACHE_FILE)


def refresh() -> None:
    global STATE
    try:
        page, _ = fetch_bytes(str(CFG["PROFILE_URL"]), int(CFG["HTTP_TIMEOUT"]))
        new_state = parse_profile(page, str(CFG["PROFILE_URL"]), CACHE_DIR)
        with STATE_LOCK:
            STATE = new_state
        save_state(new_state)
        logging.info("Odświeżono CREDO: %s widocznych wpisów", new_state["visible_detections"])
    except Exception as exc:
        logging.exception("Odświeżenie CREDO nie powiodło się")
        with STATE_LOCK:
            fallback = dict(STATE)
            fallback["ok"] = False
            fallback["error"] = f"{type(exc).__name__}: {exc}"
            fallback["last_attempt_at"] = now_iso()
            STATE = fallback
        save_state(fallback)


def refresher(stop: threading.Event) -> None:
    while not stop.is_set():
        refresh()
        stop.wait(max(60, int(CFG["REFRESH_SECONDS"])))


HTML_PAGE = r'''<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CREDO Analyzer</title>
<style>
:root{--bg:#08121f;--panel:#101e2e;--panel2:#14263a;--line:#243b51;--text:#edf5fb;--muted:#94a9ba;--blue:#38a9ff;--green:#39d98a;--yellow:#ffc857;--red:#ff6174}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 75% -10%,#173552 0,transparent 35%),var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.wrap{max-width:1500px;margin:auto;padding:22px}.top{display:flex;align-items:center;gap:15px;margin-bottom:18px}.logo{width:48px;height:48px;border-radius:14px;background:linear-gradient(145deg,#28a8ff,#5c62ff);display:grid;place-items:center;font-size:26px;box-shadow:0 8px 30px #006eff40}.top h1{font-size:24px;margin:0}.sub{color:var(--muted);font-size:13px;margin-top:3px}.top .actions{margin-left:auto;display:flex;gap:10px}.button{border:1px solid var(--line);background:var(--panel2);color:var(--text);border-radius:10px;padding:10px 14px;cursor:pointer;text-decoration:none;font-weight:650}.button:hover{border-color:var(--blue)}.cards{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:16px}.card,.section{background:linear-gradient(155deg,#122439dd,#0e1b2add);border:1px solid var(--line);border-radius:14px;box-shadow:0 12px 35px #0003}.card{padding:16px}.label{color:var(--muted);font-size:11px;font-weight:750;letter-spacing:.08em;text-transform:uppercase}.value{font-size:28px;font-weight:780;margin-top:7px}.value.small{font-size:18px}.status{display:inline-flex;align-items:center;gap:7px}.dot{width:9px;height:9px;border-radius:50%;background:var(--red);box-shadow:0 0 12px currentColor}.ok .dot{background:var(--green)}.grid{display:grid;grid-template-columns:minmax(400px,1.15fr) minmax(460px,1.85fr);gap:16px}.section{padding:17px;min-width:0}.section h2{font-size:16px;margin:0 0 14px}.sensor{position:relative;width:100%;aspect-ratio:16/9;background:#03070c;border:1px solid var(--line);border-radius:10px;overflow:hidden}.sensor::before{content:"";position:absolute;inset:0;background-image:linear-gradient(#21364c44 1px,transparent 1px),linear-gradient(90deg,#21364c44 1px,transparent 1px);background-size:10% 10%}.sensor-point{position:absolute;width:9px;height:9px;border:2px solid #fff;border-radius:50%;background:var(--blue);box-shadow:0 0 10px var(--blue);transform:translate(-50%,-50%)}.axis{display:flex;justify-content:space-between;color:var(--muted);font-size:11px;margin-top:7px}.legend{display:flex;gap:12px;flex-wrap:wrap;margin-top:13px}.pill{border:1px solid var(--line);border-radius:999px;padding:6px 9px;font-size:12px;color:var(--muted)}.list{display:grid;gap:9px;max-height:540px;overflow:auto;padding-right:4px}.event{display:grid;grid-template-columns:70px minmax(180px,1fr) 90px 100px;gap:12px;align-items:center;background:#0a1623;border:1px solid #1e3449;border-radius:11px;padding:9px}.thumb{width:64px;height:64px;border-radius:7px;object-fit:cover;background:#000;image-rendering:pixelated;border:1px solid #24394d}.empty-thumb{display:grid;place-items:center;color:#607487;font-size:10px}.event .date{font-weight:700;font-size:13px}.event .meta{font-size:12px;color:var(--muted);margin-top:5px}.tag{justify-self:start;border-radius:7px;padding:5px 7px;font-size:11px;font-weight:800;background:#1b334a;color:#9bd4ff}.tag.track{background:#144c3b;color:#78f4b9}.tag.art{background:#49252c;color:#ffadb7}.warning{margin-top:13px;color:#f2cc7a;background:#3c301870;border:1px solid #725c2f;border-radius:10px;padding:10px;font-size:12px;line-height:1.45}.footer{color:var(--muted);text-align:center;font-size:11px;padding:18px}.error{color:#ffabb4}.spinner{animation:pulse 1s infinite}@keyframes pulse{50%{opacity:.45}}
@media(max-width:1100px){.cards{grid-template-columns:repeat(3,1fr)}.grid{grid-template-columns:1fr}}@media(max-width:650px){.wrap{padding:12px}.cards{grid-template-columns:repeat(2,1fr)}.top{align-items:flex-start}.top .actions{display:none}.event{grid-template-columns:60px 1fr 80px}.event .xy{display:none}}
</style></head><body>
<main class="wrap"><header class="top"><div class="logo">☄</div><div><h1>CREDO Analyzer</h1><div class="sub">CREDO Analyzer · lokalny panel pomiarów</div></div><div class="actions"><button class="button" id="refresh">Odśwież CREDO</button></div></header>
<section class="cards">
 <div class="card"><div class="label">Połączenie</div><div class="value small status" id="connection"><span class="dot"></span><span>SPRAWDZAM</span></div></div>
 <div class="card"><div class="label">Zaliczone przez CREDO</div><div class="value" id="accepted">—</div></div>
 <div class="card"><div class="label">Widoczne wpisy</div><div class="value" id="visible">—</div></div>
 <div class="card"><div class="label">Czas detektora</div><div class="value small" id="runtime">—</div></div>
 <div class="card"><div class="label">Detekcje / godzinę</div><div class="value" id="rate">—</div></div>
</section>
<section class="grid">
 <div class="section"><h2>Mapa trafień na matrycy</h2><div class="sensor" id="sensor"></div><div class="axis"><span>x = 0</span><span id="axis-info">współrzędne z profilu CREDO</span><span>x = max</span></div><div class="legend" id="legend"></div><div class="warning">Klasyfikacja SPOT / TRACK / WORM jest automatyczna i orientacyjna. Kształt śladu nie potwierdza samodzielnie rodzaju cząstki.</div></div>
 <div class="section"><h2>Ostatnie zdarzenia</h2><div class="list" id="events"><div class="sub">Pobieram dane…</div></div></div>
</section>
<div class="footer" id="footer">CREDO Analyzer</div></main>
<script>
const $=id=>document.getElementById(id);const esc=s=>String(s??'—').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function tagClass(c){c=c||'';if(c.includes('TRACK')||c.includes('WORM'))return'track';if(c.includes('ARTEFAKT'))return'art';return''}
function render(d){$('connection').className='value small status '+(d.ok?'ok':'');$('connection').innerHTML='<span class="dot"></span><span>'+(d.ok?'ONLINE':'BŁĄD')+'</span>';$('accepted').textContent=d.accepted_detections??'—';$('visible').textContent=d.visible_detections??0;$('runtime').textContent=d.detector_time||'—';$('rate').textContent=d.rate_per_hour??'—';
 const pts=(d.detections||[]).filter(x=>Number.isFinite(x.x)&&Number.isFinite(x.y));const maxX=Math.max(1,...pts.map(x=>x.x)),maxY=Math.max(1,...pts.map(x=>x.y));$('sensor').innerHTML=pts.map((x,i)=>`<span class="sensor-point" style="left:${x.x/maxX*96+2}%;top:${x.y/maxY*92+4}%" title="${esc(x.timestamp)} · x=${x.x}, y=${x.y}"></span>`).join('')||'<div class="sub" style="padding:18px">Współrzędne pojawią się, gdy publiczna strona udostępni je w kodzie wpisów.</div>';$('axis-info').textContent=pts.length?`${pts.length} punktów · zakres y 0–${maxY}`:'brak współrzędnych';
 const counts={};(d.detections||[]).forEach(x=>counts[x.class]=(counts[x.class]||0)+1);$('legend').innerHTML=Object.entries(counts).map(([k,v])=>`<span class="pill">${esc(k)}: <b>${v}</b></span>`).join('')||'<span class="pill">Brak obrazów do klasyfikacji</span>';
 $('events').innerHTML=(d.detections||[]).map(x=>`<article class="event">${x.image?`<img class="thumb" src="/image/${esc(x.id)}" alt="Detekcja">`:'<div class="thumb empty-thumb">BRAK PNG</div>'}<div><div class="date">${esc(x.timestamp)}</div><div class="meta">piksele aktywne: ${esc(x.active_pixels)} · bbox: ${x.bbox?esc(x.bbox.join('×')):'—'}</div></div><span class="tag ${tagClass(x.class)}">${esc(x.class)}</span><div class="meta xy">x: ${esc(x.x)} · y: ${esc(x.y)}</div></article>`).join('')||'<div class="sub">Publiczny profil nie zwrócił jeszcze wpisów.</div>';
 $('footer').innerHTML=`Źródło: publiczny profil CREDO · ostatnie pobranie: ${esc(d.updated_at)} · wersja ${esc(d.version)}${d.error?' · <span class="error">'+esc(d.error)+'</span>':''}`;}
async function load(){try{const r=await fetch('/api/status',{cache:'no-store'});render(await r.json())}catch(e){$('connection').innerHTML='<span class="dot"></span><span>BŁĄD PANELU</span>'}}
$('refresh').onclick=async()=>{$('refresh').classList.add('spinner');await fetch('/api/refresh',{method:'POST'});await load();$('refresh').classList.remove('spinner')};load();setInterval(load,30000);
</script></body></html>'''


class Handler(BaseHTTPRequestHandler):
    server_version = f"CREDOAnalyzer/{APP_VERSION}"

    def log_message(self, fmt: str, *args: Any) -> None:
        logging.info("%s - %s", self.address_string(), fmt % args)

    def send_payload(self, body: bytes, content_type: str, status: int = 200) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Content-Security-Policy", "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src 'self' data:")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802
        path = urllib.parse.urlparse(self.path).path
        if path == "/":
            self.send_payload(HTML_PAGE.encode(), "text/html; charset=utf-8")
        elif path == "/api/status":
            with STATE_LOCK:
                body = json.dumps(STATE, ensure_ascii=False).encode()
            self.send_payload(body, "application/json; charset=utf-8")
        elif path.startswith("/image/"):
            detection_id = path.removeprefix("/image/")
            if not re.fullmatch(r"[0-9a-f]{20}", detection_id):
                self.send_error(HTTPStatus.NOT_FOUND)
                return
            target = IMAGE_DIR / f"{detection_id}.png"
            if target.is_file():
                self.send_payload(target.read_bytes(), "image/png")
            else:
                self.send_error(HTTPStatus.NOT_FOUND)
        elif path == "/healthz":
            self.send_payload(b"ok\n", "text/plain; charset=utf-8")
        else:
            self.send_error(HTTPStatus.NOT_FOUND)

    def do_POST(self) -> None:  # noqa: N802
        path = urllib.parse.urlparse(self.path).path
        if path == "/api/refresh":
            refresh()
            with STATE_LOCK:
                body = json.dumps(STATE, ensure_ascii=False).encode()
            self.send_payload(body, "application/json; charset=utf-8")
        else:
            self.send_error(HTTPStatus.NOT_FOUND)


def main() -> None:
    global STATE
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    if CACHE_FILE.exists():
        try:
            STATE = json.loads(CACHE_FILE.read_text(encoding="utf-8"))
        except Exception:
            logging.warning("Nie udało się odczytać cache", exc_info=True)
    stop = threading.Event()
    thread = threading.Thread(target=refresher, args=(stop,), name="credo-refresh", daemon=True)
    thread.start()
    server = ThreadingHTTPServer((str(CFG["HOST"]), int(CFG["PORT"])), Handler)

    def shutdown(_signum: int, _frame: Any) -> None:
        stop.set()
        threading.Thread(target=server.shutdown, daemon=True).start()

    signal.signal(signal.SIGTERM, shutdown)
    signal.signal(signal.SIGINT, shutdown)
    logging.info("CREDO Analyzer %s słucha na %s:%s", APP_VERSION, CFG["HOST"], CFG["PORT"])
    try:
        server.serve_forever(poll_interval=0.5)
    finally:
        stop.set()
        server.server_close()


if __name__ == "__main__":
    main()
