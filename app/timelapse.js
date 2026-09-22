'use strict';
// Local playback only: does not request data from CREDO.
const tlButton=document.createElement('button');tlButton.textContent='Timelapse';tlButton.id='timelapse-open';$('enlarge').before(tlButton);
const tlDialog=document.createElement('dialog');tlDialog.id='timelapse';
tlDialog.innerHTML=`<header><h2>Timelapse detekcji</h2><button id="tl-close">Zamknij ✕</button></header>
<div class="tl-controls"><label>Od <input id="tl-from" type="datetime-local" step="0.001"></label><label>Do <input id="tl-to" type="datetime-local" step="0.001"></label><label>Czas filmu <select id="tl-duration"><option value="15">15 sekund</option><option value="30" selected>30 sekund</option><option value="60">1 minuta</option><option value="120">2 minuty</option></select></label><button id="tl-start">Odtwórz od początku</button><button id="tl-pause" disabled>Pauza</button></div>
<p id="tl-message" role="status">Wybierz okres.</p><div class="tl-map"><canvas id="tl-canvas" aria-label="Chronologiczne pojawianie się detekcji"></canvas></div>
<input id="tl-seek" type="range" min="0" max="1000" value="0" aria-label="Pozycja odtwarzania" disabled>
<p class="muted">Czasy jak w źródle CREDO. Uwzględnia wybraną klasę i zakres czasu. Fala jest efektem wizualnym, nie rozmiarem oddziaływania cząstki. Kliknij widoczny punkt, aby zobaczyć pomiar.</p>`;
document.body.appendChild(tlDialog);
let tl={items:[],start:0,end:0,duration:30000,elapsed:0,running:false,last:0,raf:0,hits:[],rx:1,ry:1};
// Use a neutral timeline for source timestamps; no timezone conversion.
function tlTime(s){const v=String(s).trim().replace(' ','T');if(!/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d{1,6})?)?$/.test(v))return NaN;return Date.parse(v+'Z')}
function tlStamp(t){return new Date(t).toISOString().replace('T',' ').replace('Z','')}
function tlStop(){tl.running=false;cancelAnimationFrame(tl.raf);$('tl-pause').textContent='Wznów'}

function tlRender(){
  const f=equalMapFrame('tl-canvas',tl.rx,tl.ry);
  if(!f)return;
  const {ctx,left,top,pw,ph,s,H}=f;
  const current=tl.start+(tl.end-tl.start)*Math.min(1,tl.elapsed/tl.duration);
  tl.hits=[];
  ctx.save();
  ctx.beginPath();ctx.rect(left,top,pw,ph);ctx.clip();
  for(const item of tl.items){
    if(item.t>current)break;
    const e=item.event;
    const x=left+(e.x+.5)*s;
    const y=top+(H-e.y-.5)*s;
    ctx.fillStyle=color(e.class);
    ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();
    tl.hits.push({x,y,id:e.id});
    const arrival=(item.t-tl.start)/Math.max(1,tl.end-tl.start)*tl.duration;
    const age=tl.elapsed-arrival;
    if(age>=0&&age<1800){
      for(let ring=0;ring<2;ring++){
        const phase=(age-ring*230)/1570;
        if(phase<0||phase>1)continue;
        ctx.globalAlpha=.5*(1-phase);
        ctx.strokeStyle=color(e.class);
        ctx.lineWidth=1.5;
        ctx.beginPath();
        ctx.arc(x,y,5+phase*32,0,Math.PI*2);
        ctx.stroke();
      }
      ctx.globalAlpha=1;
    }
  }
  ctx.restore();
  $('tl-seek').value=Math.min(1000,tl.elapsed/tl.duration*1000);
  if(tl.items.length){
    $('tl-message').textContent=
      `${tlStamp(current)} · ${tl.hits.length} / ${tl.items.length} detekcji`+
      (tl.elapsed>=tl.duration?' · koniec':'');
  }
}

function tlFrame(now){if(!tl.running)return;tl.elapsed=Math.min(tl.duration,tl.elapsed+(now-tl.last));tl.last=now;tlRender();if(tl.elapsed>=tl.duration){tlStop();return}tl.raf=requestAnimationFrame(tlFrame)}
function tlPlay(){tl.running=true;tl.last=performance.now();$('tl-pause').disabled=false;$('tl-pause').textContent='Pauza';tl.raf=requestAnimationFrame(tlFrame)}
$('timelapse-open').onclick=()=>{tlStop();tl.items=[];tl.elapsed=0;$('tl-seek').disabled=true;$('tl-pause').disabled=true;const sorted=[...events].filter(e=>Number.isFinite(tlTime(e.timestamp))).sort((a,b)=>tlTime(a.timestamp)-tlTime(b.timestamp));if(sorted.length){$('tl-from').value=sorted[0].timestamp.replace(' ','T');$('tl-to').value=sorted.at(-1).timestamp.replace(' ','T')}$('tl-message').textContent='Wybierz okres i naciśnij Odtwórz od początku.';/* CREDO_TIMELAPSE_INITIAL_SIZE_V1 */
{
  const dims = status.dimensions || {};
  const width = Number(dims.width);
  const height = Number(dims.height);
  let maxX = 0, maxY = 0;
  for (const event of all) {
    if (Number.isFinite(event.x)) maxX = Math.max(maxX, event.x);
    if (Number.isFinite(event.y)) maxY = Math.max(maxY, event.y);
  }
  tl.rx = Number.isFinite(width) && width > 1
    ? width - 1 : Math.max(100, Math.ceil((maxX + 1) / 100) * 100);
  tl.ry = Number.isFinite(height) && height > 1
    ? height - 1 : Math.max(100, Math.ceil((maxY + 1) / 100) * 100);
}
tlDialog.showModal();requestAnimationFrame(tlRender)};
$('tl-start').onclick=()=>{tlStop();const start=tlTime($('tl-from').value),end=tlTime($('tl-to').value);if(!Number.isFinite(start)||!Number.isFinite(end)||end<start){$('tl-message').textContent='Wybierz poprawny początek i koniec okresu.';return}const cls=$('filter-class').value;const chosen=all.filter(e=>(!cls||e.class===cls)&&Number.isFinite(e.x)&&Number.isFinite(e.y)).map(e=>({event:{...e},t:tlTime(e.timestamp)})).filter(e=>e.t>=start&&e.t<=end).sort((a,b)=>a.t-b.t);if(!chosen.length){$('tl-message').textContent='Brak detekcji ze współrzędnymi w wybranym okresie.';return}
const maxX=chosen.reduce((v,e)=>Math.max(v,e.event.x),0),maxY=chosen.reduce((v,e)=>Math.max(v,e.event.y),0);tl={...tl,items:chosen,start,end,duration:Number($('tl-duration').value)*1000,elapsed:0,rx:status.dimensions?status.dimensions.width-1:Math.max(100,Math.ceil((maxX+1)/100)*100),ry:status.dimensions?status.dimensions.height-1:Math.max(100,Math.ceil((maxY+1)/100)*100)};$('tl-seek').disabled=false;tlRender();tlPlay()};
$('tl-pause').onclick=()=>{if(tl.running)tlStop();else{if(tl.elapsed>=tl.duration)tl.elapsed=0;tlPlay()}};
$('tl-seek').oninput=()=>{tlStop();tl.elapsed=Number($('tl-seek').value)/1000*tl.duration;tlRender()};
$('tl-close').onclick=()=>tlDialog.close();tlDialog.addEventListener('close',tlStop);
$('tl-canvas').onclick=e=>{const r=$('tl-canvas').getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;const hits=tl.hits.filter(p=>Math.hypot(p.x-x,p.y-y)<10);if(!hits.length)return;tlStop();if(hits.length===1)detail(hits[0].id);else{$('choices').innerHTML=hits.map(p=>{const d=tl.items.find(i=>i.event.id===p.id).event;return `<button data-id="${p.id}">${esc(d.timestamp)} · ${esc(d.class)}</button>`}).join('');show('choose')}};
new ResizeObserver(()=>{if(tlDialog.open)tlRender()}).observe($('tl-canvas'));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&tl.running)tlStop()});

/* CREDO_AXES_VIDEO_V1 */
const videoButton=document.createElement('button');
videoButton.textContent='Zapisz film';
const videoDownload=document.createElement('a');
videoDownload.textContent='Pobierz film';
videoDownload.hidden=true;
const videoInfo=document.createElement('p');
videoInfo.className='muted';
videoInfo.setAttribute('role','status');
document.querySelector('.tl-controls').append(videoButton,videoDownload);
$('tl-message').after(videoInfo);

let recording=null,videoURL=null;
const recordingCanvas=document.createElement('canvas');
recordingCanvas.width=1920;
recordingCanvas.height=1080;
const recordingContext=recordingCanvas.getContext('2d');

function paintVideo(){
  const source=$('tl-canvas');
  const ctx=recordingContext;
  ctx.fillStyle='#08121f';
  ctx.fillRect(0,0,1920,1080);
  if(source.width&&source.height){
    const scale=Math.min(1840/source.width,920/source.height);
    const width=source.width*scale,height=source.height*scale;
    ctx.drawImage(source,(1920-width)/2,75+(920-height)/2,width,height);
  }
  ctx.fillStyle='#edf5fb';
  ctx.font='26px sans-serif';
  ctx.fillText('CREDO · KoszalinCredo',40,42);
  const current=tl.start+(tl.end-tl.start)*Math.min(1,tl.elapsed/tl.duration);
  ctx.font='22px sans-serif';
  ctx.fillText(tlStamp(current)+' · '+tl.hits.length+' / '+tl.items.length,40,1040);
}

function videoControls(locked){
  document.querySelectorAll('.tl-controls input,.tl-controls select,.tl-controls button')
    .forEach(e=>e.disabled=locked);
  $('tl-seek').disabled=locked||!tl.items.length;
  $('tl-pause').disabled=locked||!tl.items.length;
}

function finishVideo(cancelled){
  const job=recording;
  if(!job)return;
  job.cancelled=job.cancelled||cancelled;
  if(job.recorder.state!=='inactive')job.recorder.stop();
}

/* CREDO_FINAL_FRAME_V10_2 */
const previousTlRender=tlRender;
let finalVideoFramePending=false;

function requestCapturedVideoFrame(job){
  try{
    const track=job?.stream?.getVideoTracks?.()[0];
    if(track && typeof track.requestFrame==='function'){
      track.requestFrame();
    }
  }catch(_){}
}

tlRender=function(){
  previousTlRender();

  if(!recording)return;

  paintVideo();
  requestCapturedVideoFrame(recording);

  if(
    tl.elapsed>=tl.duration &&
    !finalVideoFramePending
  ){
    finalVideoFramePending=true;

    const finalJob=recording;

    /*
      Wymuszamy DOKŁADNIE koniec osi czasu,
      żeby tlRender() policzył ostatnią detekcję
      leżącą dokładnie na wartości "Do".
    */
    tl.elapsed=tl.duration;

    /*
      Najpierw odświeżamy matrycę:
      powinno być teraz 49 / 49.
    */
    previousTlRender();

    /*
      Następnie składamy finalną klatkę MP4
      z aktualnym zdjęciem, matrycą i licznikiem.
    */
    paintVideo();
    requestCapturedVideoFrame(finalJob);

    /*
      MediaRecorder/captureStream pracuje asynchronicznie.
      Dajemy mu dwie klatki przeglądarki oraz 120 ms,
      aby ostatnia klatka rzeczywiście trafiła do strumienia,
      a dopiero później zatrzymujemy recorder.
    */
    requestAnimationFrame(()=>{
      requestCapturedVideoFrame(finalJob);

      requestAnimationFrame(()=>{
        paintVideo();
        requestCapturedVideoFrame(finalJob);

        setTimeout(()=>{
          try{
            if(
              recording===finalJob &&
              !finalJob.cancelled
            ){
              paintVideo();
              requestCapturedVideoFrame(finalJob);
              finishVideo(false);
            }
          }finally{
            finalVideoFramePending=false;
          }
        },120);
      });
    });
  }
};

videoButton.onclick=()=>{
  if(recording)return;
  if(!window.MediaRecorder||!recordingCanvas.captureStream){
    videoInfo.textContent='Ta przeglądarka nie obsługuje zapisu filmu.';
    return;
  }
  const mime=['video/mp4;codecs=avc1.42E028','video/webm;codecs=vp8','video/webm']
    .find(type=>MediaRecorder.isTypeSupported(type));
  if(!mime){
    videoInfo.textContent='Brak obsługi formatu zapisu filmu.';
    return;
  }

  $('tl-start').click();
  if(!tl.running)return;

  let stream;
  try{
    paintVideo();
    stream=recordingCanvas.captureStream(30);
    const recorder=new MediaRecorder(stream,{
      mimeType:mime,videoBitsPerSecond:5000000
    });
    const job={
      recorder,stream,chunks:[],cancelled:false,
      filename:'CREDO_'+tlStamp(tl.start).replace(/[^0-9]/g,'')+
        '_'+tlStamp(tl.end).replace(/[^0-9]/g,'')
    };
    recording=job;
    recorder.ondataavailable=e=>{
      if(e.data.size)job.chunks.push(e.data);
    };
    recorder.onerror=()=>{
      job.cancelled=true;
      finishVideo(true);
      videoInfo.textContent='Błąd zapisu filmu. Spróbuj ponownie.';
    };
    recorder.onstop=()=>{
      job.stream.getTracks().forEach(track=>track.stop());
      recording=null;
      videoControls(false);
      if(job.cancelled){
        videoInfo.textContent='Zapis przerwany. Możesz uruchomić go ponownie.';
        return;
      }
      const blob=new Blob(job.chunks,{type:recorder.mimeType||mime});
      if(!blob.size){
        videoInfo.textContent='Nie powstał plik filmu.';
        return;
      }
      if(videoURL)URL.revokeObjectURL(videoURL);
      videoURL=URL.createObjectURL(blob);
      videoDownload.href=videoURL;
      videoDownload.download=job.filename+
        (blob.type.includes('mp4')?'.mp4':'.webm');
      videoDownload.hidden=false;
      videoInfo.textContent='Film gotowy — kliknij Pobierz film ('+
        (blob.size/1048576).toFixed(1)+' MB).';
    };
    recorder.start(1000);
    videoDownload.hidden=true;
    videoControls(true);
    videoInfo.textContent='Zapisywanie filmu… Pozostaw tę kartę widoczną.';
  }catch(error){
    if(stream)stream.getTracks().forEach(track=>track.stop());
    recording=null;
    tlStop();
    videoControls(false);
    videoInfo.textContent='Nie udało się rozpocząć zapisu: '+error.message;
  }
};

$('tl-canvas').addEventListener('click',e=>{
  if(recording)e.stopImmediatePropagation();
},true);

tlDialog.addEventListener('close',()=>finishVideo(true));
document.addEventListener('visibilitychange',()=>{
  if(document.hidden&&recording)finishVideo(true);
});

/* CREDO_MP4_V1 */
let mp4Busy=false,mp4ObjectURL=null;

function updateMp4Label(){
  videoDownload.textContent='Pobierz MP4';
}
updateMp4Label();
new MutationObserver(updateMp4Label).observe(
  videoDownload,{attributes:true,attributeFilter:['href','download','hidden']}
);

videoDownload.addEventListener('click',async e=>{
  if(mp4Busy){
    e.preventDefault();
    return;
  }
  if(videoDownload.download.toLowerCase().endsWith('.mp4'))return;

  e.preventDefault();
  const sourceURL=videoDownload.href;
  const sourceName=videoDownload.download;
  mp4Busy=true;
  videoButton.disabled=true;
  videoInfo.textContent='Wysyłanie filmu do Pi i konwersja do MP4…';

  try{
    const sourceResponse=await fetch(sourceURL);
    const blob=await sourceResponse.blob();
    if(blob.size>100*1024*1024)throw Error('Film przekracza limit 100 MB.');

    const response=await fetch('/api/video/mp4',{
      method:'POST',
      headers:{
        'Content-Type':'video/webm',
        'X-Credo-Video':'1'
      },
      body:blob
    });
    if(!response.ok){
      const data=await response.json();
      throw Error(data.error||'Błąd konwersji');
    }
    const mp4=await response.blob();
    if(!mp4.size)throw Error('Otrzymano pusty film.');

    if(mp4ObjectURL)URL.revokeObjectURL(mp4ObjectURL);
    mp4ObjectURL=URL.createObjectURL(mp4);
    videoDownload.href=mp4ObjectURL;
    videoDownload.download=sourceName.replace(/\.[^.]+$/,'')+'.mp4';
    videoDownload.hidden=false;
    videoInfo.textContent='MP4 gotowy ('+
      (mp4.size/1048576).toFixed(1)+
      ' MB). Kliknij Pobierz MP4, aby zapisać na urządzeniu.';
  }catch(error){
    videoInfo.textContent='Nie udało się przygotować MP4: '+error.message;
  }finally{
    mp4Busy=false;
    videoButton.disabled=false;
  }
});
