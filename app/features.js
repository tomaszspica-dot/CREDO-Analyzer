'use strict';
/* CREDO_FEATURES_CLEAN_V10 */

(()=>{
  if(window.__CREDO_FEATURES_CLEAN_V10)return;
  window.__CREDO_FEATURES_CLEAN_V10=true;

  const make=(tag,attrs={},text='')=>{
    const e=document.createElement(tag);

    for(const [k,v] of Object.entries(attrs)){
      if(k==='class')e.className=v;
      else e.setAttribute(k,v);
    }

    if(text)e.textContent=text;
    return e;
  };


  /* =========================================================
     CSS
     ========================================================= */

  const style=make(
    'style',
    {id:'credo-features-clean-v10'}
  );

  style.textContent=`

    /* ===== WSPÓLNE ===== */

    .credo-feature-dialog{
      width:min(1180px,96vw);
      max-height:94dvh;
    }

    .credo-feature-dialog.wide{
      width:min(1450px,98vw);
    }

    .feature-canvas{
      height:560px;
      min-height:280px;
    }

    .feature-grid{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:14px;
    }

    .feature-panel{
      background:#091623;
      border:1px solid var(--line);
      border-radius:10px;
      padding:12px;
    }

    .feature-period{
      display:flex;
      gap:8px;
      flex-wrap:wrap;
      align-items:center;
    }

    .feature-table td,
    .feature-table th{
      font-variant-numeric:tabular-nums;
    }


    /* ===== PASEK FILTRÓW ===== */

    .filters{
      display:flex!important;
      flex-direction:column;
      align-items:stretch!important;
      gap:12px!important;
    }

    .credo-filter-row{
      width:100%;
      display:flex;
      align-items:center;
      flex-wrap:wrap;
      gap:10px;
    }

    .credo-filter-row-main{
      padding-bottom:2px;
    }

    .credo-filter-row-actions{
      padding-top:11px;
      border-top:1px solid var(--line);
      justify-content:space-between;
      gap:18px;
    }

    .credo-filter-group{
      display:flex;
      align-items:center;
      flex-wrap:wrap;
      gap:9px;
    }

    .credo-filter-group-label{
      color:var(--muted);
      font-size:11px;
      font-weight:700;
      text-transform:uppercase;
      letter-spacing:.06em;
      margin-right:2px;
      white-space:nowrap;
    }

    .credo-filter-group button,
    .credo-filter-group a{
      white-space:nowrap;
    }


    /* ===== LISTA POMIARÓW ===== */

    #events .event{
      display:grid!important;

      grid-template-columns:
        58px
        minmax(0,1fr)
        42px
        96px;

      column-gap:12px;
      align-items:center;
      min-height:80px;
    }

    #events .event>img,
    #events .event>.event-image-placeholder{
      grid-column:1;
      width:58px;
      height:58px;
      margin:0;
    }

    #events .event>img{
      object-fit:contain;
      background:#000;
      image-rendering:pixelated;
    }

    #events .event>.event-image-placeholder{
      display:block;
      border-radius:5px;
      background:#06101a;
      border:1px dashed #20364b;
    }

    #events .event>button[data-event]{
      grid-column:2;
      width:100%;
      min-width:0;
      margin:0;
    }

    #events .event>button[data-event] b,
    #events .event>button[data-event] small{
      display:block;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
    }

    #events .event>.favorite-star{
      grid-column:3;
      justify-self:center;
      margin:0;
    }

    #events .event>.tag{
      grid-column:4;
      justify-self:end;
      min-width:82px;
      text-align:center;
      margin:0;
      white-space:nowrap;
    }

    .favorite-star{
      font-size:18px;
      line-height:1;
      padding:7px 10px;
      min-width:40px;
    }

    .favorite-star.on{
      color:#fbbf24;
      border-color:#fbbf24;
    }


    /* ===== ULUBIONE ===== */

    #feature-favorites-list{
      display:grid;
      gap:8px;
      margin-top:12px;
    }

    .favorite-row{
      display:grid;
      grid-template-columns:
        72px
        minmax(0,1fr)
        44px;

      gap:12px;
      align-items:center;

      background:#091623;
      border:1px solid #20364b;
      border-radius:9px;
      padding:10px;
    }

    .favorite-row img{
      width:68px;
      height:68px;
      object-fit:contain;
      background:#000;
      image-rendering:pixelated;

      border:1px solid #20364b;
      border-radius:6px;
      cursor:zoom-in;
    }

    .favorite-row .open-fav{
      background:none;
      border:0;
      padding:0;
      text-align:left;
      min-width:0;
    }

    .favorite-row .open-fav b{
      display:block;
      margin-bottom:4px;
    }

    .favorite-row .fav-note{
      display:block;
      margin-top:5px;
      color:var(--muted);
      white-space:pre-wrap;
    }

    #favorite-image-preview{
      width:min(900px,95vw);
      max-height:94dvh;
      padding:18px;
    }

    #favorite-image-preview[open]{
      display:flex;
      flex-direction:column;
      gap:12px;
    }

    #favorite-preview-img{
      display:block;
      width:100%;
      max-height:72dvh;
      object-fit:contain;
      background:#000;

      border:1px solid var(--line);
      border-radius:8px;

      image-rendering:pixelated;
    }

    #favorite-preview-meta{
      margin:0;
      white-space:pre-line;
      color:var(--muted);
      font-size:13px;
    }


    /* ===== TIMELAPSE ===== */

    #timelapse #tl-stage{
      display:grid!important;

      grid-template-columns:
        360px
        minmax(0,1fr);

      gap:18px!important;
      align-items:start!important;

      width:100%!important;

      height:
        clamp(
          430px,
          calc(100dvh - 320px),
          680px
        );

      margin-top:0!important;
      margin-bottom:38px!important;
    }

    #timelapse #tl-photo-wrap,
    #timelapse #tl-photo-wrap:not([hidden]){
      grid-column:1!important;
      grid-row:1!important;

      position:relative!important;
      box-sizing:border-box!important;

      padding:0!important;

      margin-left:0!important;
      margin-right:0!important;
      margin-bottom:0!important;

      background:#000!important;

      border:
        1px solid var(--line)!important;

      border-radius:9px!important;

      overflow:hidden!important;

      aspect-ratio:1/1!important;
    }

    #timelapse #tl-photo-wrap[hidden]{
      display:block!important;
      visibility:hidden!important;
    }

    #timelapse #tl-photo-wrap:not([hidden]){
      display:block!important;
      visibility:visible!important;
    }

    #timelapse #tl-current-photo{
      position:absolute!important;
      inset:0!important;

      display:block!important;

      width:100%!important;
      height:100%!important;

      min-width:0!important;
      min-height:0!important;

      max-width:none!important;
      max-height:none!important;

      object-fit:contain!important;
      object-position:center!important;

      background:#000!important;

      border:0!important;
      border-radius:0!important;

      image-rendering:pixelated!important;
    }

    #timelapse #tl-photo-text{
      position:absolute!important;

      left:8px!important;
      right:8px!important;
      bottom:8px!important;

      z-index:4!important;

      margin:0!important;
      padding:7px 9px!important;
      min-height:0!important;

      background:
        rgba(5,14,23,.84)!important;

      border:
        1px solid #294158!important;

      border-radius:7px!important;

      color:#d7e5ef!important;

      font-size:11px!important;
      line-height:1.25!important;
      text-align:center!important;
      white-space:pre-line!important;

      pointer-events:none!important;
    }

    #timelapse .tl-map{
      grid-column:2!important;
      grid-row:1!important;

      min-width:0!important;
      width:100%!important;
      height:100%!important;

      overflow:visible!important;
    }

    #timelapse #tl-canvas{
      display:block!important;

      width:100%!important;
      height:100%!important;

      min-width:0!important;
      min-height:0!important;
    }

    #timelapse #tl-seek{
      position:relative!important;
      z-index:10!important;

      display:block!important;
      width:100%!important;

      margin-top:0!important;
      margin-bottom:12px!important;
    }


    @media(max-width:900px){

      .credo-filter-row-actions{
        justify-content:flex-start;
      }

      #events .event{
        grid-template-columns:
          58px
          minmax(0,1fr)
          42px;
      }

      #events .event>.tag{
        grid-column:2/4;
        grid-row:2;
        justify-self:start;
        margin-top:-5px;
      }

      .feature-grid{
        grid-template-columns:1fr;
      }

      .feature-canvas{
        height:420px;
      }

      #timelapse #tl-stage{
        grid-template-columns:
          1fr!important;

        height:auto!important;

        grid-template-rows:
          auto
          420px!important;
      }

      #timelapse #tl-photo-wrap{
        grid-column:1!important;
        grid-row:1!important;
        justify-self:center!important;
      }

      #timelapse .tl-map{
        grid-column:1!important;
        grid-row:2!important;
      }
    }
  `;

  document.head.appendChild(style);


  /* =========================================================
     WSPÓLNA GEOMETRIA
     ========================================================= */

  const commonRange=()=>{

    const pts=
      all.filter(
        e=>
          Number.isFinite(e.x) &&
          Number.isFinite(e.y)
      );

    const maxX=
      pts.reduce(
        (v,e)=>Math.max(v,e.x),
        0
      );

    const maxY=
      pts.reduce(
        (v,e)=>Math.max(v,e.y),
        0
      );

    const dims=
      status.dimensions;

    return {

      rx:
        dims
          ? dims.width-1
          : Math.max(
              100,
              Math.ceil(
                (maxX+1)/100
              )*100
            )-1,

      ry:
        dims
          ? dims.height-1
          : Math.max(
              100,
              Math.ceil(
                (maxY+1)/100
              )*100
            )-1
    };
  };


  const addTopButton=
    (text,id,handler)=>{

      const b=
        make(
          'button',
          {id},
          text
        );

      b.type='button';
      b.onclick=handler;

      document
        .querySelector('.filters')
        .appendChild(b);

      return b;
    };


  /* =========================================================
     ARCHIWUM
     ========================================================= */

  const archive=
    make(
      'a',
      {
        id:'feature-archive',
        href:'/export/archive.zip',
        title:
          'Pobierz kopię bazy SQLite, obrazów i danych pomocniczych'
      },
      'Kopia archiwum ZIP'
    );

  document
    .querySelector('.filters')
    .appendChild(archive);


  /* =========================================================
     MAPA ZAGĘSZCZENIA
     ========================================================= */

  const heatDialog=
    make(
      'dialog',
      {
        id:'feature-heatmap',
        class:
          'credo-feature-dialog wide'
      }
    );

  heatDialog.innerHTML=`
    <header>
      <h2>Mapa zagęszczenia detekcji</h2>
      <button type="button" data-feature-close>
        Zamknij ✕
      </button>
    </header>

    <p id="feature-heat-info" class="muted"></p>

    <div class="feature-canvas">
      <canvas id="feature-heat-canvas"></canvas>
    </div>

    <p class="muted">
      Ta sama geometria i skala osi X/Y co na mapie głównej.
      Jaśniejszy obszar oznacza większą liczbę zapisanych detekcji.
    </p>
  `;

  document.body.appendChild(
    heatDialog
  );

  heatDialog
    .querySelector('[data-feature-close]')
    .onclick=
      ()=>heatDialog.close();


  addTopButton(
    'Mapa zagęszczenia',
    'feature-heat-open',
    ()=>{

      heatDialog.showModal();

      requestAnimationFrame(
        drawHeatmap
      );
    }
  );


  function drawDensity(
    canvasId,
    data
  ){

    const {rx,ry}=
      commonRange();

    const f=
      equalMapFrame(
        canvasId,
        rx,
        ry
      );

    if(!f)return;


    const {
      ctx,
      left,
      top,
      pw,
      ph
    }=f;


    const W=rx+1;
    const H=ry+1;


    const nx=
      Math.max(
        8,
        Math.min(
          64,
          Math.round(
            Math.sqrt(
              Math.max(
                1,
                data.length
              )
            )*1.7
          )
        )
      );


    const ny=
      Math.max(
        8,
        Math.min(
          64,
          Math.round(
            nx*H/W
          )
        )
      );


    const counts=
      Array.from(
        {length:ny},
        ()=>Array(nx).fill(0)
      );


    for(const e of data){

      if(
        !Number.isFinite(e.x) ||
        !Number.isFinite(e.y)
      ){
        continue;
      }

      const ix=
        Math.min(
          nx-1,
          Math.max(
            0,
            Math.floor(
              e.x/W*nx
            )
          )
        );

      const iy=
        Math.min(
          ny-1,
          Math.max(
            0,
            Math.floor(
              e.y/H*ny
            )
          )
        );

      counts[iy][ix]++;
    }


    const maximum=
      Math.max(
        0,
        ...counts.flat()
      );

    if(!maximum)return;


    ctx.save();

    ctx.beginPath();
    ctx.rect(
      left,
      top,
      pw,
      ph
    );
    ctx.clip();


    for(
      let iy=0;
      iy<ny;
      iy++
    ){

      for(
        let ix=0;
        ix<nx;
        ix++
      ){

        const n=
          counts[iy][ix];

        if(!n)continue;


        const q=
          Math.log1p(n) /
          Math.log1p(maximum);


        ctx.fillStyle=
          `rgba(251,191,36,${
            0.10+0.82*q
          })`;


        ctx.fillRect(

          left+
            ix*pw/nx,

          top+
            (ny-iy-1)*ph/ny,

          pw/nx+.5,

          ph/ny+.5
        );
      }
    }

    ctx.restore();
  }


  function drawHeatmap(){

    drawDensity(
      'feature-heat-canvas',
      events
    );

    $('feature-heat-info')
      .textContent=
        `${events.length} detekcji po aktualnych filtrach · `+
        `skala wspólna z mapą główną`;
  }


  new ResizeObserver(
    ()=>{

      if(heatDialog.open){
        drawHeatmap();
      }
    }
  ).observe(
    $('feature-heat-canvas')
  );


  /* =========================================================
     PORÓWNANIE OKRESÓW
     ========================================================= */

  const cmpDialog=
    make(
      'dialog',
      {
        id:'feature-compare',
        class:
          'credo-feature-dialog wide'
      }
    );


  cmpDialog.innerHTML=`

    <header>
      <h2>Porównanie okresów</h2>

      <button type="button" data-feature-close>
        Zamknij ✕
      </button>
    </header>


    <div class="feature-grid">

      <div class="feature-panel">

        <h3>Okres A</h3>

        <div class="feature-period">

          <label>
            Od
            <input
              type="date"
              id="cmp-a-from">
          </label>

          <label>
            Do
            <input
              type="date"
              id="cmp-a-to">
          </label>

        </div>
      </div>


      <div class="feature-panel">

        <h3>Okres B</h3>

        <div class="feature-period">

          <label>
            Od
            <input
              type="date"
              id="cmp-b-from">
          </label>

          <label>
            Do
            <input
              type="date"
              id="cmp-b-to">
          </label>

        </div>
      </div>

    </div>


    <p>
      <button
        type="button"
        id="cmp-run">
        Porównaj
      </button>
    </p>


    <div id="cmp-summary"></div>


    <div class="feature-grid">

      <div class="feature-panel">

        <h3>Zagęszczenie A</h3>

        <div class="feature-canvas">
          <canvas id="cmp-a-canvas"></canvas>
        </div>

      </div>


      <div class="feature-panel">

        <h3>Zagęszczenie B</h3>

        <div class="feature-canvas">
          <canvas id="cmp-b-canvas"></canvas>
        </div>

      </div>

    </div>


    <p class="muted">
      Obie mapy mają identyczną skalę X/Y.
      Porównanie uwzględnia aktualnie wybraną klasę
      w filtrze głównym.
    </p>
  `;


  document.body.appendChild(
    cmpDialog
  );


  cmpDialog
    .querySelector('[data-feature-close]')
    .onclick=
      ()=>cmpDialog.close();


  const datesForCompare=()=>{

    const days=[
      ...new Set(
        all
          .map(
            e=>
              String(
                e.timestamp
              ).slice(
                0,
                10
              )
          )
          .filter(
            d=>
              /^\d{4}-\d\d-\d\d$/
                .test(d)
          )
      )
    ].sort();


    if(!days.length)return;


    const mid=
      Math.max(
        0,
        Math.floor(
          (days.length-1)/2
        )
      );


    $('cmp-a-from').value=
      days[0];

    $('cmp-a-to').value=
      days[mid];

    $('cmp-b-from').value=
      days[
        Math.min(
          mid+1,
          days.length-1
        )
      ];

    $('cmp-b-to').value=
      days.at(-1);
  };


  addTopButton(
    'Porównaj okresy',
    'feature-compare-open',
    ()=>{

      datesForCompare();

      cmpDialog.showModal();

      requestAnimationFrame(
        runCompare
      );
    }
  );


  const periodRows=
    (from,to)=>{

      const cls=
        $('filter-class').value;


      return all.filter(
        e=>{

          const d=
            String(
              e.timestamp
            ).slice(
              0,
              10
            );


          return(
            (!from || d>=from) &&
            (!to   || d<=to)   &&
            (!cls  || e.class===cls)
          );
        }
      );
    };


  const avgActive=
    rows=>{

      const values=
        rows
          .map(
            e=>
              Number(
                e.active_pixels
              )
          )
          .filter(
            Number.isFinite
          );


      return values.length

        ? (
            values.reduce(
              (a,b)=>a+b,
              0
            ) /
            values.length
          ).toFixed(1)

        : '—';
    };


  const classCounts=
    rows=>{

      const c={};

      for(const e of rows){
        c[e.class]=
          (c[e.class]||0)+1;
      }

      return c;
    };


  const delta=
    (a,b)=>

      !a&&!b
        ? '0%'

        : !a
          ? '—'

          :
            `${
              (b-a)/a*100>=0
                ? '+'
                : ''
            }${
              (
                (b-a)/a*100
              ).toFixed(1)
            }%`;


  function runCompare(){

    const A=
      periodRows(
        $('cmp-a-from').value,
        $('cmp-a-to').value
      );

    const B=
      periodRows(
        $('cmp-b-from').value,
        $('cmp-b-to').value
      );

    const ca=
      classCounts(A);

    const cb=
      classCounts(B);


    const rows=[

      [
        'Detekcje',
        A.length,
        B.length,
        delta(
          A.length,
          B.length
        )
      ],

      [
        'Z obrazem',
        A.filter(e=>e.image).length,
        B.filter(e=>e.image).length,
        ''
      ],

      [
        'Ulubione',
        A.filter(e=>e.favorite).length,
        B.filter(e=>e.favorite).length,
        ''
      ],

      [
        'Śr. aktywne piksele',
        avgActive(A),
        avgActive(B),
        ''
      ],

      ...Object
        .keys(palette)
        .map(
          k=>[
            k,
            ca[k]||0,
            cb[k]||0,
            ''
          ]
        )
    ];


    $('cmp-summary')
      .innerHTML=

        `<table class="feature-table">

          <thead>
            <tr>
              <th>Wskaźnik</th>
              <th>Okres A</th>
              <th>Okres B</th>
              <th>Zmiana B/A</th>
            </tr>
          </thead>

          <tbody>

            ${
              rows.map(
                r=>
                  `<tr>
                    <td>${esc(r[0])}</td>
                    <td>${esc(r[1])}</td>
                    <td>${esc(r[2])}</td>
                    <td>${esc(r[3])}</td>
                  </tr>`
              ).join('')
            }

          </tbody>

        </table>`;


    drawDensity(
      'cmp-a-canvas',
      A
    );

    drawDensity(
      'cmp-b-canvas',
      B
    );
  }


  $('cmp-run').onclick=
    runCompare;


  new ResizeObserver(
    ()=>{

      if(cmpDialog.open){
        runCompare();
      }
    }
  ).observe(
    $('cmp-a-canvas')
  );


  /* =========================================================
     ULUBIONE
     ========================================================= */

  const favDialog=
    make(
      'dialog',
      {
        id:'feature-favorites',
        class:'credo-feature-dialog'
      }
    );


  favDialog.innerHTML=`

    <header>
      <h2>Ulubione pomiary</h2>

      <button
        type="button"
        data-feature-close>
        Zamknij ✕
      </button>
    </header>

    <p class="muted">
      Ulubione korzystają z tej samej notatki,
      którą zapisujesz w szczegółach pomiaru.
    </p>

    <div id="feature-favorites-list"></div>
  `;


  document.body.appendChild(
    favDialog
  );


  favDialog
    .querySelector('[data-feature-close]')
    .onclick=
      ()=>favDialog.close();


  const favTop=
    addTopButton(
      'Ulubione (0)',
      'feature-favorites-open',
      ()=>{

        renderFavorites();

        favDialog.showModal();
      }
    );


  const detailFooter=
    $('detail')
      .querySelector('footer');


  const favToggle=
    make(
      'button',
      {
        id:'favorite-toggle',
        class:'favorite-star'
      },
      '☆'
    );


  favToggle.type='button';


  detailFooter.insertBefore(
    favToggle,
    detailFooter.firstChild
  );


  const favState=
    e=>{

      favToggle.textContent=
        e?.favorite
          ? '★'
          : '☆';

      favToggle
        .classList
        .toggle(
          'on',
          !!e?.favorite
        );

      favToggle.title=
        e?.favorite
          ? 'Usuń z ulubionych'
          : 'Dodaj do ulubionych';
    };


  favToggle.onclick=
    async()=>{

      if(!selected)return;


      const id=
        selected.id;

      const next=
        !selected.favorite;


      try{

        await api(
          '/api/favorite',
          {
            id,
            favorite:next
          }
        );


        await load();


        selected=
          all.find(
            e=>e.id===id
          ) ||
          selected;


        favState(
          selected
        );

        renderFavorites();

      }catch(error){

        $('saved')
          .textContent=
            error.message;
      }
    };


  function renderFavorites(){

    const rows=
      all
        .filter(
          e=>e.favorite
        )
        .sort(
          (a,b)=>
            String(
              b.timestamp
            ).localeCompare(
              String(
                a.timestamp
              )
            )
        );


    favTop.textContent=
      `Ulubione (${rows.length})`;


    $('feature-favorites-list')
      .innerHTML=

        rows.map(
          e=>

            `<article
              class="favorite-row"
              data-fav="${esc(e.id)}">

              ${
                e.image

                  ?
                    `<img
                      src="/image/${esc(e.id)}"
                      alt="Detekcja"
                      loading="lazy">`

                  :
                    '<span>☆</span>'
              }

              <button
                type="button"
                class="open-fav"
                data-open="${esc(e.id)}">

                <b>
                  ${esc(e.timestamp)}
                </b>

                <small>
                  X ${esc(e.x)}
                  ·
                  Y ${esc(e.y)}
                  ·
                  ${tag(e.class)}
                </small>

                <span class="fav-note">
                  ${esc(
                    e.note ||
                    'Bez notatki'
                  )}
                </span>

              </button>

              <button
                type="button"
                class="favorite-star on"
                data-unfav="${esc(e.id)}"
                title="Usuń z ulubionych">
                ★
              </button>

            </article>`
        ).join('')

        ||

        '<p>Nie masz jeszcze ulubionych pomiarów.</p>';
  }


  $('feature-favorites-list')
    .onclick=
      async ev=>{

        const open=
          ev.target.closest(
            '[data-open]'
          );


        if(open){

          favDialog.close();

          detail(
            open.dataset.open
          );

          return;
        }


        const unfav=
          ev.target.closest(
            '[data-unfav]'
          );


        if(unfav){

          await api(
            '/api/favorite',
            {
              id:
                unfav.dataset.unfav,

              favorite:false
            }
          );


          await load();

          renderFavorites();
        }
      };


  /* =========================================================
     PODGLĄD ULUBIONEGO PNG
     ========================================================= */

  const preview=
    make(
      'dialog',
      {
        id:
          'favorite-image-preview'
      }
    );


  preview.innerHTML=`

    <header>

      <h2 id="favorite-preview-title">
        Podgląd pomiaru
      </h2>

      <button
        type="button"
        id="favorite-preview-close">
        Zamknij ✕
      </button>

    </header>


    <img
      id="favorite-preview-img"
      alt="Powiększony obraz detekcji">


    <p id="favorite-preview-meta"></p>


    <footer>

      <button
        type="button"
        id="favorite-preview-details">

        Otwórz szczegóły pomiaru

      </button>

    </footer>
  `;


  document.body.appendChild(
    preview
  );


  let previewEventId=null;


  const openFavoriteImage=
    id=>{

      const e=
        all.find(
          x=>x.id===id
        );


      if(!e || !e.image){
        return;
      }


      previewEventId=id;


      $('favorite-preview-title')
        .textContent=
          e.timestamp;


      $('favorite-preview-img')
        .src=
          '/image/'+
          encodeURIComponent(id);


      $('favorite-preview-meta')
        .textContent=

          `X: ${e.x??'—'} · `+
          `Y: ${e.y??'—'}\n`+

          `Klasa: ${e.class}\n`+

          (
            e.note
              ? `Notatka: ${e.note}`
              : 'Bez notatki'
          );


      if(!preview.open){
        preview.showModal();
      }
    };


  $('favorite-preview-close')
    .onclick=
      ()=>preview.close();


  $('favorite-preview-details')
    .onclick=
      ()=>{

        const id=
          previewEventId;


        preview.close();


        if(favDialog.open){
          favDialog.close();
        }


        if(id){
          detail(id);
        }
      };


  $('feature-favorites-list')
    .addEventListener(
      'click',
      e=>{

        const image=
          e.target.closest(
            '.favorite-row img'
          );


        if(!image)return;


        e.preventDefault();
        e.stopPropagation();


        const row=
          image.closest(
            '[data-fav]'
          );


        if(row){

          openFavoriteImage(
            row.dataset.fav
          );
        }
      },
      true
    );


  /* =========================================================
     DETAIL + LISTA POMIARÓW
     ========================================================= */

  const baseDetail=
    detail;


  detail=
    function(id){

      baseDetail(id);

      favState(
        all.find(
          e=>e.id===id
        )
      );
    };


  function normalizeEventRows(){

    for(
      const row of
      $('events')
        .querySelectorAll(
          '.event'
        )
    ){

      const hasImage=
        Array
          .from(row.children)
          .some(
            el=>
              el.tagName==='IMG' ||
              el.classList
                ?.contains(
                  'event-image-placeholder'
                )
          );


      if(!hasImage){

        const blank=
          make(
            'span',
            {
              class:
                'event-image-placeholder',

              'aria-hidden':
                'true'
            }
          );


        row.insertBefore(
          blank,
          row.firstChild
        );
      }


      const id=
        row
          .querySelector(
            '[data-event]'
          )
          ?.dataset.event;


      const e=
        all.find(
          x=>x.id===id
        );


      if(
        !id ||
        !e ||
        row.querySelector(
          '[data-list-fav]'
        )
      ){
        continue;
      }


      const b=
        make(
          'button',
          {
            class:
              'favorite-star'+
              (
                e.favorite
                  ? ' on'
                  : ''
              ),

            'data-list-fav':
              id,

            title:
              e.favorite
                ? 'Usuń z ulubionych'
                : 'Dodaj do ulubionych'
          },

          e.favorite
            ? '★'
            : '☆'
        );


      b.type='button';


      b.onclick=
        async ev=>{

          ev.stopPropagation();


          await api(
            '/api/favorite',
            {
              id,
              favorite:
                !e.favorite
            }
          );


          await load();
        };


      const tagEl=
        row.querySelector(
          '.tag'
        );


      row.insertBefore(
        b,
        tagEl||null
      );
    }
  }


  const baseRenderList=
    renderList;


  renderList=
    function(){

      baseRenderList();

      normalizeEventRows();
    };


  /* =========================================================
     PASEK STEROWANIA
     ========================================================= */

  function arrangeToolbar(){

    const filters=
      document.querySelector(
        '.filters'
      );


    if(
      !filters ||
      filters.dataset.credoClean==='1'
    ){
      return;
    }


    const from=$('from');
    const to=$('to');
    const cls=$('filter-class');

    const clear=$('clear');

    const csv=$('csv');

    const dimensions=
      $('dimensions');

    const heat=
      $('feature-heat-open');

    const compare=
      $('feature-compare-open');

    const favorites=
      $('feature-favorites-open');


    if(
      !from ||
      !to ||
      !cls ||
      !clear ||
      !csv ||
      !dimensions ||
      !archive ||
      !heat ||
      !compare ||
      !favorites
    ){
      return;
    }


    const main=
      make(
        'div',
        {
          class:
            'credo-filter-row credo-filter-row-main'
        }
      );


    const actions=
      make(
        'div',
        {
          class:
            'credo-filter-row credo-filter-row-actions'
        }
      );


    const dataGroup=
      make(
        'div',
        {
          class:
            'credo-filter-group'
        }
      );


    const analysisGroup=
      make(
        'div',
        {
          class:
            'credo-filter-group'
        }
      );


    const dataLabel=
      make(
        'span',
        {
          class:
            'credo-filter-group-label'
        },
        'Dane'
      );


    const analysisLabel=
      make(
        'span',
        {
          class:
            'credo-filter-group-label'
        },
        'Analiza'
      );


    main.append(
      from.closest('label'),
      to.closest('label'),
      cls.closest('label'),
      clear
    );


    dataGroup.append(
      dataLabel,
      csv,
      archive,
      dimensions
    );


    analysisGroup.append(
      analysisLabel,
      heat,
      compare,
      favorites
    );


    actions.append(
      dataGroup,
      analysisGroup
    );


    filters.replaceChildren(
      main,
      actions
    );


    filters.dataset.credoClean='1';
  }


  /* =========================================================
     TIMELAPSE — ZDJĘCIE
     ========================================================= */

  const tlPhotoWrap=
    make(
      'div',
      {
        id:'tl-photo-wrap'
      }
    );


  tlPhotoWrap.hidden=true;


  tlPhotoWrap.innerHTML=`

    <img
      id="tl-current-photo"
      alt="Zdjęcie bieżącej detekcji">

    <div id="tl-photo-text"></div>
  `;


  $('tl-message')
    .after(
      tlPhotoWrap
    );


  let tlPhotoId=null;
  let tlPhotoEvent=null;
  let tlPhotoImage=null;

  let geometryBusy=false;


  const currentTlEvent=
    ()=>{

      if(!tl.items.length){
        return null;
      }


      const current=

        tl.start +

        (
          tl.end -
          tl.start
        ) *

        Math.min(
          1,
          tl.elapsed /
          tl.duration
        );


      let found=null;


      for(const item of tl.items){

        if(item.t>current){
          break;
        }


        if(item.event.image){
          found=item.event;
        }
      }


      return found;
    };


  function updateTlPhoto(){

    const e=
      currentTlEvent();


    tlPhotoEvent=e;


    if(!e){

      tlPhotoWrap.hidden=true;

      tlPhotoId=null;
      tlPhotoImage=null;

      return;
    }


    tlPhotoWrap.hidden=false;


    $('tl-photo-text')
      .textContent=

        `${e.timestamp}\n`+

        `${e.class} · `+

        `X ${e.x??'—'} · `+

        `Y ${e.y??'—'}`+

        (
          e.note
            ? `\nNotatka: ${e.note}`
            : ''
        );


    if(tlPhotoId!==e.id){

      tlPhotoId=e.id;
      tlPhotoImage=null;


      const img=
        new Image();


      img.onload=
        ()=>{

          tlPhotoImage=img;
        };


      img.src=
        '/image/'+
        encodeURIComponent(
          e.id
        );


      $('tl-current-photo')
        .src=
          img.src;
    }
  }


  /* =========================================================
     TIMELAPSE — GEOMETRIA
     ========================================================= */

  function ensureTlStage(){

    const photo=
      $('tl-photo-wrap');

    const map=
      document.querySelector(
        '#timelapse .tl-map'
      );

    const seek=
      $('tl-seek');


    if(
      !photo ||
      !map ||
      !seek
    ){
      return null;
    }


    let stage=
      $('tl-stage');


    if(!stage){

      stage=
        make(
          'div',
          {id:'tl-stage'}
        );


      seek.parentNode.insertBefore(
        stage,
        seek
      );
    }


    if(photo.parentNode!==stage){
      stage.appendChild(photo);
    }


    if(map.parentNode!==stage){
      stage.appendChild(map);
    }


    return{
      stage,
      photo,
      map
    };
  }


  function measurePlot(){

    const els=
      ensureTlStage();

    const canvas=
      $('tl-canvas');


    if(
      !els ||
      !canvas
    ){
      return null;
    }


    const r=
      canvas
        .getBoundingClientRect();


    if(
      r.width<200 ||
      r.height<200
    ){
      return null;
    }


    const dims=
      status.dimensions||{};


    const W=
      Number(dims.width)>1
        ? Number(dims.width)
        : 1920;


    const H=
      Number(dims.height)>1
        ? Number(dims.height)
        : 1080;


    /*
      Ten sam rachunek co equalMapFrame():
      bok kwadratu = fizyczna długość osi Y.
    */

    const s=
      Math.min(

        Math.max(
          1,
          r.width-90
        ) / W,

        Math.max(
          1,
          r.height-65
        ) / H
      );


    const ph=
      H*s;


    const top=
      20 +
      (
        r.height -
        65 -
        ph
      )/2;


    return{

      ...els,

      side:
        Math.max(
          220,
          Math.min(
            900,
            Math.round(ph)
          )
        ),

      top:
        Math.max(
          0,
          Math.round(top)
        )
    };
  }


  function forceSquare(){

    const g=
      measurePlot();


    if(!g)return;


    for(
      const prop of
      [
        'width',
        'height',
        'min-width',
        'min-height',
        'max-width',
        'max-height'
      ]
    ){

      g.photo
        .style
        .setProperty(
          prop,
          g.side+'px',
          'important'
        );
    }


    g.photo
      .style
      .setProperty(
        'aspect-ratio',
        '1 / 1',
        'important'
      );


    g.photo
      .style
      .setProperty(
        'margin-top',
        g.top+'px',
        'important'
      );


    g.stage
      .style
      .setProperty(
        'grid-template-columns',
        g.side+
          'px minmax(0,1fr)',
        'important'
      );
  }


  function settleGeometry(){

    if(geometryBusy){
      return;
    }


    geometryBusy=true;


    let n=0;


    const step=
      ()=>{

        forceSquare();


        if(++n<6){

          requestAnimationFrame(
            step
          );

        }else{

          geometryBusy=false;
        }
      };


    requestAnimationFrame(
      step
    );
  }


  /* =========================================================
     TIMELAPSE — RENDER
     ========================================================= */

  const baseTlRender=
    tlRender;


  tlRender=
    function(){

      /*
        Timelapse ma ten sam zakres matrycy
        co mapa główna.
      */

      const r=
        commonRange();


      tl.rx=r.rx;
      tl.ry=r.ry;


      updateTlPhoto();


      baseTlRender();
    };


  /* =========================================================
     TIMELAPSE / MP4 — CLEAN V10.1
     ========================================================= */

  /* CREDO_MP4_LAYOUT_V10_1 */

  /*
    Wszystkie obrazy potrzebne do filmu są ładowane
    PRZED uruchomieniem MediaRecorder.
  */

  const tlImageCache=
    new Map();

  let tlPreloadKey='';
  let tlPreloadPromise=
    Promise.resolve();


  async function preloadTlImages(items){

    const unique=[];
    const seen=new Set();

    for(const item of items||[]){

      const e=
        item?.event;

      if(
        !e?.image ||
        seen.has(e.id)
      ){
        continue;
      }

      seen.add(e.id);
      unique.push(e);
    }


    const key=
      unique
        .map(e=>e.id)
        .join('|');


    if(key===tlPreloadKey){
      return tlPreloadPromise;
    }


    tlPreloadKey=key;


    tlPreloadPromise=
      Promise.allSettled(

        unique.map(

          e=>

            new Promise(resolve=>{

              const old=
                tlImageCache.get(
                  e.id
                );


              if(
                old?.complete &&
                old.naturalWidth>0
              ){
                resolve();
                return;
              }


              const img=
                new Image();


              img.onload=()=>{

                tlImageCache.set(
                  e.id,
                  img
                );

                resolve();
              };


              img.onerror=
                ()=>resolve();


              img.src=
                '/image/'+
                encodeURIComponent(
                  e.id
                );
            })
        )
      );


    return tlPreloadPromise;
  }


  /*
    Przy normalnym odtwarzaniu preload robimy
    w tle. Nie opóźnia to timelapse.
  */

  const baseTlPlay=
    tlPlay;


  tlPlay=
    function(){

      preloadTlImages(
        tl.items
      );

      baseTlPlay();
    };


  /* =========================================================
     MP4 — FIXED GEOMETRY V10.7
     ========================================================= */

  /* CREDO_MP4_FIXED_GEOMETRY_V10_7 */

  paintVideo=
    function(){

      const ctx=
        recordingContext;


      /* =====================================================
         STAŁA GEOMETRIA 1920 × 1080
         ===================================================== */

      const OUT_W=1920;
      const OUT_H=1080;

      /*
        JEDYNY wspólny odstęp.

        panel:
            M
          M [560] M [996×560] M
            M
      */

      const M=32;

      const DET=560;

      const MAP_H=560;

      /*
        1920 : 1080 = 16 : 9

        560 × 16/9 = 995.555...
        Zaokrąglamy do 996 px.
      */
      const MAP_W=996;


      const PANEL_W=
        M+
        DET+
        M+
        MAP_W+
        M;


      const PANEL_H=
        M+
        MAP_H+
        M;


      /*
        PANEL_W = 1652
        PANEL_H = 624

        Jest wyśrodkowany matematycznie
        w canvasie 1920 × 1080.
      */

      const PANEL_X=
        Math.round(
          (OUT_W-PANEL_W)/2
        );


      const PANEL_Y=
        Math.round(
          (OUT_H-PANEL_H)/2
        );


      const DET_X=
        PANEL_X+M;


      const DET_Y=
        PANEL_Y+M;


      const MAP_X=
        DET_X+
        DET+
        M;


      const MAP_Y=
        PANEL_Y+M;


      /* =====================================================
         FUNKCJE POMOCNICZE
         ===================================================== */

      function roundedRect(
        x,
        y,
        w,
        h,
        r
      ){

        const rr=
          Math.max(
            0,
            Math.min(
              r,
              w/2,
              h/2
            )
          );


        ctx.beginPath();

        ctx.moveTo(
          x+rr,
          y
        );

        ctx.lineTo(
          x+w-rr,
          y
        );

        ctx.quadraticCurveTo(
          x+w,
          y,
          x+w,
          y+rr
        );

        ctx.lineTo(
          x+w,
          y+h-rr
        );

        ctx.quadraticCurveTo(
          x+w,
          y+h,
          x+w-rr,
          y+h
        );

        ctx.lineTo(
          x+rr,
          y+h
        );

        ctx.quadraticCurveTo(
          x,
          y+h,
          x,
          y+h-rr
        );

        ctx.lineTo(
          x,
          y+rr
        );

        ctx.quadraticCurveTo(
          x,
          y,
          x+rr,
          y
        );

        ctx.closePath();
      }


      const dims=
        status.dimensions||{};


      const SENSOR_W=
        Number(dims.width)>1
          ? Number(dims.width)
          : 1920;


      const SENSOR_H=
        Number(dims.height)>1
          ? Number(dims.height)
          : 1080;


      const progress=
        Math.min(
          1,
          Math.max(
            0,
            tl.elapsed/
            Math.max(
              1,
              tl.duration
            )
          )
        );


      const currentTime=
        tl.start+
        (
          tl.end-
          tl.start
        )*
        progress;


      const currentEvent=
        currentTlEvent();


      const currentImage=
        currentEvent?.image

          ? tlImageCache.get(
              currentEvent.id
            )

          : null;


      /*
        Wszystkie wydarzenia, które w tej klatce
        mają być już widoczne na matrycy.
      */

      const visible=[];


      for(
        const item of
        tl.items
      ){

        if(
          item.t>
          currentTime
        ){
          break;
        }

        visible.push(
          item
        );
      }


      function pxForX(x){

        const v=
          Math.max(
            0,
            Math.min(
              SENSOR_W-1,
              Number(x)||0
            )
          );


        return (
          MAP_X+
          (
            v/
            Math.max(
              1,
              SENSOR_W-1
            )
          )*
          MAP_W
        );
      }


      function pyForY(y){

        const v=
          Math.max(
            0,
            Math.min(
              SENSOR_H-1,
              Number(y)||0
            )
          );


        return (
          MAP_Y+
          MAP_H-
          (
            v/
            Math.max(
              1,
              SENSOR_H-1
            )
          )*
          MAP_H
        );
      }


      /* =====================================================
         TŁO
         ===================================================== */

      ctx.fillStyle=
        '#08121f';


      ctx.fillRect(
        0,
        0,
        OUT_W,
        OUT_H
      );


      /* =====================================================
         TYTUŁ NAD RAMKĄ
         ===================================================== */

      ctx.textAlign=
        'center';


      ctx.fillStyle=
        '#edf5fb';


      ctx.font=
        '27px sans-serif';


      ctx.fillText(
        'CREDO · KoszalinCredo',
        OUT_W/2,
        62
      );


      ctx.fillStyle=
        '#91a8ba';


      ctx.font=
        '17px sans-serif';


      ctx.fillText(

        tlStamp(tl.start)+
        '  →  '+
        tlStamp(tl.end),

        OUT_W/2,
        91
      );


      /* =====================================================
         JEDNA ZEWNĘTRZNA RAMKA
         ===================================================== */

      roundedRect(
        PANEL_X,
        PANEL_Y,
        PANEL_W,
        PANEL_H,
        16
      );


      ctx.fillStyle=
        '#091623';


      ctx.fill();


      ctx.strokeStyle=
        '#294158';


      ctx.lineWidth=2;


      ctx.stroke();


      /* =====================================================
         KWADRAT DETEKCJI 560 × 560
         ===================================================== */

      ctx.fillStyle=
        '#000';


      ctx.fillRect(
        DET_X,
        DET_Y,
        DET,
        DET
      );


      ctx.strokeStyle=
        '#294158';


      ctx.lineWidth=2;


      ctx.strokeRect(
        DET_X,
        DET_Y,
        DET,
        DET
      );


      if(
        currentImage?.complete &&
        currentImage.naturalWidth>0 &&
        currentImage.naturalHeight>0
      ){

        const scale=
          Math.min(

            DET/
            currentImage.naturalWidth,

            DET/
            currentImage.naturalHeight
          );


        const iw=
          currentImage
            .naturalWidth*
          scale;


        const ih=
          currentImage
            .naturalHeight*
          scale;


        ctx.imageSmoothingEnabled=
          false;


        ctx.drawImage(

          currentImage,

          DET_X+
          (
            DET-
            iw
          )/2,

          DET_Y+
          (
            DET-
            ih
          )/2,

          iw,
          ih
        );
      }


      /* =====================================================
         INFORMACJA O DETEKCJI
         ===================================================== */

      if(currentEvent){

        const pad=12;
        const boxH=62;


        const boxX=
          DET_X+
          pad;


        const boxY=
          DET_Y+
          DET-
          boxH-
          pad;


        const boxW=
          DET-
          2*pad;


        roundedRect(
          boxX,
          boxY,
          boxW,
          boxH,
          8
        );


        ctx.fillStyle=
          'rgba(5,14,23,.88)';


        ctx.fill();


        ctx.strokeStyle=
          '#294158';


        ctx.lineWidth=1;


        ctx.stroke();


        ctx.textAlign=
          'center';


        ctx.fillStyle=
          '#edf5fb';


        ctx.font=
          '15px sans-serif';


        ctx.fillText(
          String(
            currentEvent.timestamp
          ),
          DET_X+
          DET/2,
          boxY+25
        );


        ctx.font=
          '14px sans-serif';


        ctx.fillText(

          `${currentEvent.class} · `+
          `X ${currentEvent.x??'—'} · `+
          `Y ${currentEvent.y??'—'}`,

          DET_X+
          DET/2,
          boxY+48
        );
      }


      /* =====================================================
         MATRYCA 996 × 560
         ===================================================== */

      ctx.fillStyle=
        '#04101b';


      ctx.fillRect(
        MAP_X,
        MAP_Y,
        MAP_W,
        MAP_H
      );


      /*
        Siatka.

        16 pionowych pól
        9 poziomych pól,
        czyli proporcja zgodna z 16:9.
      */

      ctx.strokeStyle=
        'rgba(64,101,130,.55)';


      ctx.lineWidth=1;


      for(
        let i=0;
        i<=16;
        i++
      ){

        const x=
          MAP_X+
          MAP_W*
          i/16;


        ctx.beginPath();

        ctx.moveTo(
          x,
          MAP_Y
        );

        ctx.lineTo(
          x,
          MAP_Y+
          MAP_H
        );

        ctx.stroke();
      }


      for(
        let i=0;
        i<=9;
        i++
      ){

        const y=
          MAP_Y+
          MAP_H*
          i/9;


        ctx.beginPath();

        ctx.moveTo(
          MAP_X,
          y
        );

        ctx.lineTo(
          MAP_X+
          MAP_W,
          y
        );

        ctx.stroke();
      }


      /* =====================================================
         PUNKTY + FALE
         ===================================================== */

      for(
        const item of
        visible
      ){

        const e=
          item.event;


        if(
          !Number.isFinite(e.x) ||
          !Number.isFinite(e.y)
        ){
          continue;
        }


        const x=
          pxForX(
            e.x
          );


        const y=
          pyForY(
            e.y
          );


        ctx.fillStyle=
          color(
            e.class
          );


        ctx.beginPath();


        ctx.arc(
          x,
          y,
          4,
          0,
          Math.PI*2
        );


        ctx.fill();


        /*
          Ten sam sens fali co w zwykłym timelapse.
        */

        const arrival=

          (
            item.t-
            tl.start
          ) /

          Math.max(
            1,
            tl.end-
            tl.start
          ) *

          tl.duration;


        const age=
          tl.elapsed-
          arrival;


        if(
          age>=0 &&
          age<1800
        ){

          for(
            let ring=0;
            ring<2;
            ring++
          ){

            const phase=

              (
                age-
                ring*230
              ) /
              1570;


            if(
              phase<0 ||
              phase>1
            ){
              continue;
            }


            ctx.globalAlpha=
              0.28*
              (
                1-
                phase
              );


            ctx.strokeStyle=
              color(
                e.class
              );


            ctx.lineWidth=2;


            ctx.beginPath();


            ctx.arc(

              x,
              y,

              5+
              phase*32,

              0,
              Math.PI*2
            );


            ctx.stroke();
          }


          ctx.globalAlpha=1;
        }
      }


      /*
        Rama matrycy.
      */

      ctx.strokeStyle=
        '#294158';


      ctx.lineWidth=2;


      ctx.strokeRect(
        MAP_X,
        MAP_Y,
        MAP_W,
        MAP_H
      );


      /* =====================================================
         OSIE — WEWNĄTRZ MATRYCY
         ===================================================== */

      ctx.fillStyle=
        '#b9cfdf';


      ctx.font=
        '12px sans-serif';


      ctx.textAlign=
        'left';


      ctx.fillText(
        String(
          SENSOR_H
        ),
        MAP_X+7,
        MAP_Y+17
      );


      ctx.fillText(
        String(
          Math.round(
            SENSOR_H/2
          )
        ),
        MAP_X+7,
        MAP_Y+
        MAP_H/2+
        4
      );


      ctx.fillText(
        '1',
        MAP_X+7,
        MAP_Y+
        MAP_H-
        8
      );


      ctx.textAlign=
        'center';


      ctx.fillText(
        '1',
        MAP_X+10,
        MAP_Y+
        MAP_H-
        8
      );


      ctx.fillText(

        String(
          Math.round(
            SENSOR_W/2
          )
        ),

        MAP_X+
        MAP_W/2,

        MAP_Y+
        MAP_H-
        8
      );


      ctx.textAlign=
        'right';


      ctx.fillText(

        String(
          SENSOR_W
        ),

        MAP_X+
        MAP_W-
        7,

        MAP_Y+
        MAP_H-
        8
      );


      /* =====================================================
         TIMELINE — SZEROKOŚĆ RAMKI
         ===================================================== */

      const BAR_X=
        PANEL_X;


      const BAR_W=
        PANEL_W;


      const BAR_Y=
        PANEL_Y+
        PANEL_H+
        66;


      ctx.strokeStyle=
        '#516275';


      ctx.lineWidth=3;


      ctx.beginPath();


      ctx.moveTo(
        BAR_X,
        BAR_Y
      );


      ctx.lineTo(
        BAR_X+
        BAR_W,
        BAR_Y
      );


      ctx.stroke();


      ctx.strokeStyle=
        '#1597ff';


      ctx.lineWidth=5;


      ctx.beginPath();


      ctx.moveTo(
        BAR_X,
        BAR_Y
      );


      ctx.lineTo(

        BAR_X+
        BAR_W*
        progress,

        BAR_Y
      );


      ctx.stroke();


      const knobX=

        BAR_X+
        BAR_W*
        progress;


      ctx.beginPath();


      ctx.arc(
        knobX,
        BAR_Y,
        7,
        0,
        Math.PI*2
      );


      ctx.fillStyle=
        '#edf5fb';


      ctx.fill();


      ctx.strokeStyle=
        '#08121f';


      ctx.lineWidth=2;


      ctx.stroke();


      /* =====================================================
         DOLNY OPIS
         ===================================================== */

      ctx.fillStyle=
        '#edf5fb';


      ctx.font=
        '20px sans-serif';


      ctx.textAlign=
        'left';


      ctx.fillText(
        tlStamp(
          currentTime
        ),
        BAR_X,
        BAR_Y+46
      );


      ctx.textAlign=
        'right';


      ctx.fillText(

        `${visible.length} / `+
        `${tl.items.length} detekcji`,

        BAR_X+
        BAR_W,

        BAR_Y+46
      );


      ctx.textAlign=
        'left';
    };

  /* =========================================================
     PEŁNY PRELOAD PRZED ZAPISEM FILMU
     ========================================================= */

  let allowVideoAfterPreload=
    false;


  /*
    timelapse.js ma istniejący videoButton.onclick.

    Ten listener działa w CAPTURE, więc pierwszy
    klik przechwytujemy przed oryginalnym onclick.
  */

  videoButton.addEventListener(

    'click',

    async ev=>{

      /*
        Drugi, programowy klik po preloadzie
        musi już dotrzeć do oryginalnego onclick.
      */

      if(allowVideoAfterPreload){

        allowVideoAfterPreload=
          false;

        return;
      }


      if(recording){
        return;
      }


      ev.preventDefault();

      ev.stopImmediatePropagation();


      videoButton.disabled=
        true;


      videoInfo.textContent=
        'Przygotowanie zdjęć do filmu…';


      try{

        /*
          Oryginalny tl-start buduje tl.items
          zgodnie z Od / Do / Klasa.
        */

        $('tl-start').click();


        if(!tl.items.length){

          videoButton.disabled=
            false;

          videoInfo.textContent=
            'Brak detekcji w wybranym okresie.';

          return;
        }


        /*
          Zatrzymujemy odtwarzanie podczas preloadu.
        */

        tlStop();

        tl.elapsed=0;

        tlRender();


        const count=
          new Set(
            tl.items
              .filter(
                i=>i.event?.image
              )
              .map(
                i=>i.event.id
              )
          ).size;


        videoInfo.textContent=
          `Ładowanie ${count} zdjęć przed zapisem filmu…`;


        await preloadTlImages(
          tl.items
        );


        /*
          Wszystkie dostępne PNG są już w pamięci.
        */

        tl.elapsed=0;

        tlRender();


        allowVideoAfterPreload=
          true;


        videoButton.disabled=
          false;


        videoInfo.textContent=
          'Zdjęcia gotowe — rozpoczynam zapis filmu…';


        /*
          Drugi klik uruchamia istniejący
          MediaRecorder z timelapse.js.
        */

        videoButton.click();


      }catch(error){

        allowVideoAfterPreload=
          false;


        videoButton.disabled=
          false;


        videoInfo.textContent=
          'Nie udało się przygotować filmu: '+
          error.message;
      }

    },

    true
  );



  /* =========================================================
     TIMELAPSE — ZDARZENIA
     ========================================================= */

  const tlOpen=
    $('timelapse-open');


  tlOpen
    ?.addEventListener(
      'click',
      ()=>{

        setTimeout(
          ()=>{

            ensureTlStage();
            settleGeometry();
          },
          0
        );


        setTimeout(
          settleGeometry,
          100
        );
      }
    );


  $('tl-start')
    ?.addEventListener(
      'click',
      ()=>{

        setTimeout(
          ()=>{

            ensureTlStage();
            settleGeometry();
          },
          0
        );


        setTimeout(
          settleGeometry,
          100
        );
      }
    );


  $('tl-pause')
    ?.addEventListener(
      'click',
      settleGeometry
    );


  window.addEventListener(
    'resize',
    settleGeometry
  );


  new ResizeObserver(
    ()=>{

      if(
        $('timelapse')
          ?.open
      ){
        settleGeometry();
      }
    }
  ).observe(
    $('tl-canvas')
  );


  /* =========================================================
     GŁÓWNY RENDER
     ========================================================= */

  const baseRender=
    render;


  render=
    function(){

      baseRender();

      renderFavorites();

      arrangeToolbar();

      normalizeEventRows();


      if(heatDialog.open){

        requestAnimationFrame(
          drawHeatmap
        );
      }


      if(cmpDialog.open){

        requestAnimationFrame(
          runCompare
        );
      }
    };


  /* =========================================================
     START
     ========================================================= */

  arrangeToolbar();

  normalizeEventRows();

  renderFavorites();

  ensureTlStage();

})();


/* ============================================================
   CREDO_GIF_SERVER_UI_V10_9
   Przycisk GIF -> Mac -> Pillow -> gotowy plik.
   ============================================================ */

(()=>{
  'use strict';

  if(
    window.__CREDO_GIF_SERVER_UI_V10_9
  ){
    return;
  }

  window.__CREDO_GIF_SERVER_UI_V10_9=true;


  /*
    Gdyby DOM pochodził jeszcze ze starego JS
    po częściowym odświeżeniu, usuwamy stary przycisk.
  */
  document
    .getElementById('tl-gif')
    ?.remove();


  document
    .getElementById('tl-gif-info')
    ?.remove();


  const controls=
    document.querySelector(
      '.tl-controls'
    );


  if(!controls){
    console.error(
      'CREDO GIF: brak .tl-controls'
    );
    return;
  }


  const button=
    document.createElement(
      'button'
    );

  button.id='tl-gif';
  button.type='button';
  button.textContent='GIF';

  button.title=
    'Utwórz GIF — każda detekcja przez 1,0 sekundę';


  /*
    Umieszczamy GIF obok "Zapisz film".
  */
  const movieButton=
    [...controls.querySelectorAll('button')]
      .find(
        b=>
          b.textContent.trim()==='Zapisz film'
      );


  if(movieButton){
    movieButton.after(button);
  }else{
    controls.appendChild(button);
  }


  const info=
    document.createElement(
      'p'
    );

  info.id='tl-gif-info';
  info.className='muted';
  info.setAttribute(
    'role',
    'status'
  );


  const videoInfo=
    document.querySelector(
      '#timelapse .muted[role="status"]'
    );


  if(videoInfo){
    videoInfo.after(info);
  }else{
    document
      .getElementById('tl-message')
      ?.after(info);
  }


  button.addEventListener(
    'click',
    async()=>{

      const from=
        document
          .getElementById('tl-from')
          ?.value || '';

      const to=
        document
          .getElementById('tl-to')
          ?.value || '';


      if(
        !from ||
        !to
      ){
        info.textContent=
          'Wybierz zakres Od / Do.';

        return;
      }


      const params=
        new URLSearchParams();

      params.set(
        'from',
        from
      );

      params.set(
        'to',
        to
      );


      const cls=
        document
          .getElementById('filter-class')
          ?.value || '';


      if(cls){
        params.set(
          'class',
          cls
        );
      }


      button.disabled=true;

      const previous=
        button.textContent;

      button.textContent=
        'GIF…';

      info.textContent=
        'Mac tworzy GIF — 1,0 s na każdą detekcję…';


      try{

        const response=
          await fetch(
            '/export.gif?'+
            params.toString(),
            {
              method:'GET',
              cache:'no-store'
            }
          );


        if(!response.ok){

          let message=
            'HTTP '+response.status;

          try{
            const data=
              await response.json();

            if(data?.error){
              message=data.error;
            }
          }catch(_){}

          throw new Error(
            message
          );
        }


        const blob=
          await response.blob();


        if(
          !blob.size ||
          !String(blob.type)
            .includes('gif')
        ){
          throw new Error(
            'Serwer nie zwrócił prawidłowego GIF.'
          );
        }


        let filename=
          'CREDO.gif';


        const disposition=
          response.headers.get(
            'Content-Disposition'
          ) || '';


        const match=
          disposition.match(
            /filename="?([^";]+)"?/i
          );


        if(match?.[1]){
          filename=match[1];
        }


        const url=
          URL.createObjectURL(
            blob
          );


        const link=
          document.createElement(
            'a'
          );

        link.href=url;
        link.download=filename;

        document.body.appendChild(
          link
        );

        link.click();
        link.remove();


        setTimeout(
          ()=>URL.revokeObjectURL(url),
          30000
        );


        info.textContent=
          'GIF gotowy · '+
          (
            blob.size/
            1048576
          ).toFixed(1)+
          ' MB';


      }catch(error){

        console.error(
          'CREDO GIF',
          error
        );

        info.textContent=
          'Błąd GIF: '+
          (
            error?.message ||
            String(error)
          );


      }finally{

        button.disabled=false;
        button.textContent=previous;
      }
    }
  );

})();

/* ============================================================
   CREDO_RESEARCH_UI_V11
   ============================================================ */

(()=>{
'use strict';

if(window.__CREDO_RESEARCH_UI_V11){
    return;
}

window.__CREDO_RESEARCH_UI_V11=true;


/* ------------------------------------------------------------
   STYLE
   ------------------------------------------------------------ */

const style=document.createElement('style');

style.textContent=`

#credo-research-strip{
    display:flex;
    gap:10px;
    align-items:center;
    flex-wrap:wrap;
    padding:8px 11px;
    margin:8px 0;
    border:1px solid #20364b;
    border-radius:9px;
    background:#091623;
    color:#bcd0df;
    font-size:13px;
}

#credo-research-strip strong{
    color:#edf5fb;
}

#credo-research-dialog{
    width:min(1180px,96vw);
    height:min(850px,94dvh);
    max-width:none;
    max-height:none;
    padding:0;
    overflow:hidden;
}

#credo-research-dialog[open]{
    display:flex;
    flex-direction:column;
}

#credo-research-dialog > header{
    display:flex;
    align-items:center;
    gap:16px;
    padding:16px 18px;
    border-bottom:1px solid #20364b;
}

#credo-research-dialog > header h2{
    margin:0;
    flex:1;
}

.credo-research-tabs{
    display:flex;
    gap:8px;
    flex-wrap:wrap;
    padding:12px 18px;
    border-bottom:1px solid #20364b;
}

.credo-research-tabs button.active{
    outline:2px solid #1597ff;
}

.credo-research-body{
    flex:1;
    overflow:auto;
    padding:18px;
}

.research-grid{
    display:grid;
    grid-template-columns:
        repeat(auto-fit,minmax(210px,1fr));
    gap:12px;
    margin:12px 0 20px;
}

.research-card{
    border:1px solid #20364b;
    border-radius:10px;
    padding:14px;
    background:#091623;
}

.research-card b{
    display:block;
    font-size:22px;
    margin-top:7px;
}

.research-table{
    width:100%;
    border-collapse:collapse;
    font-size:13px;
}

.research-table th,
.research-table td{
    padding:7px;
    border-bottom:1px solid #20364b;
    vertical-align:top;
}

.research-event{
    cursor:pointer;
    text-decoration:underline;
}

.research-good{
    color:#68d391;
}

.research-warn{
    color:#f6c85f;
}

.research-muted{
    color:#8fa8bb;
}

.research-score{
    font-size:18px;
    font-weight:bold;
}

@media(max-width:700px){
    #credo-research-dialog{
        width:100vw;
        height:100dvh;
        margin:0;
        border-radius:0;
    }
}

`;

document.head.appendChild(style);


/* ------------------------------------------------------------
   HELPERS
   ------------------------------------------------------------ */

function rEsc(value){
    return String(value??'')
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;')
        .replaceAll('"','&quot;')
        .replaceAll("'",'&#039;');
}


function fmt(value,digits=2){
    const n=Number(value);

    if(!Number.isFinite(n)){
        return '—';
    }

    return n.toFixed(digits);
}


function scaleText(name,data){
    const value=
        data?.scale;

    if(
        value===null ||
        value===undefined ||
        value===''
    ){
        return `${name}—`;
    }

    return `${name}${value}`;
}


function eventLink(id,text){
    if(!id){
        return rEsc(text);
    }

    return `
        <span
            class="research-event"
            data-research-id="${rEsc(id)}"
        >${rEsc(text)}</span>
    `;
}


/* ------------------------------------------------------------
   BADANIA BUTTON
   ------------------------------------------------------------ */

const researchButton=
    document.createElement('button');

researchButton.type='button';
researchButton.id='credo-research-open';
researchButton.textContent='BADANIA';


const buttons=[
    ...document.querySelectorAll('button')
];

const anchor=
    buttons.find(
        b=>/ulubione/i.test(
            b.textContent||''
        )
    )
    ||
    buttons.find(
        b=>/porówn/i.test(
            b.textContent||''
        )
    )
    ||
    buttons.find(
        b=>/heat/i.test(
            b.textContent||''
        )
    );


if(anchor){
    anchor.after(
        researchButton
    );
}else{
    const host=
        document.querySelector('main header')
        || document.querySelector('main');

    host?.appendChild(
        researchButton
    );
}


/* ------------------------------------------------------------
   CURRENT SPACE WEATHER STRIP
   ------------------------------------------------------------ */

const strip=
    document.createElement('div');

strip.id='credo-research-strip';

strip.innerHTML=
    '<strong>◌ Pogoda kosmiczna</strong> · pobieranie NOAA…';


const main=
    document.querySelector('main');

if(main){
    const firstSection=
        main.querySelector('section');

    if(firstSection){
        firstSection.before(strip);
    }else{
        main.prepend(strip);
    }
}


/* ------------------------------------------------------------
   DIALOG
   ------------------------------------------------------------ */

const dialog=
    document.createElement('dialog');

dialog.id=
    'credo-research-dialog';

dialog.innerHTML=`
<header>
    <h2>BADANIA CREDO</h2>
    <span id="research-status" class="research-muted"></span>
    <button id="research-refresh">Odśwież</button>
    <button id="research-close">Zamknij ✕</button>
</header>

<div class="credo-research-tabs">
    <button data-tab="coincidences" class="active">
        Koincydencje
    </button>

    <button data-tab="space">
        Pogoda kosmiczna
    </button>

    <button data-tab="network">
        Sieć CREDO
    </button>

    <button data-tab="candidates">
        Kandydaci
    </button>

    <button data-tab="unusual">
        Nietypowe
    </button>

    <button data-tab="baseline">
        Baseline
    </button>

    <button data-tab="journal">
        Journal
    </button>

    <button data-tab="trace">
        Trace
    </button>
</div>

<div
    id="research-body"
    class="credo-research-body"
>
    Ładowanie…
</div>
`;

document.body.appendChild(
    dialog
);

const body=
    dialog.querySelector(
        '#research-body'
    );

const statusText=
    dialog.querySelector(
        '#research-status'
    );

let researchData=null;
let currentTab='coincidences';


/* ------------------------------------------------------------
   RENDER: COINCIDENCES
   ------------------------------------------------------------ */

function renderCoincidences(){

    /*
     * CREDO_COINCIDENCES_DASHBOARD_V17_FIXED
     * CREDO_COINCIDENCES_TOOLTIP_V17_1
     * CREDO_COINCIDENCES_VISUAL_V17_2
     * CREDO_COINCIDENCES_AXIS_LABELS_V17_2_1
     * CREDO_COINCIDENCES_AUDIT_UI_V18
     */

    const c=
        researchData?.coincidences
        ||{};

    const pairs=
        Array.isArray(c.pairs)
        ?
        c.pairs
        :
        [];


    function eventInfo(value){

        const x=
            (
                value
                &&
                typeof value==='object'
            )
            ?
            value
            :
            {};

        return {
            id:
                x.id
                ??
                x.digest
                ??
                x.event_id
                ??
                null,

            timestamp:
                x.timestamp
                ??
                x.time
                ??
                x.datetime
                ??
                '—',

            cls:
                String(
                    x.class
                    ??
                    x.cls
                    ??
                    x.type
                    ??
                    '—'
                )
                .toUpperCase()
        };
    }


    function deltaMs(pair){

        const n=
            Number(
                pair?.delta_ms
            );

        return Number.isFinite(n)
            ?
            Math.abs(n)
            :
            null;
    }


    function bucket(delta){

        if(delta===0){
            return 'WSPÓLNY TIMESTAMP';
        }

        if(delta<=10){
            return '1–10 ms';
        }

        if(delta<=100){
            return '10–100 ms';
        }

        if(delta<=1000){
            return '100 ms–1 s';
        }

        if(delta<=10000){
            return '1–10 s';
        }

        return '>10 s';
    }


    function deltaText(delta){

        if(delta===null){
            return '—';
        }

        if(delta===0){
            return '0.000 ms';
        }

        if(delta<1000){
            return (
                delta<10
                ?
                delta.toFixed(3)
                :
                delta.toFixed(1)
            )+' ms';
        }

        return (
            delta/1000
        ).toFixed(3)+' s';
    }


    function timestampNumber(text){

        if(!text){
            return null;
        }

        const m=
            String(text)
            .match(
                /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?/
            );

        if(!m){
            return null;
        }

        const ms=
            Number(
                String(
                    m[7]||''
                )
                .padEnd(
                    3,
                    '0'
                )
                .slice(
                    0,
                    3
                )
            )
            ||0;

        return Date.UTC(
            Number(m[1]),
            Number(m[2])-1,
            Number(m[3]),
            Number(m[4]),
            Number(m[5]),
            Number(m[6]),
            ms
        );
    }


    const normalized=
        pairs
        .map(
            pair=>{

                const a=
                    eventInfo(
                        pair?.a
                    );

                const b=
                    eventInfo(
                        pair?.b
                    );

                const delta=
                    deltaMs(
                        pair
                    );

                return {
                    pair,
                    a,
                    b,
                    delta,
                    time:
                        timestampNumber(
                            a.timestamp
                        )
                };
            }
        )
        .filter(
            x=>
                x.delta!==null
        )
        .sort(
            (a,b)=>
                (
                    a.time||0
                )
                -
                (
                    b.time||0
                )
        );


    const ranges=[
        {
            label:'WSPÓLNY TIMESTAMP',
            cls:'blue',
            count:0
        },
        {
            label:'1–10 ms',
            cls:'green',
            count:0
        },
        {
            label:'10–100 ms',
            cls:'yellow',
            count:0
        },
        {
            label:'100 ms–1 s',
            cls:'orange',
            count:0
        },
        {
            label:'1–10 s',
            cls:'red',
            count:0
        }
    ];


    const rangeMap=
        Object.fromEntries(
            ranges.map(
                x=>[
                    x.label,
                    x
                ]
            )
        );


    normalized.forEach(
        x=>{

            const name=
                bucket(
                    x.delta
                );

            if(rangeMap[name]){
                rangeMap[name].count++;
            }
        }
    );


    const classCounts=
        new Map();


    normalized.forEach(
        x=>{

            const classes=
                [
                    x.a.cls,
                    x.b.cls
                ]
                .sort();

            const name=
                classes.join(
                    ' + '
                );

            classCounts.set(
                name,
                (
                    classCounts.get(name)
                    ||0
                )
                +1
            );
        }
    );


    const classRows=
        [...classCounts.entries()]
        .sort(
            (a,b)=>
                b[1]-a[1]
        )
        .slice(
            0,
            6
        );


    function eventHTML(ev){

        if(
            ev.id
            &&
            typeof eventLink==='function'
        ){
            return eventLink(
                ev.id,
                ev.timestamp
            );
        }

        return rEsc(
            ev.timestamp
        );
    }


    /*
     * CREDO_COINCIDENCES_AUDIT_UI_V18
     *
     * Audyt korzysta wyłącznie z danych już obecnych
     * w researchData.coindidences.
     *
     * Nie interpretuje zbieżności jako wspólnego
     * pochodzenia zdarzeń.
     */

    function coincidenceAuditHTML(x){

        const delta=
            Number(
                x?.delta
            );


        if(!Number.isFinite(delta)){
            return '';
        }


        const range=
            bucket(delta);


        let rule='';


        if(delta===0){

            rule=
                'Oba zdarzenia mają identyczny timestamp w danych CREDO.';

        }else if(delta<=10){

            rule=
                'Różnica czasu jest większa od 0 ms i nie przekracza 10 ms.';

        }else if(delta<=100){

            rule=
                'Różnica czasu jest większa od 10 ms i nie przekracza 100 ms.';

        }else if(delta<=1000){

            rule=
                'Różnica czasu jest większa od 100 ms i nie przekracza 1 s.';

        }else{

            rule=
                'Różnica czasu jest większa od 1 s i nie przekracza 10 s.';
        }


        const aTime=
            x?.a?.timestamp
            ??'—';

        const bTime=
            x?.b?.timestamp
            ??'—';

        const aClass=
            x?.a?.cls
            ??'—';

        const bClass=
            x?.b?.cls
            ??'—';


        return `

        <details style="
            margin-top:7px;
        ">

            <summary style="
                display:inline-block;
                cursor:pointer;
                user-select:none;
                padding:4px 8px;
                border:1px solid #4c6b86;
                border-radius:7px;
                background:#182b3a;
                color:#d9ecff;
                font-size:11px;
                font-weight:700;
            ">
                Dlaczego?
            </summary>


            <div style="
                margin-top:8px;
                width:520px;
                max-width:68vw;
                padding:11px;
                border:1px solid #344b60;
                border-radius:8px;
                background:#101b25;
                color:#dce7f1;
                font-size:12px;
                line-height:1.4;
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    gap:16px;
                    margin-bottom:10px;
                ">

                    <div>

                        <strong>
                            Audit Trail koincydencji
                        </strong>

                        <div style="
                            margin-top:3px;
                            color:#91a9bd;
                            font-size:11px;
                        ">
                            kwalifikacja wyłącznie na podstawie Δt
                        </div>

                    </div>


                    <div style="
                        text-align:right;
                    ">

                        <div style="
                            font-size:17px;
                            font-weight:800;
                        ">
                            ${rEsc(
                                deltaText(delta)
                            )}
                        </div>

                        <div style="
                            color:#91a9bd;
                            font-size:11px;
                        ">
                            ${rEsc(range)}
                        </div>

                    </div>

                </div>


                <div style="
                    display:grid;
                    grid-template-columns:1fr 1fr;
                    gap:8px;
                ">

                    <div style="
                        padding:8px 9px;
                        border:1px solid #30475b;
                        border-radius:7px;
                    ">

                        <strong>
                            Zdarzenie A
                        </strong>

                        <div style="
                            margin-top:4px;
                            color:#b8c8d6;
                        ">
                            ${rEsc(String(aTime))}
                        </div>

                        <div style="
                            margin-top:2px;
                            color:#8fa6b9;
                        ">
                            klasa:
                            ${rEsc(String(aClass))}
                        </div>

                    </div>


                    <div style="
                        padding:8px 9px;
                        border:1px solid #30475b;
                        border-radius:7px;
                    ">

                        <strong>
                            Zdarzenie B
                        </strong>

                        <div style="
                            margin-top:4px;
                            color:#b8c8d6;
                        ">
                            ${rEsc(String(bTime))}
                        </div>

                        <div style="
                            margin-top:2px;
                            color:#8fa6b9;
                        ">
                            klasa:
                            ${rEsc(String(bClass))}
                        </div>

                    </div>

                </div>


                <div style="
                    margin-top:10px;
                    padding:8px 9px;
                    border:1px solid #30475b;
                    border-radius:7px;
                    background:#13202b;
                ">

                    <strong>
                        Dlaczego ten przedział?
                    </strong>

                    <div style="
                        margin-top:4px;
                        color:#b8c8d6;
                    ">
                        ${rEsc(rule)}
                    </div>

                </div>


                <div style="
                    margin-top:10px;
                    color:#8fa6b9;
                    font-size:11px;
                ">
                    Para znajduje się na liście, ponieważ
                    |Δt| ≤ 10 s.
                    Jest to zbieżność czasowa.
                    Sama w sobie nie dowodzi wspólnego
                    źródła ani związku przyczynowego.
                </div>

            </div>

        </details>
        `;
    }


    const rows=
        normalized
        .filter(
            x=>
                x.delta<=10000
        )
        .map(
            (x,i)=>`

<tr>

<td>${i+1}</td>

<td>
    <strong>
        ${rEsc(deltaText(x.delta))}
    </strong>
</td>

<td>
    ${eventHTML(x.a)}
    <br>
    <small>${rEsc(x.a.cls)}</small>
</td>

<td>
    ${eventHTML(x.b)}
    <br>
    <small>${rEsc(x.b.cls)}</small>
</td>

<td>
    ${rEsc(
        [
            x.a.cls,
            x.b.cls
        ]
        .sort()
        .join(' + ')
    )}
</td>

<td>
    <span class="c17-chip">
        ${rEsc(bucket(x.delta))}
    </span>

    ${coincidenceAuditHTML(x)}
</td>

</tr>

`
        )
        .join('');


    if(
        !document.getElementById(
            'c17-fixed-style'
        )
    ){

        const style=
            document.createElement(
                'style'
            );

        style.id=
            'c17-fixed-style';

        style.textContent=`

#c17{
    display:flex;
    flex-direction:column;
    gap:12px;
}

#c17 *{
    box-sizing:border-box;
}

#c17 .c17-muted{
    color:#95aabd;
    font-size:10px;
    line-height:1.45;
}

#c17 .c17-kpis{
    display:grid;
    grid-template-columns:repeat(5,minmax(0,1fr));
    gap:9px;
}

#c17 .c17-kpi{
    min-height:88px;
    padding:12px;
    border-radius:9px;
    background:#071a28;
    border:1px solid #294b64;
}

#c17 .c17-kpi.blue{
    border-color:#2699e8;
}

#c17 .c17-kpi.green{
    border-color:#3cc57a;
}

#c17 .c17-kpi.yellow{
    border-color:#d5b333;
}

#c17 .c17-kpi.orange{
    border-color:#dc8036;
}

#c17 .c17-kpi.red{
    border-color:#d24a57;
}

#c17 .c17-kpi span{
    display:block;
    color:#adc0cc;
    font-size:9px;
    font-weight:700;
}

#c17 .c17-kpi b{
    display:block;
    margin-top:8px;
    font-size:25px;
    color:#f1f7fb;
}

#c17 .c17-kpi small{
    display:block;
    margin-top:4px;
    color:#7d95a4;
    font-size:8px;
}

#c17 .c17-grid{
    display:grid;
    grid-template-columns:1fr 1fr 1fr;
    gap:9px;
}

#c17 .c17-card{
    min-width:0;
    padding:11px;
    border:1px solid #284d65;
    border-radius:9px;
    background:#071925;
}

#c17 .c17-card h4{
    margin:0;
    font-size:11px;
    color:#e7f0f5;
}

#c17 .c17-card p{
    margin:3px 0 8px 0;
    color:#738b9b;
    font-size:8px;
}

#c17 canvas{
    display:block;
    width:100%;
    height:190px;
}

#c17 #c17-scatter{
    height:180px;
}

#c17 .c17-table-wrap{
    max-height:300px;
    overflow:auto;
    border:1px solid #27485e;
    border-radius:8px;
}

#c17 table{
    width:100%;
    border-collapse:collapse;
    font-size:9px;
}

#c17 th{
    position:sticky;
    top:0;
    z-index:2;
    padding:7px;
    background:#0a2232;
    color:#cbd9e2;
    text-align:left;
}

#c17 td{
    padding:7px;
    border-top:1px solid #1d3b4f;
    color:#bccdd7;
    vertical-align:top;
}

#c17 tbody tr:nth-child(even){
    background:rgba(38,77,101,.16);
}

#c17 .c17-chip{
    display:inline-block;
    padding:2px 7px;
    border:1px solid #33799d;
    border-radius:999px;
    color:#68c7ef;
    white-space:nowrap;
    font-size:8px;
}

#c17 .c17-info{
    padding:11px 13px;
    border:1px solid #2a5067;
    border-radius:9px;
    background:#0a2131;
    color:#99afbd;
    font-size:9px;
    line-height:1.5;
}

#c17 .c17-info strong{
    color:#e8f1f6;
}

#c17 .c17-scatter-wrap{
    position:relative;
}

#c17 .c17-tooltip{
    position:absolute;
    z-index:50;
    width:310px;
    max-width:calc(100% - 12px);
    padding:10px 11px;
    border:1px solid #3b799d;
    border-radius:9px;
    background:rgba(5,20,31,.98);
    box-shadow:0 10px 30px rgba(0,0,0,.48);
    color:#c9d9e3;
    font-size:9px;
    line-height:1.45;
}

#c17 .c17-tooltip[hidden]{
    display:none;
}

#c17 .c17-tip-head{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:10px;
    padding-bottom:6px;
    margin-bottom:7px;
    border-bottom:1px solid #25485e;
}

#c17 .c17-tip-delta{
    color:#65ceff;
    font-size:14px;
    font-weight:800;
}

#c17 .c17-tip-range{
    border:1px solid #397c9d;
    border-radius:999px;
    padding:2px 7px;
    color:#78d5ff;
    font-size:7px;
    white-space:nowrap;
}

#c17 .c17-tip-event{
    display:grid;
    grid-template-columns:20px 1fr;
    gap:7px;
    margin-top:7px;
}

#c17 .c17-tip-letter{
    display:flex;
    align-items:center;
    justify-content:center;
    width:20px;
    height:20px;
    border-radius:50%;
    background:#193a4f;
    color:#fff;
    font-size:8px;
    font-weight:800;
}

#c17 .c17-tip-event small{
    display:block;
    color:#819aaa;
    margin-top:2px;
}

#c17 .c17-tip-foot{
    margin-top:8px;
    padding-top:6px;
    border-top:1px solid #25485e;
    color:#768e9e;
    font-size:7px;
}

#c17 #c17-scatter{
    cursor:crosshair;
}

#c17 #c17-hist{
    height:210px;
}

@media(max-width:1000px){

    #c17 .c17-kpis{
        grid-template-columns:repeat(2,minmax(0,1fr));
    }

    #c17 .c17-grid{
        grid-template-columns:1fr;
    }
}

`;

        document.head.appendChild(
            style
        );
    }


    body.innerHTML=`

<div id="c17">

    <div>

        <h3 style="margin-bottom:3px">
            Koincydencje czasowe
        </h3>

        <div class="c17-muted">

            Analiza rzeczywistych par zwracanych przez
            <code>researchData.coincidences.pairs</code>.

            Wspólny timestamp oznacza identyczny zapis czasu
            dwóch różnych detekcji.

            Nie jest automatycznie dowodem wspólnego
            zdarzenia fizycznego.

        </div>

    </div>


    <div class="c17-kpis">

        ${
            ranges.map(
                r=>`

                <div class="c17-kpi ${r.cls}">

                    <span>
                        ${rEsc(r.label)}
                    </span>

                    <b>
                        ${r.count}
                    </b>

                    <small>
                        ${
                            r.label==='WSPÓLNY TIMESTAMP'
                            ?
                            'Δt = 0.000 ms'
                            :
                            'par detekcji'
                        }
                    </small>

                </div>

                `
            )
            .join('')
        }

    </div>


    <div class="c17-grid">

        <section class="c17-card">

            <h4>
                Rozkład różnicy czasu Δt
            </h4>

            <p>
                liczba par w pięciu zakresach czasowych
            </p>

            <canvas id="c17-hist"></canvas>

        </section>


        <section class="c17-card">

            <h4>
                Koincydencje w czasie
            </h4>

            <p>
                kiedy w archiwum występowały pary ≤10 s
            </p>

            <canvas id="c17-time"></canvas>

        </section>


        <section class="c17-card">

            <h4>
                Pary klas detekcji
            </h4>

            <p>
                najczęstsze kombinacje SPOT / TRACK / WORM
            </p>

            <canvas id="c17-classes"></canvas>

        </section>

    </div>


    <section class="c17-card">

        <h4>
            Różnica czasu Δt w czasie
        </h4>

        <p>
            każdy punkt oznacza jedną parę;
            oś pionowa pokazuje skalę od 0 ms do 10 s
        </p>

        <div class="c17-scatter-wrap">

            <canvas id="c17-scatter"></canvas>

            <div
              id="c17-scatter-tip"
              class="c17-tooltip"
              hidden
            ></div>

        </div>

        <div class="c17-sub" style="margin-top:6px">
            Najedź na punkt → szczegóły.
            Kliknij punkt → przypnij.
            Kliknij puste miejsce → zamknij.
        </div>

    </section>


    <section class="c17-card">

        <h4 style="margin-bottom:8px">
            Lista par do dalszej analizy
        </h4>

        <div class="c17-table-wrap">

            <table>

                <thead>
                    <tr>
                        <th>#</th>
                        <th>Δt</th>
                        <th>Detekcja A</th>
                        <th>Detekcja B</th>
                        <th>Klasy</th>
                        <th>Zakres</th>
                    </tr>
                </thead>

                <tbody>
                    ${
                        rows
                        ||
                        `
                        <tr>
                            <td colspan="6">
                                Brak par ≤10 s.
                            </td>
                        </tr>
                        `
                    }
                </tbody>

            </table>

        </div>

    </section>


    <div class="c17-info">

        <strong>
            Interpretacja:
        </strong>

        małe Δt jest tylko kandydatem do dalszej analizy
        czasowej.

        Przy kamerach pracujących około kilkudziesięciu
        klatek na sekundę dokładność czasu samej akwizycji
        ogranicza interpretację bardzo małych różnic.

        Potwierdzenie przez inne urządzenia CREDO będzie
        znacznie silniejszym kryterium niż sama para
        znaleziona w lokalnym archiwum.

    </div>

</div>

`;


    function prepareCanvas(id){

        const el=
            document.getElementById(id);

        if(!el){
            return null;
        }

        const rect=
            el.getBoundingClientRect();

        const w=
            Math.max(
                100,
                rect.width
            );

        const h=
            Math.max(
                100,
                rect.height
            );

        const dpr=
            window.devicePixelRatio
            ||1;

        el.width=
            Math.round(
                w*dpr
            );

        el.height=
            Math.round(
                h*dpr
            );

        const ctx=
            el.getContext('2d');

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        ctx.fillStyle=
            '#071925';

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        return {
            ctx,
            w,
            h
        };
    }


    function grid(
        ctx,
        left,
        top,
        width,
        height,
        rows=4
    ){

        ctx.strokeStyle=
            '#18384b';

        ctx.lineWidth=1;

        for(let i=0;i<=rows;i++){

            const y=
                top
                +height*i/rows;

            ctx.beginPath();

            ctx.moveTo(
                left,
                y
            );

            ctx.lineTo(
                left+width,
                y
            );

            ctx.stroke();
        }
    }


    /*
     * 1. HISTOGRAM
     */

    {
        const c=
            prepareCanvas(
                'c17-hist'
            );

        if(c){

            const {
                ctx,
                w,
                h
            }=c;

            const values=
                ranges.map(
                    x=>x.count
                );

            const labels=[
                '0 ms',
                '1–10 ms',
                '10–100 ms',
                '100 ms–1 s',
                '1–10 s'
            ];

            const colors=[
                '#359bea',
                '#48c982',
                '#d9b838',
                '#df843a',
                '#d64e5b'
            ];

            const left=35;
            const right=8;
            const top=15;
            const bottom=42;

            const width=
                w-left-right;

            const height=
                h-top-bottom;

            grid(
                ctx,
                left,
                top,
                width,
                height
            );

            const max=
                Math.max(
                    1,
                    ...values
                );


            /*
             * V17.2 — czytelna oś liczby par.
             */

            ctx.fillStyle=
                '#8fa6b5';

            ctx.font=
                '8px system-ui';

            ctx.textAlign=
                'right';


            for(const fraction of [0,0.5,1]){

                const value=
                    Math.round(
                        max*fraction
                    );

                const y=
                    top+height
                    -fraction*height;


                ctx.fillText(
                    String(value),
                    left-7,
                    y+3
                );
            }


            const slot=
                width/values.length;

            values.forEach(
                (value,i)=>{

                    const bw=
                        slot*.58;

                    const bh=
                        value/max*height;

                    const x=
                        left
                        +i*slot
                        +(slot-bw)/2;

                    const y=
                        top+height-bh;

                    ctx.fillStyle=
                        colors[i];

                    ctx.fillRect(
                        x,
                        y,
                        bw,
                        bh
                    );

                    ctx.fillStyle=
                        '#e2edf3';

                    ctx.font=
                        '9px system-ui';

                    ctx.textAlign=
                        'center';

                    ctx.fillText(
                        String(value),
                        x+bw/2,
                        Math.max(
                            top+10,
                            y-4
                        )
                    );

                    /*
                     * V17.2.1 — pełny zakres i jednostka
                     * w jednym wierszu.
                     */

                    ctx.fillStyle=
                        '#c2d2db';

                    ctx.font=
                        '8px system-ui';

                    ctx.fillText(
                        labels[i],
                        x+bw/2,
                        h-13
                    );
                }
            );

            ctx.textAlign=
                'left';
        }
    }


    /*
     * 2. KOINCYDENCJE W CZASIE
     */

    {
        const c=
            prepareCanvas(
                'c17-time'
            );

        if(c){

            const {
                ctx,
                w,
                h
            }=c;

            const usable=
                normalized.filter(
                    x=>
                        x.delta<=10000
                        &&
                        Number.isFinite(
                            x.time
                        )
                );

            if(usable.length){

                const min=
                    Math.min(
                        ...usable.map(
                            x=>x.time
                        )
                    );

                const max=
                    Math.max(
                        ...usable.map(
                            x=>x.time
                        )
                    );

                const hour=
                    3600000;

                const start=
                    Math.floor(
                        min/hour
                    )
                    *hour;

                const end=
                    Math.ceil(
                        (max+1)/hour
                    )
                    *hour;

                const hours=
                    Math.max(
                        1,
                        Math.ceil(
                            (end-start)/hour
                        )
                    );

                const exact=
                    new Array(hours)
                    .fill(0);

                const near=
                    new Array(hours)
                    .fill(0);

                usable.forEach(
                    x=>{

                        const i=
                            Math.min(
                                hours-1,
                                Math.max(
                                    0,
                                    Math.floor(
                                        (x.time-start)/hour
                                    )
                                )
                            );

                        if(x.delta===0){
                            exact[i]++;
                        }else{
                            near[i]++;
                        }
                    }
                );

                const left=27;
                const right=8;
                const top=12;
                const bottom=28;

                const width=
                    w-left-right;

                const height=
                    h-top-bottom;

                grid(
                    ctx,
                    left,
                    top,
                    width,
                    height
                );

                const vmax=
                    Math.max(
                        1,
                        ...exact,
                        ...near
                    );

                const slot=
                    width/hours;

                const bw=
                    Math.max(
                        1,
                        Math.min(
                            5,
                            slot*.33
                        )
                    );

                for(let i=0;i<hours;i++){

                    const x=
                        left
                        +(i+.5)*slot;

                    const h1=
                        exact[i]/vmax*height;

                    const h2=
                        near[i]/vmax*height;

                    ctx.fillStyle=
                        '#349be9';

                    ctx.fillRect(
                        x-bw-1,
                        top+height-h1,
                        bw,
                        h1
                    );

                    ctx.fillStyle=
                        '#49c986';

                    ctx.fillRect(
                        x+1,
                        top+height-h2,
                        bw,
                        h2
                    );
                }

                ctx.fillStyle=
                    '#8097a6';

                ctx.font=
                    '7px system-ui';

                ctx.textAlign=
                    'center';

                for(let j=0;j<5;j++){

                    const i=
                        Math.round(
                            j*(hours-1)/4
                        );

                    const d=
                        new Date(
                            start+i*hour
                        );

                    const label=
                        String(
                            d.getUTCDate()
                        )
                        .padStart(
                            2,
                            '0'
                        )
                        +'.'
                        +String(
                            d.getUTCMonth()+1
                        )
                        .padStart(
                            2,
                            '0'
                        )
                        +' '
                        +String(
                            d.getUTCHours()
                        )
                        .padStart(
                            2,
                            '0'
                        );

                    ctx.fillText(
                        label,
                        left+(i+.5)*slot,
                        h-8
                    );
                }

                ctx.textAlign=
                    'left';
            }
        }
    }


    /*
     * 3. KLASY
     */

    {
        const c=
            prepareCanvas(
                'c17-classes'
            );

        if(c){

            const {
                ctx,
                w,
                h
            }=c;

            const max=
                Math.max(
                    1,
                    ...classRows.map(
                        x=>x[1]
                    )
                );

            const left=
                Math.min(
                    105,
                    w*.42
                );

            const right=22;
            const top=8;
            const bottom=8;

            const width=
                w-left-right;

            const height=
                h-top-bottom;

            const slot=
                height/
                Math.max(
                    1,
                    classRows.length
                );

            classRows.forEach(
                ([label,value],i)=>{

                    const bh=
                        slot*.52;

                    const y=
                        top
                        +i*slot
                        +slot*.2;

                    const bw=
                        value/max*width;

                    ctx.fillStyle=
                        '#399fe3';

                    ctx.fillRect(
                        left,
                        y,
                        bw,
                        bh
                    );

                    ctx.fillStyle=
                        '#adc0cb';

                    ctx.font=
                        '8px system-ui';

                    ctx.textAlign=
                        'right';

                    ctx.fillText(
                        label,
                        left-6,
                        y+bh*.72
                    );

                    ctx.fillStyle=
                        '#e2edf3';

                    ctx.textAlign=
                        'left';

                    ctx.fillText(
                        String(value),
                        Math.min(
                            w-10,
                            left+bw+5
                        ),
                        y+bh*.72
                    );
                }
            );

            ctx.textAlign=
                'left';
        }
    }


    /*
     * 4. DELTA W CZASIE
     */

    {
        const c=
            prepareCanvas(
                'c17-scatter'
            );

        if(c){

            const {
                ctx,
                w,
                h
            }=c;

            const usable=
                normalized.filter(
                    x=>
                        x.delta<=10000
                        &&
                        Number.isFinite(
                            x.time
                        )
                );

            if(usable.length){

                const hitPoints=[];

                const min=
                    Math.min(
                        ...usable.map(
                            x=>x.time
                        )
                    );

                const max=
                    Math.max(
                        ...usable.map(
                            x=>x.time
                        )
                    );

                const span=
                    Math.max(
                        1,
                        max-min
                    );

                const left=48;
                const right=10;
                const top=10;
                const bottom=28;

                const width=
                    w-left-right;

                const height=
                    h-top-bottom;

                const levels=[
                    [0,'0'],
                    [1,'1 ms'],
                    [2,'10 ms'],
                    [3,'100 ms'],
                    [4,'1 s'],
                    [5,'10 s']
                ];

                levels.forEach(
                    ([level,label])=>{

                        const y=
                            top+height
                            -level/5*height;

                        ctx.strokeStyle=
                            '#19394c';

                        ctx.beginPath();

                        ctx.moveTo(
                            left,
                            y
                        );

                        ctx.lineTo(
                            left+width,
                            y
                        );

                        ctx.stroke();

                        ctx.fillStyle=
                            '#8198a7';

                        ctx.font=
                            '7px system-ui';

                        ctx.textAlign=
                            'right';

                        ctx.fillText(
                            label,
                            left-6,
                            y+2
                        );
                    }
                );

                usable.forEach(
                    x=>{

                        const px=
                            left
                            +(x.time-min)/span
                            *width;

                        let level=0;

                        if(x.delta>0){

                            level=
                                Math.max(
                                    1,
                                    Math.min(
                                        5,
                                        Math.log10(
                                            Math.max(
                                                1,
                                                x.delta
                                            )
                                        )
                                        +1
                                    )
                                );
                        }

                        const py=
                            top+height
                            -level/5*height;

                        ctx.fillStyle=
                            x.delta===0
                            ?
                            '#349bea'
                            :
                            x.delta<=100
                            ?
                            '#48c985'
                            :
                            x.delta<=1000
                            ?
                            '#d7b83c'
                            :
                            '#dc5660';

                        ctx.beginPath();

                        ctx.arc(
                            px,
                            py,
                            2.8,
                            0,
                            Math.PI*2
                        );

                        ctx.fill();

                        hitPoints.push({
                            px,
                            py,
                            item:x
                        });
                    }
                );

                ctx.fillStyle=
                    '#8198a7';

                ctx.font=
                    '7px system-ui';

                ctx.textAlign=
                    'center';

                for(let i=0;i<5;i++){

                    const t=
                        min+span*i/4;

                    const d=
                        new Date(t);

                    const label=
                        String(
                            d.getUTCDate()
                        )
                        .padStart(
                            2,
                            '0'
                        )
                        +'.'
                        +String(
                            d.getUTCMonth()+1
                        )
                        .padStart(
                            2,
                            '0'
                        )
                        +' '
                        +String(
                            d.getUTCHours()
                        )
                        .padStart(
                            2,
                            '0'
                        );

                    ctx.fillText(
                        label,
                        left+width*i/4,
                        h-8
                    );
                }

                ctx.textAlign=
                    'left';


                const canvasEl=
                    document.getElementById(
                        'c17-scatter'
                    );

                const tip=
                    document.getElementById(
                        'c17-scatter-tip'
                    );


                if(canvasEl && tip){

                    let pinned=null;


                    function nearest(ev){

                        let best=null;
                        let dist=Infinity;

                        for(const point of hitPoints){

                            const dx=
                                point.px-ev.offsetX;

                            const dy=
                                point.py-ev.offsetY;

                            const d=
                                Math.sqrt(
                                    dx*dx+dy*dy
                                );

                            if(
                                d<=11
                                &&
                                d<dist
                            ){
                                best=point;
                                dist=d;
                            }
                        }

                        return best;
                    }


                    function placeTip(ev){

                        tip.hidden=false;

                        const rect=
                            canvasEl
                            .getBoundingClientRect();

                        const tw=
                            tip.offsetWidth || 310;

                        const th=
                            tip.offsetHeight || 150;

                        let left=
                            ev.offsetX+14;

                        let top=
                            ev.offsetY+14;


                        if(left+tw>rect.width-6){
                            left=
                                ev.offsetX
                                -tw
                                -14;
                        }


                        if(top+th>rect.height-6){
                            top=
                                ev.offsetY
                                -th
                                -14;
                        }


                        left=
                            Math.max(
                                6,
                                Math.min(
                                    left,
                                    rect.width-tw-6
                                )
                            );


                        top=
                            Math.max(
                                6,
                                Math.min(
                                    top,
                                    rect.height-th-6
                                )
                            );


                        tip.style.left=
                            left+'px';

                        tip.style.top=
                            top+'px';
                    }


                    function show(
                        point,
                        ev,
                        pin
                    ){

                        const item=
                            point.item;

                        const classes=
                            [
                                item.a.cls,
                                item.b.cls
                            ]
                            .sort()
                            .join(' + ');


                        /*
                         * V17.2 — identyczna semantyka koloru
                         * jak na wykresie.
                         */

                        const accent=
                            item.delta===0
                            ?
                            '#349bea'
                            :
                            item.delta<=10
                            ?
                            '#48c985'
                            :
                            item.delta<=100
                            ?
                            '#d7b83c'
                            :
                            item.delta<=1000
                            ?
                            '#df843a'
                            :
                            '#dc5660';


                        tip.innerHTML=`

<div class="c17-tip-head">

    <div>
        <div style="
          color:#8099a8;
          font-size:7px;
        ">
            RÓŻNICA CZASU
        </div>

        <div
          class="c17-tip-delta"
          style="color:${accent}"
        >
            ${rEsc(
                deltaText(
                    item.delta
                )
            )}
        </div>
    </div>

    <span
      class="c17-tip-range"
      style="
        color:${accent};
        border-color:${accent};
      "
    >
        ${rEsc(
            bucket(
                item.delta
            )
        )}
    </span>

</div>


<div>
    Para:
    <strong>
        ${rEsc(classes)}
    </strong>
</div>


<div class="c17-tip-event">

    <span class="c17-tip-letter">
        A
    </span>

    <div>

        ${eventHTML(item.a)}

        <small>
            ${rEsc(item.a.cls)}
        </small>

    </div>

</div>


<div class="c17-tip-event">

    <span class="c17-tip-letter">
        B
    </span>

    <div>

        ${eventHTML(item.b)}

        <small>
            ${rEsc(item.b.cls)}
        </small>

    </div>

</div>


<div class="c17-tip-foot">

    ${
        pin
        ?
        'Przypięte — kliknij puste miejsce wykresu, aby zamknąć.'
        :
        'Kliknij punkt, aby przypiąć.'
    }

</div>
`;


                        if(pin){
                            pinned=point;
                        }


                        tip.style.borderColor=
                            accent;


                        placeTip(ev);

                        canvasEl.style.cursor=
                            'pointer';
                    }


                    canvasEl.addEventListener(
                        'mousemove',
                        ev=>{

                            if(pinned){
                                return;
                            }

                            const point=
                                nearest(ev);

                            if(point){

                                show(
                                    point,
                                    ev,
                                    false
                                );

                            }else{

                                tip.hidden=true;

                                canvasEl.style.cursor=
                                    'crosshair';
                            }
                        }
                    );


                    canvasEl.addEventListener(
                        'mouseleave',
                        ()=>{

                            if(!pinned){

                                tip.hidden=true;

                                canvasEl.style.cursor=
                                    'crosshair';
                            }
                        }
                    );


                    canvasEl.addEventListener(
                        'click',
                        ev=>{

                            const point=
                                nearest(ev);

                            if(point){

                                pinned=null;

                                show(
                                    point,
                                    ev,
                                    true
                                );

                            }else{

                                pinned=null;

                                tip.hidden=true;

                                canvasEl.style.cursor=
                                    'crosshair';
                            }
                        }
                    );


                    tip.addEventListener(
                        'click',
                        ev=>{
                            ev.stopPropagation();
                        }
                    );
                }
            }
        }
    }
}



/* ------------------------------------------------------------
   RENDER: SPACE WEATHER
   ------------------------------------------------------------ */

/* ============================================================
   CREDO_RESEARCH_SPACE_DASHBOARD_UI_V16

   TYLKO:
   BADANIA -> Pogoda kosmiczna

   Główne okno aplikacji nie jest modyfikowane.
   ============================================================ */

let sw16Range = 24;
let sw16History = [];
let sw16ShowAll = false;
let sw16LoadSerial = 0;


/* ============================================================
   HELPERS
   ============================================================ */

function sw16N(value){

    const n = Number(value);

    return Number.isFinite(n)
        ? n
        : null;
}


function sw16Pad(value){

    return String(value)
        .padStart(2,"0");
}


function sw16Utc(value){

    if(!value){
        return "—";
    }


    const d = new Date(value);


    if(Number.isNaN(d.getTime())){
        return String(value);
    }


    return (
        d.getUTCFullYear()
        + "-"
        + sw16Pad(d.getUTCMonth()+1)
        + "-"
        + sw16Pad(d.getUTCDate())
        + " "
        + sw16Pad(d.getUTCHours())
        + ":"
        + sw16Pad(d.getUTCMinutes())
        + " UTC"
    );
}


function sw16Hour(value){

    const d = new Date(value);


    if(Number.isNaN(d.getTime())){
        return "";
    }


    return d
        .toISOString()
        .slice(0,13);
}


function sw16TimeLabel(value){

    const d = new Date(value);


    if(Number.isNaN(d.getTime())){
        return "";
    }


    if(sw16Range===24){

        return (
            sw16Pad(d.getUTCHours())
            +
            ":00"
        );
    }


    if(sw16Range===72){

        return (
            sw16Pad(d.getUTCDate())
            +
            "."
            +
            sw16Pad(d.getUTCMonth()+1)
            +
            " "
            +
            sw16Pad(d.getUTCHours())
        );
    }


    return (
        sw16Pad(d.getUTCDate())
        +
        "."
        +
        sw16Pad(d.getUTCMonth()+1)
    );
}


function sw16Scale(scales,key){

    return sw16N(
        scales?.[key]?.scale
    );
}


function sw16Dst(sw){

    if(
        sw?.dst
        &&
        typeof sw.dst === "object"
    ){

        return sw16N(
            sw.dst.value
        );
    }


    return sw16N(
        sw?.dst
    );
}


function sw16KpTone(value){

    const v = sw16N(value);


    if(v===null) return "neutral";
    if(v<4) return "green";
    if(v<5) return "blue";
    if(v<6) return "yellow";
    if(v<8) return "orange";

    return "red";
}


function sw16ScaleTone(value){

    const v = sw16N(value);


    if(v===null) return "neutral";
    if(v<=0) return "green";
    if(v===1) return "blue";
    if(v===2) return "yellow";
    if(v===3) return "orange";

    return "red";
}


function sw16DstTone(value){

    const v = sw16N(value);


    if(v===null) return "neutral";
    if(v>-30) return "green";
    if(v>-50) return "blue";
    if(v>-100) return "yellow";
    if(v>-200) return "orange";

    return "red";
}


function sw16Status(
    kp,
    g,
    solar,
    radio,
    dst
){

    if(
        [
            kp,
            g,
            solar,
            radio,
            dst
        ]
        .every(
            value=>
                value===null
        )
    ){

        return {
            label:"Brak danych",
            tone:"neutral",
            text:
                "Brak pełnego zestawu aktualnych danych NOAA."
        };
    }


    if(
        (kp===null || kp<4)
        &&
        (g===null || g===0)
        &&
        (solar===null || solar===0)
        &&
        (radio===null || radio===0)
        &&
        (dst===null || dst>-30)
    ){

        return {
            label:"Spokojnie",
            tone:"green",
            text:
                "Warunki spokojne. Brak podwyższonej aktywności w bieżących skalach."
        };
    }


    return {
        label:"Podwyższona aktywność",
        tone:"orange",
        text:
            "Co najmniej jeden parametr wskazuje podwyższoną aktywność."
    };
}


function sw16Metric(
    title,
    value,
    subtitle,
    tone
){

    return `

<div class="sw16-metric sw16-${tone}">

    <div class="sw16-metric-name">
        ${rEsc(title)}
    </div>

    <b>
        ${rEsc(value)}
    </b>

    <small>
        ${rEsc(subtitle || "")}
    </small>

</div>
`;
}


function sw16Pct(
    value,
    total
){

    value = Number(value) || 0;
    total = Number(total) || 0;


    if(total<=0){
        return "0.0%";
    }


    return (
        (
            value/total*100
        ).toFixed(1)
        +
        "%"
    );
}


/* ============================================================
   STYLE — TYLKO MODAL BADANIA
   ============================================================ */

function sw16EnsureStyle(){

    if(
        document.getElementById(
            "sw16-style"
        )
    ){
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "sw16-style";


    style.textContent = `

#sw16-root{
    display:flex;
    flex-direction:column;
    gap:11px;
}

#sw16-root *{
    box-sizing:border-box;
}

#sw16-root .sw16-panel{
    padding:12px;
    border:1px solid #294b64;
    border-radius:11px;
    background:#0b1d2d;
}

#sw16-root .sw16-head{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:12px;
    margin-bottom:10px;
}

#sw16-root .sw16-title{
    color:#eef6fa;
    font-size:15px;
    font-weight:800;
}

#sw16-root .sw16-desc{
    margin-top:3px;
    color:#8da5b5;
    font-size:9px;
    line-height:1.4;
}

#sw16-root .sw16-status{
    display:inline-flex;
    margin-left:7px;
    padding:3px 8px;
    border-radius:999px;
    font-size:8px;
    font-weight:800;
}

#sw16-root .sw16-status.green{
    color:#73e890;
    background:#103b21;
    border:1px solid #25723b;
}

#sw16-root .sw16-status.orange{
    color:#ffc16c;
    background:#40270f;
    border:1px solid #87521d;
}

#sw16-root .sw16-status.neutral{
    color:#b2c3ce;
    background:#162b39;
    border:1px solid #34536a;
}

#sw16-root .sw16-current-info{
    text-align:right;
    color:#8da5b5;
    font-size:8px;
    line-height:1.5;
}

#sw16-root .sw16-metrics-6{
    display:grid;
    grid-template-columns:repeat(6,minmax(0,1fr));
    gap:7px;
}

#sw16-root .sw16-metrics-5{
    display:grid;
    grid-template-columns:repeat(5,minmax(0,1fr));
    gap:7px;
}

#sw16-root .sw16-metric{
    min-width:0;
    min-height:82px;
    padding:9px;
    border:1px solid #294b64;
    border-radius:8px;
    background:#081a28;
}

#sw16-root .sw16-metric-name{
    min-height:22px;
    color:#bcced9;
    font-size:8px;
    font-weight:700;
    line-height:1.25;
}

#sw16-root .sw16-metric b{
    display:block;
    margin-top:5px;
    color:#f5f9fb;
    font-size:17px;
    line-height:1.1;
}

#sw16-root .sw16-metric small{
    display:block;
    margin-top:4px;
    color:#8299a9;
    font-size:7px;
    line-height:1.25;
}

#sw16-root .sw16-green{
    border-color:#3bac61;
}

#sw16-root .sw16-blue{
    border-color:#318fc5;
}

#sw16-root .sw16-yellow{
    border-color:#aa9638;
}

#sw16-root .sw16-orange{
    border-color:#be7132;
}

#sw16-root .sw16-red{
    border-color:#bd4556;
}

#sw16-root .sw16-purple{
    border-color:#7452b1;
}

#sw16-root .sw16-neutral{
    border-color:#304f63;
}

#sw16-root .sw16-method{
    margin-top:8px;
    color:#7f97a7;
    font-size:8px;
    line-height:1.45;
}

#sw16-root .sw16-charts{
    display:grid;
    grid-template-columns:1.35fr .9fr 1.15fr;
    gap:8px;
}

#sw16-root .sw16-chart{
    overflow:hidden;
    min-width:0;
    border:1px solid #294b64;
    border-radius:9px;
    background:#071824;
}

#sw16-root .sw16-chart-head{
    min-height:50px;
    padding:9px 10px 4px;
}

#sw16-root .sw16-chart-title{
    color:#e8f2f7;
    font-size:10px;
    font-weight:800;
}

#sw16-root .sw16-chart-sub{
    margin-top:2px;
    color:#738d9e;
    font-size:7px;
    line-height:1.35;
}

#sw16-root .sw16-chart-head-flex{
    display:flex;
    justify-content:space-between;
    gap:8px;
}

#sw16-root .sw16-range{
    display:flex;
    gap:3px;
    white-space:nowrap;
}

#sw16-root .sw16-range button{
    padding:4px 6px;
    border:1px solid #315875;
    border-radius:6px;
    background:#10283b;
    color:#a9bfce;
    font-size:7px;
    cursor:pointer;
}

#sw16-root .sw16-range button.active{
    border-color:#35aef3;
    background:#123f5b;
    color:#fff;
}

#sw16-root .sw16-key{
    display:flex;
    gap:8px;
    flex-wrap:wrap;
    min-height:15px;
    padding:0 10px 3px;
    color:#7e97a7;
    font-size:7px;
}

#sw16-root canvas{
    display:block;
    width:100%;
    height:180px;
}

#sw16-root .sw16-table-head{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:10px;
    margin-bottom:8px;
}

#sw16-root .sw16-more{
    padding:5px 8px;
    border:1px solid #315875;
    border-radius:6px;
    background:#10283b;
    color:#c7d8e2;
    font-size:8px;
    cursor:pointer;
}

#sw16-root .sw16-more:disabled{
    opacity:.45;
    cursor:default;
}

#sw16-root .sw16-table-wrap{
    max-height:260px;
    overflow:auto;
    border:1px solid #24445a;
    border-radius:8px;
}

#sw16-root table{
    width:100%;
    border-collapse:collapse;
    font-size:8px;
}

#sw16-root th{
    position:sticky;
    top:0;
    z-index:1;
    padding:7px 6px;
    background:#0a2233;
    color:#c9dae4;
    text-align:left;
    white-space:nowrap;
}

#sw16-root td{
    padding:6px;
    border-top:1px solid #1d3b4f;
    color:#b9cbd7;
    white-space:nowrap;
}

#sw16-root tbody tr:nth-child(even){
    background:rgba(26,58,78,.22);
}

#sw16-root .before{
    color:#efb25b;
    font-weight:700;
}

#sw16-root .after{
    color:#5bd3fb;
    font-weight:700;
}

@media(max-width:1050px){

    #sw16-root .sw16-metrics-6{
        grid-template-columns:repeat(3,minmax(0,1fr));
    }

    #sw16-root .sw16-metrics-5{
        grid-template-columns:repeat(3,minmax(0,1fr));
    }

    #sw16-root .sw16-charts{
        grid-template-columns:1fr;
    }
}

`;


    document.head.appendChild(
        style
    );
}


/* ============================================================
   DATA
   ============================================================ */

function sw16VisibleHistory(){

    return sw16History.slice(
        -sw16Range
    );
}


function sw16EventTimes(){

    const rows =
        researchData
        ?.space_comparison
        ?.analytics_event_times;


    return Array.isArray(rows)
        ? rows
        : [];
}


function sw16HistoryMap(){

    const map =
        new Map();


    for(const point of sw16History){

        const key =
            sw16Hour(
                point.time
            );


        if(key){

            map.set(
                key,
                point
            );
        }
    }


    return map;
}


function sw16VisibleEvents(){

    const history =
        sw16VisibleHistory();


    if(!history.length){
        return [];
    }


    const start =
        new Date(
            history[0].time
        ).getTime();


    const end =
        new Date(
            history[
                history.length-1
            ].time
        ).getTime()
        +
        3600000;


    return sw16EventTimes()
        .filter(
            value=>{

                const ms =
                    new Date(value)
                    .getTime();


                return (
                    Number.isFinite(ms)
                    &&
                    ms>=start
                    &&
                    ms<end
                );
            }
        );
}


/* ============================================================
   CANVAS
   ============================================================ */

function sw16Canvas(id){

    const canvas =
        document.getElementById(id);


    if(!canvas){
        return null;
    }


    const rect =
        canvas.getBoundingClientRect();


    if(
        !rect.width
        ||
        !rect.height
    ){
        return null;
    }


    const dpr =
        window.devicePixelRatio
        ||
        1;


    canvas.width =
        Math.round(
            rect.width*dpr
        );


    canvas.height =
        Math.round(
            rect.height*dpr
        );


    const ctx =
        canvas.getContext("2d");


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    ctx.clearRect(
        0,
        0,
        rect.width,
        rect.height
    );


    ctx.fillStyle=
        "#071824";


    ctx.fillRect(
        0,
        0,
        rect.width,
        rect.height
    );


    return {
        ctx,
        w:rect.width,
        h:rect.height
    };
}


function sw16Line(
    ctx,
    x1,
    y1,
    x2,
    y2,
    color
){

    ctx.strokeStyle=color;
    ctx.lineWidth=1;


    ctx.beginPath();

    ctx.moveTo(
        x1,
        y1
    );

    ctx.lineTo(
        x2,
        y2
    );

    ctx.stroke();
}


function sw16Grid(
    ctx,
    left,
    top,
    width,
    height
){

    for(let i=0;i<=4;i++){

        const y =
            top
            +
            height*i/4;


        sw16Line(
            ctx,
            left,
            y,
            left+width,
            y,
            "#173548"
        );
    }
}


function sw16X(
    index,
    count,
    left,
    width
){

    if(count<=1){

        return (
            left
            +
            width/2
        );
    }


    return (
        left
        +
        index/(count-1)
        *
        width
    );
}


function sw16Axis(
    ctx,
    rows,
    left,
    width,
    y,
    marks
){

    if(!rows.length){
        return;
    }


    ctx.fillStyle=
        "#70899a";

    ctx.font=
        "7px system-ui";


    for(let i=0;i<marks;i++){

        const index =
            Math.round(
                i
                *
                (rows.length-1)
                /
                Math.max(
                    1,
                    marks-1
                )
            );


        const x =
            sw16X(
                index,
                rows.length,
                left,
                width
            );


        const label =
            sw16TimeLabel(
                rows[index].time
            );


        const tw =
            ctx.measureText(
                label
            ).width;


        ctx.fillText(
            label,
            Math.max(
                left,
                Math.min(
                    left+width-tw,
                    x-tw/2
                )
            ),
            y
        );
    }
}


/* ============================================================
   CHART 1 — DETEKCJE VS KP
   ============================================================ */

function sw16DrawTimeline(){

    const c =
        sw16Canvas(
            "sw16-time"
        );


    if(!c){
        return;
    }


    const {
        ctx,
        w,
        h
    }=c;


    const rows =
        sw16VisibleHistory();


    if(!rows.length){
        return;
    }


    const left=29;
    const right=25;
    const top=8;
    const bottom=22;

    const width=
        w-left-right;

    const height=
        h-top-bottom;


    sw16Grid(
        ctx,
        left,
        top,
        width,
        height
    );


    const counts=
        new Map();


    for(const event of sw16VisibleEvents()){

        const key=
            sw16Hour(event);


        counts.set(
            key,
            (
                counts.get(key)
                ||
                0
            )
            +
            1
        );
    }


    const values=
        rows.map(
            point=>
                counts.get(
                    sw16Hour(
                        point.time
                    )
                )
                ||
                0
        );


    const maxCount=
        Math.max(
            1,
            ...values
        );


    const slot=
        width/
        Math.max(
            1,
            rows.length
        );


    const barWidth=
        Math.max(
            1.5,
            Math.min(
                11,
                slot*.62
            )
        );


    rows.forEach(
        (point,index)=>{

            const x=
                sw16X(
                    index,
                    rows.length,
                    left,
                    width
                );


            const barHeight=
                values[index]
                /
                maxCount
                *
                height;


            ctx.fillStyle=
                "rgba(45,167,237,.82)";


            ctx.fillRect(
                x-barWidth/2,
                top+height-barHeight,
                barWidth,
                barHeight
            );
        }
    );


    ctx.strokeStyle=
        "#57d779";

    ctx.lineWidth=
        2;

    ctx.beginPath();


    let started=false;


    rows.forEach(
        (point,index)=>{

            const kp=
                sw16N(
                    point.kp
                );


            if(kp===null){
                return;
            }


            const x=
                sw16X(
                    index,
                    rows.length,
                    left,
                    width
                );


            const y=
                top+height
                -
                Math.max(
                    0,
                    Math.min(
                        9,
                        kp
                    )
                )
                /9
                *
                height;


            if(!started){

                ctx.moveTo(
                    x,
                    y
                );

                started=true;

            }else{

                ctx.lineTo(
                    x,
                    y
                );
            }
        }
    );


    ctx.stroke();


    ctx.fillStyle=
        "#7892a3";

    ctx.font=
        "7px system-ui";

    ctx.textAlign=
        "right";


    for(let i=0;i<=4;i++){

        ctx.fillText(
            String(
                Math.round(
                    maxCount
                    *
                    (4-i)/4
                )
            ),
            left-4,
            top+height*i/4+2
        );
    }


    ctx.textAlign=
        "left";


    sw16Axis(
        ctx,
        rows,
        left,
        width,
        h-4,
        sw16Range===24
        ?
        7
        :
        6
    );
}


/* ============================================================
   CHART 2 — HISTOGRAM KP
   ============================================================ */

function sw16KpColor(index){

    if(index<=3){
        return "#4cc575";
    }

    if(index===4){
        return "#d6c44a";
    }

    if(index<=6){
        return "#ef9347";
    }

    return "#e45462";
}


function sw16DrawHistogram(){

    const c=
        sw16Canvas(
            "sw16-hist"
        );


    if(!c){
        return;
    }


    const {
        ctx,
        w,
        h
    }=c;


    const map=
        sw16HistoryMap();


    const bins=
        new Array(10)
        .fill(0);


    for(const event of sw16VisibleEvents()){

        const point=
            map.get(
                sw16Hour(event)
            );


        const kp=
            sw16N(
                point?.kp
            );


        if(kp===null){
            continue;
        }


        const bin=
            Math.max(
                0,
                Math.min(
                    9,
                    Math.floor(kp)
                )
            );


        bins[bin]++;
    }


    const left=26;
    const right=6;
    const top=8;
    const bottom=22;

    const width=
        w-left-right;

    const height=
        h-top-bottom;


    sw16Grid(
        ctx,
        left,
        top,
        width,
        height
    );


    const maxValue=
        Math.max(
            1,
            ...bins
        );


    const slot=
        width/10;


    bins.forEach(
        (value,index)=>{

            const bw=
                slot*.62;


            const bh=
                value
                /
                maxValue
                *
                height;


            ctx.fillStyle=
                sw16KpColor(
                    index
                );


            ctx.fillRect(
                left
                +
                index*slot
                +
                (slot-bw)/2,
                top+height-bh,
                bw,
                bh
            );


            ctx.fillStyle=
                "#8198a8";

            ctx.font=
                "7px system-ui";

            ctx.textAlign=
                "center";


            ctx.fillText(
                String(index),
                left
                +
                index*slot
                +
                slot/2,
                h-6
            );
        }
    );


    ctx.textAlign=
        "right";

    ctx.fillStyle=
        "#8198a8";

    ctx.font=
        "7px system-ui";


    ctx.fillText(
        String(maxValue),
        left-4,
        top+2
    );


    ctx.fillText(
        "0",
        left-4,
        top+height
    );


    ctx.textAlign=
        "left";
}


/* ============================================================
   CHART 3 — X-RAY
   ============================================================ */

function sw16XrayLevel(value){

    const s=
        String(
            value
            ||
            ""
        )
        .toUpperCase();


    if(s.startsWith("X")) return 4;
    if(s.startsWith("M")) return 3;
    if(s.startsWith("C")) return 2;
    if(s.startsWith("B")) return 1;
    if(s.startsWith("A")) return 0;


    return null;
}


function sw16DrawXray(){

    const c=
        sw16Canvas(
            "sw16-xray"
        );


    if(!c){
        return;
    }


    const {
        ctx,
        w,
        h
    }=c;


    const rows=
        sw16VisibleHistory();


    if(!rows.length){
        return;
    }


    const start=
        new Date(
            rows[0].time
        ).getTime();


    const end=
        new Date(
            rows[
                rows.length-1
            ].time
        ).getTime()
        +
        3600000;


    const left=25;
    const right=6;
    const top=8;
    const bottom=22;

    const width=
        w-left-right;

    const height=
        h-top-bottom;


    [
        ["A",0],
        ["B",1],
        ["C",2],
        ["M",3],
        ["X",4]
    ]
    .forEach(
        ([label,level])=>{

            const y=
                top+height
                -
                level/4
                *
                height;


            sw16Line(
                ctx,
                left,
                y,
                left+width,
                y,
                "#173548"
            );


            ctx.fillStyle=
                "#70899a";

            ctx.font=
                "7px system-ui";

            ctx.textAlign=
                "right";


            ctx.fillText(
                label,
                left-4,
                y+2
            );
        }
    );


    ctx.textAlign=
        "left";


    /*
     * Niebieskie punkty = chwile detekcji.
     */

    for(const event of sw16VisibleEvents()){

        const ms=
            new Date(event)
            .getTime();


        if(
            !Number.isFinite(ms)
            ||
            ms<start
            ||
            ms>=end
        ){
            continue;
        }


        const x=
            left
            +
            (ms-start)
            /
            (end-start)
            *
            width;


        ctx.fillStyle=
            "rgba(45,167,237,.82)";


        ctx.beginPath();

        ctx.arc(
            x,
            top+height-3,
            1.7,
            0,
            Math.PI*2
        );

        ctx.fill();
    }


    /*
     * Fioletowe znaczniki = maksimum klasy X-ray
     * przypisane przez istniejące API historii do danej godziny.
     */

    rows.forEach(
        point=>{

            if(!point.xray){
                return;
            }


            const level=
                sw16XrayLevel(
                    point.xray
                );


            if(level===null){
                return;
            }


            const ms=
                new Date(
                    point.time
                ).getTime()
                +
                1800000;


            const x=
                left
                +
                (ms-start)
                /
                (end-start)
                *
                width;


            const y=
                top+height
                -
                level/4
                *
                height;


            ctx.strokeStyle=
                "#bf70df";

            ctx.lineWidth=
                1.4;


            ctx.beginPath();

            ctx.moveTo(
                x,
                top+height
            );

            ctx.lineTo(
                x,
                y
            );

            ctx.stroke();


            ctx.fillStyle=
                "#bf70df";


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                3,
                0,
                Math.PI*2
            );

            ctx.fill();
        }
    );


    sw16Axis(
        ctx,
        rows,
        left,
        width,
        h-4,
        5
    );
}


/* ============================================================
   TABLE
   ============================================================ */

function sw16Delta(seconds){

    const value=
        Number(seconds);


    if(!Number.isFinite(value)){
        return "—";
    }


    const sign=
        value>=0
        ?
        "+"
        :
        "−";


    const abs=
        Math.abs(value);


    if(abs<120){

        return (
            sign
            +
            abs.toFixed(1)
            +
            " s"
        );
    }


    return (
        sign
        +
        (abs/60).toFixed(1)
        +
        " min"
    );
}


function sw16HistoryAt(value){

    const key=
        sw16Hour(value);


    if(!key){
        return null;
    }


    return (
        sw16HistoryMap()
        .get(key)
        ||
        null
    );
}


function sw16RenderTable(){

    const tbody=
        document.getElementById(
            "sw16-table-body"
        );


    const button=
        document.getElementById(
            "sw16-more"
        );


    if(!tbody){
        return;
    }


    const cmp=
        researchData
        ?.space_comparison
        ||
        {};


    const source=
        Array.isArray(
            cmp.flare_matches
        )
        ?
        [...cmp.flare_matches]
        :
        [];


    source.sort(
        (a,b)=>
            Math.abs(
                Number(
                    a.signed_delta_seconds
                    ??
                    a.delta_seconds
                    ??
                    999999999
                )
            )
            -
            Math.abs(
                Number(
                    b.signed_delta_seconds
                    ??
                    b.delta_seconds
                    ??
                    999999999
                )
            )
    );


    if(button){

        button.disabled=
            source.length<=5;


        button.textContent=
            sw16ShowAll
            ?
            "Pokaż 5 najbliższych"
            :
            `Pokaż wszystkie (${source.length})`;
    }


    const rows=
        sw16ShowAll
        ?
        source
        :
        source.slice(0,5);


    if(!rows.length){

        tbody.innerHTML=`
          <tr>
            <td colspan="9">
              Brak zbieżności w oknie ±30 min.
            </td>
          </tr>
        `;

        return;
    }


    tbody.innerHTML=
        rows.map(
            (item,index)=>{

                const eventUtc=
                    item.event_time_utc
                    ||
                    item.event_time;


                const sec=
                    sw16N(
                        item.signed_delta_seconds
                        ??
                        item.delta_seconds
                    );


                const positionClass=
                    sec!==null
                    &&
                    sec<0
                    ?
                    "before"
                    :
                    "after";


                const history=
                    sw16HistoryAt(
                        eventUtc
                    );


                const kp=
                    sw16N(
                        history?.kp
                    );


                const dst=
                    sw16N(
                        history?.dst
                    );


                const position=
                    sec===null
                    ?
                    "—"
                    :
                    (
                        sec<0
                        ?
                        "przed maksimum"
                        :
                        "po maksimum"
                    );


                return `

<tr>

    <td>
        ${index+1}
    </td>

    <td>
        ${rEsc(
            sw16Utc(
                eventUtc
            )
        )}
    </td>

    <td>
        ${rEsc(
            String(
                item.event_class
                ||
                "—"
            ).toUpperCase()
        )}
    </td>

    <td>
        ${rEsc(
            item.flare_class
            ||
            "—"
        )}
    </td>

    <td>
        ${rEsc(
            item.window
            ||
            "—"
        )}
    </td>

    <td class="${positionClass}">
        ${rEsc(
            sw16Delta(sec)
        )}
    </td>

    <td>
        ${
            kp===null
            ?
            "—"
            :
            kp.toFixed(2)
        }
    </td>

    <td>
        ${
            dst===null
            ?
            "—"
            :
            dst.toFixed(0)
            +
            " nT"
        }
    </td>

    <td>
        ${rEsc(position)}
    </td>

</tr>
`;
            }
        )
        .join("");
}


function sw16DrawAll(){

    sw16DrawTimeline();

    sw16DrawHistogram();

    sw16DrawXray();

    sw16RenderTable();
}


/* ============================================================
   HISTORY
   ============================================================ */

async function sw16LoadHistory(){

    const serial=
        ++sw16LoadSerial;


    try{

        const response=
            await fetch(
                "/api/space-history?hours=168",
                {
                    cache:"no-store"
                }
            );


        if(!response.ok){

            throw new Error(
                "HTTP "
                +
                response.status
            );
        }


        const data=
            await response.json();


        if(
            serial!==sw16LoadSerial
            ||
            currentTab!=="space"
        ){
            return;
        }


        if(
            data?.version
            !==
            "CREDO_SPACE_HISTORY_V15"
        ){

            throw new Error(
                "nieprawidłowa wersja historii"
            );
        }


        sw16History=
            Array.isArray(
                data.points
            )
            ?
            data.points
            :
            [];


        sw16DrawAll();


    }catch(error){

        console.error(
            "CREDO V16 research",
            error
        );
    }
}


/* ============================================================
   RENDER BADANIA -> POGODA KOSMICZNA
   ============================================================ */

function renderSpace(){

    sw16EnsureStyle();


    const sw=
        researchData
        ?.space_weather
        ||
        {};


    const cmp=
        researchData
        ?.space_comparison
        ||
        {};


    const scales=
        sw.scales
        ||
        {};


    const kp=
        sw16N(
            sw.kp
        );


    const g=
        sw16Scale(
            scales,
            "G"
        );


    const solar=
        sw16Scale(
            scales,
            "S"
        );


    const radio=
        sw16Scale(
            scales,
            "R"
        );


    const dst=
        sw16Dst(sw);


    const flare=
        sw.latest_flare
        ||
        {};


    const status=
        sw16Status(
            kp,
            g,
            solar,
            radio,
            dst
        );


    const eventCount=
        Number(
            researchData
            ?.event_count
            ||
            0
        );


    const coverage=
        Number(
            cmp.kp_coverage
            ||
            0
        );


    const ge5=
        Number(
            cmp.kp_ge5_detections
            ||
            0
        );


    const corr=
        (
            cmp.pearson_r!==null
            &&
            cmp.pearson_r!==undefined
        )
        ?
        `${
            cmp.pearson_r
        } (${
            cmp.pearson_bins||0
        } okien)`
        :
        "—";


    body.innerHTML=`

<div id="sw16-root">


    <section class="sw16-panel">

        <div class="sw16-head">

            <div>

                <div>

                    <span class="sw16-title">
                        ☀️ Pogoda kosmiczna NOAA
                    </span>

                    <span class="sw16-status ${status.tone}">
                        ${rEsc(status.label)}
                    </span>

                </div>

                <div class="sw16-desc">
                    ${rEsc(status.text)}
                </div>

            </div>


            <div class="sw16-current-info">

                Ostatnia aktualizacja:
                ${rEsc(
                    sw16Utc(
                        scales.timestamp
                        ||
                        sw.kp_time
                        ||
                        sw?.dst?.time
                    )
                )}

                <br>

                Źródło: NOAA SWPC

            </div>

        </div>


        <div class="sw16-metrics-6">

            ${sw16Metric(
                "Kp",
                kp===null
                ?
                "—"
                :
                kp.toFixed(2),
                sw16Utc(
                    sw.kp_time
                ),
                sw16KpTone(kp)
            )}


            ${sw16Metric(
                "Burza geomagnetyczna",
                g===null
                ?
                "—"
                :
                "G"+g,
                g===0
                ?
                "brak (spokojnie)"
                :
                "poziom "+g,
                sw16ScaleTone(g)
            )}


            ${sw16Metric(
                "Burza radiacyjna",
                solar===null
                ?
                "—"
                :
                "S"+solar,
                solar===0
                ?
                "brak (spokojnie)"
                :
                "poziom "+solar,
                sw16ScaleTone(solar)
            )}


            ${sw16Metric(
                "Blackout radiowy",
                radio===null
                ?
                "—"
                :
                "R"+radio,
                radio===0
                ?
                "brak (spokojnie)"
                :
                "poziom "+radio,
                sw16ScaleTone(radio)
            )}


            ${sw16Metric(
                "Dst",
                dst===null
                ?
                "—"
                :
                dst.toFixed(0)
                +
                " nT",
                "zaburzenie pola magnetycznego",
                sw16DstTone(dst)
            )}


            ${sw16Metric(
                "Ostatni rozbłysk X-ray",
                flare.class
                ||
                "—",
                sw16Utc(
                    flare.time
                ),
                "purple"
            )}

        </div>

    </section>


    <section class="sw16-panel">

        <div class="sw16-head">

            <div>

                <div class="sw16-title">
                    Twoje detekcje a aktywność geomagnetyczna
                </div>

                <div class="sw16-desc">
                    Statystyki detekcji CREDO zestawione z indeksem Kp.
                </div>

            </div>

        </div>


        <div class="sw16-metrics-5">

            ${sw16Metric(
                "Detekcje z dopasowanym Kp",
                coverage,
                sw16Pct(
                    coverage,
                    eventCount
                )
                +
                " wszystkich",
                "blue"
            )}


            ${sw16Metric(
                "Średnie Kp przy detekcjach",
                cmp.kp_mean_at_detections
                ??
                "—",
                "dla dopasowanych chwil",
                "green"
            )}


            ${sw16Metric(
                "Najwyższe Kp przy detekcji",
                cmp.kp_max_at_detection
                ??
                "—",
                "maksimum",
                sw16KpTone(
                    cmp.kp_max_at_detection
                )
            )}


            ${sw16Metric(
                "Detekcje przy Kp ≥ 5",
                ge5,
                sw16Pct(
                    ge5,
                    eventCount
                )
                +
                " wszystkich",
                ge5>0
                ?
                "orange"
                :
                "green"
            )}


            ${sw16Metric(
                "Korelacja detekcji ↔ Kp",
                corr,
                "Pearson r · okna 3-godzinne",
                "purple"
            )}

        </div>


        <div class="sw16-method">

            Analiza ma charakter eksploracyjny.
            Korelacja czasowa nie dowodzi związku przyczynowego.
            Surowa liczba detekcji nie jest jeszcze normalizowana
            przez rzeczywisty czas aktywności detektora.

        </div>

    </section>


    <div class="sw16-charts">


        <section class="sw16-chart">

            <div class="sw16-chart-head sw16-chart-head-flex">

                <div>

                    <div class="sw16-chart-title">
                        📈 Detekcje vs Kp w czasie
                    </div>

                    <div class="sw16-chart-sub">
                        słupki = liczba detekcji · zielona linia = Kp
                    </div>

                </div>


                <div class="sw16-range">

                    <button
                      data-sw16-range="24"
                      class="${sw16Range===24?"active":""}"
                    >
                        24 h
                    </button>

                    <button
                      data-sw16-range="72"
                      class="${sw16Range===72?"active":""}"
                    >
                        72 h
                    </button>

                    <button
                      data-sw16-range="168"
                      class="${sw16Range===168?"active":""}"
                    >
                        7 dni
                    </button>

                </div>

            </div>


            <div class="sw16-key">
                <span style="color:#2da7ed">■ detekcje</span>
                <span style="color:#57d779">━ Kp</span>
            </div>


            <canvas id="sw16-time"></canvas>

        </section>


        <section class="sw16-chart">

            <div class="sw16-chart-head">

                <div class="sw16-chart-title">
                    ▥ Rozkład detekcji wg Kp
                </div>

                <div class="sw16-chart-sub">
                    liczba detekcji przypisana do przedziałów Kp 0–9
                </div>

            </div>


            <div class="sw16-key">
                <span>Kp 0–9</span>
            </div>


            <canvas id="sw16-hist"></canvas>

        </section>


        <section class="sw16-chart">

            <div class="sw16-chart-head">

                <div class="sw16-chart-title">
                    ⚡ Detekcje a maksima X-ray
                </div>

                <div class="sw16-chart-sub">
                    detekcje i godzinne maksima klasy GOES na wspólnej osi czasu
                </div>

            </div>


            <div class="sw16-key">
                <span style="color:#2da7ed">● detekcje</span>
                <span style="color:#bf70df">● maksimum X-ray</span>
            </div>


            <canvas id="sw16-xray"></canvas>

        </section>


    </div>


    <section class="sw16-panel">

        <div class="sw16-table-head">

            <div>

                <div class="sw16-title">
                    ◷ Najciekawsze zbieżności czasowe
                </div>

                <div class="sw16-desc">
                    Detekcje położone najbliżej maksimów rozbłysków X-ray.
                </div>

            </div>


            <button
              id="sw16-more"
              class="sw16-more"
              type="button"
            >
                Pokaż wszystkie
            </button>

        </div>


        <div class="sw16-table-wrap">

            <table>

                <thead>

                    <tr>

                        <th>#</th>

                        <th>
                            Chwila CREDO (UTC)
                        </th>

                        <th>
                            Klasa
                        </th>

                        <th>
                            Rozbłysk
                        </th>

                        <th>
                            Okno
                        </th>

                        <th>
                            Δt
                        </th>

                        <th>
                            Kp
                        </th>

                        <th>
                            Dst
                        </th>

                        <th>
                            Położenie
                        </th>

                    </tr>

                </thead>


                <tbody id="sw16-table-body">

                    <tr>

                        <td colspan="9">
                            Ładowanie…
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>


        <div class="sw16-method">

            Wspólny timestamp CREDO jest liczony jako jedna chwila
            w dotychczasowej analizie rozbłysków.
            Każda chwila jest przypisana do najbliższego maksimum.
            Okno ±30 min pozostaje szerokim oknem eksploracyjnym,
            a nie dowodem związku fizycznego.

        </div>

    </section>


</div>
`;


    body
    .querySelectorAll(
        "[data-sw16-range]"
    )
    .forEach(
        button=>{

            button.onclick=()=>{

                sw16Range=
                    Number(
                        button.dataset.sw16Range
                    );


                body
                .querySelectorAll(
                    "[data-sw16-range]"
                )
                .forEach(
                    item=>
                        item.classList.toggle(
                            "active",
                            item===button
                        )
                );


                if(sw16History.length){

                    sw16DrawAll();
                }
            };
        }
    );


    const more=
        document.getElementById(
            "sw16-more"
        );


    if(more){

        more.onclick=()=>{

            sw16ShowAll=
                !sw16ShowAll;


            sw16RenderTable();
        };
    }


    sw16RenderTable();

    sw16LoadHistory();
}


window.addEventListener(
    "resize",
    ()=>{

        if(
            currentTab==="space"
            &&
            sw16History.length
            &&
            document.getElementById(
                "sw16-root"
            )
        ){

            sw16DrawAll();
        }
    }
);

function renderNetwork(){

    // CREDO_NETWORK_UI_V11_4

    const n=
        researchData?.network_credo||{};

    const c=
        n.counts||{};


    function deltaLabel(value){

        const x=
            Number(value);

        if(!Number.isFinite(x)){
            return '—';
        }

        if(x===0){
            return 'WSPÓLNY TIMESTAMP';
        }

        return (
            (x>0 ? '+' : '−')
            +
            Math.abs(x)
            +
            ' ms'
        );
    }


    const rows=
        (n.matches||[])
        .slice(0,150)
        .map(item=>`

        <tr>

            <td>

                ${eventLink(
                    item.local_id,
                    item.local_time
                )}

                ${
                    Number(
                        item.local_count
                    )>1

                    ?

                    `<br>
                    <small>
                    ${rEsc(
                        item.local_count
                    )}
                    lokalne detekcje
                    w tej chwili
                    </small>`

                    :

                    ''
                }

            </td>


            <td>

                <b>
                ${rEsc(
                    deltaLabel(
                        item.delta_ms
                    )
                )}
                </b>

            </td>


            <td>

                ${rEsc(
                    item.external_time
                    || '—'
                )}

                ${
                    Number(
                        item.external_detection_count
                    )>1

                    ?

                    `<br>
                    <small>
                    ${rEsc(
                        item.external_detection_count
                    )}
                    detekcje tego urządzenia
                    w tym timestampie
                    </small>`

                    :

                    ''
                }

            </td>


            <td>
                ${rEsc(
                    item.device_id
                    ?? '—'
                )}
            </td>


            <td>
                ${rEsc(
                    item.device_model
                    ||
                    item.device_type
                    ||
                    '—'
                )}
            </td>


            <td>

                ${rEsc(
                    item.user
                    ||
                    (
                        item.user_id
                        !==null
                        &&
                        item.user_id
                        !==undefined
                        ?
                        'ID '+item.user_id
                        :
                        '—'
                    )
                )}

            </td>


            <td>

                ${rEsc(
                    item.team
                    ||
                    (
                        item.team_id
                        !==null
                        &&
                        item.team_id
                        !==undefined
                        ?
                        'ID '+item.team_id
                        :
                        '—'
                    )
                )}

            </td>

        </tr>

        `)
        .join('');


    if(!n.engine_ready){

        body.innerHTML=`

            <h3>Sieć CREDO</h3>

            <div class="research-card">

                <b>BŁĄD SILNIKA</b>

                <p>
                    ${rEsc(
                        n.reason||''
                    )}
                </p>

            </div>

        `;

        return;
    }


    if(!n.data_present){

        body.innerHTML=`

            <h3>Sieć CREDO</h3>

            <div class="research-card">

                <b>
                    SILNIK GOTOWY —
                    BRAK DANYCH SIECIOWYCH
                </b>

                <p>
                    ${rEsc(
                        n.reason||''
                    )}
                </p>

            </div>


            <div class="research-grid">

                <div class="research-card">

                    Lokalne unikalne chwile

                    <b>
                        ${
                            n.local_unique_times
                            ??0
                        }
                    </b>

                </div>


                <div class="research-card">

                    Pliki eksportu CREDO

                    <b>
                        ${
                            n.export_files
                            ??0
                        }
                    </b>

                </div>


                <div class="research-card">

                    Zaimportowane
                    detekcje sieci

                    <b>
                        ${
                            n.network_rows
                            ??0
                        }
                    </b>

                </div>

            </div>


            <p class="research-muted">

                Analyzer jest już przygotowany
                do oficjalnego eksportu CREDO.

                Po uzyskaniu dostępu pobrane
                dane zostaną zapisane lokalnie,
                zindeksowane i porównane z
                Twoimi detekcjami.

            </p>


            <p class="research-muted">

                Nie próbujemy obchodzić
                autoryzacji CREDO i nie
                generujemy wyników z danych,
                których nie posiadamy.

            </p>

        `;

        return;
    }


    body.innerHTML=`

        <h3>Sieć CREDO</h3>


        <div class="research-card">

            <b class="research-good">
                AKTYWNE
            </b>

            <p>
                ${rEsc(
                    n.reason||''
                )}
            </p>

        </div>


        <div class="research-grid">

            <div class="research-card">

                Detekcje sieci

                <b>
                    ${
                        n.network_rows
                        ??0
                    }
                </b>

            </div>


            <div class="research-card">

                Urządzenia w indeksie

                <b>
                    ${
                        n.network_devices
                        ??0
                    }
                </b>

            </div>


            <div class="research-card">

                Twoje chwile
                z dopasowaniem

                <b>
                    ${
                        n.matched_local_times
                        ??0
                    }
                </b>

            </div>


            <div class="research-card">

                Inne urządzenia

                <b>
                    ${
                        n.external_devices
                        ??0
                    }
                </b>

            </div>


            <div class="research-card">

                Pary sieciowe ≤10 s

                <b>
                    ${
                        n.pair_count
                        ??0
                    }
                </b>

            </div>

        </div>


        <h3>Koincydencje sieciowe</h3>


        <div class="research-grid">

            <div class="research-card">

                WSPÓLNY TIMESTAMP

                <b>
                    ${
                        c.same_ms
                        ??0
                    }
                </b>

            </div>


            <div class="research-card">

                1–10 ms

                <b>
                    ${
                        c['1_10ms']
                        ??0
                    }
                </b>

            </div>


            <div class="research-card">

                10–100 ms

                <b>
                    ${
                        c['10_100ms']
                        ??0
                    }
                </b>

            </div>


            <div class="research-card">

                100 ms–1 s

                <b>
                    ${
                        c['100ms_1s']
                        ??0
                    }
                </b>

            </div>


            <div class="research-card">

                1–10 s

                <b>
                    ${
                        c['1_10s']
                        ??0
                    }
                </b>

            </div>

        </div>


        <p class="research-muted">

            Milisekundowe dopasowanie między
            różnymi urządzeniami jest
            kandydatem do dalszego badania,
            a nie dowodem wspólnego zjawiska.

            Zegary telefonów mogą mieć
            różne błędy synchronizacji.

        </p>


        <p class="research-muted">

            Rozpoznane własne device_id:

            ${
                (
                    n.local_device_ids
                    ||[]
                ).length

                ?

                rEsc(
                    n.local_device_ids
                    .join(', ')
                )

                :

                'jeszcze nie rozpoznano'
            }

        </p>


        ${
            rows

            ?

            `
            <table class="research-table">

                <thead>

                    <tr>
                        <th>Twoja chwila</th>
                        <th>Δt</th>
                        <th>Inne urządzenie</th>
                        <th>Device ID</th>
                        <th>Model</th>
                        <th>Użytkownik</th>
                        <th>Zespół</th>
                    </tr>

                </thead>


                <tbody>
                    ${rows}
                </tbody>

            </table>
            `

            :

            `
            <p>
                W aktualnym zakresie danych
                nie znaleziono detekcji innych
                urządzeń w przedziale ±10 s.
            </p>
            `
        }


        <p class="research-muted">

            Zakres indeksu:

            ${rEsc(
                n.first_network_time
                ||'—'
            )}

            →

            ${rEsc(
                n.last_network_time
                ||'—'
            )}

        </p>

    `;
}




/* ------------------------------------------------------------
   RENDER: CANDIDATES
   CREDO_CANDIDATES_UI_V11_5
   ------------------------------------------------------------ */


/* ============================================================
   CREDO_CANDIDATES_DYNAMIC_V12

   Dynamiczny TOP10 tworzony z researchData.unusual.
   Nie jest to klasyfikacja rodzaju cząstki.

   A/B/C = priorytet pozycji w bieżącym rankingu:
     A = #1
     B = #2–#6
     C = #7–#10

   Score = względny wynik nietypowości istniejącego backendu,
   nie prawdopodobieństwo i nie energia cząstki.
   ============================================================ */

function renderCandidates(){

    const schema={"id": "id", "timestamp": "timestamp", "class": "class", "score": "score", "pixels": "active_pixels", "peak": "peak", "elongation": null, "clusters": "clusters"};


    const unusual=
        Array.isArray(
            researchData?.unusual
        )
        ?
        researchData.unusual
        :
        [];


    function value(
        row,
        name
    ){

        const key=
            schema[name];

        if(!key){
            return null;
        }

        return row?.[key]
            ??null;
    }


    function numberValue(
        row,
        name
    ){

        // CREDO_CANDIDATES_DYNAMIC_V12_1
   // CREDO_CANDIDATES_DYNAMIC_V12_2_NO_ELONG_COLUMN — marker wersji, NIE kod wykonywalny
        // CREDO_CANDIDATES_DYNAMIC_V12_2_RUNTIME_FIX
        //
        // Brak pola NIE może być zamieniany przez
        // Number(null) na fałszywe 0.
        //
        // Dotyczy obecnie m.in. elongation, którego
        // researchData.unusual nie dostarcza.

        const raw=
            value(
                row,
                name
            );

        if(
            raw===null
            ||
            raw===undefined
            ||
            raw===""
        ){
            return null;
        }

        const n=
            Number(raw);

        return Number.isFinite(n)
            ? n
            : null;
    }


    function gradeForRank(rank){

        if(rank===1){
            return 'A';
        }

        if(rank<=6){
            return 'B';
        }

        return 'C';
    }


    function gradeBadge(grade){

        let bg='#31536d';

        if(grade==='A'){
            bg='#8b1e1e';
        }

        if(grade==='B'){
            bg='#8a6414';
        }

        return `
          <span style="
            display:inline-block;
            min-width:28px;
            text-align:center;
            font-weight:800;
            padding:3px 8px;
            border-radius:7px;
            background:${bg};
            color:#fff;
          ">
            ${rEsc(grade)}
          </span>
        `;
    }


    /*
     * Odrzucamy rekordy bez czasu lub score,
     * następnie sortujemy OD NOWA przy każdym renderze.
     */

    const ranked=
        unusual
        .filter(
            row=>{

                const timestamp=
                    value(
                        row,
                        'timestamp'
                    );

                const score=
                    numberValue(
                        row,
                        'score'
                    );

                return (
                    timestamp
                    &&
                    score!==null
                );
            }
        )
        .sort(
            (a,b)=>
                numberValue(
                    b,
                    'score'
                )
                -
                numberValue(
                    a,
                    'score'
                )
        );


    const top10=
        ranked.slice(0,10);


    /*
     * Liczymy wspólne timestampy w AKTUALNYM rankingu.
     */

    const timestampCounts=
        new Map();


    for(const row of top10){

        const timestamp=
            String(
                value(
                    row,
                    'timestamp'
                )
                ||''
            );


        timestampCounts.set(
            timestamp,
            (
                timestampCounts.get(
                    timestamp
                )
                ||0
            )
            +1
        );
    }


    function dynamicNote(
        row,
        rank
    ){

        const parts=[];

        const cls=
            String(
                value(
                    row,
                    'class'
                )
                ||''
            ).toUpperCase();


        const pixels=
            numberValue(
                row,
                'pixels'
            );


        const peak=
            numberValue(
                row,
                'peak'
            );


        const elong=
            numberValue(
                row,
                'elongation'
            );


        const timestamp=
            String(
                value(
                    row,
                    'timestamp'
                )
                ||''
            );


        const sameTime=
            timestampCounts.get(
                timestamp
            )
            ||0;


        if(rank===1){

            parts.push(
                'Aktualnie najwyższy wynik nietypowości w dynamicznym rankingu.'
            );

        }else if(rank<=3){

            parts.push(
                'Jeden z najwyżej ocenionych aktualnych kandydatów.'
            );

        }else{

            parts.push(
                'Kandydat obecnego TOP10.'
            );
        }


        if(
            cls==='TRACK'
            &&
            elong!==null
        ){

            if(elong>=5){

                parts.push(
                    'Bardzo wydłużony TRACK.'
                );

            }else if(elong>=3){

                parts.push(
                    'Wyraźnie wydłużony TRACK.'
                );
            }
        }


        if(
            pixels!==null
            &&
            pixels>=20
        ){

            parts.push(
                'Duża liczba aktywnych pikseli.'
            );
        }


        if(
            peak!==null
            &&
            peak>=150
        ){

            parts.push(
                'Wysoki peak.'
            );
        }


        if(sameTime>1){

            parts.push(
                'Wspólny timestamp z '
                +(sameTime-1)
                +' innym rekordem TOP10 — warto sprawdzić w Sieci CREDO.'
            );
        }


        return parts.join(' ');
    }


    function eventCell(row){

        const id=
            value(
                row,
                'id'
            );


        const timestamp=
            value(
                row,
                'timestamp'
            );


        if(
            id
            &&
            typeof eventLink==='function'
        ){

            return eventLink(
                id,
                timestamp
            );
        }


        return rEsc(
            timestamp
            ||'—'
        );
    }


    /*
     * CREDO_CANDIDATES_AUDIT_UI_V1
     *
     * Wizualizacja danych audit zwróconych przez backend.
     * Frontend NICZEGO tutaj nie przelicza.
     */

    function auditHTML(row){

        const audit=
            (
                row?.audit
                &&
                typeof row.audit==='object'
            )
            ?
            row.audit
            :
            null;


        if(!audit){
            return '';
        }


        const components=
            Array.isArray(
                audit.components
            )
            ?
            audit.components
            :
            [];


        function text(value){

            if(
                value===null
                ||
                value===undefined
                ||
                value===''
            ){
                return '—';
            }

            return String(value);
        }


        function num(
            value,
            digits=4
        ){

            const n=Number(value);

            if(!Number.isFinite(n)){
                return '—';
            }

            return n.toFixed(digits)
                .replace(/0+$/,'')
                .replace(/\.$/,'');
        }


        const componentRows=
            components
            .map(
                component=>{

                    const scored=
                        component?.scored
                        ===true;


                    const status=
                        scored
                        ?
                        '<span style="color:#74d99f;font-weight:700">punktowana</span>'
                        :
                        '<span style="color:#e9bd66;font-weight:700">niepunktowana</span>';


                    const zText=
                        scored
                        ?
                        num(
                            component?.z,
                            4
                        )
                        :
                        '—';


                    const contribution=
                        num(
                            component?.contribution,
                            4
                        );


                    const skip=
                        (
                            !scored
                            &&
                            component?.skip_reason
                        )
                        ?
                        `
                        <div style="
                            margin-top:5px;
                            color:#b8c6d4;
                            font-size:11px;
                            line-height:1.3;
                        ">
                            ${rEsc(
                                component.skip_reason
                            )}
                        </div>
                        `
                        :
                        '';


                    return `
                    <tr>

                        <td style="
                            padding:7px 8px;
                            vertical-align:top;
                        ">
                            <strong>
                                ${rEsc(
                                    text(
                                        component?.label
                                    )
                                )}
                            </strong>
                            ${skip}
                        </td>

                        <td style="
                            padding:7px 8px;
                            text-align:right;
                        ">
                            ${rEsc(
                                text(
                                    component?.observed
                                )
                            )}
                        </td>

                        <td style="
                            padding:7px 8px;
                            text-align:right;
                        ">
                            ${rEsc(zText)}
                        </td>

                        <td style="
                            padding:7px 8px;
                            text-align:right;
                        ">
                            ${rEsc(
                                num(
                                    component?.weight,
                                    2
                                )
                            )}
                        </td>

                        <td style="
                            padding:7px 8px;
                            text-align:right;
                            font-weight:700;
                        ">
                            ${rEsc(contribution)}
                        </td>

                        <td style="
                            padding:7px 8px;
                        ">
                            ${status}
                        </td>

                    </tr>
                    `;
                }
            )
            .join('');


        const rarity=
            (
                audit.class_rarity
                &&
                typeof audit.class_rarity==='object'
            )
            ?
            audit.class_rarity
            :
            {};


        const frequency=
            Number(
                rarity.frequency
            );


        const frequencyText=
            Number.isFinite(frequency)
            ?
            (
                frequency*100
            ).toFixed(2)
            +' %'
            :
            '—';


        const repeats=
            (
                audit.additional
                &&
                typeof audit.additional==='object'
            )
            ?
            audit.additional
            :
            {};


        const repeatedNote=
            repeats.repeated_coordinates
            ?
            `
            <div style="
                margin-top:10px;
                padding:8px 10px;
                border:1px solid #40566b;
                border-radius:7px;
                color:#b9cad9;
                background:#13202b;
            ">
                <strong>
                    Powtarzające się współrzędne
                </strong>
                — informacja dodatkowa.
                Nie zwiększa score.
            </div>
            `
            :
            '';


        return `

        <details style="
            margin-top:9px;
            border-top:1px solid #33495d;
            padding-top:8px;
        ">

            <summary style="
                display:inline-block;
                cursor:pointer;
                user-select:none;
                padding:5px 10px;
                border:1px solid #4c6b86;
                border-radius:7px;
                background:#182b3a;
                color:#d9ecff;
                font-size:12px;
                font-weight:700;
            ">
                Dlaczego?
            </summary>


            <div style="
                margin-top:10px;
                padding:11px;
                border:1px solid #344b60;
                border-radius:8px;
                background:#101b25;
                min-width:520px;
                max-width:780px;
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    gap:12px;
                    margin-bottom:10px;
                ">

                    <div>
                        <strong>
                            Audit Trail
                        </strong>

                        <div style="
                            color:#91a9bd;
                            font-size:11px;
                            margin-top:3px;
                        ">
                            ${rEsc(
                                text(
                                    audit.method
                                )
                            )}
                        </div>
                    </div>


                    <div style="
                        text-align:right;
                    ">

                        <div style="
                            font-size:18px;
                            font-weight:800;
                        ">
                            score
                            ${rEsc(
                                num(
                                    audit.score_display,
                                    2
                                )
                            )}
                        </div>

                        <div style="
                            color:#91a9bd;
                            font-size:11px;
                        ">
                            dokładnie:
                            ${rEsc(
                                num(
                                    audit.score_unrounded,
                                    6
                                )
                            )}
                        </div>

                    </div>

                </div>


                <table style="
                    width:100%;
                    border-collapse:collapse;
                    font-size:12px;
                ">

                    <thead>

                        <tr style="
                            color:#91a9bd;
                            border-bottom:1px solid #344b60;
                        ">
                            <th style="text-align:left;padding:7px 8px">
                                Cecha
                            </th>

                            <th style="text-align:right;padding:7px 8px">
                                Wartość
                            </th>

                            <th style="text-align:right;padding:7px 8px">
                                z
                            </th>

                            <th style="text-align:right;padding:7px 8px">
                                Waga
                            </th>

                            <th style="text-align:right;padding:7px 8px">
                                Wkład
                            </th>

                            <th style="text-align:left;padding:7px 8px">
                                Status
                            </th>
                        </tr>

                    </thead>

                    <tbody>
                        ${componentRows}
                    </tbody>

                </table>


                <div style="
                    margin-top:10px;
                    padding-top:10px;
                    border-top:1px solid #344b60;
                    display:grid;
                    grid-template-columns:
                        minmax(120px,1fr)
                        minmax(80px,.6fr)
                        minmax(80px,.6fr)
                        minmax(80px,.6fr);
                    gap:8px;
                    font-size:12px;
                ">

                    <div>
                        <strong>
                            Rzadkość klasy
                        </strong>
                        <br>
                        ${rEsc(
                            text(
                                rarity.class
                            )
                        )}
                    </div>

                    <div>
                        częstość
                        <br>
                        <strong>
                            ${rEsc(frequencyText)}
                        </strong>
                    </div>

                    <div>
                        waga
                        <br>
                        <strong>
                            ${rEsc(
                                num(
                                    rarity.weight,
                                    2
                                )
                            )}
                        </strong>
                    </div>

                    <div>
                        wkład
                        <br>
                        <strong>
                            ${rEsc(
                                num(
                                    rarity.contribution,
                                    4
                                )
                            )}
                        </strong>
                    </div>

                </div>


                ${repeatedNote}


                <div style="
                    margin-top:10px;
                    color:#8fa6b9;
                    font-size:11px;
                    line-height:1.4;
                ">
                    ${rEsc(
                        text(
                            audit.interpretation
                        )
                    )}
                </div>

            </div>

        </details>
        `;
    }


    const prepared=
        top10.map(
            (row,index)=>{

                const rank=
                    index+1;


                return {
                    raw:row,
                    rank,
                    grade:
                        gradeForRank(
                            rank
                        ),
                    timestamp:
                        value(
                            row,
                            'timestamp'
                        ),
                    cls:
                        value(
                            row,
                            'class'
                        )
                        ||'—',
                    score:
                        numberValue(
                            row,
                            'score'
                        ),
                    pixels:
                        numberValue(
                            row,
                            'pixels'
                        ),
                    peak:
                        numberValue(
                            row,
                            'peak'
                        ),
                    elongation:
                        numberValue(
                            row,
                            'elongation'
                        ),
                    special:
                        (
                            timestampCounts.get(
                                String(
                                    value(
                                        row,
                                        'timestamp'
                                    )
                                    ||''
                                )
                            )
                            ||0
                        )>1,
                    note:
                        dynamicNote(
                            row,
                            rank
                        )
                };
            }
        );


    const countA=
        prepared.filter(
            x=>x.grade==='A'
        ).length;


    const countB=
        prepared.filter(
            x=>x.grade==='B'
        ).length;


    const countC=
        prepared.filter(
            x=>x.grade==='C'
        ).length;


    const rows=
        prepared.map(
            item=>`

<tr>

    <td>
        <b>#${item.rank}</b>
    </td>

    <td>

        ${gradeBadge(item.grade)}

        ${
            item.special
            ?
            '<br><small style="color:#60d7ff">WSPÓLNY TIMESTAMP</small>'
            :
            ''
        }

    </td>

    <td>
        ${eventCell(item.raw)}
    </td>

    <td>
        ${rEsc(item.cls)}
    </td>

    <td>
        ${
            item.score===null
            ?
            '—'
            :
            fmt(
                item.score,
                2
            )
        }
    </td>

    <td>
        ${
            item.pixels===null
            ?
            '—'
            :
            rEsc(
                item.pixels
            )
        }
    </td>

    <td>
        ${
            item.peak===null
            ?
            '—'
            :
            rEsc(
                item.peak
            )
        }
    </td>

    <td style="
        min-width:330px;
        white-space:normal;
    ">
        ${rEsc(item.note)}

        ${auditHTML(item.raw)}
    </td>

</tr>
`
        )
        .join('');


    const newest=
        ranked
        .map(
            row=>
                value(
                    row,
                    'timestamp'
                )
        )
        .filter(Boolean)
        .sort()
        .at(-1)
        ||'—';


    const leader=
        prepared[0]
        ||null;


    const shared=
        prepared.filter(
            item=>item.special
        );


    let highlights='';


    if(leader){

        highlights+=`

<p>

    <strong>#1</strong>
    — aktualnie najwyższy kandydat:

    ${rEsc(
        String(
            leader.cls
        )
    )},

    score
    ${
        leader.score===null
        ?
        '—'
        :
        fmt(
            leader.score,
            2
        )
    }.

</p>
`;
    }


    if(shared.length>=2){

        highlights+=`

<p>

    <strong>
        Wspólny timestamp
    </strong>

    — w bieżącym TOP10 znajduje się
    ${shared.length}
    rekordów należących do co najmniej jednej
    powtarzającej się chwili.

    To jest kandydat do późniejszej weryfikacji
    względem innych urządzeń w Sieci CREDO.

</p>
`;
    }


    if(!ranked.length){

        body.innerHTML=`

<h3>
    Kandydaci do dalszej analizy
</h3>

<p class="research-muted">
    Backend nie zwrócił obecnie rekordów
    do dynamicznego rankingu.
</p>
`;

        return;
    }


    body.innerHTML=`

<h3>
    Kandydaci do dalszej analizy
</h3>


<p class="research-muted">

    Dynamiczny TOP10 jest teraz przeliczany
    z aktualnego wyniku
    <code>researchData.unusual</code>
    przy każdym odświeżeniu BADANIA.

    A / B / C oznacza wyłącznie priorytet pozycji
    w bieżącym rankingu, a nie pewność,
    że detekcja pochodzi od konkretnego rodzaju cząstki.

    Wynik jest względnym score nietypowości,
    a nie prawdopodobieństwem ani energią cząstki.

</p>


<div class="research-grid">

    <div class="research-card">

        <b style="font-size:28px">
            ${countA}
        </b>

        <div>
            Priorytet A
        </div>

        <small>
            miejsce #1
        </small>

    </div>


    <div class="research-card">

        <b style="font-size:28px">
            ${countB}
        </b>

        <div>
            Priorytet B
        </div>

        <small>
            miejsca #2–#6
        </small>

    </div>


    <div class="research-card">

        <b style="font-size:28px">
            ${countC}
        </b>

        <div>
            Priorytet C
        </div>

        <small>
            miejsca #7–#10
        </small>

    </div>


    <div class="research-card">

        <b style="font-size:28px">
            ${ranked.length}
        </b>

        <div>
            Pula kandydatów
        </div>

        <small>
            ${ranked.length} rekordów unusual · najnowszy:
            ${rEsc(newest)}
        </small>

    </div>

</div>


<div class="research-card">

    <b>
        Najważniejsze obecnie
    </b>

    ${
        highlights
        ||
        '<p>Brak dodatkowych wyróżnień.</p>'
    }

</div>


<table class="research-table">

    <thead>

        <tr>
            <th>#</th>
            <th>Priorytet</th>
            <th>Czas</th>
            <th>Klasa</th>
            <th>Wynik</th>
            <th>Piksele</th>
            <th>Peak</th>

            <th>Automatyczna notatka</th>
        </tr>

    </thead>

    <tbody>
        ${rows}
    </tbody>

</table>


<p class="research-muted">

    Ranking jest generowany z aktualnych danych
    za każdym ponownym pobraniem
    <code>/api/research</code>.

    Dawny ręcznie wpisany TOP10 z 14.09.2026
    nie jest już źródłem tej tabeli.

    Potwierdzenie czasowe przez inne urządzenia
    nadal powinno być oceniane osobno
    w zakładce Sieć CREDO.

</p>
`;

}




/*
 * CREDO_BASELINE_ARCHIVE_UI_V1
 *
 * BADANIA -> Baseline
 *
 * Dane pochodzą wyłącznie z
 * researchData.baseline_archive.
 *
 * UI nie przelicza uptime ani ekspozycji.
 */

function renderBaseline(){

    const b=
        (
            researchData?.baseline_archive
            &&
            typeof researchData.baseline_archive==='object'
        )
        ?
        researchData.baseline_archive
        :
        null;


    if(!b){

        body.innerHTML=`

        <h3>
            Baseline archiwum
        </h3>

        <div class="research-card">

            <b>
                BRAK DANYCH BASELINE
            </b>

            <p>
                Backend nie zwrócił
                <code>baseline_archive</code>.
            </p>

        </div>
        `;

        return;
    }


    const coverage=
        b.coverage
        &&
        typeof b.coverage==='object'
        ?
        b.coverage
        :
        {};


    const activity=
        b.activity
        &&
        typeof b.activity==='object'
        ?
        b.activity
        :
        {};


    const classes=
        Array.isArray(b.classes)
        ?
        b.classes
        :
        [];


    const features=
        b.features
        &&
        typeof b.features==='object'
        ?
        b.features
        :
        {};


    const limitations=
        Array.isArray(b.limitations)
        ?
        b.limitations
        :
        [];


    function bText(value){

        if(
            value===null
            ||
            value===undefined
            ||
            value===''
        ){
            return '—';
        }

        return String(value);
    }


    function bNum(
        value,
        digits=2
    ){

        const n=Number(value);

        if(!Number.isFinite(n)){
            return '—';
        }

        return n
            .toFixed(digits)
            .replace(/0+$/,'')
            .replace(/\.$/,'');
    }


    function bFeatureLabel(key){

        if(key==='active_pixels'){
            return 'Aktywne piksele';
        }

        if(key==='peak'){
            return 'Jasność maksymalna';
        }

        if(key==='clusters'){
            return 'Liczba klastrów';
        }

        return key;
    }


    const days=
        Array.isArray(
            activity.per_day
        )
        ?
        activity.per_day
        :
        [];


    const maxDay=
        Math.max(
            1,
            ...days.map(
                item=>
                    Number(
                        item?.count
                    )
                    ||0
            )
        );


    const dayRows=
        days.map(
            item=>{

                const count=
                    Number(
                        item?.count
                    )
                    ||0;

                const width=
                    Math.max(
                        1,
                        Math.round(
                            100
                            *
                            count
                            /
                            maxDay
                        )
                    );

                return `
                <tr>

                    <td>
                        ${rEsc(
                            bText(
                                item?.date
                            )
                        )}
                    </td>

                    <td style="
                        text-align:right;
                        font-weight:700;
                        width:70px;
                    ">
                        ${count}
                    </td>

                    <td style="
                        width:45%;
                    ">

                        <div style="
                            height:8px;
                            border-radius:999px;
                            background:#182a39;
                            overflow:hidden;
                        ">

                            <div style="
                                width:${width}%;
                                height:100%;
                                background:#45b9ef;
                            "></div>

                        </div>

                    </td>

                </tr>
                `;
            }
        )
        .join('');


    const classRows=
        classes.map(
            item=>`

            <tr>

                <td>
                    <strong>
                        ${rEsc(
                            bText(
                                item?.class
                            )
                        )}
                    </strong>
                </td>

                <td style="
                    text-align:right;
                ">
                    ${rEsc(
                        bText(
                            item?.count
                        )
                    )}
                </td>

                <td style="
                    text-align:right;
                ">
                    ${rEsc(
                        bNum(
                            item?.percent,
                            2
                        )
                    )} %
                </td>

            </tr>
            `
        )
        .join('');


    const featureKeys=[
        'active_pixels',
        'peak',
        'clusters'
    ];


    const featureRows=
        featureKeys.map(
            key=>{

                const x=
                    features?.[key]
                    &&
                    typeof features[key]==='object'
                    ?
                    features[key]
                    :
                    {};


                const mad=
                    Number(
                        x.mad
                    );


                const zeroMad=
                    Number.isFinite(mad)
                    &&
                    mad===0;


                return `

                <tr>

                    <td>

                        <strong>
                            ${rEsc(
                                bFeatureLabel(key)
                            )}
                        </strong>

                        ${
                            zeroMad
                            ?
                            `
                            <div style="
                                margin-top:3px;
                                color:#e7bc63;
                                font-size:11px;
                            ">
                                MAD = 0 — brak odpornej
                                zmienności tej cechy
                            </div>
                            `
                            :
                            ''
                        }

                    </td>

                    <td style="text-align:right">
                        ${rEsc(
                            bText(
                                x.n
                            )
                        )}
                    </td>

                    <td style="text-align:right">
                        ${rEsc(
                            bNum(
                                x.median,
                                4
                            )
                        )}
                    </td>

                    <td style="text-align:right">
                        ${rEsc(
                            bNum(
                                x.mad,
                                4
                            )
                        )}
                    </td>

                    <td style="text-align:right">
                        ${rEsc(
                            bNum(
                                x.robust_scale,
                                4
                            )
                        )}
                    </td>

                    <td style="text-align:right">
                        ${rEsc(
                            bNum(
                                x.mean,
                                4
                            )
                        )}
                    </td>

                    <td style="text-align:right">
                        ${
                            rEsc(
                                bNum(
                                    x.min,
                                    4
                                )
                            )
                        }
                        –
                        ${
                            rEsc(
                                bNum(
                                    x.max,
                                    4
                                )
                            )
                        }
                    </td>

                </tr>
                `;
            }
        )
        .join('');


    const limitationHTML=
        limitations.length
        ?
        `
        <ul style="
            margin:8px 0 0 18px;
            padding:0;
            line-height:1.5;
        ">
            ${
                limitations
                .map(
                    text=>`
                    <li>
                        ${rEsc(
                            bText(text)
                        )}
                    </li>
                    `
                )
                .join('')
            }
        </ul>
        `
        :
        '';


    body.innerHTML=`

    <div id="credo-baseline-v1">

        <div style="
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
            gap:18px;
            margin-bottom:14px;
        ">

            <div>

                <h3 style="
                    margin:0 0 4px 0;
                ">
                    Baseline archiwum
                </h3>

                <div class="research-muted">
                    Opis typowego stanu danych zapisanych
                    lokalnie w CREDO Analyzer.
                </div>

            </div>


            <div style="
                border:1px solid #9d7627;
                background:#352b18;
                color:#ffd77a;
                border-radius:8px;
                padding:6px 10px;
                font-size:12px;
                font-weight:700;
                white-space:nowrap;
            ">
                WSTĘPNY · BEZ NORMALIZACJI UPTIME
            </div>

        </div>


        <div
          class="research-card"
          style="
            border-color:#80652d;
            background:#1d1b14;
            margin-bottom:14px;
          "
        >

            <strong style="
                color:#ffd77a;
            ">
                Ważne ograniczenie
            </strong>

            <p style="
                margin-bottom:0;
            ">
                To jest baseline
                <strong>lokalnego archiwum</strong>,
                a nie częstość zdarzeń skorygowana
                o czas aktywnej pracy detektora.
                Godzina bez detekcji nie oznacza
                automatycznie godziny działającego
                detektora bez zdarzeń.
            </p>

            ${limitationHTML}

        </div>


        <h3>
            Pokrycie danych
        </h3>

        <div class="research-grid">

            <div class="research-card">
                Detekcje w baseline
                <b>
                    ${rEsc(
                        bText(
                            coverage.event_count
                        )
                    )}
                </b>
            </div>

            <div class="research-card">
                Zakres archiwum
                <b>
                    ${rEsc(
                        bNum(
                            coverage.span_days,
                            2
                        )
                    )} dni
                </b>
            </div>

            <div class="research-card">
                Godziny z ≥1 detekcją
                <b>
                    ${rEsc(
                        bText(
                            coverage.nonzero_hours
                        )
                    )}
                </b>
            </div>

            <div class="research-card">
                Godziny kalendarzowe
                <b>
                    ${rEsc(
                        bText(
                            coverage.calendar_hours
                        )
                    )}
                </b>
            </div>

            <div class="research-card">
                Godziny bez wpisu
                <b>
                    ${rEsc(
                        bText(
                            coverage.zero_event_calendar_hours
                        )
                    )}
                </b>
                <small style="
                    display:block;
                    margin-top:5px;
                    color:#91a9bd;
                ">
                    nie interpretujemy jako uptime
                </small>
            </div>

        </div>


        <div
          class="research-card"
          style="margin-top:10px"
        >

            <div style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:14px;
            ">

                <div>
                    <span class="research-muted">
                        Pierwsza detekcja w baseline
                    </span>
                    <br>
                    <strong>
                        ${rEsc(
                            bText(
                                coverage.first_event
                            )
                        )}
                    </strong>
                </div>

                <div>
                    <span class="research-muted">
                        Ostatnia detekcja w baseline
                    </span>
                    <br>
                    <strong>
                        ${rEsc(
                            bText(
                                coverage.last_event
                            )
                        )}
                    </strong>
                </div>

            </div>

        </div>


        <h3 style="margin-top:20px">
            Aktywność archiwum
        </h3>

        <div class="research-grid">

            <div class="research-card">

                Ostatnie 24 h archiwum

                <b>
                    ${rEsc(
                        bText(
                            activity.latest_24h_events
                        )
                    )}
                </b>

                <small style="
                    display:block;
                    margin-top:5px;
                    color:#91a9bd;
                ">
                    liczone względem ostatniej
                    zapisanej detekcji
                </small>

            </div>

            <div class="research-card">

                Mediana aktywnej godziny

                <b>
                    ${rEsc(
                        bNum(
                            activity.nonzero_hour_median,
                            3
                        )
                    )}
                </b>

                <small style="
                    display:block;
                    margin-top:5px;
                    color:#91a9bd;
                ">
                    tylko godziny z ≥1 wpisem
                </small>

            </div>

            <div class="research-card">

                Średnia aktywnej godziny

                <b>
                    ${rEsc(
                        bNum(
                            activity.nonzero_hour_mean,
                            3
                        )
                    )}
                </b>

            </div>

            <div class="research-card">

                Maksimum aktywnej godziny

                <b>
                    ${rEsc(
                        bText(
                            activity.nonzero_hour_max
                        )
                    )}
                </b>

            </div>

        </div>


        <div
          class="research-card"
          style="margin-top:10px"
        >

            <strong>
                Detekcje według dnia
            </strong>

            ${
                dayRows
                ?
                `
                <table
                  class="research-table"
                  style="margin-top:8px"
                >
                    <thead>
                        <tr>
                            <th>Dzień</th>
                            <th style="text-align:right">
                                Liczba
                            </th>
                            <th>
                                Względna liczba wpisów
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        ${dayRows}
                    </tbody>
                </table>
                `
                :
                '<p>Brak danych dziennych.</p>'
            }

        </div>


        <h3 style="margin-top:20px">
            Rozkład klas
        </h3>

        <div class="research-card">

            ${
                classRows
                ?
                `
                <table class="research-table">

                    <thead>
                        <tr>
                            <th>Klasa</th>
                            <th style="text-align:right">
                                Liczba
                            </th>
                            <th style="text-align:right">
                                Udział
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        ${classRows}
                    </tbody>

                </table>
                `
                :
                '<p>Brak danych klas.</p>'
            }

        </div>


        <h3 style="margin-top:20px">
            Typowe cechy detekcji
        </h3>

        <div class="research-card">

            <table class="research-table">

                <thead>

                    <tr>
                        <th>Cecha</th>
                        <th style="text-align:right">
                            n
                        </th>
                        <th style="text-align:right">
                            Mediana
                        </th>
                        <th style="text-align:right">
                            MAD
                        </th>
                        <th style="text-align:right">
                            Robust scale
                        </th>
                        <th style="text-align:right">
                            Średnia
                        </th>
                        <th style="text-align:right">
                            Min–max
                        </th>
                    </tr>

                </thead>

                <tbody>
                    ${featureRows}
                </tbody>

            </table>


            <p class="research-muted">
                MAD to medianowe odchylenie bezwzględne.
                Robust scale = 1.4826 × MAD.
                Są to statystyki opisowe archiwum,
                nie ocena prawdopodobieństwa
                pochodzenia cząstki.
            </p>

        </div>


        <p
          class="research-muted"
          style="margin-top:14px"
        >
            ${rEsc(
                bText(
                    b.interpretation
                )
            )}
        </p>

    </div>
    `;
}


/*
 * CREDO_RESEARCH_JOURNAL_UI_V1
 *
 * BADANIA -> Journal
 *
 * Journal jest append-only po stronie backendu.
 * UI nie posiada funkcji edycji ani kasowania.
 */

async function renderJournal(){

    body.innerHTML=`

    <h3>
        Research Journal
    </h3>

    <div class="research-card">
        Pobieranie dziennika…
    </div>
    `;


    let journal=null;


    try{

        const response=
            await fetch(
                '/api/research-journal?limit=100',
                {
                    cache:'no-store'
                }
            );


        if(!response.ok){

            throw new Error(
                'HTTP '+response.status
            );
        }


        journal=
            await response.json();

    }catch(error){

        if(currentTab!=='journal'){
            return;
        }

        body.innerHTML=`

        <h3>
            Research Journal
        </h3>

        <div class="research-card">

            <b class="research-bad">
                BŁĄD ODCZYTU JOURNALU
            </b>

            <p>
                ${rEsc(
                    String(
                        error?.message
                        || error
                    )
                )}
            </p>

        </div>
        `;

        return;
    }


    if(currentTab!=='journal'){
        return;
    }


    const entries=
        Array.isArray(
            journal?.entries
        )
        ?
        journal.entries
        :
        [];


    function jText(value){

        if(
            value===null
            ||
            value===undefined
            ||
            value===''
        ){
            return '—';
        }

        return String(value);
    }


    function jKind(kind){

        const labels={
            candidate_review:
                'Kandydat',

            coincidence_review:
                'Koincydencja',

            baseline_snapshot:
                'Baseline',

            manual_note:
                'Notatka'
        };

        return labels[kind]
            || jText(kind);
    }


    function jTime(value){

        if(!value){
            return '—';
        }

        const d=
            new Date(value);


        if(
            Number.isNaN(
                d.getTime()
            )
        ){
            return String(value);
        }


        const pad=
            n=>
                String(n)
                .padStart(2,'0');


        return (
            d.getUTCFullYear()
            +'-'
            +pad(
                d.getUTCMonth()+1
            )
            +'-'
            +pad(
                d.getUTCDate()
            )
            +' '
            +pad(
                d.getUTCHours()
            )
            +':'
            +pad(
                d.getUTCMinutes()
            )
            +':'
            +pad(
                d.getUTCSeconds()
            )
            +' UTC'
        );
    }


    function jHash(value){

        const text=
            String(
                value
                ||''
            );

        if(!text){
            return '—';
        }

        if(text.length<=16){
            return text;
        }

        return (
            text.slice(0,12)
            +'…'
            +text.slice(-6)
        );
    }


    function jSnapshot(entry){

        const snapshot=
            entry?.snapshot;


        if(
            snapshot===null
            ||
            snapshot===undefined
        ){
            return '';
        }


        let text='';


        try{

            text=JSON.stringify(
                snapshot,
                null,
                2
            );

        }catch(_){

            text=String(
                snapshot
            );
        }


        return `

        <details style="
            margin-top:7px;
        ">

            <summary style="
                cursor:pointer;
                color:#9dc2dd;
            ">
                Snapshot danych
            </summary>

            <pre style="
                margin:8px 0 0 0;
                padding:9px;
                max-height:250px;
                overflow:auto;
                white-space:pre-wrap;
                overflow-wrap:anywhere;
                border:1px solid #30475b;
                border-radius:7px;
                background:#0a1721;
                font-size:11px;
            ">${rEsc(text)}</pre>

        </details>
        `;
    }


    const rows=
        entries.map(
            entry=>`

            <tr>

                <td style="
                    white-space:nowrap;
                ">
                    #${rEsc(
                        jText(
                            entry?.id
                        )
                    )}
                </td>

                <td style="
                    white-space:nowrap;
                ">
                    ${rEsc(
                        jTime(
                            entry?.at
                        )
                    )}
                </td>

                <td>
                    <strong>
                        ${rEsc(
                            jKind(
                                entry?.kind
                            )
                        )}
                    </strong>
                </td>

                <td>
                    ${
                        rEsc(
                            jText(
                                entry?.subject_type
                            )
                        )
                    }

                    ${
                        entry?.subject_id
                        ?
                        `
                        <div class="research-muted">
                            ${rEsc(
                                String(
                                    entry.subject_id
                                )
                            )}
                        </div>
                        `
                        :
                        ''
                    }
                </td>

                <td>

                    <strong>
                        ${rEsc(
                            jText(
                                entry?.title
                            )
                        )}
                    </strong>

                    ${
                        entry?.note
                        ?
                        `
                        <div style="
                            margin-top:5px;
                            white-space:pre-wrap;
                        ">
                            ${rEsc(
                                String(
                                    entry.note
                                )
                            )}
                        </div>
                        `
                        :
                        ''
                    }

                    ${
                        entry?.algorithm_version
                        ?
                        `
                        <div class="research-muted"
                             style="margin-top:5px">
                            wersja:
                            ${rEsc(
                                String(
                                    entry.algorithm_version
                                )
                            )}
                        </div>
                        `
                        :
                        ''
                    }

                    ${jSnapshot(entry)}

                </td>

                <td>

                    <code
                      title="${rEsc(
                          jText(
                              entry?.entry_hash
                          )
                      )}"
                      style="
                        font-size:11px;
                        overflow-wrap:anywhere;
                      "
                    >
                        ${rEsc(
                            jHash(
                                entry?.entry_hash
                            )
                        )}
                    </code>

                </td>

            </tr>
            `
        )
        .join('');


    const chainGood=
        journal?.chain_ok
        ===true;


    body.innerHTML=`

    <div id="credo-journal-v1">

        <div style="
            display:flex;
            align-items:flex-start;
            justify-content:space-between;
            gap:14px;
            margin-bottom:14px;
        ">

            <div>

                <h3 style="
                    margin:0 0 4px 0;
                ">
                    Research Journal
                </h3>

                <div class="research-muted">
                    Trwały dziennik decyzji i snapshotów
                    badawczych CREDO Analyzer.
                </div>

            </div>


            <div style="
                display:flex;
                gap:8px;
                align-items:center;
            ">

                <span style="
                    padding:6px 10px;
                    border-radius:7px;
                    border:1px solid ${
                        chainGood
                        ? '#26754b'
                        : '#9b3d3d'
                    };
                    color:${
                        chainGood
                        ? '#66dc95'
                        : '#ff8e8e'
                    };
                    font-weight:700;
                    font-size:12px;
                    white-space:nowrap;
                ">
                    ${
                        chainGood
                        ? 'ŁAŃCUCH SHA-256 OK'
                        : 'BŁĄD ŁAŃCUCHA'
                    }
                </span>

                <button
                  type="button"
                  id="journal-reload"
                >
                    Odśwież
                </button>

            </div>

        </div>


        <div class="research-grid">

            <div class="research-card">

                Liczba wpisów

                <b>
                    ${rEsc(
                        jText(
                            journal?.total
                            ??0
                        )
                    )}
                </b>

            </div>

            <div class="research-card">

                Tryb

                <b>
                    APPEND-ONLY
                </b>

            </div>

            <div class="research-card">

                Integralność

                <b class="${
                    chainGood
                    ? 'research-good'
                    : 'research-bad'
                }">
                    ${
                        chainGood
                        ? 'OK'
                        : 'BŁĄD'
                    }
                </b>

            </div>

            <div class="research-card">

                Łańcuch

                <b>
                    SHA-256
                </b>

            </div>

        </div>


        <div
          class="research-card"
          style="
            margin-top:12px;
            border-color:#305069;
          "
        >

            <strong>
                Nowa ręczna notatka
            </strong>

            <form
              id="journal-manual-form"
              style="
                margin-top:10px;
                display:grid;
                gap:9px;
              "
            >

                <input
                  id="journal-title"
                  type="text"
                  maxlength="160"
                  placeholder="Tytuł, np. Kontrola detekcji z 17.09"
                  style="
                    width:100%;
                    box-sizing:border-box;
                  "
                >

                <textarea
                  id="journal-note"
                  maxlength="4000"
                  required
                  rows="4"
                  placeholder="Treść notatki badawczej…"
                  style="
                    width:100%;
                    box-sizing:border-box;
                    resize:vertical;
                  "
                ></textarea>

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:10px;
                ">

                    <span
                      id="journal-form-status"
                      class="research-muted"
                    >
                        Wpisu po zapisaniu nie można
                        edytować ani usunąć.
                    </span>

                    <button
                      type="submit"
                      id="journal-save-note"
                    >
                        Zapisz do Journalu
                    </button>

                </div>

            </form>

        </div>


        <div
          class="research-card"
          style="
            margin-top:12px;
          "
        >

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:12px;
            ">

                <div>

                    <strong>
                        Snapshot aktualnego baseline
                    </strong>

                    <div class="research-muted"
                         style="margin-top:4px">
                        Zapisze aktualne pokrycie,
                        aktywność, klasy i statystyki
                        cech z Baseline archiwum.
                    </div>

                </div>

                <button
                  type="button"
                  id="journal-save-baseline"
                >
                    Zapisz snapshot
                </button>

            </div>

            <div
              id="journal-baseline-status"
              class="research-muted"
              style="margin-top:7px"
            ></div>

        </div>


        <h3 style="
            margin-top:20px;
        ">
            Historia
        </h3>


        <div class="research-card">

            ${
                rows
                ?
                `
                <table class="research-table">

                    <thead>

                        <tr>
                            <th>#</th>
                            <th>Czas</th>
                            <th>Typ</th>
                            <th>Obiekt</th>
                            <th>Wpis</th>
                            <th>Hash</th>
                        </tr>

                    </thead>

                    <tbody>
                        ${rows}
                    </tbody>

                </table>
                `
                :
                `
                <p style="margin:0">
                    Journal jest pusty.
                    Pierwszy wpis powstanie dopiero,
                    gdy świadomie go zapiszesz.
                </p>
                `
            }

        </div>


        <p
          class="research-muted"
          style="margin-top:12px"
        >
            Research Journal jest odseparowany od
            zwykłych notatek detekcji i historii zmian
            klas. Backend blokuje UPDATE oraz DELETE
            tabeli Journalu, a każdy wpis jest powiązany
            z poprzednim przez SHA-256.
        </p>

    </div>
    `;


    async function postJournal(payload){

        const response=
            await fetch(
                '/api/research-journal',
                {
                    method:'POST',

                    headers:{
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


        let data={};


        try{

            data=
                await response.json();

        }catch(_){
            data={};
        }


        if(!response.ok){

            throw new Error(
                data?.error
                ||(
                    'HTTP '
                    +response.status
                )
            );
        }


        return data;
    }


    const reload=
        document.getElementById(
            'journal-reload'
        );


    if(reload){

        reload.onclick=()=>{
            renderJournal();
        };
    }


    const form=
        document.getElementById(
            'journal-manual-form'
        );


    if(form){

        form.onsubmit=
            async event=>{

                event.preventDefault();


                const titleEl=
                    document.getElementById(
                        'journal-title'
                    );

                const noteEl=
                    document.getElementById(
                        'journal-note'
                    );

                const statusEl=
                    document.getElementById(
                        'journal-form-status'
                    );

                const button=
                    document.getElementById(
                        'journal-save-note'
                    );


                const title=
                    String(
                        titleEl?.value
                        ||''
                    ).trim();

                const note=
                    String(
                        noteEl?.value
                        ||''
                    ).trim();


                if(!note){

                    if(statusEl){
                        statusEl.textContent=
                            'Wpisz treść notatki.';
                    }

                    return;
                }


                if(button){
                    button.disabled=true;
                }

                if(statusEl){
                    statusEl.textContent=
                        'Zapisywanie…';
                }


                try{

                    await postJournal({
                        kind:
                            'manual_note',

                        subject_type:
                            'general',

                        subject_id:
                            null,

                        title:
                            (
                                title
                                ||
                                'Notatka ręczna'
                            ),

                        note:
                            note,

                        algorithm_version:
                            null,

                        snapshot:
                            null
                    });


                    if(currentTab==='journal'){
                        await renderJournal();
                    }

                }catch(error){

                    if(statusEl){

                        statusEl.textContent=
                            'Błąd: '
                            +String(
                                error?.message
                                ||error
                            );
                    }

                    if(button){
                        button.disabled=false;
                    }
                }
            };
    }


    const baselineButton=
        document.getElementById(
            'journal-save-baseline'
        );


    if(baselineButton){

        baselineButton.onclick=
            async()=>{

                const statusEl=
                    document.getElementById(
                        'journal-baseline-status'
                    );

                const b=
                    researchData
                    ?.baseline_archive;


                if(
                    !b
                    ||
                    typeof b!=='object'
                ){

                    if(statusEl){

                        statusEl.textContent=
                            'Brak baseline_archive.';
                    }

                    return;
                }


                baselineButton.disabled=true;

                if(statusEl){
                    statusEl.textContent=
                        'Zapisywanie snapshotu…';
                }


                const a=
                    b.activity
                    ||{};


                const snapshot={

                    version:
                        b.version
                        ??null,

                    scope:
                        b.scope
                        ??null,

                    status:
                        b.status
                        ??null,

                    uptime_normalized:
                        b.uptime_normalized
                        ??false,

                    exposure_normalized:
                        b.exposure_normalized
                        ??false,

                    coverage:
                        b.coverage
                        ||{},

                    activity:{
                        nonzero_hour_median:
                            a.nonzero_hour_median
                            ??null,

                        nonzero_hour_mean:
                            a.nonzero_hour_mean
                            ??null,

                        nonzero_hour_max:
                            a.nonzero_hour_max
                            ??null,

                        latest_24h_events:
                            a.latest_24h_events
                            ??null
                    },

                    classes:
                        b.classes
                        ||[],

                    features:
                        b.features
                        ||{}
                };


                try{

                    await postJournal({

                        kind:
                            'baseline_snapshot',

                        subject_type:
                            'baseline',

                        subject_id:
                            'archive',

                        title:
                            'Snapshot baseline archiwum',

                        note:
                            (
                                'Ręczny zapis aktualnego '
                                +'Baseline archiwum CREDO.'
                            ),

                        algorithm_version:
                            (
                                b.version
                                ?
                                'baseline_archive/'
                                +String(
                                    b.version
                                )
                                :
                                null
                            ),

                        snapshot:
                            snapshot
                    });


                    if(currentTab==='journal'){
                        await renderJournal();
                    }

                }catch(error){

                    if(statusEl){

                        statusEl.textContent=
                            'Błąd: '
                            +String(
                                error?.message
                                ||error
                            );
                    }

                    baselineButton.disabled=false;
                }
            };
    }
}



/* ============================================================
   CREDO_DIAGNOSTIC_TRACE_UI_V1

   Diagnostic Trace / near-misses.

   Kandydaci:
   - ranking z istniejącego researchData.unusual
   - TOP10 = pierwsze 10 prawidłowych rekordów wg score
   - near-miss = kolejne pozycje #11–#15
   - gap = różnica do aktualnego #10

   Koincydencje:
   - próg istniejącego algorytmu = 10 000 ms
   - backend zachowuje pierwszą WYKLUCZONĄ parę >10 s
     dla każdego zdarzenia
   - nie jest to nowy próg ani dowód fizycznego związku
   ============================================================ */


function traceEscV1(
    value
){

    return String(
        value
        ??''
    )
    .replace(
        /&/g,
        '&amp;'
    )
    .replace(
        /</g,
        '&lt;'
    )
    .replace(
        />/g,
        '&gt;'
    )
    .replace(
        /"/g,
        '&quot;'
    )
    .replace(
        /'/g,
        '&#39;'
    );
}


function traceEnsureStyleV1(){

    const id=
        'credo-diagnostic-trace-style-v1';

    if(
        document.getElementById(id)
    ){
        return;
    }


    const style=
        document.createElement(
            'style'
        );

    style.id=id;

    style.textContent=`

#credo-diagnostic-trace-v1{
    display:grid;
    gap:14px;
}

.trace-v1-head{
    display:flex;
    justify-content:space-between;
    gap:14px;
    align-items:flex-start;
}

.trace-v1-head h3{
    margin:0 0 4px 0;
}

.trace-v1-sub{
    color:#94adbf;
    font-size:13px;
}

.trace-v1-badge{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    height:28px;
    padding:0 10px;
    border-radius:8px;
    border:1px solid #3b6680;
    background:rgba(42,79,103,.20);
    color:#add0e6;
    font-size:11px;
    font-weight:750;
    white-space:nowrap;
}

.trace-v1-grid{
    display:grid;
    grid-template-columns:
        repeat(4,minmax(0,1fr));
    gap:10px;
}

.trace-v1-card{
    border:1px solid #29465a;
    border-radius:9px;
    background:#091925;
    padding:11px 12px;
    min-height:72px;
    box-sizing:border-box;
}

.trace-v1-card span{
    display:block;
    color:#9db3c4;
    font-size:12px;
}

.trace-v1-card strong{
    display:block;
    margin-top:5px;
    color:#edf6fc;
    font-size:21px;
}

.trace-v1-card small{
    display:block;
    margin-top:4px;
    color:#708da1;
    font-size:11px;
}

.trace-v1-section{
    border:1px solid #29465a;
    border-radius:10px;
    background:#091925;
    padding:12px;
}

.trace-v1-section h3{
    margin:0 0 4px 0;
    font-size:16px;
}

.trace-v1-note{
    color:#8faabd;
    font-size:12px;
    line-height:1.45;
}

.trace-v1-table{
    width:100%;
    border-collapse:collapse;
    margin-top:11px;
    font-size:12px;
}

.trace-v1-table th,
.trace-v1-table td{
    padding:8px 7px;
    border-bottom:1px solid #203b4e;
    text-align:left;
    vertical-align:top;
}

.trace-v1-table th{
    color:#a9c1d1;
    font-size:11px;
}

.trace-v1-table tr:last-child td{
    border-bottom:0;
}

.trace-v1-rank{
    font-weight:800;
    color:#dbeaf5;
}

.trace-v1-gap{
    color:#f0c762;
    font-weight:750;
}

.trace-v1-good{
    color:#65d992;
}

.trace-v1-muted{
    color:#7794a8;
    font-size:11px;
}

.trace-v1-reason{
    margin-top:3px;
    color:#9eb4c4;
    font-size:11px;
}

.trace-v1-warning{
    margin-top:10px;
    padding:9px 10px;
    border:1px solid rgba(182,135,42,.40);
    border-radius:8px;
    background:rgba(109,79,19,.13);
    color:#d7bd7c;
    font-size:11px;
    line-height:1.45;
}

@media(max-width:900px){
    .trace-v1-grid{
        grid-template-columns:
            repeat(2,minmax(0,1fr));
    }
}

`;

    document.head.appendChild(
        style
    );
}


function traceScoreRawV1(
    item
){

    const exact=
        item?.audit
        ?.score_unrounded;

    if(
        Number.isFinite(
            Number(exact)
        )
    ){
        return Number(exact);
    }


    if(
        Number.isFinite(
            Number(item?.score)
        )
    ){
        return Number(item.score);
    }


    return null;
}


function traceScoreTextV1(
    value,
    digits=3
){

    if(
        !Number.isFinite(
            Number(value)
        )
    ){
        return '—';
    }

    return Number(value)
        .toFixed(digits);
}


function traceDeltaTextV1(
    value
){

    const ms=Number(value);

    if(!Number.isFinite(ms)){
        return '—';
    }

    if(ms>=1000){

        return (
            (ms/1000)
            .toFixed(3)
            +' s'
        );
    }

    return (
        ms.toFixed(3)
        +' ms'
    );
}


function renderDiagnosticTraceV1(){

    traceEnsureStyleV1();


    const source=
        Array.isArray(
            researchData?.unusual
        )
        ?
        researchData.unusual
        :
        [];


    /*
     * Ta sama zasada, którą opisuje obecny Dynamiczny TOP10:
     * rekord musi mieć timestamp i score.
     */

    const candidates=
        source
        .filter(
            item=>
                item
                &&
                item.timestamp
                &&
                traceScoreRawV1(item)!==null
        )
        .slice()
        .sort(
            (a,b)=>
                traceScoreRawV1(b)
                -
                traceScoreRawV1(a)
        );


    const cutoff=
        candidates.length>=10
        ?
        candidates[9]
        :
        null;


    const cutoffScore=
        traceScoreRawV1(
            cutoff
        );


    const nearCandidates=
        candidates.slice(
            10,
            15
        );


    const firstCandidate=
        nearCandidates[0]
        ||null;


    const firstCandidateGap=
        (
            cutoffScore!==null
            &&
            firstCandidate
        )
        ?
        Math.max(
            0,
            cutoffScore
            -traceScoreRawV1(
                firstCandidate
            )
        )
        :
        null;


    const coincidences=
        (
            researchData?.coincidences
            &&
            typeof researchData
                .coincidences
                ==='object'
        )
        ?
        researchData.coincidences
        :
        {};


    const cutoffMs=
        Number(
            coincidences
            ?.near_miss_cutoff_ms
            ??10000
        );


    const nearPairs=
        Array.isArray(
            coincidences
            ?.near_misses
        )
        ?
        coincidences
            .near_misses
            .slice(
                0,
                10
            )
        :
        [];


    const firstPair=
        nearPairs[0]
        ||null;


    const firstPairMargin=
        Number.isFinite(
            Number(
                firstPair?.margin_ms
            )
        )
        ?
        Number(
            firstPair.margin_ms
        )
        :
        null;


    const candidateRows=
        nearCandidates.map(
            (
                item,
                index
            )=>{

                const score=
                    traceScoreRawV1(
                        item
                    );


                const gap=
                    (
                        cutoffScore!==null
                        &&
                        score!==null
                    )
                    ?
                    Math.max(
                        0,
                        cutoffScore-score
                    )
                    :
                    null;


                const reasons=
                    Array.isArray(
                        item?.reasons
                    )
                    ?
                    item.reasons
                    :
                    [];


                return `

                <tr>

                    <td class="trace-v1-rank">
                        #${11+index}
                    </td>

                    <td>
                        ${traceEscV1(
                            item?.timestamp
                            ||'—'
                        )}
                    </td>

                    <td>
                        ${traceEscV1(
                            item?.class
                            ||'—'
                        )}
                    </td>

                    <td>
                        <strong>
                            ${traceEscV1(
                                traceScoreTextV1(
                                    score
                                )
                            )}
                        </strong>
                    </td>

                    <td class="trace-v1-gap">
                        ${
                            gap===null
                            ?
                            '—'
                            :
                            '−'
                            +traceEscV1(
                                traceScoreTextV1(
                                    gap
                                )
                            )
                        }
                    </td>

                    <td>

                        Pozycja
                        <strong>
                            #${11+index}
                        </strong>
                        jest poza aktualnym TOP10.

                        ${
                            reasons.length
                            ?
                            `
                            <div class="trace-v1-reason">
                                ${traceEscV1(
                                    reasons
                                    .slice(0,2)
                                    .join(' · ')
                                )}
                            </div>
                            `
                            :
                            ''
                        }

                    </td>

                </tr>
                `;
            }
        )
        .join('');


    const pairRows=
        nearPairs.map(
            (
                pair,
                index
            )=>{

                const delta=
                    Number(
                        pair?.delta_ms
                    );

                const margin=
                    Number(
                        pair?.margin_ms
                    );


                return `

                <tr>

                    <td class="trace-v1-rank">
                        #${index+1}
                    </td>

                    <td>
                        ${traceEscV1(
                            traceDeltaTextV1(
                                delta
                            )
                        )}
                    </td>

                    <td class="trace-v1-gap">
                        +${traceEscV1(
                            traceDeltaTextV1(
                                margin
                            )
                        )}
                    </td>

                    <td>

                        ${traceEscV1(
                            pair?.a
                            ?.timestamp
                            ||'—'
                        )}

                        <div class="trace-v1-muted">
                            ${traceEscV1(
                                pair?.a
                                ?.class
                                ||'—'
                            )}
                        </div>

                    </td>

                    <td>

                        ${traceEscV1(
                            pair?.b
                            ?.timestamp
                            ||'—'
                        )}

                        <div class="trace-v1-muted">
                            ${traceEscV1(
                                pair?.b
                                ?.class
                                ||'—'
                            )}
                        </div>

                    </td>

                    <td>
                        Wykluczona przez istniejący
                        próg
                        <strong>
                            ${traceEscV1(
                                traceDeltaTextV1(
                                    cutoffMs
                                )
                            )}
                        </strong>.
                    </td>

                </tr>
                `;
            }
        )
        .join('');


    body.innerHTML=`

    <div id="credo-diagnostic-trace-v1">

        <div class="trace-v1-head">

            <div>

                <h3>
                    Diagnostic Trace / near-misses
                </h3>

                <div class="trace-v1-sub">
                    Rekordy znajdujące się najbliżej
                    istniejących granic decyzyjnych.
                </div>

            </div>

            <span class="trace-v1-badge">
                TRACE V1
            </span>

        </div>


        <div class="trace-v1-grid">

            <div class="trace-v1-card">

                <span>
                    Granica TOP10
                </span>

                <strong>
                    ${
                        cutoffScore===null
                        ?
                        '—'
                        :
                        traceEscV1(
                            traceScoreTextV1(
                                cutoffScore
                            )
                        )
                    }
                </strong>

                <small>
                    score pozycji #10
                </small>

            </div>


            <div class="trace-v1-card">

                <span>
                    Najbliższy kandydat poza TOP10
                </span>

                <strong>
                    ${
                        firstCandidate
                        ?
                        '#11'
                        :
                        '—'
                    }
                </strong>

                <small>
                    ${
                        firstCandidateGap===null
                        ?
                        'brak danych'
                        :
                        'różnica '
                        +traceEscV1(
                            traceScoreTextV1(
                                firstCandidateGap
                            )
                        )
                    }
                </small>

            </div>


            <div class="trace-v1-card">

                <span>
                    Próg koincydencji
                </span>

                <strong>
                    ${traceEscV1(
                        traceDeltaTextV1(
                            cutoffMs
                        )
                    )}
                </strong>

                <small>
                    istniejący próg algorytmu
                </small>

            </div>


            <div class="trace-v1-card">

                <span>
                    Najbliższa para poza progiem
                </span>

                <strong>
                    ${
                        firstPairMargin===null
                        ?
                        '—'
                        :
                        '+'
                        +traceEscV1(
                            traceDeltaTextV1(
                                firstPairMargin
                            )
                        )
                    }
                </strong>

                <small>
                    ponad 10 s
                </small>

            </div>

        </div>


        <section class="trace-v1-section">

            <h3>
                Kandydaci tuż poza TOP10
            </h3>

            <div class="trace-v1-note">
                To pozycje #11–#15 istniejącego rankingu.
                Granicą jest aktualny score pozycji #10 —
                nie wprowadzamy dodatkowego progu.
            </div>


            ${
                candidateRows
                ?
                `
                <table class="trace-v1-table">

                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Czas</th>
                            <th>Klasa</th>
                            <th>Score</th>
                            <th>Do #10</th>
                            <th>Dlaczego poza TOP10</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${candidateRows}
                    </tbody>

                </table>
                `
                :
                `
                <div class="trace-v1-warning">
                    Brak co najmniej 11 prawidłowych
                    rekordów rankingu.
                </div>
                `
            }

        </section>


        <section class="trace-v1-section">

            <h3>
                Koincydencje tuż poza 10 s
            </h3>

            <div class="trace-v1-note">
                Dla każdego zdarzenia backend zachowuje
                pierwszą chronologicznie parę, która
                przekracza istniejący próg 10 s.
                Następnie pokazujemy przypadki o najmniejszym
                przekroczeniu tego progu.
            </div>


            ${
                pairRows
                ?
                `
                <table class="trace-v1-table">

                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Δt</th>
                            <th>Ponad próg</th>
                            <th>Detekcja A</th>
                            <th>Detekcja B</th>
                            <th>Decyzja</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${pairRows}
                    </tbody>

                </table>
                `
                :
                `
                <div class="trace-v1-warning">
                    Backend nie zwrócił jeszcze
                    par tuż poza progiem 10 s.
                </div>
                `
            }


            <div class="trace-v1-warning">

                <strong>Interpretacja:</strong>

                „near-miss” oznacza wyłącznie przypadek
                bliski granicy obecnego algorytmu.
                Nie jest prawdopodobieństwem,
                identyfikacją rodzaju cząstki ani
                dowodem wspólnego źródła dwóch detekcji.

            </div>

        </section>

    </div>
    `;
}


function renderUnusual(){
    const items=
        researchData?.unusual||[];

    const rows=
        items.map(
            (item,index)=>`
        <tr>
            <td>
                ${index+1}
            </td>

            <td class="research-score">
                ${fmt(item.score,2)}
            </td>

            <td>
                ${eventLink(
                    item.id,
                    item.timestamp
                )}
            </td>

            <td>
                ${rEsc(item.class)}
            </td>

            <td>
                ${rEsc(
                    (item.reasons||[])
                    .join(' · ')
                )}
            </td>

            <td>
                ${rEsc(
                    item.active_pixels
                    ?? '—'
                )}
            </td>
        </tr>
        `
        ).join('');

    body.innerHTML=`
        <h3>Najbardziej nietypowe detekcje</h3>

        <p class="research-muted">
            Ranking porównuje detekcję z Twoim własnym
            archiwum: liczbę aktywnych pikseli,
            jasność, liczbę klastrów oraz rzadkość klasy.
            Nie próbuje określać rodzaju cząstki.
        </p>

        ${
            rows
            ?
            `
            <table class="research-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Wynik</th>
                        <th>Czas</th>
                        <th>Klasa</th>
                        <th>Dlaczego nietypowa</th>
                        <th>Piksele</th>
                    </tr>
                </thead>

                <tbody>
                    ${rows}
                </tbody>
            </table>
            `
            :
            '<p>Brak danych do analizy.</p>'
        }
    `;
}


/* ------------------------------------------------------------
   TAB
   ------------------------------------------------------------ */


/* ============================================================
   CREDO_RESEARCH_JOURNAL_REVIEW_UI_V2

   Kandydaci + Koincydencje -> Research Journal.

   Zero automatycznych wpisów.
   Zapis następuje wyłącznie po kliknięciu użytkownika.
   ============================================================ */


async function journalReviewPostV2(
    payload
){

    const response=
        await fetch(
            '/api/research-journal',
            {
                method:
                    'POST',

                headers:{
                    'Content-Type':
                        'application/json'
                },

                body:
                    JSON.stringify(
                        payload
                    )
            }
        );


    let data={};


    try{

        data=
            await response.json();

    }catch(_){

        data={};
    }


    if(!response.ok){

        throw new Error(
            data?.error
            ||
            (
                'HTTP '
                +response.status
            )
        );
    }


    return data;
}


/* ------------------------------------------------------------
   KANDYDACI
   ------------------------------------------------------------ */

function journalDecorateCandidatesV2(){

    if(
        currentTab!=='candidates'
    ){
        return;
    }


    const unusual=
        Array.isArray(
            researchData?.unusual
        )
        ?
        researchData.unusual
        :
        [];


    if(!unusual.length){
        return;
    }


    const tables=[
        ...body.querySelectorAll(
            'table.research-table'
        )
    ];


    const table=
        tables.find(
            node=>{

                const text=[
                    ...node.querySelectorAll(
                        'th'
                    )
                ]
                .map(
                    th=>
                        String(
                            th.textContent
                            ||''
                        )
                        .replace(
                            /\s+/g,
                            ' '
                        )
                        .trim()
                )
                .join('|');


                return (
                    text.includes(
                        'Priorytet'
                    )
                    &&
                    text.includes(
                        'Wynik'
                    )
                    &&
                    text.includes(
                        'Piksele'
                    )
                    &&
                    text.includes(
                        'Peak'
                    )
                );
            }
        );


    if(!table){
        return;
    }


    const rows=[
        ...table.querySelectorAll(
            'tbody > tr'
        )
    ];


    rows.forEach(
        (
            row,
            index
        )=>{

            if(
                row.querySelector(
                    '[data-journal-candidate-v2]'
                )
            ){
                return;
            }


            const item=
                unusual[index];


            if(!item){
                return;
            }


            const cell=
                row.lastElementChild;


            if(!cell){
                return;
            }


            const host=
                document.createElement(
                    'div'
                );

            host.style.marginTop=
                '8px';

            host.style.display=
                'flex';

            host.style.alignItems=
                'center';

            host.style.gap=
                '8px';


            const button=
                document.createElement(
                    'button'
                );

            button.type=
                'button';

            button.dataset
                .journalCandidateV2=
                '1';

            button.textContent=
                'Zapisz do Journalu';


            const status=
                document.createElement(
                    'span'
                );

            status.className=
                'research-muted';

            status.style.fontSize=
                '11px';


            host.append(
                button,
                status
            );

            cell.appendChild(
                host
            );


            button.onclick=
                async event=>{

                    event.stopPropagation();

                    button.disabled=true;

                    status.textContent=
                        'Zapisywanie…';


                    const priority=
                        index===0
                        ?
                        'A'
                        :
                        (
                            index<=5
                            ?
                            'B'
                            :
                            'C'
                        );


                    const subjectId=
                        item?.id
                        ??
                        item?.digest
                        ??
                        item?.event_id
                        ??
                        null;


                    const snapshot={

                        rank:
                            index+1,

                        priority:
                            priority,

                        id:
                            subjectId,

                        timestamp:
                            item?.timestamp
                            ??null,

                        class:
                            item?.class
                            ??null,

                        score:
                            item?.score
                            ??null,

                        active_pixels:
                            item?.active_pixels
                            ??null,

                        peak:
                            item?.peak
                            ??null,

                        clusters:
                            item?.clusters
                            ??null,

                        reasons:
                            Array.isArray(
                                item?.reasons
                            )
                            ?
                            item.reasons
                            :
                            [],

                        audit:
                            (
                                item?.audit
                                &&
                                typeof item.audit
                                    ==='object'
                            )
                            ?
                            item.audit
                            :
                            null
                    };


                    try{

                        const saved=
                            await journalReviewPostV2({

                                kind:
                                    'candidate_review',

                                subject_type:
                                    'event',

                                subject_id:
                                    subjectId
                                    ===null
                                    ?
                                    null
                                    :
                                    String(
                                        subjectId
                                    ),

                                title:
                                    (
                                        'Kandydat #'
                                        +(index+1)
                                        +' '
                                        +String(
                                            item?.class
                                            ||''
                                        )
                                    )
                                    .trim(),

                                note:
                                    (
                                        'Ręczny zapis kandydata '
                                        +'z bieżącego rankingu '
                                        +'CREDO Analyzer.'
                                    ),

                                algorithm_version:
                                    (
                                        item?.audit
                                        ?.version
                                        ?
                                        (
                                            'candidate-audit/'
                                            +String(
                                                item.audit
                                                .version
                                            )
                                        )
                                        :
                                        'candidate-ranking-v12'
                                    ),

                                snapshot:
                                    snapshot
                            });


                        const id=
                            saved?.entry?.id;


                        button.textContent=
                            'Zapisano';

                        status.textContent=
                            id
                            ?
                            '#'+id
                            :
                            'OK';

                    }catch(error){

                        button.disabled=false;

                        status.textContent=
                            (
                                'Błąd: '
                                +String(
                                    error?.message
                                    ||error
                                )
                            );
                    }
                };
        }
    );
}


/* ------------------------------------------------------------
   KOINCYDENCJE
   ------------------------------------------------------------ */

function journalPairIdV2(
    pair,
    index
){

    function eventToken(value){

        if(
            !value
            ||
            typeof value!=='object'
        ){
            return null;
        }


        return (
            value.id
            ??
            value.digest
            ??
            value.event_id
            ??
            value.timestamp
            ??
            value.time
            ??
            null
        );
    }


    const a=
        pair?.a
        ??
        pair?.event_a
        ??
        pair?.first
        ??
        pair?.left
        ??
        null;


    const b=
        pair?.b
        ??
        pair?.event_b
        ??
        pair?.second
        ??
        pair?.right
        ??
        null;


    const one=
        eventToken(a);

    const two=
        eventToken(b);


    if(
        one!==null
        &&
        two!==null
    ){

        return (
            String(one)
            +'|'
            +String(two)
        )
        .slice(
            0,
            256
        );
    }


    return (
        'pair-'
        +(index+1)
    );
}


/*
 * CREDO_RESEARCH_JOURNAL_COINCIDENCE_FIX_V2_1
 *
 * Audit V18 używa:
 *
 *   <details>
 *       <summary>Dlaczego?</summary>
 *       ...
 *   </details>
 *
 * Journal musi więc szukać SUMMARY, nie BUTTON.
 * Przycisk Journalu umieszczamy ZA całym DETAILS,
 * żeby był widoczny także przy zwiniętym audycie.
 */

function journalDecorateCoincidencesV2(){

    if(
        currentTab!=='coincidences'
    ){
        return;
    }


    const pairs=
        Array.isArray(
            researchData
            ?.coincidences
            ?.pairs
        )
        ?
        researchData
            .coincidences
            .pairs
        :
        [];


    if(!pairs.length){
        return;
    }


    /*
     * Audit UI V18 ma przy każdej prezentowanej
     * parze przycisk „Dlaczego?”.
     *
     * Nie przebudowujemy istniejącej tabeli:
     * dodajemy przycisk Journalu bezpośrednio
     * obok istniejącego przycisku audytu.
     */

    const whyButtons=[
        ...body.querySelectorAll(
            '#c17 table summary'
        )
    ]
    .filter(
        summary=>
            String(
                summary.textContent
                ||''
            )
            .replace(
                /\s+/g,
                ' '
            )
            .trim()
            ==='Dlaczego?'
    );


    whyButtons.forEach(
        (
            why,
            index
        )=>{

            const pair=
                pairs[index];


            if(!pair){
                return;
            }


            const details=
                why.closest(
                    'details'
                );


            const parent=
                details
                ?.parentElement;


            if(
                !details
                ||
                !parent
            ){
                return;
            }


            if(
                parent.querySelector(
                    '[data-journal-coincidence-v2]'
                )
            ){
                return;
            }


            const button=
                document.createElement(
                    'button'
                );

            button.type=
                'button';

            button.dataset
                .journalCoincidenceV2=
                '1';

            button.textContent=
                'Zapisz do Journalu';

            button.style.marginLeft=
                '8px';


            const status=
                document.createElement(
                    'span'
                );

            status.className=
                'research-muted';

            status.style.marginLeft=
                '7px';

            status.style.fontSize=
                '11px';


            button.style.marginLeft=
                '0';

            button.style.marginTop=
                '6px';


            details.insertAdjacentElement(
                'afterend',
                button
            );

            button.insertAdjacentElement(
                'afterend',
                status
            );


            button.onclick=
                async event=>{

                    event.stopPropagation();

                    button.disabled=true;

                    status.textContent=
                        'Zapisywanie…';


                    const subjectId=
                        journalPairIdV2(
                            pair,
                            index
                        );


                    /*
                     * Zachowujemy surowy obiekt pary.
                     * Nie próbujemy reinterpretować
                     * pól czasowych ani naukowego
                     * znaczenia koincydencji.
                     */

                    const snapshot={

                        displayed_index:
                            index+1,

                        pair:
                            pair,

                        interpretation:
                            (
                                'Zbieżność czasowa. '
                                +'Nie stanowi sama w sobie '
                                +'dowodu wspólnego źródła.'
                            )
                    };


                    try{

                        const saved=
                            await journalReviewPostV2({

                                kind:
                                    'coincidence_review',

                                subject_type:
                                    'pair',

                                subject_id:
                                    subjectId,

                                title:
                                    (
                                        'Koincydencja #'
                                        +(index+1)
                                    ),

                                note:
                                    (
                                        'Ręczny zapis zbieżności '
                                        +'czasowej z BADANIA CREDO. '
                                        +'Zapis nie oznacza potwierdzenia '
                                        +'wspólnego źródła fizycznego.'
                                    ),

                                algorithm_version:
                                    'coincidences-audit-v18',

                                snapshot:
                                    snapshot
                            });


                        const id=
                            saved?.entry?.id;


                        button.textContent=
                            'Zapisano';

                        status.textContent=
                            id
                            ?
                            '#'+id
                            :
                            'OK';

                    }catch(error){

                        button.disabled=false;

                        status.textContent=
                            (
                                'Błąd: '
                                +String(
                                    error?.message
                                    ||error
                                )
                            );
                    }
                };
        }
    );
}


/* ------------------------------------------------------------
   WRAPPERY ISTNIEJĄCYCH RENDERERÓW
   ------------------------------------------------------------ */

const journalCandidatesBaseV2=
    renderCandidates;

renderCandidates=
    function(){

        journalCandidatesBaseV2();

        journalDecorateCandidatesV2();
    };


const journalCoincidencesBaseV2=
    renderCoincidences;

renderCoincidences=
    function(){

        journalCoincidencesBaseV2();

        journalDecorateCoincidencesV2();
    };



/* ============================================================
   CREDO_BASELINE_DRIFT_UI_V2

   Rozszerza istniejący Baseline V1.
   Nie tworzy nowej zakładki.
   Nie dodaje timerów ani MutationObserver.
   ============================================================ */


function baselineDriftEscV2(
    value
){

    return String(
        value
        ??''
    )
    .replace(
        /&/g,
        '&amp;'
    )
    .replace(
        /</g,
        '&lt;'
    )
    .replace(
        />/g,
        '&gt;'
    )
    .replace(
        /"/g,
        '&quot;'
    )
    .replace(
        /'/g,
        '&#39;'
    );
}


function baselineDriftNumberV2(
    value,
    digits=2
){

    const n=Number(
        value
    );

    if(!Number.isFinite(n)){
        return '—';
    }

    return n.toFixed(
        digits
    );
}


function baselineDriftSignedV2(
    value,
    digits=2,
    suffix=''
){

    const n=Number(
        value
    );

    if(!Number.isFinite(n)){
        return '—';
    }

    return (
        (
            n>0
            ?
            '+'
            :
            ''
        )
        +n.toFixed(
            digits
        )
        +suffix
    );
}


function baselineDriftLevelV2(
    level
){

    const map={

        stable:{
            label:'STABILNIE',
            cls:'stable'
        },

        watch:{
            label:'OBSERWUJ',
            cls:'watch'
        },

        clear_change:{
            label:'WYRAŹNA ZMIANA',
            cls:'change'
        },

        not_scored:{
            label:'NIEOCENIONE',
            cls:'muted'
        },

        insufficient:{
            label:'ZA MAŁO DANYCH',
            cls:'muted'
        }
    };


    return (
        map[level]
        ||
        map.insufficient
    );
}


function baselineDriftEnsureStyleV2(){

    const id=
        'credo-baseline-drift-v2-style';

    if(
        document.getElementById(id)
    ){
        return;
    }


    const style=
        document.createElement(
            'style'
        );

    style.id=id;

    style.textContent=`

.baseline-drift-v2{
    margin-top:18px;
    padding-top:16px;
    border-top:1px solid #29465a;
}

.baseline-drift-v2-head{
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap:14px;
    margin-bottom:12px;
}

.baseline-drift-v2-head h3{
    margin:0 0 4px 0;
}

.baseline-drift-v2-sub{
    color:#8faabd;
    font-size:12px;
    line-height:1.45;
}

.baseline-drift-v2-badges{
    display:flex;
    flex-wrap:wrap;
    justify-content:flex-end;
    gap:6px;
}

.baseline-drift-v2-badge{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    min-height:27px;
    padding:0 9px;
    border-radius:8px;
    border:1px solid #3b6680;
    background:rgba(42,79,103,.20);
    color:#add0e6;
    font-size:10px;
    font-weight:800;
    white-space:nowrap;
}

.baseline-drift-v2-badge.stable{
    border-color:rgba(72,170,116,.55);
    color:#70dfa0;
}

.baseline-drift-v2-badge.watch{
    border-color:rgba(202,157,61,.60);
    color:#e0bd68;
}

.baseline-drift-v2-badge.change{
    border-color:rgba(211,91,91,.60);
    color:#ed8a8a;
}

.baseline-drift-v2-badge.muted{
    color:#9eb0bd;
}

.baseline-drift-v2-grid{
    display:grid;
    grid-template-columns:
        repeat(4,minmax(0,1fr));
    gap:9px;
    margin-bottom:12px;
}

.baseline-drift-v2-card{
    padding:10px 11px;
    border:1px solid #29465a;
    border-radius:9px;
    background:#091925;
}

.baseline-drift-v2-card span{
    display:block;
    color:#91aabd;
    font-size:11px;
}

.baseline-drift-v2-card strong{
    display:block;
    margin-top:5px;
    color:#edf6fc;
    font-size:20px;
}

.baseline-drift-v2-card small{
    display:block;
    margin-top:3px;
    color:#718da0;
    font-size:10px;
}

.baseline-drift-v2-section{
    margin-top:10px;
    padding:11px;
    border:1px solid #29465a;
    border-radius:9px;
    background:#091925;
}

.baseline-drift-v2-section h4{
    margin:0 0 5px 0;
}

.baseline-drift-v2-note{
    color:#8faabd;
    font-size:11px;
    line-height:1.45;
}

.baseline-drift-v2-table{
    width:100%;
    border-collapse:collapse;
    margin-top:9px;
    font-size:12px;
}

.baseline-drift-v2-table th,
.baseline-drift-v2-table td{
    padding:7px 6px;
    border-bottom:1px solid #203b4e;
    text-align:left;
    vertical-align:middle;
}

.baseline-drift-v2-table th{
    color:#a9c1d1;
    font-size:10px;
}

.baseline-drift-v2-table tr:last-child td{
    border-bottom:0;
}

.baseline-drift-v2-rule{
    margin-top:10px;
    padding:9px 10px;
    border:1px solid rgba(67,110,138,.50);
    border-radius:8px;
    background:rgba(20,51,70,.25);
    color:#9db5c6;
    font-size:10px;
    line-height:1.5;
}

@media(max-width:900px){

    .baseline-drift-v2-grid{
        grid-template-columns:
            repeat(2,minmax(0,1fr));
    }
}

`;

    document.head.appendChild(
        style
    );
}


function baselineDriftRenderV2(){

    baselineDriftEnsureStyleV2();


    const drift=
        researchData
        ?.baseline_drift;


    if(
        !drift
        ||
        typeof drift
            !=='object'
    ){

        return;
    }


    const state=
        baselineDriftLevelV2(
            drift.state
        );


    const maturityLabel=
        drift.maturity==='mature'
        ?
        'DOJRZAŁY'
        :
        'WSTĘPNY';


    const windowData=
        drift.window
        ||{};


    const featureOrder=[
        'active_pixels',
        'peak',
        'clusters'
    ];


    const features=
        drift.features
        ||{};


    const featureRows=
        featureOrder
        .map(
            key=>{

                const item=
                    features[key];

                if(!item){
                    return '';
                }


                const level=
                    baselineDriftLevelV2(
                        item.level
                    );


                return `

                <tr>

                    <td>
                        ${baselineDriftEscV2(
                            item.label
                            ||key
                        )}
                    </td>

                    <td>
                        ${baselineDriftEscV2(
                            baselineDriftNumberV2(
                                item.reference_median,
                                2
                            )
                        )}
                    </td>

                    <td>
                        ${baselineDriftEscV2(
                            baselineDriftNumberV2(
                                item.recent_median,
                                2
                            )
                        )}
                    </td>

                    <td>
                        ${baselineDriftEscV2(
                            baselineDriftSignedV2(
                                item.delta_percent,
                                2,
                                '%'
                            )
                        )}
                    </td>

                    <td>
                        ${baselineDriftEscV2(
                            baselineDriftSignedV2(
                                item.robust_shift,
                                3,
                                ''
                            )
                        )}
                    </td>

                    <td>
                        <span
                            class="
                                baseline-drift-v2-badge
                                ${level.cls}
                            "
                        >
                            ${baselineDriftEscV2(
                                level.label
                            )}
                        </span>
                    </td>

                </tr>
                `;
            }
        )
        .join('');


    const classes=
        Array.isArray(
            drift.classes
        )
        ?
        drift.classes
        :
        [];


    const classRows=
        classes.map(
            item=>{

                const level=
                    baselineDriftLevelV2(
                        item.level
                    );


                return `

                <tr>

                    <td>
                        ${baselineDriftEscV2(
                            item.class
                            ||'—'
                        )}
                    </td>

                    <td>
                        ${baselineDriftEscV2(
                            baselineDriftNumberV2(
                                item.reference_percent,
                                2
                            )
                        )}%
                    </td>

                    <td>
                        ${baselineDriftEscV2(
                            baselineDriftNumberV2(
                                item.recent_percent,
                                2
                            )
                        )}%
                    </td>

                    <td>
                        ${baselineDriftEscV2(
                            baselineDriftSignedV2(
                                item.delta_pp,
                                2,
                                ' pp'
                            )
                        )}
                    </td>

                    <td>
                        <span
                            class="
                                baseline-drift-v2-badge
                                ${level.cls}
                            "
                        >
                            ${baselineDriftEscV2(
                                level.label
                            )}
                        </span>
                    </td>

                </tr>
                `;
            }
        )
        .join('');


    const activity=
        drift.activity
        ||{};


    const refActivity=
        activity.reference
        ||{};


    const recentActivity=
        activity.recent
        ||{};


    const rules=
        drift.rules
        ||{};


    body.insertAdjacentHTML(
        'beforeend',
        `

        <section class="baseline-drift-v2">

            <div class="baseline-drift-v2-head">

                <div>

                    <h3>
                        Drift / kalibracja
                    </h3>

                    <div class="baseline-drift-v2-sub">
                        Cała wcześniejsza historia
                        vs ostatnie 24 h.
                        Diagnostyka stabilności —
                        nie kalibracja bezwzględna.
                    </div>

                </div>


                <div class="baseline-drift-v2-badges">

                    <span
                        class="
                            baseline-drift-v2-badge
                            ${state.cls}
                        "
                    >
                        ${baselineDriftEscV2(
                            state.label
                        )}
                    </span>

                    <span
                        class="
                            baseline-drift-v2-badge
                            muted
                        "
                    >
                        ${baselineDriftEscV2(
                            maturityLabel
                        )}
                    </span>

                </div>

            </div>


            <div class="baseline-drift-v2-grid">

                <div class="baseline-drift-v2-card">

                    <span>
                        Reference
                    </span>

                    <strong>
                        ${baselineDriftEscV2(
                            windowData.reference_count
                            ??'—'
                        )}
                    </strong>

                    <small>
                        wcześniejsze zdarzenia
                    </small>

                </div>


                <div class="baseline-drift-v2-card">

                    <span>
                        Recent
                    </span>

                    <strong>
                        ${baselineDriftEscV2(
                            windowData.recent_count
                            ??'—'
                        )}
                    </strong>

                    <small>
                        ostatnie 24 h
                    </small>

                </div>


                <div class="baseline-drift-v2-card">

                    <span>
                        Zakres archiwum
                    </span>

                    <strong>
                        ${baselineDriftEscV2(
                            baselineDriftNumberV2(
                                drift
                                ?.coverage
                                ?.span_days,
                                2
                            )
                        )}
                    </strong>

                    <small>
                        dni
                    </small>

                </div>


                <div class="baseline-drift-v2-card">

                    <span>
                        Błędy metrics JSON
                    </span>

                    <strong>
                        ${baselineDriftEscV2(
                            drift.metrics_parse_errors
                            ??0
                        )}
                    </strong>

                    <small>
                        podczas analizy
                    </small>

                </div>

            </div>


            <div class="baseline-drift-v2-section">

                <h4>
                    Cechy detekcji
                </h4>

                <div class="baseline-drift-v2-note">
                    Robust shift =
                    zmiana mediany względem
                    1.4826 × MAD okresu reference.
                </div>


                <table class="baseline-drift-v2-table">

                    <thead>
                        <tr>
                            <th>Cecha</th>
                            <th>Reference</th>
                            <th>24 h</th>
                            <th>Δ %</th>
                            <th>Robust shift</th>
                            <th>Stan</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${featureRows}
                    </tbody>

                </table>

            </div>


            <div class="baseline-drift-v2-section">

                <h4>
                    Rozkład klas
                </h4>

                <div class="baseline-drift-v2-note">
                    Zmiana udziału SPOT / TRACK /
                    WORM itd. jest podawana
                    w punktach procentowych.
                </div>


                <table class="baseline-drift-v2-table">

                    <thead>
                        <tr>
                            <th>Klasa</th>
                            <th>Reference</th>
                            <th>24 h</th>
                            <th>Δ</th>
                            <th>Stan</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${classRows}
                    </tbody>

                </table>

            </div>


            <div class="baseline-drift-v2-section">

                <h4>
                    Surowa aktywność archiwum
                </h4>

                <div class="baseline-drift-v2-note">

                    Reference:
                    ${baselineDriftEscV2(
                        refActivity.active_hours
                        ??'—'
                    )}
                    aktywnych godzin,
                    mediana
                    ${baselineDriftEscV2(
                        baselineDriftNumberV2(
                            refActivity
                            .nonzero_hour_median,
                            2
                        )
                    )}
                    wpisów / aktywną godzinę.

                    <br>

                    Recent:
                    ${baselineDriftEscV2(
                        recentActivity.active_hours
                        ??'—'
                    )}
                    aktywnych godzin,
                    mediana
                    ${baselineDriftEscV2(
                        baselineDriftNumberV2(
                            recentActivity
                            .nonzero_hour_median,
                            2
                        )
                    )}
                    wpisów / aktywną godzinę.

                </div>

            </div>


            <div class="baseline-drift-v2-rule">

                <strong>
                    Reguły diagnostyczne aplikacji:
                </strong>

                OBSERWUJ od |robust shift| ≥
                ${baselineDriftEscV2(
                    rules
                    .feature_watch_abs_robust_shift
                    ??1.5
                )}
                lub zmiany klasy ≥
                ${baselineDriftEscV2(
                    rules
                    .class_watch_abs_delta_pp
                    ??5
                )}
                pp.

                WYRAŹNA ZMIANA od |robust shift| ≥
                ${baselineDriftEscV2(
                    rules
                    .feature_clear_change_abs_robust_shift
                    ??3
                )}
                lub zmiany klasy ≥
                ${baselineDriftEscV2(
                    rules
                    .class_clear_change_abs_delta_pp
                    ??10
                )}
                pp.

                <br>

                Te granice są wyłącznie regułami
                diagnostycznymi Analyzera.
                Nie są progami fizycznymi.

                <br>

                Uptime normalized:
                <strong>
                    ${drift.uptime_normalized
                      ?'TAK'
                      :'NIE'}
                </strong>
                ·
                Exposure normalized:
                <strong>
                    ${drift.exposure_normalized
                      ?'TAK'
                      :'NIE'}
                </strong>.

            </div>

        </section>
        `
    );
}


/*
 * Wrapper istniejącego Baseline V1.
 * Najpierw renderuje stary Baseline,
 * potem tylko dopina Drift V2.
 */

const baselineDriftBaseRenderV2=
    renderBaseline;


renderBaseline=
    function(){

        baselineDriftBaseRenderV2();

        baselineDriftRenderV2();
    };




/* ============================================================
   CREDO_BASELINE_HISTORY_UI_V3
   Bez nowej zakładki.
   Bez timerów.
   Bez MutationObserver.
   ============================================================ */


function bh3Esc(value){

    return String(value ?? '')
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
}


function bh3Num(
    value,
    digits=2
){

    const n=Number(value);

    return Number.isFinite(n)
        ? n.toFixed(digits)
        : '—';
}


function bh3Date(value){

    if(!value){
        return '—';
    }

    return String(value)
        .replace('T',' ')
        .replace('+00:00',' UTC');
}


function bh3Style(){

    const id='credo-baseline-history-v3-style';

    if(document.getElementById(id)){
        return;
    }


    const style=document.createElement('style');

    style.id=id;

    style.textContent=`

.baseline-history-v3{
    margin-top:18px;
    padding-top:16px;
    border-top:1px solid #29465a;
}

.baseline-history-v3-head{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:14px;
    margin-bottom:12px;
}

.baseline-history-v3-head h3{
    margin:0 0 4px 0;
}

.baseline-history-v3-note{
    color:#8faabd;
    font-size:11px;
    line-height:1.5;
}

.baseline-history-v3-grid{
    display:grid;
    grid-template-columns:repeat(4,minmax(0,1fr));
    gap:9px;
}

.baseline-history-v3-card,
.baseline-history-v3-section{
    border:1px solid #29465a;
    border-radius:9px;
    background:#091925;
}

.baseline-history-v3-card{
    padding:10px 11px;
}

.baseline-history-v3-card span{
    display:block;
    color:#91aabd;
    font-size:10px;
}

.baseline-history-v3-card strong{
    display:block;
    margin-top:5px;
    color:#edf6fc;
    font-size:18px;
}

.baseline-history-v3-section{
    margin-top:10px;
    padding:11px;
}

.baseline-history-v3-section h4{
    margin:0 0 5px 0;
}

.baseline-history-v3-sparks{
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    gap:9px;
    margin-top:9px;
}

.baseline-history-v3-spark{
    padding:9px;
    border:1px solid #203b4e;
    border-radius:8px;
    background:#071722;
}

.baseline-history-v3-spark-title{
    display:flex;
    justify-content:space-between;
    gap:8px;
    color:#a9c1d1;
    font-size:10px;
}

.baseline-history-v3-chart{
    display:block;
    width:100%;
    height:auto;
    margin-top:9px;
    border:1px solid #203b4e;
    border-radius:8px;
    background:#071722;
}

.baseline-history-v3-empty{
    margin-top:9px;
    padding:18px;
    border:1px dashed #31536e;
    border-radius:8px;
    color:#8faabd;
    text-align:center;
    font-size:11px;
}

.baseline-history-v3-legend{
    display:flex;
    flex-wrap:wrap;
    gap:12px;
    margin-top:7px;
    color:#9db5c6;
    font-size:10px;
}

.baseline-history-v3-key{
    display:inline-flex;
    align-items:center;
    gap:5px;
}

.baseline-history-v3-dot{
    display:inline-block;
    width:8px;
    height:8px;
    border-radius:50%;
}

@media(max-width:900px){

    .baseline-history-v3-grid{
        grid-template-columns:repeat(2,minmax(0,1fr));
    }

    .baseline-history-v3-sparks{
        grid-template-columns:1fr;
    }
}

`;

    document.head.appendChild(style);
}


function bh3Time(
    snapshot,
    index
){

    const raw=
        snapshot?.last_event
        ||
        snapshot?.captured_at;

    if(raw){

        const t=Date.parse(
            String(raw).replace(' ','T')
        );

        if(Number.isFinite(t)){
            return t;
        }
    }

    return index;
}


function bh3Points(
    snapshots,
    getter,
    yMin,
    yMax,
    width,
    height,
    pad
){

    if(!snapshots.length){
        return [];
    }


    const times=
        snapshots.map(bh3Time);

    let xMin=Math.min(...times);
    let xMax=Math.max(...times);

    if(xMin===xMax){
        xMin-=1;
        xMax+=1;
    }


    const out=[];


    snapshots.forEach(
        (snapshot,index)=>{

            const value=Number(
                getter(snapshot)
            );

            if(!Number.isFinite(value)){
                return;
            }


            const x=
                pad
                +
                (
                    (
                        times[index]-xMin
                    )
                    /
                    (
                        xMax-xMin
                    )
                )
                *
                (
                    width-2*pad
                );


            const clipped=
                Math.max(
                    yMin,
                    Math.min(
                        yMax,
                        value
                    )
                );


            const y=
                pad
                +
                (
                    1
                    -
                    (
                        (
                            clipped-yMin
                        )
                        /
                        (
                            yMax-yMin
                        )
                    )
                )
                *
                (
                    height-2*pad
                );


            out.push({
                x,
                y,
                value
            });
        }
    );


    return out;
}


function bh3Poly(points){

    return points
        .map(
            p=>
                p.x.toFixed(2)
                +','
                +p.y.toFixed(2)
        )
        .join(' ');
}


function bh3Spark(
    snapshots,
    getter,
    color
){

    const values=
        snapshots
        .map(getter)
        .map(Number)
        .filter(Number.isFinite);


    if(!values.length){
        return '';
    }


    let min=Math.min(...values);
    let max=Math.max(...values);

    if(min===max){
        min-=0.5;
        max+=0.5;
    }


    const points=
        bh3Points(
            snapshots,
            getter,
            min,
            max,
            260,
            70,
            7
        );


    const last=
        points[points.length-1];


    return `

    <svg
        viewBox="0 0 260 70"
        style="width:100%;display:block"
        aria-hidden="true"
    >

        <polyline
            points="${bh3Poly(points)}"
            fill="none"
            stroke="${color}"
            stroke-width="2"
            vector-effect="non-scaling-stroke"
        />

        ${
            last
            ?
            `
            <circle
                cx="${last.x}"
                cy="${last.y}"
                r="3"
                fill="${color}"
            />
            `
            :
            ''
        }

    </svg>
    `;
}


function bh3ShiftChart(snapshots){

    const width=1000;
    const height=250;
    const pad=38;

    const yMin=-3.2;
    const yMax=3.2;


    const active=
        bh3Points(
            snapshots,
            s=>s?.features?.active_pixels?.robust_shift,
            yMin,
            yMax,
            width,
            height,
            pad
        );


    const peak=
        bh3Points(
            snapshots,
            s=>s?.features?.peak?.robust_shift,
            yMin,
            yMax,
            width,
            height,
            pad
        );


    const y=value=>
        pad
        +
        (
            1
            -
            (
                (value-yMin)
                /
                (yMax-yMin)
            )
        )
        *
        (
            height-2*pad
        );


    const guides=[
        3,
        1.5,
        0,
        -1.5,
        -3
    ];


    return `

    <svg
        class="baseline-history-v3-chart"
        viewBox="0 0 ${width} ${height}"
        aria-label="Historia robust shift"
    >

        ${guides.map(
            value=>`

            <line
                x1="${pad}"
                y1="${y(value)}"
                x2="${width-pad}"
                y2="${y(value)}"
                stroke="${
                    Math.abs(value)===3
                    ?'#6b4650'
                    :'#29465a'
                }"
                stroke-width="1"
                stroke-dasharray="${
                    value===0
                    ?'0'
                    :'5 5'
                }"
            />

            <text
                x="5"
                y="${y(value)+4}"
                fill="#7894a7"
                font-size="12"
            >
                ${value}
            </text>
            `
        ).join('')}

        <polyline
            points="${bh3Poly(active)}"
            fill="none"
            stroke="#43b5dc"
            stroke-width="2"
            vector-effect="non-scaling-stroke"
        />

        <polyline
            points="${bh3Poly(peak)}"
            fill="none"
            stroke="#72d99c"
            stroke-width="2"
            vector-effect="non-scaling-stroke"
        />

    </svg>
    `;
}


function bh3ClassChart(snapshots){

    const width=1000;
    const height=260;
    const pad=38;

    const colors=[
        '#43b5dc',
        '#72d99c',
        '#e0bd68',
        '#cb8ee3'
    ];


    const names=new Set();


    snapshots.forEach(
        snapshot=>{

            (
                snapshot.classes
                ||[]
            )
            .forEach(
                item=>{

                    if(item?.class){
                        names.add(
                            item.class
                        );
                    }
                }
            );
        }
    );


    const classes=
        Array.from(names)
        .map(
            name=>{

                const maxShare=
                    Math.max(
                        0,
                        ...snapshots.map(
                            snapshot=>{

                                const found=
                                    (
                                        snapshot.classes
                                        ||[]
                                    )
                                    .find(
                                        item=>
                                            item.class
                                            ===name
                                    );

                                return Number(
                                    found?.recent_percent
                                    ||0
                                );
                            }
                        )
                    );


                return {
                    name,
                    maxShare
                };
            }
        )
        .sort(
            (a,b)=>
                b.maxShare-a.maxShare
        )
        .slice(0,4);


    const lines=
        classes.map(
            (entry,index)=>{

                const points=
                    bh3Points(
                        snapshots,
                        snapshot=>{

                            const found=
                                (
                                    snapshot.classes
                                    ||[]
                                )
                                .find(
                                    item=>
                                        item.class
                                        ===entry.name
                                );

                            return (
                                found?.recent_percent
                                ??0
                            );
                        },
                        0,
                        100,
                        width,
                        height,
                        pad
                    );


                return `

                <polyline
                    points="${bh3Poly(points)}"
                    fill="none"
                    stroke="${colors[index]}"
                    stroke-width="2"
                    vector-effect="non-scaling-stroke"
                />
                `;
            }
        )
        .join('');


    const grid=[
        0,
        25,
        50,
        75,
        100
    ];


    return {

        svg:`

        <svg
            class="baseline-history-v3-chart"
            viewBox="0 0 ${width} ${height}"
            aria-label="Historia udziałów klas"
        >

            ${grid.map(
                value=>{

                    const y=
                        pad
                        +
                        (
                            1-value/100
                        )
                        *
                        (
                            height-2*pad
                        );

                    return `

                    <line
                        x1="${pad}"
                        y1="${y}"
                        x2="${width-pad}"
                        y2="${y}"
                        stroke="#29465a"
                    />

                    <text
                        x="4"
                        y="${y+4}"
                        fill="#7894a7"
                        font-size="12"
                    >
                        ${value}%
                    </text>
                    `;
                }
            ).join('')}

            ${lines}

        </svg>
        `,

        legend:
            classes.map(
                (entry,index)=>`

                <span class="baseline-history-v3-key">

                    <span
                        class="baseline-history-v3-dot"
                        style="background:${colors[index]}"
                    ></span>

                    ${bh3Esc(entry.name)}

                </span>
                `
            ).join('')
    };
}


function baselineHistoryRenderV3(){

    bh3Style();


    const history=
        researchData
        ?.baseline_history;


    if(
        !history
        ||
        typeof history!=='object'
    ){
        return;
    }


    const snapshots=
        Array.isArray(
            history.snapshots
        )
        ?
        history.snapshots
        :
        [];


    const first=
        snapshots[0]
        ||null;


    const latest=
        snapshots[
            snapshots.length-1
        ]
        ||null;


    const enough=
        snapshots.length>=2;


    const classChart=
        bh3ClassChart(
            snapshots
        );


    body.insertAdjacentHTML(
        'beforeend',
        `

        <section class="baseline-history-v3">

            <div class="baseline-history-v3-head">

                <div>

                    <h3>
                        Historia baseline
                    </h3>

                    <div class="baseline-history-v3-note">
                        Jeden snapshot na unikalny
                        last_event. Historia jest
                        przechowywana oddzielnie od
                        archive.sqlite3.
                    </div>

                </div>

                <span
                    class="
                        baseline-drift-v2-badge
                        muted
                    "
                >
                    HISTORY V3
                </span>

            </div>


            <div class="baseline-history-v3-grid">

                <div class="baseline-history-v3-card">
                    <span>Snapshoty</span>
                    <strong>
                        ${bh3Esc(
                            history.total_snapshots
                            ??0
                        )}
                    </strong>
                </div>


                <div class="baseline-history-v3-card">
                    <span>Pierwszy snapshot</span>
                    <strong style="font-size:11px">
                        ${bh3Esc(
                            bh3Date(
                                first?.last_event
                            )
                        )}
                    </strong>
                </div>


                <div class="baseline-history-v3-card">
                    <span>Ostatni snapshot</span>
                    <strong style="font-size:11px">
                        ${bh3Esc(
                            bh3Date(
                                latest?.last_event
                            )
                        )}
                    </strong>
                </div>


                <div class="baseline-history-v3-card">
                    <span>Snapshoty w API</span>
                    <strong>
                        ${bh3Esc(
                            history.returned_snapshots
                            ??0
                        )}
                    </strong>
                </div>

            </div>


            <div class="baseline-history-v3-section">

                <h4>
                    Mediany ostatnich 24 h
                </h4>


                <div class="baseline-history-v3-sparks">


                    <div class="baseline-history-v3-spark">

                        <div class="baseline-history-v3-spark-title">

                            <span>
                                Aktywne piksele
                            </span>

                            <strong>
                                ${bh3Esc(
                                    bh3Num(
                                        latest
                                        ?.features
                                        ?.active_pixels
                                        ?.recent_median
                                    )
                                )}
                            </strong>

                        </div>

                        ${bh3Spark(
                            snapshots,
                            s=>
                                s
                                ?.features
                                ?.active_pixels
                                ?.recent_median,
                            '#43b5dc'
                        )}

                    </div>


                    <div class="baseline-history-v3-spark">

                        <div class="baseline-history-v3-spark-title">

                            <span>
                                Jasność maksymalna
                            </span>

                            <strong>
                                ${bh3Esc(
                                    bh3Num(
                                        latest
                                        ?.features
                                        ?.peak
                                        ?.recent_median
                                    )
                                )}
                            </strong>

                        </div>

                        ${bh3Spark(
                            snapshots,
                            s=>
                                s
                                ?.features
                                ?.peak
                                ?.recent_median,
                            '#72d99c'
                        )}

                    </div>


                    <div class="baseline-history-v3-spark">

                        <div class="baseline-history-v3-spark-title">

                            <span>
                                Liczba klastrów
                            </span>

                            <strong>
                                ${bh3Esc(
                                    bh3Num(
                                        latest
                                        ?.features
                                        ?.clusters
                                        ?.recent_median
                                    )
                                )}
                            </strong>

                        </div>

                        ${bh3Spark(
                            snapshots,
                            s=>
                                s
                                ?.features
                                ?.clusters
                                ?.recent_median,
                            '#e0bd68'
                        )}

                    </div>

                </div>

            </div>


            <div class="baseline-history-v3-section">

                <h4>
                    Historia robust shift
                </h4>

                <div class="baseline-history-v3-note">
                    ±1.5 = OBSERWUJ ·
                    ±3 = WYRAŹNA ZMIANA.
                </div>


                ${
                    enough
                    ?
                    bh3ShiftChart(
                        snapshots
                    )
                    :
                    `
                    <div class="baseline-history-v3-empty">

                        Pierwszy snapshot został
                        zapisany.

                        Wykres pojawi się po
                        kolejnej zmianie last_event.

                    </div>
                    `
                }


                <div class="baseline-history-v3-legend">

                    <span class="baseline-history-v3-key">
                        <span
                            class="baseline-history-v3-dot"
                            style="background:#43b5dc"
                        ></span>
                        aktywne piksele
                    </span>

                    <span class="baseline-history-v3-key">
                        <span
                            class="baseline-history-v3-dot"
                            style="background:#72d99c"
                        ></span>
                        jasność maksymalna
                    </span>

                </div>

            </div>


            <div class="baseline-history-v3-section">

                <h4>
                    Historia udziałów klas
                </h4>


                ${
                    enough
                    ?
                    classChart.svg
                    :
                    `
                    <div class="baseline-history-v3-empty">

                        Drugi snapshot uruchomi
                        wykres zmian klas.

                    </div>
                    `
                }


                ${
                    enough
                    ?
                    `
                    <div class="baseline-history-v3-legend">
                        ${classChart.legend}
                    </div>
                    `
                    :
                    ''
                }

            </div>


            <div class="baseline-history-v3-section">

                <div class="baseline-history-v3-note">

                    Uptime normalized:
                    <strong>NIE</strong>
                    ·
                    Exposure normalized:
                    <strong>NIE</strong>.

                    <br>

                    Historia służy do obserwacji
                    stabilności Analyzera.
                    Nie jest pomiarem strumienia
                    promieniowania ani kalibracją
                    fizyczną detektora.

                </div>

            </div>

        </section>
        `
    );
}


/*
 * Wrapper istniejącego Baseline V2.
 */

const baselineHistoryBaseRenderV3=
    renderBaseline;


renderBaseline=
    function(){

        baselineHistoryBaseRenderV3();

        baselineHistoryRenderV3();
    };



function renderCurrentTab(){

    dialog
        .querySelectorAll(
            '.credo-research-tabs button'
        )
        .forEach(
            button=>{
                button.classList.toggle(
                    'active',
                    button.dataset.tab===currentTab
                );
            }
        );

    if(currentTab==='coincidences'){
        renderCoincidences();
    }

    if(currentTab==='space'){
        renderSpace();
    }

    if(currentTab==='network'){
        renderNetwork();
    }

    if(currentTab==='candidates'){
        renderCandidates();
    }

    if(currentTab==='unusual'){
        renderUnusual();
    }

    if(currentTab==='baseline'){
        renderBaseline();
    }

    if(currentTab==='journal'){
        renderJournal();
    }

    if(currentTab==='trace'){
        renderDiagnosticTraceV1();
    }
}


dialog
    .querySelectorAll(
        '.credo-research-tabs button'
    )
    .forEach(
        button=>{
            button.onclick=()=>{
                currentTab=
                    button.dataset.tab;

                renderCurrentTab();
            };
        }
    );


/* ------------------------------------------------------------
   CLICK EVENT -> NORMAL CREDO DETAIL
   ------------------------------------------------------------ */

body.addEventListener(
    'click',
    event=>{

        const target=
            event.target.closest(
                '[data-research-id]'
            );

        if(!target){
            return;
        }

        const id=
            target.dataset.researchId;

        if(
            id &&
            typeof window.detail==='function'
        ){
            window.detail(id);
            return;
        }

        if(
            id &&
            typeof detail==='function'
        ){
            detail(id);
        }
    }
);


/* ------------------------------------------------------------
   LOAD
   ------------------------------------------------------------ */

async function loadResearch(){
    statusText.textContent=
        'Pobieranie danych…';

    body.innerHTML=
        '<p>Analiza archiwum i danych NOAA…</p>';

    try{

        const params=
            new URLSearchParams();

        const cls=
            document.getElementById(
                'filter-class'
            )?.value||'';

        if(cls){
            params.set(
                'class',
                cls
            );
        }

        const response=
            await fetch(
                '/api/research?'
                +params.toString(),
                {
                    cache:'no-store'
                }
            );

        if(!response.ok){
            throw new Error(
                'HTTP '+response.status
            );
        }

        researchData=
            await response.json();

        statusText.textContent=
            `${researchData.event_count??0} detekcji`;

        renderCurrentTab();

        updateStripFromData(
            researchData.space_weather
        );

    }catch(error){

        console.error(
            'CREDO research',
            error
        );

        statusText.textContent=
            'Błąd';

        body.innerHTML=`
            <p class="error">
                Nie udało się pobrać analizy:
                ${rEsc(error.message)}
            </p>
        `;
    }
}


/* ------------------------------------------------------------
   CURRENT NOAA STRIP
   ------------------------------------------------------------ */


/* ============================================================
   CREDO_SPACE_WEATHER_HOME_V12_2

   Status zbiorczy:
   - oficjalne NOAA G/S/R mają pierwszeństwo
   - Kp i Dst są pomocniczą oceną geomagnetyczną
   - ostatni flare jest informacyjny i NIE podnosi sam statusu
   ============================================================ */

/*
 * Jeżeli gdzieś istnieje niedokończony V12.1,
 * blokujemy jego uruchomienie.
 */
window.__CREDO_SPACE_WEATHER_HOME_V12_1=true;


function swHomeEsc(v){
    return String(v??'')
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
}


function swHomeNumber(v){

    const n=Number(v);

    return Number.isFinite(n)
        ? n
        : null;
}


function swHomeScaleLevel(obj){

    if(
        obj===undefined
        ||
        obj===null
    ){
        return 0;
    }

    let value;

    if(typeof obj==='object'){
        value=obj.scale;
    }else{
        value=obj;
    }

    const m=String(
        value??''
    ).match(/[0-5]/);

    return m
        ? Number(m[0])
        : 0;
}


function swHomeScaleCode(prefix,obj){

    return (
        prefix
        +
        swHomeScaleLevel(obj)
    );
}


function swHomeNoaaText(level){

    return [
        'brak zjawiska',
        'niewielkie',
        'umiarkowane',
        'silne',
        'poważne',
        'ekstremalne'
    ][
        Math.max(
            0,
            Math.min(
                5,
                Number(level)||0
            )
        )
    ];
}


function swHomeKpText(kp){

    if(kp===null){
        return 'brak danych';
    }

    if(kp<4){
        return 'spokojne warunki geomagnetyczne';
    }

    if(kp<5){
        return 'aktywne pole geomagnetyczne, jeszcze poniżej G1';
    }

    if(kp<6){
        return 'próg G1 — niewielka burza geomagnetyczna';
    }

    if(kp<7){
        return 'próg G2 — umiarkowana burza geomagnetyczna';
    }

    if(kp<8){
        return 'próg G3 — silna burza geomagnetyczna';
    }

    if(kp<9){
        return 'próg G4 — poważna burza geomagnetyczna';
    }

    return 'próg G5 — ekstremalna burza geomagnetyczna';
}


function swHomeDstText(dst){

    if(dst===null){
        return 'brak danych';
    }

    if(dst>-30){
        return 'spokojnie / blisko spokojnego tła';
    }

    if(dst>-50){
        return 'słabe zaburzenie geomagnetyczne';
    }

    if(dst>-100){
        return 'umiarkowane zaburzenie geomagnetyczne';
    }

    if(dst>-200){
        return 'silne zaburzenie geomagnetyczne';
    }

    if(dst>-350){
        return 'bardzo silne zaburzenie geomagnetyczne';
    }

    return 'ekstremalne zaburzenie geomagnetyczne';
}


/*
 * Pięć poziomów naszego PANELU.
 *
 * To NIE jest nowa oficjalna skala NOAA.
 * Jest to czytelne podsumowanie:
 *
 * 0 spokojnie
 * 1 aktywność podwyższona, ale bez burzy NOAA
 * 2 niewielkie zjawisko
 * 3 silniejsze zjawisko
 * 4 poważne / ekstremalne
 */
function swHomeStatus(sw){

    const scales=
        sw?.scales||{};

    const g=
        swHomeScaleLevel(
            scales.G
        );

    const solar=
        swHomeScaleLevel(
            scales.S
        );

    const radio=
        swHomeScaleLevel(
            scales.R
        );

    const noaa=
        Math.max(
            g,
            solar,
            radio
        );

    const kp=
        swHomeNumber(
            sw?.kp
        );

    const dst=
        swHomeNumber(
            sw?.dst?.value
        );


    /*
     * Poważne / ekstremalne.
     *
     * NOAA poziom 4–5,
     * Kp >= 8,
     * albo bardzo głęboki Dst.
     */
    if(
        noaa>=4
        ||
        (
            kp!==null
            &&
            kp>=8
        )
        ||
        (
            dst!==null
            &&
            dst<=-200
        )
    ){
        return {
            level:4,
            icon:'🚨',
            title:'Poważna aktywność',
            css:'critical',
            description:
                'Występują poważne lub ekstremalne warunki pogody kosmicznej.'
        };
    }


    /*
     * Silniejsze zjawisko.
     *
     * NOAA G/S/R 2–3,
     * Kp 6–7,
     * Dst <= -100 nT.
     */
    if(
        noaa>=2
        ||
        (
            kp!==null
            &&
            kp>=6
        )
        ||
        (
            dst!==null
            &&
            dst<=-100
        )
    ){
        return {
            level:3,
            icon:'🌩️',
            title:'Silne zaburzenia',
            css:'storm',
            description:
                'Występują umiarkowane lub silne zjawiska pogody kosmicznej.'
        };
    }


    /*
     * Niewielkie zjawisko.
     *
     * G1 / S1 / R1,
     * Kp >=5,
     * albo Dst <= -50.
     */
    if(
        noaa>=1
        ||
        (
            kp!==null
            &&
            kp>=5
        )
        ||
        (
            dst!==null
            &&
            dst<=-50
        )
    ){
        return {
            level:2,
            icon:'⚠️',
            title:'Niewielkie zjawisko',
            css:'minor',
            description:
                'Występują pierwsze warunki burzowe lub zauważalne zaburzenia.'
        };
    }


    /*
     * Podwyższona aktywność,
     * ale jeszcze bez oficjalnej burzy G1/S1/R1.
     *
     * Kp 4.x lub Dst -30...-49.
     */
    if(
        (
            kp!==null
            &&
            kp>=4
        )
        ||
        (
            dst!==null
            &&
            dst<=-30
        )
    ){
        return {
            level:1,
            icon:'📶',
            title:'Podwyższona aktywność',
            css:'elevated',
            description:
                'Warunki odbiegają od spokojnego tła, ale nie osiągają jeszcze istotnego poziomu burzowego.'
        };
    }


    return {
        level:0,
        icon:'🛡️',
        title:'Spokojnie',
        css:'calm',
        description:
            'Brak istotnych burz geomagnetycznych, radiacyjnych i blackoutów radiowych.'
    };
}


function swHomeInterpretation(sw){

    const scales=
        sw?.scales||{};

    const g=
        swHomeScaleLevel(
            scales.G
        );

    const solar=
        swHomeScaleLevel(
            scales.S
        );

    const radio=
        swHomeScaleLevel(
            scales.R
        );

    const kp=
        swHomeNumber(
            sw?.kp
        );

    const dst=
        swHomeNumber(
            sw?.dst?.value
        );

    const status=
        swHomeStatus(sw);

    const bits=[];

    bits.push(
        status.description
    );

    bits.push(
        'NOAA: '
        +'G'+g
        +' / S'+solar
        +' / R'+radio
        +'.'
    );

    if(kp!==null){
        bits.push(
            'Kp '
            +kp.toFixed(2)
            +': '
            +swHomeKpText(kp)
            +'.'
        );
    }

    if(dst!==null){
        bits.push(
            'Dst '
            +dst.toFixed(0)
            +' nT: '
            +swHomeDstText(dst)
            +'.'
        );
    }

    const flare=
        sw?.latest_flare?.class;

    if(flare){
        bits.push(
            'Ostatni rozbłysk X-ray '
            +String(flare)
            +' — informacyjnie; '
            +'sam nie zmienia statusu zbiorczego.'
        );
    }

    return bits.join(' ');
}


function swHomeEnsureStyle(){

    if(
        document.getElementById(
            'credo-sw-home-v12-2-style'
        )
    ){
        return;
    }


    const style=
        document.createElement(
            'style'
        );

    style.id=
        'credo-sw-home-v12-2-style';

    style.textContent=`

#credo-research-strip{
    display:block;
    padding:15px 16px;
    margin:10px 0 14px 0;
    border:1px solid #29445b;
    border-radius:12px;
    background:#0b1d2d;
    color:#dcecf7;
    font-size:13px;
}

#credo-research-strip .swv12-head{
    display:flex;
    justify-content:space-between;
    gap:14px;
    align-items:flex-start;
    flex-wrap:wrap;
    margin-bottom:12px;
}

#credo-research-strip .swv12-title{
    display:flex;
    align-items:center;
    gap:10px;
}

#credo-research-strip .swv12-icon{
    font-size:28px;
    line-height:1;
}

#credo-research-strip .swv12-title h3{
    margin:0;
    color:#f0f7fd;
    font-size:17px;
}

#credo-research-strip .swv12-source{
    margin-top:3px;
    color:#88a3b8;
    font-size:11px;
}

#credo-research-strip .swv12-right{
    display:flex;
    gap:8px;
    align-items:center;
    flex-wrap:wrap;
}

#credo-research-strip .swv12-status{
    padding:7px 11px;
    border-radius:999px;
    font-weight:800;
    border:1px solid #355269;
}

#credo-research-strip .swv12-status.calm{
    color:#72e69b;
    background:#102d20;
    border-color:#245b3a;
}

#credo-research-strip .swv12-status.elevated{
    color:#6fd9ef;
    background:#112c35;
    border-color:#23586b;
}

#credo-research-strip .swv12-status.minor{
    color:#ffd36b;
    background:#332b13;
    border-color:#665623;
}

#credo-research-strip .swv12-status.storm{
    color:#ff9d57;
    background:#382113;
    border-color:#714326;
}

#credo-research-strip .swv12-status.critical{
    color:#ff7181;
    background:#3a151c;
    border-color:#7c2b37;
}

#credo-research-strip .swv12-btn{
    border:1px solid #31536e;
    background:#173149;
    color:#edf7ff;
    padding:7px 11px;
    border-radius:8px;
    cursor:pointer;
    font-weight:700;
}

#credo-research-strip .swv12-btn:hover{
    background:#1d405e;
}

#credo-research-strip .swv12-interpret{
    background:#081622;
    border:1px solid #1c3346;
    border-radius:9px;
    padding:10px 12px;
    margin-bottom:12px;
    line-height:1.45;
}

#credo-research-strip .swv12-tablewrap{
    overflow-x:auto;
    border:1px solid #1e3548;
    border-radius:9px;
}

#credo-research-strip .swv12-table{
    width:100%;
    min-width:800px;
    border-collapse:collapse;
}

#credo-research-strip .swv12-table th,
#credo-research-strip .swv12-table td{
    text-align:left;
    padding:9px 10px;
    border-bottom:1px solid #1b3041;
    vertical-align:top;
}

#credo-research-strip .swv12-table th{
    color:#9db5c8;
    background:#0e2233;
    font-size:11px;
    text-transform:uppercase;
    letter-spacing:.035em;
}

#credo-research-strip .swv12-table td{
    color:#d9e9f5;
}

#credo-research-strip .swv12-table td:nth-child(2){
    font-weight:800;
    color:#f3f8fc;
}

#credo-research-strip .swv12-foot{
    margin-top:9px;
    color:#8fa9bd;
    font-size:11px;
}


/* LEGENDA */

#credo-sw-v12-2-modal{
    display:none;
    position:fixed;
    inset:0;
    z-index:99999;
    align-items:center;
    justify-content:center;
    padding:18px;
    background:rgba(2,8,14,.74);
}

#credo-sw-v12-2-modal.open{
    display:flex;
}

#credo-sw-v12-2-modal .swv12-modal{
    width:min(1020px,96vw);
    max-height:88vh;
    overflow:auto;
    border:1px solid #31536e;
    border-radius:14px;
    background:#0b1d2d;
    color:#dcecf7;
    padding:17px;
    box-shadow:0 20px 60px rgba(0,0,0,.5);
}

#credo-sw-v12-2-modal .swv12-modalhead{
    display:flex;
    justify-content:space-between;
    gap:15px;
    align-items:flex-start;
    margin-bottom:13px;
}

#credo-sw-v12-2-modal h2{
    margin:0;
    color:#f2f8fc;
    font-size:20px;
}

#credo-sw-v12-2-modal .swv12-grid{
    display:grid;
    grid-template-columns:
        repeat(
            auto-fit,
            minmax(265px,1fr)
        );
    gap:10px;
}

#credo-sw-v12-2-modal .swv12-card{
    padding:12px;
    border:1px solid #203a50;
    border-radius:10px;
    background:#081722;
    line-height:1.45;
}

#credo-sw-v12-2-modal .swv12-card h4{
    margin:0 0 7px 0;
    color:#eff8ff;
}

#credo-sw-v12-2-modal .swv12-card p{
    margin:5px 0;
}

#credo-sw-v12-2-modal .swv12-important{
    grid-column:1/-1;
    border-color:#31536e;
}

@media(max-width:760px){

    #credo-research-strip .swv12-head{
        flex-direction:column;
    }
}

`;

    document.head.appendChild(
        style
    );
}



/* CREDO_SPACE_LEGEND_FINAL_V14 */
function swHomeEnsureModal(){

    let modal=
        document.getElementById(
            'credo-sw-v12-2-modal'
        );

    if(modal){
        return modal;
    }


    modal=
        document.createElement(
            'div'
        );

    modal.id=
        'credo-sw-v12-2-modal';


    modal.innerHTML=`

<div class="swv12-modal sw14-modal">

<div class="sw14-header">

    <div class="sw14-heading">

        <div class="sw14-sun">
            ☀️
        </div>

        <div>
            <h2>
                Pogoda kosmiczna — legenda
            </h2>

            <div class="sw14-subtitle">
                Wyjaśnienie indeksów i skal używanych w CREDO Analyzer
            </div>
        </div>

    </div>

    <button
        class="swv12-btn"
        id="sw-v12-2-close"
        type="button"
    >
        Zamknij ×
    </button>

</div>


<div class="sw14-grid">


<!-- STATUS -->
<div class="sw14-card">

<h4>Status zbiorczy panelu</h4>

<p class="sw14-desc">
Ogólny stan pogody kosmicznej na podstawie
bieżących parametrów.
</p>

<div class="sw14-row green">
<span class="sw14-dot"></span>
<div>
<b>Spokojnie</b>
<small>Brak istotnych zakłóceń.</small>
</div>
</div>

<div class="sw14-row blue">
<span class="sw14-dot"></span>
<div>
<b>Podwyższona aktywność</b>
<small>Możliwe niewielkie zakłócenia.</small>
</div>
</div>

<div class="sw14-row yellow">
<span class="sw14-dot"></span>
<div>
<b>Uwaga</b>
<small>Zwiększone ryzyko zakłóceń.</small>
</div>
</div>

<div class="sw14-row orange">
<span class="sw14-dot"></span>
<div>
<b>Burza</b>
<small>Możliwe silne zakłócenia.</small>
</div>
</div>

<div class="sw14-row red">
<span class="sw14-dot"></span>
<div>
<b>Silna burza</b>
<small>Duże ryzyko poważnych zakłóceń.</small>
</div>
</div>

</div>



<!-- KP -->
<div class="sw14-card">

<!-- CREDO_KP_STYLE_V14_1 -->

<h4>Kp — aktywność geomagnetyczna</h4>

<p class="sw14-desc">
Kp określa globalną aktywność geomagnetyczną
w skali 0–9. Oficjalna burza geomagnetyczna NOAA
zaczyna się od <b>Kp 5 = G1</b>.
</p>


<div class="sw14-row green">

<b class="sw14-range">
0–3
</b>

<span class="sw14-dot"></span>

<div>
<b>spokojnie</b>
<small>brak burzy geomagnetycznej</small>
</div>

</div>


<div class="sw14-row blue">

<b class="sw14-range">
4
</b>

<span class="sw14-dot"></span>

<div>
<b>aktywnie</b>
<small>podwyższona aktywność, poniżej G1</small>
</div>

</div>


<div class="sw14-row yellow">

<b class="sw14-range">
5
</b>

<span class="sw14-dot"></span>

<div>
<b>niewielka burza</b>
<small>NOAA G1</small>
</div>

</div>


<div class="sw14-row orange">

<b class="sw14-range">
6
</b>

<span class="sw14-dot"></span>

<div>
<b>umiarkowana burza</b>
<small>NOAA G2</small>
</div>

</div>


<div class="sw14-row orange">

<b class="sw14-range">
7
</b>

<span class="sw14-dot"></span>

<div>
<b>silna burza</b>
<small>NOAA G3</small>
</div>

</div>


<div class="sw14-row red">

<b class="sw14-range">
8
</b>

<span class="sw14-dot"></span>

<div>
<b>poważna burza</b>
<small>NOAA G4</small>
</div>

</div>


<div class="sw14-row red">

<b class="sw14-range">
9
</b>

<span class="sw14-dot"></span>

<div>
<b>ekstremalna burza</b>
<small>NOAA G5</small>
</div>

</div>

</div>


<!-- G -->
<div class="sw14-card">

<h4>G — burze geomagnetyczne</h4>

<p class="sw14-desc">
Oficjalna skala NOAA burz geomagnetycznych.
</p>

<div class="sw14-row green">
<b class="sw14-code">G0</b>
<span class="sw14-dot"></span>
<div><b>brak burzy</b><small>Warunki spokojne</small></div>
</div>

<div class="sw14-row blue">
<b class="sw14-code">G1</b>
<span class="sw14-dot"></span>
<div><b>niewielka</b><small>Niewielkie zakłócenia</small></div>
</div>

<div class="sw14-row yellow">
<b class="sw14-code">G2</b>
<span class="sw14-dot"></span>
<div><b>umiarkowana</b><small>Zauważalne efekty</small></div>
</div>

<div class="sw14-row orange">
<b class="sw14-code">G3</b>
<span class="sw14-dot"></span>
<div><b>silna</b><small>Znaczące zakłócenia</small></div>
</div>

<div class="sw14-row red">
<b class="sw14-code">G4</b>
<span class="sw14-dot"></span>
<div><b>poważna</b><small>Poważne zakłócenia</small></div>
</div>

<div class="sw14-row red">
<b class="sw14-code">G5</b>
<span class="sw14-dot"></span>
<div><b>ekstremalna</b><small>Ekstremalne zakłócenia</small></div>
</div>

</div>


<!-- S -->
<div class="sw14-card">

<h4>S — burze radiacyjne</h4>

<p class="sw14-desc">
Oficjalna skala NOAA zdarzeń protonowych.
</p>

<div class="sw14-row green">
<b class="sw14-code">S0</b>
<span class="sw14-dot"></span>
<div><b>brak istotnej burzy</b><small>Warunki spokojne</small></div>
</div>

<div class="sw14-row blue">
<b class="sw14-code">S1</b>
<span class="sw14-dot"></span>
<div><b>niewielka</b><small>Niewielkie zwiększenie promieniowania</small></div>
</div>

<div class="sw14-row yellow">
<b class="sw14-code">S2</b>
<span class="sw14-dot"></span>
<div><b>umiarkowana</b><small>Umiarkowane zaburzenia</small></div>
</div>

<div class="sw14-row orange">
<b class="sw14-code">S3</b>
<span class="sw14-dot"></span>
<div><b>silna</b><small>Znaczące zwiększenie promieniowania</small></div>
</div>

<div class="sw14-row red">
<b class="sw14-code">S4</b>
<span class="sw14-dot"></span>
<div><b>poważna</b><small>Duże zaburzenia</small></div>
</div>

<div class="sw14-row red">
<b class="sw14-code">S5</b>
<span class="sw14-dot"></span>
<div><b>ekstremalna</b><small>Ekstremalne zdarzenie radiacyjne</small></div>
</div>

</div>


<!-- R -->
<div class="sw14-card">

<h4>R — blackout radiowy</h4>

<p class="sw14-desc">
Oficjalna skala NOAA zakłóceń łączności
radiowej po dziennej stronie Ziemi.
</p>

<div class="sw14-row green">
<b class="sw14-code">R0</b>
<span class="sw14-dot"></span>
<div><b>brak istotnego blackoutu</b><small>Warunki nominalne</small></div>
</div>

<div class="sw14-row blue">
<b class="sw14-code">R1</b>
<span class="sw14-dot"></span>
<div><b>niewielki</b><small>Próg około M1</small></div>
</div>

<div class="sw14-row yellow">
<b class="sw14-code">R2</b>
<span class="sw14-dot"></span>
<div><b>umiarkowany</b><small>Próg około M5</small></div>
</div>

<div class="sw14-row orange">
<b class="sw14-code">R3</b>
<span class="sw14-dot"></span>
<div><b>silny</b><small>Próg około X1</small></div>
</div>

<div class="sw14-row red">
<b class="sw14-code">R4</b>
<span class="sw14-dot"></span>
<div><b>poważny</b><small>Próg około X10</small></div>
</div>

<div class="sw14-row red">
<b class="sw14-code">R5</b>
<span class="sw14-dot"></span>
<div><b>ekstremalny</b><small>Próg około X20</small></div>
</div>

</div>


<!-- DST -->
<div class="sw14-card">

<h4>Dst — zaburzenie pola Ziemi</h4>

<p class="sw14-desc">
Pomocniczy indeks zaburzenia pola
geomagnetycznego Ziemi.
</p>

<div class="sw14-row green">
<b class="sw14-range">&gt; −30 nT</b>
<span class="sw14-dot"></span>
<div><b>spokojnie</b><small>Brak istotnych zaburzeń</small></div>
</div>

<div class="sw14-row blue">
<b class="sw14-range">−30…−50</b>
<span class="sw14-dot"></span>
<div><b>słabe</b><small>Niewielkie zaburzenie</small></div>
</div>

<div class="sw14-row yellow">
<b class="sw14-range">−50…−100</b>
<span class="sw14-dot"></span>
<div><b>umiarkowane</b><small>Umiarkowane zaburzenie</small></div>
</div>

<div class="sw14-row orange">
<b class="sw14-range">−100…−200</b>
<span class="sw14-dot"></span>
<div><b>silne</b><small>Silne zaburzenie</small></div>
</div>

<div class="sw14-row red">
<b class="sw14-range">−200…−350</b>
<span class="sw14-dot"></span>
<div><b>bardzo silne</b><small>Bardzo silne zaburzenie</small></div>
</div>

<div class="sw14-row red">
<b class="sw14-range">≤ −350 nT</b>
<span class="sw14-dot"></span>
<div><b>ekstremalne</b><small>Ekstremalne zaburzenie</small></div>
</div>

</div>


<!-- XRAY -->
<div class="sw14-card sw14-xray">

<h4>Rozbłysk X-ray</h4>

<p class="sw14-desc">
Klasa rozbłysku słonecznego według strumienia
promieniowania rentgenowskiego GOES.
</p>

<div class="sw14-row green">
<b class="sw14-code">A / B</b>
<span class="sw14-dot"></span>
<div>
<b>bardzo słabe</b>
<small>Znikomy wpływ na Ziemię</small>
</div>
</div>

<div class="sw14-row blue">
<b class="sw14-code">C</b>
<span class="sw14-dot"></span>
<div>
<b>słabe</b>
<small>Zwykle brak istotnego blackoutu radiowego</small>
</div>
</div>

<div class="sw14-row yellow">
<b class="sw14-code">M1–M4.9</b>
<span class="sw14-dot"></span>
<div>
<b>umiarkowane</b>
<small>Od około M1 zaczyna się R1</small>
</div>
</div>

<div class="sw14-row orange">
<b class="sw14-code">M5–M9.9</b>
<span class="sw14-dot"></span>
<div>
<b>silniejsze</b>
<small>Od około M5 odpowiada progowi R2</small>
</div>
</div>

<div class="sw14-row orange">
<b class="sw14-code">X1–X9.9</b>
<span class="sw14-dot"></span>
<div>
<b>silne</b>
<small>Od X1 odpowiada progowi R3</small>
</div>
</div>

<div class="sw14-row red">
<b class="sw14-code">X10+</b>
<span class="sw14-dot"></span>
<div>
<b>bardzo silne</b>
<small>X10 ≈ R4, X20 ≈ R5</small>
</div>
</div>


<div class="sw14-info">
ⓘ Ostatni rozbłysk X-ray pokazujemy informacyjnie.
Bieżący wpływ na łączność radiową lepiej opisuje
oficjalna skala NOAA <b>R</b>.
</div>

</div>


</div>
</div>
`;


    document.body.appendChild(
        modal
    );


    const close=
        modal.querySelector(
            '#sw-v12-2-close'
        );

    if(close){

        close.onclick=()=>{
            modal.classList.remove(
                'open'
            );
        };
    }


    modal.onclick=(event)=>{

        if(event.target===modal){

            modal.classList.remove(
                'open'
            );
        }
    };


    return modal;
}



function swHomeTableRow(
    name,
    value,
    assessment,
    range,
    meaning
){

    return `
<tr>
    <td>${swHomeEsc(name)}</td>
    <td>${swHomeEsc(value)}</td>
    <td>${swHomeEsc(assessment)}</td>
    <td>${swHomeEsc(range)}</td>
    <td>${swHomeEsc(meaning)}</td>
</tr>
`;
}


/*
 * GŁÓWNA FUNKCJA.
 * Korzysta z dokładnie tego samego sw,
 * które wcześniej zasilało mały pasek.
 */

/* ============================================================
   CREDO_SPACE_WEATHER_COMPACT_V13B
   Kompaktowy widok głównej karty pogody kosmicznej.
   Pozostałe moduły interfejsu pozostają bez zmian.
   ============================================================ */

function sw13Level(obj){

    let value=obj;

    if(
        obj
        &&
        typeof obj==='object'
    ){
        value=obj.scale;
    }

    const m=String(
        value??''
    ).match(/[0-5]/);

    return m
        ? Number(m[0])
        : 0;
}


function sw13Num(v){

    const n=Number(v);

    return Number.isFinite(n)
        ? n
        : null;
}


function sw13Esc(v){

    return String(v??'')
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
}


function sw13Status(sw){

    const g=
        sw13Level(
            sw?.scales?.G
        );

    const solar=
        sw13Level(
            sw?.scales?.S
        );

    const radio=
        sw13Level(
            sw?.scales?.R
        );

    const noaa=
        Math.max(
            g,
            solar,
            radio
        );

    const kp=
        sw13Num(
            sw?.kp
        );

    const dst=
        sw13Num(
            sw?.dst?.value
        );


    if(
        noaa>=4
        ||
        (
            kp!==null
            &&
            kp>=8
        )
        ||
        (
            dst!==null
            &&
            dst<=-200
        )
    ){
        return {
            level:4,
            label:'Silna burza',
            cls:'critical'
        };
    }


    if(
        noaa>=2
        ||
        (
            kp!==null
            &&
            kp>=6
        )
        ||
        (
            dst!==null
            &&
            dst<=-100
        )
    ){
        return {
            level:3,
            label:'Burza',
            cls:'storm'
        };
    }


    if(
        noaa>=1
        ||
        (
            kp!==null
            &&
            kp>=5
        )
        ||
        (
            dst!==null
            &&
            dst<=-50
        )
    ){
        return {
            level:2,
            label:'Uwaga',
            cls:'warning'
        };
    }


    if(
        (
            kp!==null
            &&
            kp>=4
        )
        ||
        (
            dst!==null
            &&
            dst<=-30
        )
    ){
        return {
            level:1,
            label:'Podwyższona aktywność',
            cls:'elevated'
        };
    }


    return {
        level:0,
        label:'Spokojnie',
        cls:'calm'
    };
}


function sw13Summary(sw){

    const st=
        sw13Status(sw);

    if(st.level===0){
        return (
            'Warunki spokojne. '
            +'Brak burz geomagnetycznych, '
            +'radiacyjnych i zakłóceń radiowych.'
        );
    }

    if(st.level===1){
        return (
            'Aktywność lekko podwyższona. '
            +'Możliwe niewielkie zakłócenia.'
        );
    }

    if(st.level===2){
        return (
            'Aktywność umiarkowana. '
            +'Zwiększone ryzyko zakłóceń.'
        );
    }

    if(st.level===3){
        return (
            'Występują warunki burzowe. '
            +'Możliwe silne zakłócenia.'
        );
    }

    return (
        'Silna aktywność pogody kosmicznej. '
        +'Duże ryzyko zaburzeń.'
    );
}


function sw13Time(sw){

    const t=String(
        sw?.scales?.timestamp
        ||
        sw?.kp_time
        ||
        sw?.dst?.time
        ||
        '—'
    );

    return t;
}


function sw13EnsureStyle(){

    if(
        document.getElementById(
            'credo-sw-compact-v13b-style'
        )
    ){
        return;
    }


    const style=
        document.createElement(
            'style'
        );

    style.id=
        'credo-sw-compact-v13b-style';

    style.textContent=`

#credo-research-strip{
    display:block;
    margin:12px 0 14px 0;
    padding:14px 16px;
    border:1px solid #29445b;
    border-radius:12px;
    background:#0b1d2d;
    color:#dcecf7;
}


#credo-research-strip .sw13-head{
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap:15px;
    flex-wrap:wrap;
}


#credo-research-strip .sw13-left{
    display:flex;
    align-items:center;
    gap:10px;
}


#credo-research-strip .sw13-sun{
    font-size:27px;
    line-height:1;
}


#credo-research-strip .sw13-name-row{
    display:flex;
    align-items:center;
    gap:9px;
    flex-wrap:wrap;
}


#credo-research-strip .sw13-name{
    color:#f4f8fc;
    font-size:16px;
    font-weight:800;
}


#credo-research-strip .sw13-summary{
    margin-top:3px;
    color:#9db4c6;
    font-size:11px;
}


#credo-research-strip .sw13-right{
    display:flex;
    align-items:center;
    gap:9px;
    flex-wrap:wrap;
}


#credo-research-strip .sw13-time{
    color:#859fb3;
    font-size:10px;
}


#credo-research-strip .sw13-pill{
    padding:4px 9px;
    border-radius:999px;
    font-size:10px;
    font-weight:800;
}


#credo-research-strip .sw13-pill.calm{
    background:#103220;
    border:1px solid #246039;
    color:#73e89a;
}


#credo-research-strip .sw13-pill.elevated{
    background:#112d35;
    border:1px solid #256174;
    color:#65d8ef;
}


#credo-research-strip .sw13-pill.warning{
    background:#352d12;
    border:1px solid #715d1d;
    color:#ffd569;
}


#credo-research-strip .sw13-pill.storm{
    background:#382111;
    border:1px solid #7a431f;
    color:#ff9f58;
}


#credo-research-strip .sw13-pill.critical{
    background:#3b161c;
    border:1px solid #84303c;
    color:#ff7385;
}


#credo-research-strip .sw13-btn{
    border:1px solid #34566f;
    background:#173149;
    color:#eef7ff;
    border-radius:8px;
    padding:6px 11px;
    font-size:10px;
    font-weight:700;
    cursor:pointer;
}


#credo-research-strip .sw13-metrics{
    display:grid;
    grid-template-columns:
        repeat(
            5,
            minmax(0,1fr)
        );
    gap:8px;
    margin-top:12px;
}


#credo-research-strip .sw13-metric{
    background:#0a1926;
    border:1px solid #1d374b;
    border-radius:9px;
    padding:10px 11px;
}


#credo-research-strip .sw13-k{
    color:#92aabd;
    font-size:9px;
    font-weight:700;
}


#credo-research-strip .sw13-v{
    color:#fff;
    font-size:18px;
    line-height:1.1;
    font-weight:800;
    margin-top:3px;
}


#credo-research-strip .sw13-d{
    color:#90a9bb;
    font-size:8px;
    margin-top:4px;
}


#credo-research-strip .sw13-scale-title{
    margin-top:11px;
    margin-bottom:6px;
    color:#9cb4c6;
    font-size:9px;
    font-weight:700;
}


#credo-research-strip .sw13-scale{
    display:grid;
    grid-template-columns:
        repeat(
            5,
            minmax(0,1fr)
        );
    gap:8px;
}


#credo-research-strip .sw13-status{
    display:flex;
    align-items:center;
    gap:8px;
    min-height:44px;
    padding:7px 9px;
    border-radius:8px;
    background:#0b1925;
    border:1px solid #263d4e;
    opacity:.68;
}


#credo-research-strip .sw13-status.active{
    opacity:1;
}


#credo-research-strip .sw13-status-icon{
    min-width:23px;
    text-align:center;
    font-size:18px;
}


#credo-research-strip .sw13-status-name{
    font-size:9px;
    font-weight:800;
}


#credo-research-strip .sw13-status-desc{
    margin-top:2px;
    color:#8ea6b8;
    font-size:7px;
}


#credo-research-strip .sw13-status.calm{
    border-color:#21643f;
}

#credo-research-strip
.sw13-status.calm
.sw13-status-name{
    color:#72e99a;
}


#credo-research-strip .sw13-status.elevated{
    border-color:#206274;
}

#credo-research-strip
.sw13-status.elevated
.sw13-status-name{
    color:#65d8ef;
}


#credo-research-strip .sw13-status.warning{
    border-color:#79611e;
}

#credo-research-strip
.sw13-status.warning
.sw13-status-name{
    color:#ffd569;
}


#credo-research-strip .sw13-status.storm{
    border-color:#85461d;
}

#credo-research-strip
.sw13-status.storm
.sw13-status-name{
    color:#ff9f58;
}


#credo-research-strip .sw13-status.critical{
    border-color:#88313e;
}

#credo-research-strip
.sw13-status.critical
.sw13-status-name{
    color:#ff7385;
}


@media(max-width:900px){

    #credo-research-strip
    .sw13-metrics,

    #credo-research-strip
    .sw13-scale{

        grid-template-columns:
            repeat(
                2,
                minmax(0,1fr)
            );
    }
}

`;

    document.head.appendChild(
        style
    );
}


function sw13Metric(
    name,
    value,
    desc
){

    return `
<div class="sw13-metric">

<div class="sw13-k">
${sw13Esc(name)}
</div>

<div class="sw13-v">
${sw13Esc(value)}
</div>

<div class="sw13-d">
${sw13Esc(desc)}
</div>

</div>
`;
}


function sw13StatusCard(
    level,
    current,
    icon,
    name,
    desc,
    cls
){

    return `
<div class="
sw13-status
${sw13Esc(cls)}
${current===level ? 'active' : ''}
">

<div class="sw13-status-icon">
${icon}
</div>

<div>

<div class="sw13-status-name">
${sw13Esc(name)}
</div>

<div class="sw13-status-desc">
${sw13Esc(desc)}
</div>

</div>

</div>
`;
}



/* ============================================================
   CREDO_PARAM_FRAME_COLORS_V1
   Kolory ramek głównych parametrów Pogody kosmicznej.
   ============================================================ */

const swParamColorsV1={
    green:"#49bd70",
    blue:"#42bdf5",
    yellow:"#dfc84c",
    orange:"#f58645",
    red:"#ed5964",
    neutral:"#31536e"
};


function swParamKpColorV1(v){

    v=Number(v);

    if(!Number.isFinite(v))
        return swParamColorsV1.neutral;

    if(v<4)
        return swParamColorsV1.green;

    if(v<5)
        return swParamColorsV1.blue;

    if(v<6)
        return swParamColorsV1.yellow;

    if(v<8)
        return swParamColorsV1.orange;

    return swParamColorsV1.red;
}


function swParamScaleColorV1(v){

    v=Number(v);

    if(!Number.isFinite(v))
        return swParamColorsV1.neutral;

    if(v<=0)
        return swParamColorsV1.green;

    if(v===1)
        return swParamColorsV1.blue;

    if(v===2)
        return swParamColorsV1.yellow;

    if(v===3)
        return swParamColorsV1.orange;

    return swParamColorsV1.red;
}


function swParamDstColorV1(v){

    v=Number(v);

    if(!Number.isFinite(v))
        return swParamColorsV1.neutral;

    if(v>-30)
        return swParamColorsV1.green;

    if(v>-50)
        return swParamColorsV1.blue;

    if(v>-100)
        return swParamColorsV1.yellow;

    if(v>-200)
        return swParamColorsV1.orange;

    return swParamColorsV1.red;
}


function swParamFramesV1(
    host,
    kp,
    g,
    solar,
    radio,
    dst
){

    const grid=
        host?.querySelector(
            ".sw13-metrics"
        );

    if(!grid)
        return;


    const cards=[
        ...grid.children
    ];


    if(cards.length<5)
        return;


    const colors=[

        swParamKpColorV1(kp),

        swParamScaleColorV1(g),

        swParamScaleColorV1(solar),

        swParamScaleColorV1(radio),

        swParamDstColorV1(dst)
    ];


    cards
    .slice(0,5)
    .forEach(
        (card,index)=>{

            const color=
                colors[index];

            card.style.borderColor=
                color;

            card.style.boxShadow=
                "inset 0 0 0 1px "
                +
                color
                +
                "22";

            card.style.transition=
                "border-color .2s ease, box-shadow .2s ease";
        }
    );
}


function updateStripFromData(sw){

    sw13EnsureStyle();


    if(!sw){

        strip.innerHTML=`
<div class="sw13-left">

<div class="sw13-sun">
☀️
</div>

<div>

<div class="sw13-name">
Pogoda kosmiczna
</div>

<div class="sw13-summary">
Brak danych NOAA
</div>

</div>

</div>
`;

        return;
    }


    const status=
        sw13Status(sw);

    const kp=
        sw13Num(
            sw?.kp
        );

    const dst=
        sw13Num(
            sw?.dst?.value
        );

    const g=
        sw13Level(
            sw?.scales?.G
        );

    const solar=
        sw13Level(
            sw?.scales?.S
        );

    const radio=
        sw13Level(
            sw?.scales?.R
        );

    const updated=
        sw13Time(sw);


    strip.innerHTML=`

<div class="sw13-head">

<div class="sw13-left">

<div class="sw13-sun">
☀️
</div>


<div>

<div class="sw13-name-row">

<div class="sw13-name">
Pogoda kosmiczna
</div>

<span class="
sw13-pill
${sw13Esc(status.cls)}
">
${sw13Esc(status.label)}
</span>

</div>


<div class="sw13-summary">
${sw13Esc(
    sw13Summary(sw)
)}
</div>

</div>

</div>


<div class="sw13-right">

<span class="sw13-time">
Ostatnia aktualizacja:
${sw13Esc(updated)}
(UTC)
</span>

<button
type="button"
class="sw13-btn"
id="sw13-legend"
>
ⓘ Legenda
</button>

</div>

</div>


<div class="sw13-metrics">

${sw13Metric(
    'Kp',
    kp===null
        ? '—'
        : kp.toFixed(2),
    'aktywność geomagnetyczna'
)}

${sw13Metric(
    'G',
    'G'+g,
    'burza geomagnetyczna'
)}

${sw13Metric(
    'S',
    'S'+solar,
    'burza radiacyjna'
)}

${sw13Metric(
    'R',
    'R'+radio,
    'blackout radiowy'
)}

${sw13Metric(
    'Dst',
    dst===null
        ? '—'
        : dst.toFixed(0)+' nT',
    'zaburzenie pola magnetycznego'
)}

</div>


<div class="sw13-scale-title">
Skala i interpretacja warunków
</div>


<div class="sw13-scale">

${sw13StatusCard(
    0,
    status.level,
    '☀️',
    'Spokojnie',
    'Brak istotnych zakłóceń',
    'calm'
)}

${sw13StatusCard(
    1,
    status.level,
    '◉',
    'Podwyższona aktywność',
    'Możliwe niewielkie zakłócenia',
    'elevated'
)}

${sw13StatusCard(
    2,
    status.level,
    '⚠️',
    'Uwaga',
    'Zwiększone ryzyko zakłóceń',
    'warning'
)}

${sw13StatusCard(
    3,
    status.level,
    '⚡',
    'Burza',
    'Możliwe silne zakłócenia',
    'storm'
)}

${sw13StatusCard(
    4,
    status.level,
    '⛔',
    'Silna burza',
    'Duże ryzyko zakłóceń',
    'critical'
)}

</div>
`;


    const button=
        strip.querySelector(
            '#sw13-legend'
        );


    if(
        button
        &&
        typeof swHomeEnsureModal
            ===
            'function'
    ){

        button.onclick=()=>{

            swHomeEnsureModal()
                .classList.add(
                    'open'
                );
        };
    }

    /* CREDO_PARAM_FRAME_COLORS_V1_CALL */
    swParamFramesV1(
        strip,
        kp,
        g,
        solar,
        radio,
        dst
    );

}






async function refreshStrip(){

    try{

        const response=
            await fetch(
                '/api/research?mode=space',
                {
                    cache:'no-store'
                }
            );

        if(!response.ok){
            throw new Error(
                'HTTP '+response.status
            );
        }

        const data=
            await response.json();

        updateStripFromData(
            data.space_weather
        );

    }catch(error){

        strip.innerHTML=
            '<strong>◌ Pogoda kosmiczna</strong> · NOAA niedostępne';
    }
}


/* ------------------------------------------------------------
   CONTROLS
   ------------------------------------------------------------ */

researchButton.onclick=
    async()=>{

        dialog.showModal();

        await loadResearch();
    };


dialog.querySelector(
    '#research-close'
).onclick=()=>{
    dialog.close();
};


dialog.querySelector(
    '#research-refresh'
).onclick=()=>{
    loadResearch();
};


refreshStrip();

setInterval(
    refreshStrip,
    5*60*1000
);

})();

/* ============================================================
   CREDO_LEGENDA_MODAL_V13C
   Naprawa wyglądu istniejącego modala legendy.
   Zero zmian w logice Pogody, BADANIA i API.
   ============================================================ */
(function(){

    if(
        document.getElementById(
            'credo-legenda-modal-v13c-style'
        )
    ){
        return;
    }

    const style=
        document.createElement(
            'style'
        );

    style.id=
        'credo-legenda-modal-v13c-style';

    style.textContent=`

#credo-sw-v12-2-modal{
    position:fixed;
    inset:0;
    z-index:99999;

    display:none;

    align-items:center;
    justify-content:center;

    padding:24px;

    background:
        rgba(2,8,14,.78);

    backdrop-filter:
        blur(3px);
}


#credo-sw-v12-2-modal.open{
    display:flex;
}


#credo-sw-v12-2-modal .swv12-modal{
    width:min(
        1050px,
        94vw
    );

    max-height:86vh;

    overflow-y:auto;

    padding:18px;

    border:
        1px solid
        #31536e;

    border-radius:14px;

    background:
        #0b1d2d;

    color:
        #dcecf7;

    box-shadow:
        0 22px 70px
        rgba(0,0,0,.55);
}


#credo-sw-v12-2-modal .swv12-modalhead{
    display:flex;

    justify-content:
        space-between;

    align-items:
        flex-start;

    gap:16px;

    margin-bottom:15px;

    padding-bottom:12px;

    border-bottom:
        1px solid
        #20384b;
}


#credo-sw-v12-2-modal h2{
    margin:0;

    color:
        #f2f8fc;

    font-size:21px;
}


#credo-sw-v12-2-modal .swv12-btn{
    border:
        1px solid
        #34566f;

    background:
        #173149;

    color:
        #eef7ff;

    padding:
        7px 12px;

    border-radius:
        8px;

    cursor:pointer;

    font-weight:700;
}


#credo-sw-v12-2-modal .swv12-btn:hover{
    background:
        #1d405e;
}


#credo-sw-v12-2-modal .swv12-grid{
    display:grid;

    grid-template-columns:
        repeat(
            auto-fit,
            minmax(
                260px,
                1fr
            )
        );

    gap:11px;
}


#credo-sw-v12-2-modal .swv12-card{
    padding:13px;

    border:
        1px solid
        #203a50;

    border-radius:
        10px;

    background:
        #081722;

    line-height:1.45;
}


#credo-sw-v12-2-modal .swv12-card h4{
    margin:
        0 0 8px 0;

    color:
        #eff8ff;

    font-size:14px;
}


#credo-sw-v12-2-modal .swv12-card p{
    margin:
        5px 0;

    color:
        #d3e4f1;
}


#credo-sw-v12-2-modal .swv12-important{
    grid-column:
        1 / -1;
}


@media(max-width:700px){

    #credo-sw-v12-2-modal{
        padding:10px;
    }

    #credo-sw-v12-2-modal .swv12-modal{
        width:96vw;
        max-height:92vh;
    }

}

`;

    document.head.appendChild(
        style
    );

})();

/* CREDO_LEGENDA_SUN_V13D */


/* CREDO_KP_LEGENDA_STATIC_V4 */
(function(){

    if(
        document.getElementById(
            'credo-kp-static-v4-style'
        )
    ){
        return;
    }

    const style =
        document.createElement('style');

    style.id =
        'credo-kp-static-v4-style';

    style.textContent = `

.credo-kp-static-v4{
    grid-column:auto;
}

.credo-kp-static-v4 .kpv4-intro{
    margin:6px 0 10px 0;
    color:#b7cada;
    font-size:11px;
    line-height:1.4;
}

.credo-kp-static-v4 .kpv4-table{
    width:100%;
    border-collapse:collapse;
    margin-top:5px;
    font-size:11px;
}

.credo-kp-static-v4 .kpv4-table th,
.credo-kp-static-v4 .kpv4-table td{
    padding:6px 7px;
    text-align:left;
    vertical-align:middle;
    border-bottom:1px solid #1d394c;
}

.credo-kp-static-v4 .kpv4-table th{
    background:#0c2030;
    color:#92acbf;
    font-size:9px;
    text-transform:uppercase;
    letter-spacing:.04em;
}

.credo-kp-static-v4 .kpv4-calm td{
    background:rgba(56,165,92,.07);
}

.credo-kp-static-v4 .kpv4-active td{
    background:rgba(67,122,200,.07);
}

.credo-kp-static-v4 .kpv4-g1 td{
    background:rgba(197,165,41,.08);
}

.credo-kp-static-v4 .kpv4-g23 td{
    background:rgba(205,121,34,.08);
}

.credo-kp-static-v4 .kpv4-g45 td{
    background:rgba(190,55,69,.08);
}

.credo-kp-static-v4 .kpv4-note{
    margin:8px 0 0 0;
    color:#91aabd;
    font-size:10px;
    line-height:1.35;
}

`;

    document.head.appendChild(style);

})();



/* ============================================================
   CREDO_SPACE_LEGEND_FINAL_V14_STYLE
   ============================================================ */
(function(){

    if(
        document.getElementById(
            'credo-space-legend-final-v14-style'
        )
    ){
        return;
    }

    const style=
        document.createElement(
            'style'
        );

    style.id=
        'credo-space-legend-final-v14-style';

    style.textContent=`

/*
 * Usuń z głównej strony drugi rząd:
 * "Skala i interpretacja warunków".
 * Zostaje status obok tytułu oraz przycisk Legenda.
 */
#credo-research-strip .sw13-scale-title,
#credo-research-strip .sw13-scale{
    display:none !important;
}


/* modal */
#credo-sw-v12-2-modal .sw14-modal{
    width:min(1240px,96vw);
    max-height:88vh;
    padding:16px;
}


#credo-sw-v12-2-modal .sw14-header{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:15px;
    margin-bottom:14px;
    padding-bottom:12px;
    border-bottom:1px solid #244258;
}


#credo-sw-v12-2-modal .sw14-heading{
    display:flex;
    align-items:center;
    gap:12px;
}


#credo-sw-v12-2-modal .sw14-sun{
    font-size:30px;
    line-height:1;
}


#credo-sw-v12-2-modal .sw14-subtitle{
    margin-top:3px;
    color:#9ab2c5;
    font-size:12px;
}


#credo-sw-v12-2-modal .sw14-grid{
    display:grid;
    grid-template-columns:
        repeat(
            3,
            minmax(0,1fr)
        );
    gap:10px;
}


#credo-sw-v12-2-modal .sw14-card{
    padding:12px;
    border:1px solid #27465d;
    border-radius:11px;
    background:#081924;
    min-width:0;
}


#credo-sw-v12-2-modal .sw14-card h4{
    margin:0 0 7px 0;
    color:#f2f8fc;
    font-size:14px;
}


#credo-sw-v12-2-modal .sw14-desc{
    margin:0 0 10px 0;
    color:#afc2d1;
    font-size:11px;
    line-height:1.4;
}


#credo-sw-v12-2-modal .sw14-row{
    display:flex;
    align-items:center;
    gap:8px;
    min-height:34px;
    margin:5px 0;
    padding:6px 8px;
    border-radius:7px;
    border:1px solid;
}


#credo-sw-v12-2-modal .sw14-row b{
    display:block;
    font-size:11px;
}


#credo-sw-v12-2-modal .sw14-row small{
    display:block;
    margin-top:1px;
    color:#a8bccb;
    font-size:9px;
    line-height:1.25;
}


#credo-sw-v12-2-modal .sw14-dot{
    width:11px;
    height:11px;
    min-width:11px;
    border-radius:50%;
}


#credo-sw-v12-2-modal .sw14-code{
    width:62px;
    min-width:62px;
    font-size:14px !important;
}


#credo-sw-v12-2-modal .sw14-range{
    width:82px;
    min-width:82px;
    font-size:11px !important;
}


/* GREEN */
#credo-sw-v12-2-modal .green{
    border-color:#23884a;
    background:rgba(25,120,65,.13);
}

#credo-sw-v12-2-modal .green .sw14-dot{
    background:#43d46d;
}

#credo-sw-v12-2-modal .green > b,
#credo-sw-v12-2-modal .green div > b{
    color:#73ec94;
}


/* BLUE */
#credo-sw-v12-2-modal .blue{
    border-color:#246e9f;
    background:rgba(30,113,169,.13);
}

#credo-sw-v12-2-modal .blue .sw14-dot{
    background:#32a6ee;
}

#credo-sw-v12-2-modal .blue > b,
#credo-sw-v12-2-modal .blue div > b{
    color:#72c9fa;
}


/* YELLOW */
#credo-sw-v12-2-modal .yellow{
    border-color:#8c7718;
    background:rgba(160,137,25,.13);
}

#credo-sw-v12-2-modal .yellow .sw14-dot{
    background:#f3d12e;
}

#credo-sw-v12-2-modal .yellow > b,
#credo-sw-v12-2-modal .yellow div > b{
    color:#f2d84b;
}


/* ORANGE */
#credo-sw-v12-2-modal .orange{
    border-color:#974b1f;
    background:rgba(169,72,26,.13);
}

#credo-sw-v12-2-modal .orange .sw14-dot{
    background:#ff852e;
}

#credo-sw-v12-2-modal .orange > b,
#credo-sw-v12-2-modal .orange div > b{
    color:#ff9b55;
}


/* RED */
#credo-sw-v12-2-modal .red{
    border-color:#9b3040;
    background:rgba(157,39,57,.14);
}

#credo-sw-v12-2-modal .red .sw14-dot{
    background:#ef475a;
}

#credo-sw-v12-2-modal .red > b,
#credo-sw-v12-2-modal .red div > b{
    color:#ff7582;
}


/* KP TABLE */
#credo-sw-v12-2-modal .sw14-table{
    width:100%;
    border-collapse:collapse;
    font-size:10px;
}


#credo-sw-v12-2-modal .sw14-table th,
#credo-sw-v12-2-modal .sw14-table td{
    padding:6px 7px;
    text-align:left;
    border-bottom:1px solid #1d394c;
}


#credo-sw-v12-2-modal .sw14-table th{
    background:#0e2637;
    color:#93adbf;
    font-size:9px;
    text-transform:uppercase;
}


/*
 * Kolory tabeli Kp:
 * bez ramek każdego wiersza, tylko delikatne tło.
 */
#credo-sw-v12-2-modal .sw14-table tr.green{
    background:rgba(25,120,65,.12);
}

#credo-sw-v12-2-modal .sw14-table tr.blue{
    background:rgba(30,113,169,.12);
}

#credo-sw-v12-2-modal .sw14-table tr.yellow{
    background:rgba(160,137,25,.12);
}

#credo-sw-v12-2-modal .sw14-table tr.orange{
    background:rgba(169,72,26,.12);
}

#credo-sw-v12-2-modal .sw14-table tr.red{
    background:rgba(157,39,57,.13);
}


/* XRAY INFO */
#credo-sw-v12-2-modal .sw14-info{
    margin-top:8px;
    padding:8px 9px;
    border:1px solid #285579;
    border-radius:7px;
    background:#0d2940;
    color:#a9c8df;
    font-size:9px;
    line-height:1.35;
}


@media(max-width:950px){

    #credo-sw-v12-2-modal .sw14-grid{
        grid-template-columns:
            repeat(
                2,
                minmax(0,1fr)
            );
    }
}


@media(max-width:650px){

    #credo-sw-v12-2-modal .sw14-grid{
        grid-template-columns:1fr;
    }
}

`;

    document.head.appendChild(style);

})();


/* ============================================================
   CREDO_LEGENDA_2ROWS_V14_2

   DESKTOP:
   RZĄD 1:
   Status | Kp | G | S

   RZĄD 2:
   R | Dst | X-ray (2 kolumny)
   ============================================================ */
(function(){

    if(
        document.getElementById(
            'credo-legenda-2rows-v14-2-style'
        )
    ){
        return;
    }


    const style=
        document.createElement(
            'style'
        );

    style.id=
        'credo-legenda-2rows-v14-2-style';


    style.textContent=`

/* ============================================================
   DESKTOP — dokładnie 4 kolumny
   ============================================================ */

#credo-sw-v12-2-modal .sw14-modal{
    width:min(1380px,97vw);
}


#credo-sw-v12-2-modal .sw14-grid{
    display:grid !important;

    grid-template-columns:
        repeat(
            4,
            minmax(0,1fr)
        ) !important;

    gap:10px !important;

    align-items:stretch;
}


/*
 * Kolejność elementów w HTML jest już prawidłowa:
 *
 * 1 Status
 * 2 Kp
 * 3 G
 * 4 S
 * 5 R
 * 6 Dst
 * 7 X-ray
 *
 * Dlatego pierwsze 4 automatycznie tworzą rząd 1.
 * R i Dst zaczynają rząd 2.
 *
 * X-ray zajmuje pozostałe DWIE kolumny.
 */

#credo-sw-v12-2-modal .sw14-xray{
    grid-column:span 2 !important;
}


/*
 * Wszystkie kafelki w obrębie wiersza
 * mają równą konstrukcję.
 */
#credo-sw-v12-2-modal .sw14-card{
    height:auto;
    min-width:0;
}


/*
 * X-ray ma więcej miejsca na opisy.
 */
#credo-sw-v12-2-modal
.sw14-xray
.sw14-row{
    min-height:34px;
}


/* ============================================================
   TABLET
   ============================================================ */

@media(max-width:1050px){

    #credo-sw-v12-2-modal .sw14-grid{

        grid-template-columns:
            repeat(
                2,
                minmax(0,1fr)
            ) !important;
    }


    #credo-sw-v12-2-modal .sw14-xray{
        grid-column:span 2 !important;
    }

}


/* ============================================================
   TELEFON
   ============================================================ */

@media(max-width:650px){

    #credo-sw-v12-2-modal .sw14-grid{

        grid-template-columns:
            1fr !important;
    }


    #credo-sw-v12-2-modal .sw14-xray{
        grid-column:span 1 !important;
    }

}

`;


    document.head.appendChild(
        style
    );

})();


/* ============================================================
   CREDO_LEGENDA_LAYOUT_V14_3

   UKŁAD IDENTYCZNY Z MOCKUPEM:

   RZĄD 1:
   [ STATUS ] [ KP ] [ G ] [ S ]

   RZĄD 2:
   [      R      ] [     DST     ] [    X-RAY    ]

   Technicznie: siatka 12-kolumnowa.
   Góra: 4 x 3 kolumny.
   Dół:  3 x 4 kolumny.
   ============================================================ */
(function(){

    if(
        document.getElementById(
            'credo-legenda-layout-v14-3-style'
        )
    ){
        return;
    }


    const style=
        document.createElement(
            'style'
        );

    style.id=
        'credo-legenda-layout-v14-3-style';


    style.textContent=`

/* szerokość modala jak w mockupie */
#credo-sw-v12-2-modal .sw14-modal{
    width:min(1320px,96vw) !important;
}


/* 12-kolumnowa baza */
#credo-sw-v12-2-modal .sw14-grid{
    display:grid !important;

    grid-template-columns:
        repeat(
            12,
            minmax(0,1fr)
        ) !important;

    gap:10px !important;

    align-items:stretch !important;
}


/* ============================================================
   RZĄD 1 — CZTERY RÓWNE KARTY
   Status / Kp / G / S
   ============================================================ */

#credo-sw-v12-2-modal
.sw14-grid
>
.sw14-card:nth-child(1),

#credo-sw-v12-2-modal
.sw14-grid
>
.sw14-card:nth-child(2),

#credo-sw-v12-2-modal
.sw14-grid
>
.sw14-card:nth-child(3),

#credo-sw-v12-2-modal
.sw14-grid
>
.sw14-card:nth-child(4){

    grid-column:
        span 3 !important;
}


/* ============================================================
   RZĄD 2 — TRZY RÓWNE SZERSZE KARTY
   R / Dst / X-ray
   ============================================================ */

#credo-sw-v12-2-modal
.sw14-grid
>
.sw14-card:nth-child(5),

#credo-sw-v12-2-modal
.sw14-grid
>
.sw14-card:nth-child(6),

#credo-sw-v12-2-modal
.sw14-grid
>
.sw14-card:nth-child(7){

    grid-column:
        span 4 !important;
}


/*
 * Kasujemy efekt V14.2,
 * gdzie X-ray miał szerokość dwóch
 * kolumn starej siatki.
 */
#credo-sw-v12-2-modal
.sw14-grid
>
.sw14-xray{

    grid-column:
        span 4 !important;
}


/* równe karty */
#credo-sw-v12-2-modal .sw14-card{
    min-width:0 !important;
}


/* ============================================================
   TABLET
   ============================================================ */

@media(max-width:1050px){

    #credo-sw-v12-2-modal .sw14-grid{

        grid-template-columns:
            repeat(
                2,
                minmax(0,1fr)
            ) !important;
    }


    #credo-sw-v12-2-modal
    .sw14-grid
    >
    .sw14-card{

        grid-column:
            span 1 !important;
    }


    #credo-sw-v12-2-modal
    .sw14-grid
    >
    .sw14-xray{

        grid-column:
            span 2 !important;
    }

}


/* ============================================================
   TELEFON
   ============================================================ */

@media(max-width:650px){

    #credo-sw-v12-2-modal .sw14-grid{

        grid-template-columns:
            1fr !important;
    }


    #credo-sw-v12-2-modal
    .sw14-grid
    >
    .sw14-card,

    #credo-sw-v12-2-modal
    .sw14-grid
    >
    .sw14-xray{

        grid-column:
            span 1 !important;
    }

}

`;


    document.head.appendChild(
        style
    );

})();


/* CREDO_LEGENDA_FILL_V14_5 */
(function(){

    if(document.getElementById('credo-legenda-fill-v14-5-style')){
        return;
    }

    const style=document.createElement('style');
    style.id='credo-legenda-fill-v14-5-style';

    style.textContent=`

/*
 * Każda karta jest rozciągnięta do pełnej
 * wysokości swojego rzędu.
 */
#credo-sw-v12-2-modal .sw14-grid{
    align-items:stretch !important;
}

#credo-sw-v12-2-modal .sw14-grid > .sw14-card{
    align-self:stretch !important;
    height:auto !important;
    min-height:0 !important;
    gap:6px !important;
}


/*
 * Usuwamy stare marginesy z kolorowych pozycji.
 * Odstępy kontroluje teraz GRID karty.
 */
#credo-sw-v12-2-modal .sw14-card > .sw14-row{
    margin:0 !important;
    min-height:0 !important;
    height:auto !important;
    box-sizing:border-box !important;
}


/* ------------------------------------------------------------
   RZĄD 1
   ------------------------------------------------------------ */

/* STATUS:
   tytuł + opis + 5 wartości
*/
#credo-sw-v12-2-modal
.sw14-grid > .sw14-card:nth-child(1){
    display:grid !important;
    grid-template-rows:auto auto repeat(5,minmax(38px,1fr)) !important;
}


/* KP:
   tytuł + opis + 7 wartości
*/
#credo-sw-v12-2-modal
.sw14-grid > .sw14-card:nth-child(2){
    display:grid !important;
    grid-template-rows:auto auto repeat(7,minmax(38px,1fr)) !important;
}


/* G:
   tytuł + opis + 6 wartości
*/
#credo-sw-v12-2-modal
.sw14-grid > .sw14-card:nth-child(3){
    display:grid !important;
    grid-template-rows:auto auto repeat(6,minmax(38px,1fr)) !important;
}


/* S */
#credo-sw-v12-2-modal
.sw14-grid > .sw14-card:nth-child(4){
    display:grid !important;
    grid-template-rows:auto auto repeat(6,minmax(38px,1fr)) !important;
}


/* ------------------------------------------------------------
   RZĄD 2
   ------------------------------------------------------------ */

/* R */
#credo-sw-v12-2-modal
.sw14-grid > .sw14-card:nth-child(5){
    display:grid !important;
    grid-template-rows:auto auto repeat(6,minmax(38px,1fr)) !important;
}


/* DST */
#credo-sw-v12-2-modal
.sw14-grid > .sw14-card:nth-child(6){
    display:grid !important;
    grid-template-rows:auto auto repeat(6,minmax(38px,1fr)) !important;
}


/*
 * X-RAY:
 * tytuł + opis + 6 wartości + informacja na dole
 */
#credo-sw-v12-2-modal
.sw14-grid > .sw14-card:nth-child(7){
    display:grid !important;
    grid-template-rows:auto auto repeat(6,minmax(38px,1fr)) auto !important;
}


/* tekst wewnątrz zawsze pionowo na środku */
#credo-sw-v12-2-modal .sw14-row{
    align-items:center !important;
}


/*
 * Notka X-ray pozostaje dokładnie na dole.
 */
#credo-sw-v12-2-modal .sw14-xray > .sw14-info{
    margin:0 !important;
    align-self:end !important;
}


/*
 * Na mniejszych ekranach wracamy do naturalnej
 * wysokości, żeby niczego nie zgniatać.
 */
@media(max-width:1050px){

    #credo-sw-v12-2-modal
    .sw14-grid > .sw14-card{
        display:flex !important;
        flex-direction:column !important;
        height:auto !important;
    }

    #credo-sw-v12-2-modal
    .sw14-card > .sw14-row{
        min-height:36px !important;
    }
}

`;

    document.head.appendChild(style);

})();

/* ============================================================
   CREDO_SPACE_HISTORY_V15
   CREDO_SPACE_HISTORY_V15_1_VISUAL
   Historia pogody kosmicznej — renderer V15.1
   ============================================================ */

(function(){

"use strict";

const sw151={
    hours:24,
    data:null,
    hover:null,
    pinned:null,
    boot:0
};


function sw151Esc(v){
    return String(v ?? "")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;");
}


function sw151Pad(v){
    return String(v).padStart(2,"0");
}


function sw151WeatherHost(){

    const legend=document.getElementById("sw13-legend");

    if(!legend){
        return null;
    }

    let node=legend;

    while(node && node!==document.body){

        if(
            node.querySelector(":scope > .sw13-head")
            &&
            node.querySelector(":scope > .sw13-metrics")
        ){
            return node;
        }

        node=node.parentElement;
    }

    return null;
}


function sw151EnsureStyle(){

    if(document.getElementById("sw151-style")){
        return;
    }

    const style=document.createElement("style");

    style.id="sw151-style";

    style.textContent=`

#sw151-history{
    position:relative;
    margin:14px 0 18px;
    padding:16px;
    border:1px solid #31536e;
    border-radius:14px;
    background:#0b1d2d;
    color:#eaf3f8;
}

#sw151-history .head{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:14px;
    margin-bottom:13px;
}

#sw151-history .title{
    font-size:20px;
    font-weight:800;
}

#sw151-history .sub{
    margin-top:3px;
    color:#91a8b9;
    font-size:11px;
}

#sw151-history .actions{
    display:flex;
    gap:6px;
    flex-wrap:wrap;
}

#sw151-history button{
    padding:6px 11px;
    border:1px solid #365d79;
    border-radius:8px;
    background:#10283b;
    color:#b8cbd9;
    cursor:pointer;
}

#sw151-history button.active{
    border-color:#42bdf5;
    background:#123e5a;
    color:#fff;
}

#sw151-history .legend{
    display:none;
    margin-bottom:12px;
    padding:10px 12px;
    border:1px solid #294b64;
    border-radius:9px;
    background:#091a29;
    color:#9fb4c3;
    font-size:10px;
    line-height:1.55;
}

#sw151-history .legend.open{
    display:block;
}

#sw151-history .plot{
    position:relative;
    overflow:hidden;
    border:1px solid #26475e;
    border-radius:10px;
    background:#071722;
}

#sw151-history canvas{
    display:block;
    width:100%;
    height:470px;
    cursor:crosshair;
}

#sw151-history .foot{
    margin-top:10px;
    padding:8px 10px;
    border:1px solid rgba(54,93,121,.55);
    border-radius:8px;
    background:rgba(7,23,34,.55);
    color:#8199aa;
    font-size:9px;
    line-height:1.45;
}

#sw151-tip{
    position:absolute;
    z-index:20;
    display:none;
    width:280px;
    padding:10px 12px;
    border:1px solid #4a7a9b;
    border-radius:9px;
    background:rgba(5,20,31,.98);
    color:#dceaf3;
    box-shadow:0 12px 34px rgba(0,0,0,.42);
    pointer-events:none;
    font-size:10px;
    line-height:1.5;
}

#sw151-tip .t{
    color:#fff;
    font-size:11px;
    font-weight:800;
    margin-bottom:4px;
}

#sw151-tip .status{
    color:#8ddca4;
    font-weight:700;
    margin-bottom:5px;
}

#sw151-tip .grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:3px 12px;
}

#sw151-tip .note{
    margin-top:7px;
    padding-top:6px;
    border-top:1px solid #29485d;
    color:#92aabd;
}

#sw151-tip strong{
    color:#fff;
}

#sw151-history .error{
    padding:8px 0;
    color:#ffb567;
}

`;

    document.head.appendChild(style);
}


/* CREDO_SPACE_HISTORY_POSITION_V15_4_SOURCE */

function sw151EventsHistoryHost(){

    const headings=[
        ...document.querySelectorAll("h2")
    ];

    const heading=headings.find(
        node =>
            String(
                node.textContent || ""
            )
            .replace(/\s+/g," ")
            .trim()
            ===
            "Liczba zapisanych zdarzeń"
    );

    if(!heading){
        return null;
    }

    return heading.closest("section");
}


function sw151Ensure(){

    sw151EnsureStyle();

    let host=document.getElementById("sw151-history");

    if(host){
        return host;
    }

    const target=sw151EventsHistoryHost();

    if(!target || !target.parentNode){
        return null;
    }

    host=document.createElement("section");

    host.id="sw151-history";

    host.innerHTML=`

<div class="head">

    <div>
        <div class="title">
            Historia pogody kosmicznej
        </div>

        <div class="sub" id="sw151-meta">
            NOAA SWPC · czas UTC
        </div>
    </div>

    <div class="actions">

        <button data-hours="24" class="active">
            24 h
        </button>

        <button data-hours="72">
            72 h
        </button>

        <button data-hours="168">
            7 dni
        </button>

        <button id="sw151-legend-button">
            Legenda
        </button>

    </div>

</div>


<div class="legend" id="sw151-legend">

    <b>Kp:</b>
    zielony 0–3 · żółty 4 · pomarańczowy 5–6 · czerwony 7–9.
    Linia przerywana pokazuje próg Kp 5 = G1.

    <br>

    <b>G/S/R:</b>
    poziomy 0–5.
    Szare pole przy S oznacza brak historycznej wartości — nie jest ona rekonstruowana.

    <br>

    <b>X-ray:</b>
    klasy A, B, C, M, X według GOES.

</div>


<div id="sw151-error"></div>


<div class="plot">

    <canvas id="sw151-canvas"></canvas>

    <div id="sw151-tip"></div>

</div>


<div class="foot">

    Źródło: NOAA SWPC.
    Kp ma natywną rozdzielczość 3 h.
    G historyczne jest mapowane z progów Kp,
    R z klasy maksimum GOES X-ray.
    Historycznego S nie uzupełniamy sztucznie.
    Zbieżność czasowa z detekcjami CREDO nie oznacza związku przyczynowego.

</div>
`;

    target.insertAdjacentElement(
        "afterend",
        host
    );


    host.querySelectorAll("[data-hours]")
        .forEach(button=>{

            button.onclick=()=>{

                sw151.hours=Number(
                    button.dataset.hours
                );

                sw151.hover=null;
                sw151.pinned=null;

                host.querySelectorAll("[data-hours]")
                    .forEach(x=>x.classList.remove("active"));

                button.classList.add("active");

                sw151HideTip();
                sw151Refresh();
            };
        });


    host.querySelector("#sw151-legend-button")
        .onclick=()=>{

            host.querySelector("#sw151-legend")
                .classList.toggle("open");
        };


    sw151BindCanvas(
        host.querySelector("#sw151-canvas")
    );

    return host;
}


function sw151Box(){

    const canvas=document.getElementById("sw151-canvas");

    if(!canvas){
        return null;
    }

    const rect=canvas.getBoundingClientRect();

    if(!rect.width || !rect.height){
        return null;
    }

    const dpr=window.devicePixelRatio || 1;

    canvas.width=Math.round(rect.width*dpr);
    canvas.height=Math.round(rect.height*dpr);

    const ctx=canvas.getContext("2d");

    ctx.setTransform(
        dpr,0,0,dpr,0,0
    );

    return {
        canvas,
        ctx,
        w:rect.width,
        h:rect.height
    };
}


function sw151Layout(w,h){

    const left=82;
    const right=18;

    return {
        left,
        right,
        width:w-left-right,

        kp:{
            top:25,
            height:95
        },

        dst:{
            top:150,
            height:85
        },

        gsr:{
            top:265,
            height:90
        },

        xray:{
            top:385,
            height:55
        },

        axisY:462
    };
}


function sw151X(index,count,L){

    if(count<=1){
        return L.left+L.width/2;
    }

    return (
        L.left
        +
        index/(count-1)*L.width
    );
}


function sw151Line(
    ctx,
    x1,
    y1,
    x2,
    y2,
    color,
    width=1
){

    ctx.strokeStyle=color;
    ctx.lineWidth=width;

    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}


function sw151KpColor(v){

    v=Number(v);

    if(v>=7){
        return "#ed5964";
    }

    if(v>=5){
        return "#f59b42";
    }

    if(v>=4){
        return "#e3cc4d";
    }

    return "#45cb78";
}


function sw151ScaleColor(v){

    if(v===null || v===undefined){
        return "#263b4a";
    }

    v=Number(v);

    if(v>=4){
        return "#ed5964";
    }

    if(v>=2){
        return "#f58645";
    }

    if(v>=1){
        return "#dfc84c";
    }

    return "#49bd70";
}


function sw151XrayLevel(value){

    const s=String(value || "").toUpperCase();

    if(s.startsWith("X")){
        return 4;
    }

    if(s.startsWith("M")){
        return 3;
    }

    if(s.startsWith("C")){
        return 2;
    }

    if(s.startsWith("B")){
        return 1;
    }

    if(s.startsWith("A")){
        return 0;
    }

    return null;
}


function sw151XrayColor(value){

    const level=sw151XrayLevel(value);

    if(level===4){
        return "#ed5964";
    }

    if(level===3){
        return "#f58645";
    }

    if(level===2){
        return "#e3cc4d";
    }

    return "#49bd70";
}


function sw151Panel(ctx,b,L){

    ctx.fillStyle="rgba(10,31,46,.46)";

    ctx.fillRect(
        L.left-8,
        b.top-8,
        L.width+16,
        b.height+16
    );
}


function sw151DrawKp(ctx,points,L,selected){

    const b=L.kp;

    sw151Panel(ctx,b,L);

    ctx.fillStyle="#dcebf4";
    ctx.font="700 11px system-ui";
    ctx.fillText("Kp",14,b.top+15);

    [0,3,5,7,9].forEach(v=>{

        const y=
            b.top+b.height
            -
            v/9*b.height;

        if(v===5){
            ctx.setLineDash([5,5]);
        }

        sw151Line(
            ctx,
            L.left,
            y,
            L.left+L.width,
            y,
            v===5 ? "#a96a39" : "#203b4e"
        );

        ctx.setLineDash([]);

        ctx.fillStyle=
            v===5
            ? "#f3a15c"
            : "#758f9f";

        ctx.font="9px system-ui";
        ctx.textAlign="right";

        ctx.fillText(
            String(v),
            L.left-10,
            y+3
        );
    });

    ctx.textAlign="left";

    const threshold=
        b.top+b.height
        -
        5/9*b.height;

    ctx.fillStyle="#e3a05f";
    ctx.font="9px system-ui";

    ctx.fillText(
        "Kp 5 = G1",
        L.left+8,
        threshold-5
    );


    const step=
        L.width/
        Math.max(1,points.length);

    const barWidth=
        Math.max(
            2,
            Math.min(
                18,
                step*.66
            )
        );


    points.forEach((p,index)=>{

        if(p.kp===null || p.kp===undefined){
            return;
        }

        const value=Number(p.kp);

        if(!Number.isFinite(value)){
            return;
        }

        const x=sw151X(
            index,
            points.length,
            L
        );

        const y=
            b.top+b.height
            -
            Math.max(
                0,
                Math.min(9,value)
            )
            /9
            *
            b.height;

        ctx.fillStyle=
            selected===index
            ? "#ffd166"
            : sw151KpColor(value);

        ctx.fillRect(
            x-barWidth/2,
            y,
            barWidth,
            b.top+b.height-y
        );
    });
}


function sw151DrawDst(ctx,points,L){

    const b=L.dst;

    sw151Panel(ctx,b,L);

    ctx.fillStyle="#dcebf4";
    ctx.font="700 11px system-ui";
    ctx.fillText("Dst",14,b.top+15);


    const vals=points
        .map(p=>p.dst)
        .filter(
            v=>
                v!==null
                &&
                v!==undefined
                &&
                Number.isFinite(Number(v))
        )
        .map(Number);


    if(!vals.length){
        return;
    }


    let min=Math.min(...vals);
    let max=Math.max(...vals);

    max=Math.max(max,0);

    if(min===max){
        min-=10;
        max+=10;
    }

    const padding=Math.max(
        5,
        (max-min)*.15
    );

    min-=padding;
    max+=padding;


    const yFor=value=>
        b.top+b.height
        -
        (
            (Number(value)-min)
            /
            (max-min)
        )
        *
        b.height;


    [max,(max+min)/2,min]
        .forEach(value=>{

            const y=yFor(value);

            sw151Line(
                ctx,
                L.left,
                y,
                L.left+L.width,
                y,
                "#203b4e"
            );

            ctx.fillStyle="#758f9f";
            ctx.font="9px system-ui";
            ctx.textAlign="right";

            ctx.fillText(
                Math.round(value),
                L.left-10,
                y+3
            );
        });


    ctx.textAlign="left";


    [-50,-100].forEach(limit=>{

        if(limit<min || limit>max){
            return;
        }

        ctx.setLineDash([4,5]);

        sw151Line(
            ctx,
            L.left,
            yFor(limit),
            L.left+L.width,
            yFor(limit),
            "#784f4f"
        );

        ctx.setLineDash([]);
    });


    ctx.strokeStyle="#b784ff";
    ctx.lineWidth=2;
    ctx.beginPath();


    let started=false;


    points.forEach((p,index)=>{

        if(p.dst===null || p.dst===undefined){
            return;
        }

        const value=Number(p.dst);

        if(!Number.isFinite(value)){
            return;
        }

        const x=sw151X(
            index,
            points.length,
            L
        );

        const y=yFor(value);

        if(!started){
            ctx.moveTo(x,y);
            started=true;
        }else{
            ctx.lineTo(x,y);
        }
    });


    ctx.stroke();


    const every=
        sw151.hours===24
        ? 1
        : (
            sw151.hours===72
            ? 3
            : 6
        );


    points.forEach((p,index)=>{

        if(index%every!==0){
            return;
        }

        if(p.dst===null || p.dst===undefined){
            return;
        }

        const value=Number(p.dst);

        if(!Number.isFinite(value)){
            return;
        }

        const x=sw151X(
            index,
            points.length,
            L
        );

        const y=yFor(value);

        ctx.fillStyle="#c49bff";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            2.3,
            0,
            Math.PI*2
        );

        ctx.fill();
    });
}


function sw151DrawGsr(ctx,points,L,selected){

    const b=L.gsr;

    sw151Panel(ctx,b,L);

    ctx.fillStyle="#dcebf4";
    ctx.font="700 11px system-ui";
    ctx.fillText("G / S / R",14,b.top+15);


    const lanes=[
        ["g","G"],
        ["s","S"],
        ["r","R"]
    ];


    const laneH=b.height/3;


    lanes.forEach(([key,label],row)=>{

        const y=b.top+row*laneH;

        ctx.fillStyle="#91a9b9";
        ctx.font="700 9px system-ui";
        ctx.textAlign="right";

        ctx.fillText(
            label,
            L.left-10,
            y+laneH/2+3
        );

        ctx.textAlign="left";


        points.forEach((p,index)=>{

            const x0=
                L.left
                +
                index/points.length
                *
                L.width;

            const x1=
                L.left
                +
                (index+1)/points.length
                *
                L.width;

            ctx.fillStyle=
                sw151ScaleColor(
                    p[key]
                );

            ctx.globalAlpha=
                p[key]===null
                ||
                p[key]===undefined
                ? .40
                : .88;

            ctx.fillRect(
                x0,
                y+3,
                Math.max(
                    1,
                    x1-x0
                ),
                laneH-6
            );

            ctx.globalAlpha=1;


            if(selected===index){

                ctx.strokeStyle="#eaf7ff";

                ctx.strokeRect(
                    x0+.5,
                    y+3.5,
                    Math.max(
                        1,
                        x1-x0-1
                    ),
                    laneH-7
                );
            }
        });


        if(row<2){

            sw151Line(
                ctx,
                L.left,
                y+laneH,
                L.left+L.width,
                y+laneH,
                "#1d3648"
            );
        }
    });
}


function sw151DrawXray(ctx,points,L){

    const b=L.xray;

    sw151Panel(ctx,b,L);

    ctx.fillStyle="#dcebf4";
    ctx.font="700 11px system-ui";
    ctx.fillText("X-ray",14,b.top+15);


    [
        ["A",0],
        ["B",1],
        ["C",2],
        ["M",3],
        ["X",4]
    ].forEach(([label,level])=>{

        const y=
            b.top+b.height
            -
            level/4*b.height;

        sw151Line(
            ctx,
            L.left,
            y,
            L.left+L.width,
            y,
            "#1d3749"
        );

        ctx.fillStyle="#758f9f";
        ctx.font="8px system-ui";
        ctx.textAlign="right";

        ctx.fillText(
            label,
            L.left-10,
            y+3
        );
    });


    ctx.textAlign="left";

    let n=0;


    points.forEach((p,index)=>{

        const level=sw151XrayLevel(
            p.xray
        );

        if(level===null){
            return;
        }

        n++;

        const x=sw151X(
            index,
            points.length,
            L
        );

        const y=
            b.top+b.height
            -
            level/4*b.height;


        ctx.strokeStyle=sw151XrayColor(
            p.xray
        );

        ctx.lineWidth=2;

        ctx.beginPath();
        ctx.moveTo(x,b.top+b.height);
        ctx.lineTo(x,y);
        ctx.stroke();


        ctx.fillStyle=sw151XrayColor(
            p.xray
        );

        ctx.beginPath();
        ctx.arc(
            x,y,4,0,Math.PI*2
        );
        ctx.fill();


        if(
            sw151.hours===24
            ||
            level>=3
        ){

            ctx.fillStyle="#dcebf4";
            ctx.font="9px system-ui";

            ctx.fillText(
                String(p.xray),
                Math.min(
                    x+5,
                    L.left+L.width-32
                ),
                Math.max(
                    b.top+9,
                    y-5
                )
            );
        }
    });


    if(!n){

        ctx.fillStyle="#607c8d";
        ctx.font="10px system-ui";

        ctx.fillText(
            "brak rozbłysków w tym przedziale",
            L.left+10,
            b.top+b.height/2
        );
    }
}


function sw151TimeLabel(value){

    const d=new Date(value);

    if(sw151.hours<=24){

        return (
            sw151Pad(d.getUTCHours())
            +
            ":00"
        );
    }

    if(sw151.hours<=72){

        return (
            sw151Pad(d.getUTCDate())
            +
            "."
            +
            sw151Pad(d.getUTCMonth()+1)
            +
            " "
            +
            sw151Pad(d.getUTCHours())
        );
    }

    return (
        sw151Pad(d.getUTCDate())
        +
        "."
        +
        sw151Pad(d.getUTCMonth()+1)
    );
}


function sw151DrawAxis(ctx,points,L){

    const marks=
        sw151.hours===24
        ? 7
        : 8;


    ctx.fillStyle="#7890a0";
    ctx.font="9px system-ui";


    for(let i=0;i<marks;i++){

        const index=Math.round(
            i
            *
            (points.length-1)
            /
            (marks-1)
        );


        const x=sw151X(
            index,
            points.length,
            L
        );


        const label=sw151TimeLabel(
            points[index].time
        );


        const width=
            ctx.measureText(label).width;


        ctx.fillText(
            label,
            Math.max(
                L.left,
                Math.min(
                    L.left
                    +
                    L.width
                    -
                    width,
                    x-width/2
                )
            ),
            L.axisY
        );
    }
}


function sw151Selected(){

    if(sw151.hover!==null){
        return sw151.hover;
    }

    if(sw151.pinned!==null){
        return sw151.pinned;
    }

    return null;
}


function sw151Crosshair(ctx,points,L,index){

    if(
        index===null
        ||
        !points[index]
    ){
        return;
    }

    const x=sw151X(
        index,
        points.length,
        L
    );

    ctx.save();

    ctx.setLineDash([4,4]);

    sw151Line(
        ctx,
        x,
        L.kp.top-10,
        x,
        L.xray.top+L.xray.height+5,
        "#d9f0ff"
    );

    ctx.restore();
}


function sw151Render(data){

    sw151.data=data;

    const host=sw151Ensure();

    if(!host){
        return;
    }

    const points=Array.isArray(data?.points)
        ? data.points
        : [];


    const error=host.querySelector(
        "#sw151-error"
    );


    if(!points.length){

        error.innerHTML=
            '<div class="error">'
            +
            'Brak danych historycznych NOAA.'
            +
            '</div>';

        return;
    }


    error.textContent="";


    const coverage=data.coverage || {};


    host.querySelector("#sw151-meta")
        .textContent=
            "NOAA SWPC · UTC"
            +
            " · Kp "
            +
            (coverage.kp_records ?? "—")
            +
            " · Dst "
            +
            (coverage.dst_records ?? "—")
            +
            " · rozbłyski "
            +
            (coverage.flare_records ?? "—");


    const box=sw151Box();

    if(!box){
        return;
    }


    const {ctx,w,h}=box;

    const L=sw151Layout(w,h);


    ctx.clearRect(
        0,0,w,h
    );


    ctx.fillStyle="#071722";

    ctx.fillRect(
        0,0,w,h
    );


    const selected=sw151Selected();


    sw151DrawKp(
        ctx,
        points,
        L,
        selected
    );


    sw151DrawDst(
        ctx,
        points,
        L
    );


    sw151DrawGsr(
        ctx,
        points,
        L,
        selected
    );


    sw151DrawXray(
        ctx,
        points,
        L
    );


    sw151DrawAxis(
        ctx,
        points,
        L
    );


    sw151Crosshair(
        ctx,
        points,
        L,
        selected
    );
}


function sw151Interval(value){

    const a=new Date(value);

    const b=new Date(
        a.getTime()
        +
        3600000
    );

    return (
        a.getUTCFullYear()
        +
        "-"
        +
        sw151Pad(a.getUTCMonth()+1)
        +
        "-"
        +
        sw151Pad(a.getUTCDate())
        +
        " "
        +
        sw151Pad(a.getUTCHours())
        +
        ":00 – "
        +
        sw151Pad(b.getUTCHours())
        +
        ":00 UTC"
    );
}


function sw151Interpret(p){

    const status=String(
        p.status || ""
    );

    if(status.includes("Spokoj")){
        return "Warunki pogody kosmicznej spokojne w tym przedziale.";
    }

    if(status.includes("Brak")){
        return "Brak pełnego zestawu danych dla tego przedziału.";
    }

    return "W tym przedziale wystąpiła podwyższona aktywność pogody kosmicznej.";
}


function sw151TipHtml(p){

    const kp=
        p.kp==null
        ? "—"
        : Number(p.kp).toFixed(2);

    const dst=
        p.dst==null
        ? "—"
        : Number(p.dst).toFixed(0)+" nT";

    const g=
        p.g==null
        ? "—"
        : "G"+p.g;

    const s=
        p.s==null
        ? "—"
        : "S"+p.s;

    const r=
        p.r==null
        ? "—"
        : "R"+p.r;


    return `

<div class="t">
${sw151Esc(sw151Interval(p.time))}
</div>

<div class="status">
${sw151Esc(p.status || "—")}
</div>

<div class="grid">

    <span>Kp</span>
    <strong>${kp}</strong>

    <span>G / S / R</span>
    <strong>
        ${sw151Esc(g)}
        ·
        ${sw151Esc(s)}
        ·
        ${sw151Esc(r)}
    </strong>

    <span>Dst</span>
    <strong>${sw151Esc(dst)}</strong>

    <span>X-ray</span>
    <strong>
        ${sw151Esc(p.xray || "—")}
    </strong>

</div>

<div class="note">

    ${sw151Esc(sw151Interpret(p))}

    <br>

    Zbieżność czasowa nie oznacza
    związku przyczynowego z detekcjami CREDO.

</div>
`;
}


function sw151HideTip(){

    const tip=document.getElementById(
        "sw151-tip"
    );

    if(tip){
        tip.style.display="none";
    }
}


function sw151ShowTip(
    index,
    clientX,
    clientY
){

    const host=document.getElementById(
        "sw151-history"
    );

    const tip=document.getElementById(
        "sw151-tip"
    );

    const p=sw151.data?.points?.[index];


    if(!host || !tip || !p){
        return;
    }


    tip.innerHTML=sw151TipHtml(p);


    const rect=host.getBoundingClientRect();


    let left=
        clientX-rect.left+14;

    let top=
        clientY-rect.top+14;


    left=Math.max(
        8,
        Math.min(
            host.clientWidth-300,
            left
        )
    );


    top=Math.max(
        60,
        Math.min(
            host.clientHeight-190,
            top
        )
    );


    tip.style.left=left+"px";
    tip.style.top=top+"px";
    tip.style.display="block";
}


function sw151EventIndex(
    canvas,
    event
){

    const points=sw151.data?.points || [];

    if(!points.length){
        return null;
    }


    const rect=canvas.getBoundingClientRect();

    const L=sw151Layout(
        rect.width,
        rect.height
    );


    const x=Math.max(
        0,
        Math.min(
            L.width,
            event.clientX
            -
            rect.left
            -
            L.left
        )
    );


    return Math.max(
        0,
        Math.min(
            points.length-1,
            Math.round(
                x/L.width
                *
                (points.length-1)
            )
        )
    );
}


function sw151BindCanvas(canvas){

    canvas.onmousemove=event=>{

        const index=sw151EventIndex(
            canvas,
            event
        );

        if(index===null){
            return;
        }

        sw151.hover=index;

        sw151Render(
            sw151.data
        );

        sw151ShowTip(
            index,
            event.clientX,
            event.clientY
        );
    };


    canvas.onmouseleave=()=>{

        sw151.hover=null;

        if(sw151.data){
            sw151Render(sw151.data);
        }

        if(sw151.pinned===null){
            sw151HideTip();
        }
    };


    canvas.onclick=event=>{

        const index=sw151EventIndex(
            canvas,
            event
        );

        if(index===null){
            return;
        }

        if(sw151.pinned===index){
            sw151.pinned=null;
        }else{
            sw151.pinned=index;
        }

        sw151.hover=index;

        sw151Render(
            sw151.data
        );

        sw151ShowTip(
            index,
            event.clientX,
            event.clientY
        );
    };
}


async function sw151Refresh(){

    const host=sw151Ensure();

    if(!host){
        return;
    }


    try{

        const response=await fetch(
            "/api/space-history?hours="
            +
            encodeURIComponent(
                sw151.hours
            ),
            {
                cache:"no-store"
            }
        );


        if(!response.ok){

            throw new Error(
                "HTTP "
                +
                response.status
            );
        }


        const data=await response.json();


        if(
            data.version
            !==
            "CREDO_SPACE_HISTORY_V15"
        ){
            throw new Error(
                "nieprawidłowa wersja API"
            );
        }


        sw151Render(data);


    }catch(error){

        host.querySelector(
            "#sw151-error"
        ).innerHTML=
            '<div class="error">'
            +
            'Historia NOAA chwilowo niedostępna.'
            +
            '</div>';


        console.error(
            "CREDO V15.1",
            error
        );
    }
}


function sw151Boot(){

    if(sw151Ensure()){

        sw151Refresh();

        return;
    }


    sw151.boot++;


    if(sw151.boot<15){

        setTimeout(
            sw151Boot,
            400
        );
    }
}


setTimeout(
    sw151Boot,
    100
);


setInterval(
    sw151Refresh,
    5*60*1000
);


window.addEventListener(
    "resize",
    ()=>{

        if(sw151.data){
            sw151Render(sw151.data);
        }
    }
);


})();



/* ============================================================
   CREDO_JOURNAL_ACTIONS_VISUAL_V3

   Wyłącznie wygląd akcji przy rekordach.
   Brak zmian w zapisie Journalu i renderowaniu danych.
   ============================================================ */

(() => {

    const id=
        'credo-journal-actions-visual-v3';

    if(document.getElementById(id)){
        return;
    }

    const style=
        document.createElement('style');

    style.id=id;

    style.textContent=`

/* ------------------------------------------------------------
   DLACZEGO? + ZAPISZ DO JOURNALU
   ------------------------------------------------------------ */

#credo-research-dialog
td:has([data-journal-candidate-v2])
summary,

#credo-research-dialog
td:has([data-journal-coincidence-v2])
summary,

#credo-research-dialog
[data-journal-candidate-v2],

#credo-research-dialog
[data-journal-coincidence-v2]{

    display:inline-flex !important;
    align-items:center !important;
    justify-content:center !important;

    width:148px !important;
    min-width:148px !important;
    max-width:148px !important;

    height:32px !important;
    min-height:32px !important;

    box-sizing:border-box !important;

    margin-left:0 !important;

    padding:0 11px !important;

    border-radius:9px !important;

    border:
        1px solid rgba(118,164,205,.38)
        !important;

    font-size:12px !important;
    font-weight:650 !important;
    line-height:1 !important;

    white-space:nowrap !important;

    box-shadow:none !important;
}


/* Dlaczego? */

#credo-research-dialog
td:has([data-journal-candidate-v2])
summary,

#credo-research-dialog
td:has([data-journal-coincidence-v2])
summary{

    margin:0 !important;

    background:
        rgba(31,56,78,.72)
        !important;

    color:#dbeaf6 !important;

    cursor:pointer !important;

    list-style:none !important;
}


#credo-research-dialog
td:has([data-journal-candidate-v2])
summary::-webkit-details-marker,

#credo-research-dialog
td:has([data-journal-coincidence-v2])
summary::-webkit-details-marker{

    display:none !important;
}


/* Zapisz do Journalu */

#credo-research-dialog
[data-journal-candidate-v2],

#credo-research-dialog
[data-journal-coincidence-v2]{

    margin-top:7px !important;

    background:
        rgba(45,75,103,.78)
        !important;

    color:#e9f4ff !important;

    cursor:pointer !important;
}


#credo-research-dialog
[data-journal-candidate-v2]:hover:not(:disabled),

#credo-research-dialog
[data-journal-coincidence-v2]:hover:not(:disabled){

    background:
        rgba(58,94,126,.92)
        !important;

    border-color:
        rgba(139,190,233,.55)
        !important;
}


/* Po zapisaniu */

#credo-research-dialog
[data-journal-candidate-v2]:disabled,

#credo-research-dialog
[data-journal-coincidence-v2]:disabled{

    opacity:.70 !important;

    cursor:default !important;

    background:
        rgba(38,64,82,.60)
        !important;
}


/* ------------------------------------------------------------
   STATUS #ID / OK / BŁĄD
   ------------------------------------------------------------ */

#credo-research-dialog
[data-journal-candidate-v2]
+ .research-muted,

#credo-research-dialog
[data-journal-coincidence-v2]
+ .research-muted{

    display:inline-flex !important;
    align-items:center !important;
    justify-content:center !important;

    min-width:38px !important;
    height:25px !important;

    box-sizing:border-box !important;

    margin-left:7px !important;
    margin-top:7px !important;

    padding:0 8px !important;

    border:
        1px solid rgba(91,141,178,.30)
        !important;

    border-radius:999px !important;

    background:
        rgba(20,42,58,.72)
        !important;

    color:#a9c7dc !important;

    font-size:11px !important;
    font-weight:650 !important;

    white-space:nowrap !important;
}


#credo-research-dialog
[data-journal-candidate-v2]
+ .research-muted:empty,

#credo-research-dialog
[data-journal-coincidence-v2]
+ .research-muted:empty{

    display:none !important;
}


/* ------------------------------------------------------------
   RÓWNE ODSTĘPY
   ------------------------------------------------------------ */

#credo-research-dialog
td:has([data-journal-candidate-v2])
details,

#credo-research-dialog
td:has([data-journal-coincidence-v2])
details{

    width:148px !important;
    margin:0 !important;
}


#credo-research-dialog
td:has([data-journal-candidate-v2])
> div:has([data-journal-candidate-v2]){

    margin-top:7px !important;
    gap:7px !important;
    align-items:center !important;
}

`;

    document.head.appendChild(style);

})();



/* ============================================================
   CREDO_OPERATOR_ALERTS_UI_V1

   Panel operatorski wewnątrz "Stan systemu".
   Nie zmienia istniejących kafelków System Health.
   Brak MutationObserver.
   ============================================================ */

(() => {

    /*
     * CREDO_OPERATOR_ALERTS_UI_V1_DISABLED_BY_APP_V1_1B
     *
     * V1.1B jest renderowane przez app.js.
     * Ten stary niezależny moduł kończymy natychmiast:
     * - brak drugiego fetch()
     * - brak drugiego setInterval()
     * - brak zapisu do #system-health
     */
    return;


    const STYLE_ID=
        'credo-operator-alerts-style-v1';

    const PANEL_ID=
        'credo-operator-alerts-v1';


    function esc(value){

        return String(
            value
            ??''
        )
        .replace(
            /&/g,
            '&amp;'
        )
        .replace(
            /</g,
            '&lt;'
        )
        .replace(
            />/g,
            '&gt;'
        )
        .replace(
            /"/g,
            '&quot;'
        )
        .replace(
            /'/g,
            '&#39;'
        );
    }


    function ensureStyle(){

        if(
            document.getElementById(
                STYLE_ID
            )
        ){
            return;
        }


        const style=
            document.createElement(
                'style'
            );

        style.id=
            STYLE_ID;

        style.textContent=`

#${PANEL_ID}{
    margin:12px 0 4px 0;
    border:1px solid #29485d;
    border-radius:10px;
    background:#0a1a25;
    overflow:hidden;
}

#${PANEL_ID}[data-state="warning"]{
    border-color:#8b6b24;
}

#${PANEL_ID}[data-state="error"]{
    border-color:#963f47;
}

#${PANEL_ID} > summary{
    list-style:none;
    cursor:pointer;
    user-select:none;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:14px;
    min-height:48px;
    padding:10px 13px;
}

#${PANEL_ID} > summary::-webkit-details-marker{
    display:none;
}

.opAlertsLeftV1{
    display:flex;
    align-items:center;
    gap:9px;
    min-width:0;
}

.opAlertsTitleV1{
    color:#e8f3fb;
    font-weight:750;
    font-size:14px;
    white-space:nowrap;
}

.opAlertsCountV1{
    color:#8fa9bc;
    font-size:12px;
}

.opAlertsPillV1{
    flex:0 0 auto;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    height:27px;
    padding:0 10px;
    border-radius:8px;
    border:1px solid #29724c;
    color:#58d88c;
    background:rgba(22,94,55,.15);
    font-size:11px;
    font-weight:800;
}

.opAlertsPillV1.warning{
    border-color:#967022;
    color:#f1c55b;
    background:rgba(128,91,16,.15);
}

.opAlertsPillV1.error{
    border-color:#9d4049;
    color:#ff858e;
    background:rgba(122,31,39,.17);
}

.opAlertsBodyV1{
    border-top:1px solid #203b4e;
    padding:12px;
}

.opAlertsEmptyV1{
    color:#9eb4c5;
    font-size:13px;
}

.opAlertsListV1{
    display:grid;
    gap:8px;
}

.opAlertItemV1{
    display:grid;
    grid-template-columns:auto 1fr;
    gap:10px;
    padding:10px;
    border:1px solid #263f51;
    border-radius:9px;
    background:#091824;
}

.opAlertItemV1.warning{
    border-color:rgba(183,137,42,.45);
}

.opAlertItemV1.error{
    border-color:rgba(193,67,77,.48);
}

.opAlertBadgeV1{
    align-self:start;
    min-width:52px;
    text-align:center;
    padding:4px 7px;
    border-radius:999px;
    border:1px solid #3b6078;
    color:#9dc3dc;
    font-size:10px;
    font-weight:800;
}

.opAlertBadgeV1.info{
    border-color:#3b6078;
    color:#9dc3dc;
}

.opAlertBadgeV1.warning{
    border-color:#a47b27;
    color:#f0c75e;
}

.opAlertBadgeV1.error{
    border-color:#a5454e;
    color:#ff9098;
}

.opAlertNameV1{
    color:#e6f0f7;
    font-weight:700;
    font-size:13px;
}

.opAlertDetailV1{
    margin-top:3px;
    color:#a6bac9;
    font-size:12px;
    line-height:1.4;
}

.opAlertMetaV1{
    display:flex;
    flex-wrap:wrap;
    gap:8px;
    margin-top:6px;
    color:#7895aa;
    font-size:11px;
}

.opAlertFooterV1{
    margin-top:10px;
    color:#708ca0;
    font-size:11px;
}

`;

        document.head.appendChild(
            style
        );
    }


    function severityLabel(value){

        if(value==='error'){
            return 'BŁĄD';
        }

        if(value==='warning'){
            return 'UWAGA';
        }

        return 'INFO';
    }


    function summaryText(op){

        const counts=
            op?.counts
            ||{};

        const errors=
            Number(
                counts.error
                ||0
            );

        const warnings=
            Number(
                counts.warning
                ||0
            );

        const infos=
            Number(
                counts.info
                ||0
            );

        const active=
            errors+warnings;


        if(active===0){

            return (
                '0 alertów'
                +(
                    infos
                    ?
                    ' · '
                    +infos
                    +' info'
                    :
                    ''
                )
            );
        }


        const parts=[];

        if(errors){
            parts.push(
                errors
                +' '
                +(
                    errors===1
                    ?
                    'błąd'
                    :
                    'błędy'
                )
            );
        }

        if(warnings){
            parts.push(
                warnings
                +' '
                +(
                    warnings===1
                    ?
                    'uwaga'
                    :
                    'uwagi'
                )
            );
        }

        if(infos){
            parts.push(
                infos+' info'
            );
        }

        return parts.join(
            ' · '
        );
    }


    function pillText(op){

        const counts=
            op?.counts
            ||{};

        if(
            Number(
                counts.error
                ||0
            )>0
        ){
            return 'BŁĄD';
        }

        if(
            Number(
                counts.warning
                ||0
            )>0
        ){
            return 'UWAGA';
        }

        return 'OK';
    }


    function render(
        host,
        op
    ){

        ensureStyle();


        let panel=
            document.getElementById(
                PANEL_ID
            );


        const wasOpen=
            Boolean(
                panel?.open
            );


        if(!panel){

            panel=
                document.createElement(
                    'details'
                );

            panel.id=
                PANEL_ID;


            const first=
                host.firstElementChild;


            if(first){

                first.insertAdjacentElement(
                    'afterend',
                    panel
                );

            }else{

                host.appendChild(
                    panel
                );
            }
        }


        const state=
            op?.overall
            ||'ok';


        panel.dataset.state=
            state;


        const items=
            Array.isArray(
                op?.items
            )
            ?
            op.items
            :
            [];


        const rows=
            items.map(
                item=>{

                    const severity=
                        item?.severity
                        ||'info';


                    const value=
                        item?.value;


                    const threshold=
                        item?.threshold;


                    const meta=[];


                    if(
                        value!==null
                        &&
                        value!==undefined
                        &&
                        value!==''
                    ){

                        meta.push(
                            'wartość: '
                            +esc(value)
                        );
                    }


                    if(threshold){

                        meta.push(
                            'próg: '
                            +esc(threshold)
                        );
                    }


                    return `

                    <div class="
                      opAlertItemV1
                      ${esc(severity)}
                    ">

                        <span class="
                          opAlertBadgeV1
                          ${esc(severity)}
                        ">
                            ${esc(
                                severityLabel(
                                    severity
                                )
                            )}
                        </span>

                        <div>

                            <div class="opAlertNameV1">
                                ${esc(
                                    item?.title
                                    ||item?.key
                                    ||'Alert'
                                )}
                            </div>

                            <div class="opAlertDetailV1">
                                ${esc(
                                    item?.detail
                                    ||''
                                )}
                            </div>

                            ${
                                meta.length
                                ?
                                `
                                <div class="opAlertMetaV1">
                                    ${
                                        meta.map(
                                            x=>
                                                `<span>${x}</span>`
                                        )
                                        .join('')
                                    }
                                </div>
                                `
                                :
                                ''
                            }

                        </div>

                    </div>
                    `;
                }
            )
            .join('');


        const active=
            Number(
                op?.active_count
                ||0
            );


        panel.innerHTML=`

        <summary>

            <div class="opAlertsLeftV1">

                <span class="opAlertsTitleV1">
                    Alerty operatora
                </span>

                <span class="opAlertsCountV1">
                    ${esc(
                        summaryText(op)
                    )}
                </span>

            </div>

            <span class="
              opAlertsPillV1
              ${esc(state)}
            ">
                ${esc(
                    pillText(op)
                )}
            </span>

        </summary>

        <div class="opAlertsBodyV1">

            ${
                rows
                ?
                `
                <div class="opAlertsListV1">
                    ${rows}
                </div>
                `
                :
                `
                <div class="opAlertsEmptyV1">
                    Brak alertów wymagających reakcji.
                </div>
                `
            }

            ${
                active===0
                ?
                `
                <div class="opAlertFooterV1">
                    INFO nie podnosi stanu systemu do ostrzeżenia.
                </div>
                `
                :
                ''
            }

            <div class="opAlertFooterV1">
                Brak detekcji nie jest traktowany jako awaria,
                dopóki nie mamy wiarygodnego uptime / exposure.
            </div>

        </div>
        `;


        panel.open=
            wasOpen;
    }


    function refresh(data){

        const host=
            document.getElementById(
                'system-health'
            );


        if(!host){
            return;
        }


        try{

            const op=
                data?.operator_alerts;


            if(
                !op
                ||
                typeof op!=='object'
            ){

                throw new Error(
                    'brak operator_alerts'
                );
            }


            render(
                host,
                op
            );


        }catch(error){

            ensureStyle();


            let panel=
                document.getElementById(
                    PANEL_ID
                );


            if(!panel){

                panel=
                    document.createElement(
                        'details'
                    );

                panel.id=
                    PANEL_ID;

                host.appendChild(
                    panel
                );
            }


            panel.dataset.state=
                'error';


            panel.innerHTML=`

            <summary>

                <div class="opAlertsLeftV1">

                    <span class="opAlertsTitleV1">
                        Alerty operatora
                    </span>

                    <span class="opAlertsCountV1">
                        błąd odczytu
                    </span>

                </div>

                <span class="
                  opAlertsPillV1
                  error
                ">
                    BŁĄD
                </span>

            </summary>

            <div class="opAlertsBodyV1">

                <div class="
                  opAlertItemV1
                  error
                ">

                    <span class="
                      opAlertBadgeV1
                      error
                    ">
                        BŁĄD
                    </span>

                    <div>

                        <div class="opAlertNameV1">
                            Operator Alerts
                        </div>

                        <div class="opAlertDetailV1">
                            ${esc(
                                error?.message
                                ||error
                            )}
                        </div>

                    </div>

                </div>

            </div>
            `;
        }
    }


    function init(){

        /*
         * System Health jest już pobierany przez app.js.
         * Operator Alerts tylko konsumuje ten sam payload.
         */
        window.addEventListener(
            'credo:system-health',
            (event)=>{
                refresh(
                    event.detail
                );
            }
        );


        /*
         * Gdy app.js zdążył pobrać dane przed
         * inicjalizacją features.js.
         */
        if(
            window
            .__credoSystemHealth
        ){

            refresh(
                window
                .__credoSystemHealth
            );
        }
    }


    if(
        document.readyState
        ==='loading'
    ){

        document.addEventListener(
            'DOMContentLoaded',
            init,
            {
                once:true
            }
        );

    }else{

        init();
    }

})();
