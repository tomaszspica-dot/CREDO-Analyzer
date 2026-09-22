'use strict';
const $=id=>document.getElementById(id);
const palette={'SPOT':'#38bdf8','TRACK':'#4ade80','WORM':'#c084fc','WORM / TRACK':'#fb923c','ARTEFAKT':'#f87171','BRAK DANYCH':'#94a3b8'};
const esc=s=>String(s??'—').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const color=c=>palette[c]||'#94a3b8';
const tag=c=>`<span class="tag" style="--c:${color(c)}">${esc(c)}</span>`;
let status={},systemHealth={},events=[],all=[],page=0,selected=null,hitmaps=new Map(),generation=0;
let eventsRevision=null,lastFilterKey=null;
const query=()=>new URLSearchParams({from:$('from').value,to:$('to').value,class:$('filter-class').value});
async function api(path,data){const r=await fetch(path,data===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const j=await r.json();if(!r.ok)throw Error(j.error||r.status);return j}
function show(id){if(!$(id).open)$(id).showModal()}
for(const b of document.querySelectorAll('[data-close]')) b.onclick=()=>$(b.dataset.close).close();
for(const c of Object.keys(palette)) $('filter-class').add(new Option(c,c));
$('manual').add(new Option('Automatyczna (bez korekty)',''));for(const c of Object.keys(palette))$('manual').add(new Option(c,c));
async function load(){
  const current=++generation;

  try{
    const q=query();
    const filterKey=q.toString();

    const hasFilters=
      Array.from(q.values())
        .some(Boolean);

    /*
     * Małe endpointy są odświeżane nadal co 30 s.
     * Pełne archiwum pobieramy tylko wtedy, gdy
     * zmieniła się rewizja tabeli events.
     */
    const [s,h,rev]=
      await Promise.all([
        api('/api/status'),
        api('/api/system-health'),
        api('/api/events-revision')
      ]);

    if(current!==generation){
      return;
    }

    const newRevision=
      Number(rev?.revision??0);

    const dataChanged=
      eventsRevision===null
      ||newRevision!==eventsRevision
      ||all.length===0;

    const filterChanged=
      lastFilterKey===null
      ||filterKey!==lastFilterKey;

    let newAll=all;
    let newEvents=events;

    if(dataChanged){

      newAll=
        await api('/api/events');

      if(current!==generation){
        return;
      }
    }

    /*
     * Przy pustych filtrach events i all reprezentują
     * ten sam zbiór.
     *
     * Przy aktywnym filtrze pobieramy wynik tylko,
     * gdy zmieniły się dane albo sam filtr.
     */
    if(hasFilters){

      if(dataChanged||filterChanged){

        newEvents=
          await api(
            '/api/events?'+q
          );

        if(current!==generation){
          return;
        }
      }

    }else{

      newEvents=newAll;
    }

    status=s;
    systemHealth=h;
    all=newAll;
    events=newEvents;

    eventsRevision=newRevision;
    lastFilterKey=filterKey;

    render();

    /*
     * Jeden wspólny payload system-health dla
     * wszystkich modułów frontendu.
     */
    window.__credoSystemHealth=h;

    window.dispatchEvent(
      new CustomEvent(
        'credo:system-health',
        {
          detail:h
        }
      )
    );

  }catch(e){

    $('health').textContent=
      e.message;

    $('health').className=
      'error';
  }
}
function duration(s){if(s==null)return '—';return `${Math.floor(s/3600)} h ${Math.floor(s%3600/60)} min`}
function render(){const p=status.profile||{};const rate=p.runtime&&p.accepted!=null?(p.accepted/(p.runtime/3600)).toFixed(2):'—';
$('cards').innerHTML=[['Archiwum',status.total],['Widoczne u źródła',p.visible??'—'],['Zaliczone CREDO',p.accepted??'—'],['Czas detektora',duration(p.runtime)],['Zaliczone / h pracy',rate]].map(([k,v])=>`<div class="card"><small>${k}</small><strong>${v}</strong></div>`).join('');
$('health').className=status.error?'error':'muted';$('health').textContent=status.error?`Błąd pobrania: ${status.error}. Pokazuję archiwum.`:status.busy?'Pobieranie danych…':`Ostatnie pobranie: ${p.updated?new Date(p.updated).toLocaleString('pl-PL'):'—'} · następne: ${new Date(status.next_refresh).toLocaleTimeString('pl-PL')}`;
renderSystemHealth();
$('csv').href='/export.csv?'+query();$('count').textContent=`${events.length} po filtrach`;page=Math.min(page,Math.max(0,Math.ceil(events.length/20)-1));renderList();
const counts={};for(const e of events)counts[e.class]=(counts[e.class]||0)+1;
$('legend').innerHTML=Object.entries(palette).map(([c])=>tag(c)+` <small>${counts[c]||0}</small>`).join(' ');
const repeated=events.filter(e=>e.repeats>=3);const fractional=events.filter(e=>/\.\d+/.test(e.timestamp)).length;
$('quality').textContent=`Powtarzające się miejsca (≥3 wpisy w archiwum): ${repeated.length} pomiarów. Czasy z częścią ułamkową: ${fractional}/${events.length}. Kilka klastrów w obrazie: ${events.filter(e=>(e.clusters||[]).length>1).length}.`;
$('coverage').textContent=`${p.coverage||'Kompletność publicznej historii niepotwierdzona'}. Linki stronicowania wykryte w ostatniej stronie: ${(p.pagination_links||[]).length}. Błędy pobrania obrazów: ${p.image_errors??0}. Wcześniejsze zdarzenia niewidoczne na stronie nie są automatycznie odzyskiwane.`;
$('foot').textContent='CREDO Analyzer 2.0 · pobieranie o pełnych godzinach · dane i ręczne oceny zapisane lokalnie na Macu';
const dims=status.dimensions;const scale=dims?`Matryca ${dims.width} × ${dims.height} px · ${dims.source}`:'Zakres archiwum (automatyczny), rzeczywiste wymiary matrycy nieustalone';$('scale').textContent=scale;$('big-scale').textContent=scale;
redraw();}

/* ============================================================
   CREDO_SYSTEM_HEALTH_V1
   ============================================================ */

function renderSystemHealth(){
  const root=$('system-health');
  if(!root)return;

  const h=systemHealth||{};
  const credo=h.credo||{};
  const db=h.database||{};
  const research=h.research||{};
  const noaa=h.noaa||{};
  const cpu=h.cpu||{};
  const disk=h.disk||{};

  const state=s=>
    ['ok','warning','error'].includes(s)
      ?s
      :'unknown';

  const duration=
    research.duration_ms==null
      ?'Brak pomiaru'
      :`${Number(research.duration_ms).toFixed(1)} ms`;

  const cpuText=
    cpu.temp_c==null
      ?'Brak danych'
      :`${Number(cpu.temp_c).toFixed(1)} °C`;

  const diskText=
    disk.free_gb==null
      ?'Brak danych'
      :`${Number(disk.free_gb).toFixed(1)} GB wolne · ${Number(disk.free_pct).toFixed(1)}%`;

  // CREDO_OPERATOR_ALERTS_APP_UI_V1_1B
  //
  // Ten sam payload /api/system-health, który app.js już
  // pobrał dla kafelków. Brak drugiego fetch() i timera.

  const op=
    h.operator_alerts
    &&
    typeof h.operator_alerts==='object'
      ?h.operator_alerts
      :null;

  const opCounts=
    op?.counts
    &&
    typeof op.counts==='object'
      ?op.counts
      :{};

  const opErrors=
    Number(opCounts.error||0);

  const opWarnings=
    Number(opCounts.warning||0);

  const opInfos=
    Number(opCounts.info||0);

  const opActive=
    opErrors+opWarnings;

  const opState=
    op
      ?state(op.overall)
      :'unknown';

  const opPill=
    opState==='error'
      ?'BŁĄD'
      :opState==='warning'
        ?'UWAGA'
        :opState==='ok'
          ?'OK'
          :'INFO';

  const summaryParts=[];

  if(opErrors){
    summaryParts.push(
      `${opErrors} ${opErrors===1?'błąd':'błędy'}`
    );
  }

  if(opWarnings){
    summaryParts.push(
      `${opWarnings} ${opWarnings===1?'uwaga':'uwagi'}`
    );
  }

  if(opInfos){
    summaryParts.push(
      `${opInfos} info`
    );
  }

  const opSummary=
    opActive===0
      ?(
          '0 alertów'
          +(opInfos?` · ${opInfos} info`:'')
       )
      :summaryParts.join(' · ');

  const severityName=value=>
    value==='error'
      ?'BŁĄD'
      :value==='warning'
        ?'UWAGA'
        :'INFO';

  const opItems=
    Array.isArray(op?.items)
      ?op.items
      :[];

  const opRows=
    opItems.map(item=>{

      const severity=
        ['error','warning','info'].includes(
          item?.severity
        )
          ?item.severity
          :'info';

      const meta=[];

      if(
        item?.value!==null
        &&
        item?.value!==undefined
        &&
        item?.value!==''
      ){
        meta.push(
          'wartość: '+esc(item.value)
        );
      }

      if(item?.threshold){
        meta.push(
          'próg: '+esc(item.threshold)
        );
      }

      return `
        <div class="op-alert-item op-${severity}">
          <span class="op-alert-badge op-${severity}">
            ${severityName(severity)}
          </span>

          <div class="op-alert-content">
            <strong>
              ${esc(item?.title||item?.key||'Alert')}
            </strong>

            <small>
              ${esc(item?.detail||'')}
            </small>

            ${
              meta.length
                ?`<div class="op-alert-meta">${meta.join(' · ')}</div>`
                :''
            }
          </div>
        </div>
      `;
    }).join('');

  const opEmptyText=
    op
      ?'Brak alertów wymagających reakcji.'
      :'Brak danych Operator Alerts.';

  const opBody=
    opRows
      ?`<div class="op-alert-list">${opRows}</div>`
      :`<div class="op-alert-empty">${opEmptyText}</div>`;

  const opInfoNote=
    opActive===0
      ?'<div class="op-alert-note">INFO nie podnosi stanu systemu do ostrzeżenia.</div>'
      :'';

  const operatorWasOpen=
    Boolean(
      document
        .getElementById(
          'credo-operator-alerts-v1'
        )
        ?.open
    );

  const tiles=[
    [
      'CREDO',
      state(credo.status),
      credo.detail||'Brak danych'
    ],
    [
      'NOAA',
      state(noaa.status),
      noaa.detail||'Brak danych'
    ],
    [
      'Baza',
      state(db.status),
      db.detail||'Brak danych'
    ],
    [
      'Ostatnia detekcja',
      'unknown',
      db.latest_detection||'Brak'
    ],
    [
      '/api/research',
      state(research.status),
      duration
    ],
    [
      'CPU',
      state(cpu.status),
      cpuText
    ],
    [
      'Dysk',
      state(disk.status),
      diskText
    ]
  ];

  const labels={
    ok:'OK',
    warning:'UWAGA',
    error:'BŁĄD',
    unknown:'INFO'
  };

  root.innerHTML=`
    <header class="sh-head">
      <div>
        <h2>Stan systemu</h2>
        <small>
          Monitoring CREDO Analyzer na Macu
        </small>
      </div>
      <span class="sh-overall sh-${state(h.overall)}">
        ${labels[state(h.overall)]}
      </span>
    </header>

    <div class="sh-grid">
      ${tiles.map(([name,st,detail])=>`
        <div class="sh-tile sh-${st}">
          <div class="sh-title">
            <span class="sh-dot"></span>
            ${esc(name)}
          </div>
          <strong>${labels[st]}</strong>
          <small>${esc(detail)}</small>
        </div>
      `).join('')}
    </div>


      <details
        id="credo-operator-alerts-v1"
        class="op-alerts op-${opState}"
        ${operatorWasOpen?'open':''}
      >
        <summary>
          <div class="op-alert-head-left">
            <strong>Alerty operatora</strong>
            <small>${esc(opSummary)}</small>
          </div>

          <span class="op-alert-pill op-${opState}">
            ${opPill}
          </span>
        </summary>

        <div class="op-alert-body">
          ${opBody}
          ${opInfoNote}

          <div class="op-alert-note">
            Brak detekcji nie jest traktowany jako awaria,
            dopóki nie mamy wiarygodnego uptime / exposure.
          </div>
        </div>
      </details>
  `;
}


function renderList(){const chunk=events.slice(page*20,page*20+20);$('events').innerHTML=chunk.map(e=>`<article class="event">${e.image?`<img src="/image/${e.id}" alt="Detekcja" loading="lazy">`:''}<button data-event="${e.id}"><b>${esc(e.timestamp)}</b><small>X ${esc(e.x)} · Y ${esc(e.y)} · klastry ${(e.clusters||[]).length}${e.repeats>=3?' · powtarzające się XY':''}</small></button>${tag(e.class)}</article>`).join('')||'<p>Brak pomiarów w tym zakresie.</p>';
$('page').textContent=`${page+1} / ${Math.max(1,Math.ceil(events.length/20))}`;$('prev').disabled=page===0;$('next').disabled=(page+1)*20>=events.length;}
$('events').onclick=e=>{const row=e.target.closest('.event');if(row)detail(row.querySelector('button').dataset.event)};
$('prev').onclick=()=>{page--;renderList()};$('next').onclick=()=>{page++;renderList()};
function detail(id){const e=all.find(e=>e.id===id);if(!e)return;selected=e;$('detail-title').textContent=e.timestamp;$('photo').hidden=!e.image;if(e.image)$('photo').src='/image/'+id;else $('photo').removeAttribute('src');
$('details').textContent=`X: ${e.x??'—'} · Y: ${e.y??'—'}\nKlasa: ${e.class} · automatyczna: ${e.auto_class}\nAktywne piksele: ${e.active_pixels??'—'} · maksimum jasności: ${e.peak??'—'}\nTło: ${e.background??'—'} · próg: ${e.threshold??'—'}\nWpisy w tym samym X–Y w archiwum: ${e.repeats}\nŹródło: ${e.source}`;
$('clusters').innerHTML='<table><tr><th>Klaster</th><th>Piksele</th><th>Obwiednia</th><th>Długość px</th><th>Kąt °</th></tr>'+ (e.clusters||[]).map((c,i)=>`<tr><td>${i+1}</td><td>${c.pixels}</td><td>${esc(c.bbox.join('×'))}</td><td>${c.length_px}</td><td>${c.angle_deg??'—'}</td></tr>`).join('')+'</table>';
$('manual').value=e.manual||'';$('note').value=e.note||'';$('png').href='/image/'+id+'?download=1';$('png').hidden=!e.image;$('saved').textContent='';show('detail');}
$('save').onclick=async()=>{try{await api('/api/class',{id:selected.id,class:$('manual').value,note:$('note').value});await load();$('saved').textContent='Zapisano ocenę i historię zmiany.'}catch(e){$('saved').textContent=e.message}};
function canvasSetup(id){const canvas=$(id),r=canvas.getBoundingClientRect();if(!r.width||!r.height)return null;const dpr=devicePixelRatio||1;canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);return {ctx,w:r.width,h:r.height,dpr}}

function drawMap(id){
  const points=all.filter(e=>Number.isFinite(e.x)&&Number.isFinite(e.y));
  const maxX=points.reduce((v,e)=>Math.max(v,e.x),0);
  const maxY=points.reduce((v,e)=>Math.max(v,e.y),0);
  const dims=status.dimensions;
  const rx=dims?dims.width-1:
    Math.max(100,Math.ceil((maxX+1)/100)*100)-1;
  const ry=dims?dims.height-1:
    Math.max(100,Math.ceil((maxY+1)/100)*100)-1;
  const f=equalMapFrame(id,rx,ry);
  if(!f)return;
  const {ctx,left,top,pw,ph,s,H}=f;
  const hits=[];
  ctx.save();
  ctx.beginPath();ctx.rect(left,top,pw,ph);ctx.clip();
  for(const e of events){
    if(!Number.isFinite(e.x)||!Number.isFinite(e.y))continue;
    const x=left+(e.x+.5)*s;
    const y=top+(H-e.y-.5)*s;
    ctx.fillStyle=color(e.class);
    ctx.beginPath();
    ctx.arc(x,y,id==='big-map'?5:3.5,0,Math.PI*2);
    ctx.fill();
    if(e.repeats>=3){ctx.strokeStyle='#fff';ctx.stroke()}
    hits.push({x,y,id:e.id});
  }
  ctx.restore();
  hitmaps.set(id,hits);
}

for(const id of ['map','big-map']){$(id).onclick=e=>{const r=$(id).getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;const hits=(hitmaps.get(id)||[]).filter(p=>Math.hypot(p.x-x,p.y-y)<10);if(hits.length===1)detail(hits[0].id);else if(hits.length){$('choices').innerHTML=hits.map(p=>{const e=all.find(e=>e.id===p.id);return `<button data-id="${p.id}">${esc(e.timestamp)} · ${esc(e.class)} · X ${e.x} Y ${e.y}</button>`}).join('');show('choose')}};new ResizeObserver(()=>drawMap(id)).observe($(id));}
$('choices').onclick=e=>{const b=e.target.closest('button');if(b)detail(b.dataset.id)};
$('enlarge').onclick=()=>{show('big');requestAnimationFrame(()=>drawMap('big-map'))};
function drawChart(){
const c=canvasSetup('chart');if(!c)return;const {ctx,w,h}=c,hourly=$('bucket').value==='hour';const bins=new Map();for(const e of events){const key=e.timestamp.slice(0,hourly?13:10);bins.set(key,(bins.get(key)||0)+1)}let keys=[...bins.keys()].sort();ctx.fillStyle='#b9cede';ctx.font='13px system-ui';if(!keys.length){ctx.fillText('Brak pomiarów w wybranym okresie',20,35);return}
const parse=k=>Date.parse(k+(hourly?':00:00Z':'T00:00:00Z')),first=parse(keys[0]),last=parse(keys.at(-1)),step=hourly?3600000:86400000;keys=[];for(let t=Math.max(first,last-119*step);t<=last;t+=step)keys.push(new Date(t).toISOString().replace('T',' ').slice(0,hourly?13:10));
const maximum=Math.max(1,...keys.map(k=>bins.get(k)||0));const unit=Math.max(1,Math.ceil(maximum/5)),ceiling=Math.ceil(maximum/unit)*unit;
const left=48,right=20,top=32,base=h-58,plotW=w-left-right,plotH=base-top;
ctx.textAlign='right';ctx.lineWidth=1;for(let v=0;v<=ceiling;v+=unit){const y=base-v/ceiling*plotH;ctx.strokeStyle='#294158';ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(w-right,y);ctx.stroke();ctx.fillStyle='#b9cede';ctx.fillText(String(v),left-10,y+4)}
const slot=plotW/keys.length,barW=Math.min(48,slot*.65),labelEvery=Math.max(1,Math.ceil(keys.length/Math.max(1,Math.floor(plotW/110))));const hits=[];
keys.forEach((k,i)=>{const n=bins.get(k)||0,bh=n/ceiling*plotH,x=left+slot*(i+.5);ctx.fillStyle='#42bdf5';ctx.fillRect(x-barW/2,base-bh,barW,bh);ctx.textAlign='center';if(keys.length<=40){ctx.fillStyle='#edf5fb';ctx.fillText(String(n),x,base-bh-8)}if(i%labelEvery===0){ctx.fillStyle='#b9cede';const parts=k.split(' ');ctx.fillText(parts[0].slice(5),x,base+24);if(hourly)ctx.fillText(parts[1]+':00',x,base+42)}hits.push({left:left+i*slot,right:left+(i+1)*slot,label:k+(hourly?':00':'')+' — '+n+' zdarzeń'})});
$('chart').onmousemove=e=>{const r=$('chart').getBoundingClientRect(),x=e.clientX-r.left;const hit=hits.find(t=>x>=t.left&&x<t.right);$('chart').title=hit?hit.label:''};
}

function redraw(){drawMap('map');if($('big').open)drawMap('big-map');drawChart()}
new ResizeObserver(drawChart).observe($('chart'));$('bucket').onchange=drawChart;
for(const id of ['from','to','filter-class'])$(id).onchange=()=>{page=0;load()};$('clear').onclick=()=>{$('from').value='';$('to').value='';$('filter-class').value='';page=0;load()};
$('dimensions').onclick=()=>{$('width').value=status.dimensions?.width||'';$('height').value=status.dimensions?.height||'';$('settings-msg').textContent='';show('settings')};
async function dimensions(reset){try{await api('/api/dimensions',{reset,width:$('width').value,height:$('height').value});await load();$('settings').close()}catch(e){$('settings-msg').textContent=e.message}}
$('save-dims').onclick=()=>dimensions(false);$('reset-dims').onclick=()=>dimensions(true);
$('refresh').onclick=async()=>{try{await api('/api/refresh',{});await load()}catch(e){$('health').textContent=e.message}};
load();setInterval(load,30000);
for(const id of ['detail','choose','settings'])$(id).addEventListener('click',e=>{if(e.target!==$(id))return;const r=$(id).getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$(id).close()});

/* CREDO_AXES_VIDEO_V1 */
function credoAxes(ctx,left,top,width,height,maxX,maxY){
  ctx.save();
  ctx.fillStyle='#b9cede';
  ctx.font='12px system-ui';
  ctx.textAlign='right';
  ctx.fillText('1',left-8,top+height+18);

  const nx=Math.min(maxX,Math.max(2,Math.min(8,Math.floor(width/85))));
  const ny=Math.min(maxY,Math.max(2,Math.min(6,Math.floor(height/60))));

  ctx.textAlign='center';
  for(let i=1;i<=nx;i++){
    ctx.fillText(
      String(1+Math.round(maxX*i/nx)),
      left+width*i/nx,
      top+height+18
    );
  }
  ctx.textAlign='right';
  for(let i=1;i<=ny;i++){
    ctx.fillText(
      String(1+Math.round(maxY*i/ny)),
      left-8,
      top+height*(1-i/ny)+4
    );
  }
  ctx.restore();
}

/* CREDO_EQUAL_SCALE_V1 */
function equalMapFrame(id,rx,ry){
  const c=canvasSetup(id);
  if(!c)return null;
  const {ctx,w,h}=c;
  const W=rx+1,H=ry+1;
  const s=Math.min(Math.max(1,w-90)/W,Math.max(1,h-65)/H);
  const pw=W*s,ph=H*s;
  const left=55+(w-90-pw)/2;
  const top=20+(h-65-ph)/2;

  ctx.fillStyle='#030b12';
  ctx.fillRect(left,top,pw,ph);

  // Wspólny krok dzielący oba wymiary: pełne kwadraty.
  function gcd(a,b){while(b){const n=a%b;a=b;b=n}return a}
  const common=gcd(W,H);
  const target=55/s;
  let step=common,best=Infinity;
  for(let n=1;n<=common;n++){
    if(common%n)continue;
    const score=Math.abs(Math.log(n/target));
    if(score<best){best=score;step=n}
  }

  ctx.strokeStyle='#294158';
  ctx.lineWidth=1;
  ctx.beginPath();
  if(W/step+H/step<=500){
    for(let x=0;x<=W;x+=step){
      ctx.moveTo(left+x*s,top);
      ctx.lineTo(left+x*s,top+ph);
    }
    for(let y=0;y<=H;y+=step){
      ctx.moveTo(left,top+y*s);
      ctx.lineTo(left+pw,top+y*s);
    }
  }
  ctx.rect(left,top,pw,ph);
  ctx.stroke();

  // Etykiety odnoszą się do środków skrajnych pikseli.
  credoAxes(ctx,left+s/2,top+s/2,pw-s,ph-s,rx,ry);
  return {ctx,left,top,pw,ph,s,W,H};
}
