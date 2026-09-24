/* =====================================================================
   DESIGN ARCADE (septembre 2026)
   Refonte visuelle demandee par Corentin : base « Arcade », avec les
   meilleurs morceaux de « Duo Jour » et « Mondes ». Aucun cours, aucune
   regle de jeu, aucune mascotte n est modifie : tout passe par des
   enveloppes autour des fonctions existantes, comme les couches
   precedentes. Aucun emoji litteral ici (voir CLAUDE.md) : les icones
   sont les SVG de ico(), les images sont dans design/assets.
   ===================================================================== */
(function arcade(){
  const ASSET=k=>"design/assets/"+k+".png";
  const ALT={coffre:"Coffre",ouvert:"Coffre ouvert rempli de gemmes",matin:"Coffre du matin",soir:"Coffre du soir",
    legendaire:"Coffre légendaire",quete:"Coffre de quête",potion15:"Potion x1,5",potion2:"Potion x2",potion3:"Potion x3",gel:"Gel de série"};
  function aimg(k,size,cls){
    return '<img src="'+ASSET(k)+'" alt="'+(ALT[k]||"")+'" class="arc-img '+(cls||"")+'" width="'+size+'" height="'+size+'" style="width:'+size+'px;height:'+size+'px" draggable="false">';
  }
  window.arcImg=aimg;
  const ARC=()=>{ if(!S.arcade||typeof S.arcade!=="object")S.arcade={rec:{}}; if(!S.arcade.rec)S.arcade.rec={}; return S.arcade; };
  const fmtDay=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
  const court=(t,n)=>{ t=String(t||"").replace(/\s+/g," ").trim(); if(t.length<=n)return t;
    const c=t.slice(0,n); const p=Math.max(c.lastIndexOf(". "),c.lastIndexOf(" : ")); return (p>n*.5?c.slice(0,p+1):c.replace(/\s+\S*$/,""))+" ..."; };
  const phrase1=t=>{ t=String(t||"").replace(/\s+/g," ").trim(); const m=/^(.{20,180}?[.!?])(\s|$)/.exec(t); return m?m[1]:court(t,160); };
  const cName=()=>{ const c=COURSES.find(x=>x.id===S.active); return c?c.short:""; };

  /* ---------------- 0. ICONES MAISON : flamme, XP, chrono, lecon ----------------
     Les degrades vivent dans un seul <defs> toujours affiche : un degrade
     range dans un ecran masque ne se dessine plus dans Chrome ni Safari.   */
  const DEFS=`<svg id="arc-defs" width="0" height="0" style="position:absolute;width:0;height:0" aria-hidden="true" focusable="false"><defs>
    <linearGradient id="arcFl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FF3D1F"/><stop offset=".5" stop-color="#FF8A00"/><stop offset="1" stop-color="#FFC21A"/></linearGradient>
    <linearGradient id="arcFc" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFD84A"/><stop offset="1" stop-color="#FFF7D1"/></linearGradient>
    <linearGradient id="arcXp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE473"/><stop offset="1" stop-color="#F29E00"/></linearGradient>
    <linearGradient id="arcCh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FE0FF"/><stop offset="1" stop-color="#1C8FF6"/></linearGradient>
    <linearGradient id="arcGw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D4D8FF"/></linearGradient>
    <linearGradient id="arcGem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9BE7FF"/><stop offset="1" stop-color="#1C8FF6"/></linearGradient>
    <linearGradient id="arcHrt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF8A95"/><stop offset="1" stop-color="#E5334B"/></linearGradient></defs></svg>`;
  const FL="M13.2 1.6C13.6 5 17 7.1 18.6 10.4c.8 1.6 1.2 3.1 1.2 4.5A7.8 7.8 0 0 1 12 22.6a7.8 7.8 0 0 1-7.8-7.7c0-2.9 1.4-5.2 3.4-6.9-.1 1.9.6 3.5 1.9 4.4C9 8.2 10.6 4.4 13.2 1.6z";
  const FC="M12.3 11.2c.3 2.1 3.3 3.2 3.3 6.1a3.6 3.6 0 0 1-7.2 0c0-1.7.8-2.9 2-3.8.1 1 .5 1.7 1.1 2.1-.2-1.6.1-3.1.8-4.4z";
  const svgw=(s,inner,lab)=>`<svg class="arc-ico" viewBox="0 0 24 24" width="${s||20}" height="${s||20}" ${lab?`role="img" aria-label="${lab}"`:'aria-hidden="true"'}>${inner}</svg>`;
  const MINE={
    flame:(s,c)=>(!c||c==="var(--orange)"||c==="currentColor")
      ? svgw(s,`<path d="${FL}" fill="url(#arcFl)"/><path d="${FC}" fill="url(#arcFc)"/><path d="M13.2 3.6c.6 2.2 2.5 3.8 3.7 5.7" stroke="rgba(255,255,255,.45)" stroke-width="1.1" fill="none" stroke-linecap="round"/>`)
      : svgw(s,`<path d="${FL}" fill="${c}"/>`),
    gem:(s,c)=>(!c||c==="currentColor"||c==="var(--blue)")
      ? svgw(s,`<path d="M6.6 3.5h10.8L21.5 9 12 21 2.5 9z" fill="url(#arcGem)"/><path d="M2.8 9h18.4M8.4 9 12 20.4 15.6 9M6.6 3.5 8.4 9 12 3.5 15.6 9l1.8-5.5" stroke="#fff" stroke-opacity=".55" stroke-width="1" fill="none" stroke-linejoin="round"/>`)
      : svgw(s,`<path d="M6.6 3.5h10.8L21.5 9 12 21 2.5 9z" fill="${c}"/>`),
    heart:(s,c)=>(!c||c==="currentColor"||c==="var(--red)")
      ? svgw(s,`<path d="M12 21s-8.6-5.2-8.6-11.3A4.9 4.9 0 0 1 12 6.6a4.9 4.9 0 0 1 8.6 3.1C20.6 15.8 12 21 12 21z" fill="url(#arcHrt)"/><path d="M6.4 7.6a2.6 2.6 0 0 1 2.6-1" stroke="#fff" stroke-opacity=".7" stroke-width="1.4" stroke-linecap="round" fill="none"/>`)
      : svgw(s,`<path d="M12 21s-8.6-5.2-8.6-11.3A4.9 4.9 0 0 1 12 6.6a4.9 4.9 0 0 1 8.6 3.1C20.6 15.8 12 21 12 21z" fill="${c}"/>`),
    xp:s=>svgw(s,`<path d="M12 1.8 21 7v10l-9 5.2L3 17V7z" fill="url(#arcXp)" stroke="#C77800" stroke-width="1.3" stroke-linejoin="round"/><path d="M5 8 12 4v3.2L7.6 9.8z" fill="rgba(255,255,255,.4)"/><path d="M13.3 5.4 8 13.3h3.4l-1.1 5.3 5.5-8h-3.5z" fill="#fff"/>`,"XP"),
    chrono:s=>svgw(s,`<rect x="9.8" y="1.4" width="4.4" height="2.6" rx="1.1" fill="#1C8FF6"/><rect x="11.2" y="3.6" width="1.6" height="2.2" fill="#1C8FF6"/><path d="M18.4 5.4l1.7 1.7" stroke="#1C8FF6" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="13.6" r="8.4" fill="url(#arcCh)"/><circle cx="12" cy="13.6" r="6.3" fill="#fff"/><path d="M12 7.9v1.3M17.7 13.6h-1.3M12 19.3V18M6.3 13.6h1.3" stroke="#9DB8D6" stroke-width="1.2" stroke-linecap="round"/><path d="M12 13.6 12 9.6" stroke="#FF4B4B" stroke-width="1.8" stroke-linecap="round"/><path d="M12 13.6l2.8 1.7" stroke="#10102A" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="13.6" r="1.2" fill="#10102A"/>`,"Chronométré")
  };
  function arcIcons(){
    if(typeof ICONS==="object"&&ICONS&&!ICONS.lecon)ICONS.lecon='<path d="M11.2 6.3C9.5 4.9 7 4.2 4.3 4.2c-.7 0-1.3.6-1.3 1.3v11.9c0 .7.6 1.3 1.3 1.3 2.6 0 4.9.7 6.9 2.1zM12.8 6.3c1.7-1.4 4.2-2.1 6.9-2.1.7 0 1.3.6 1.3 1.3v11.9c0 .7-.6 1.3-1.3 1.3-2.6 0-4.9.7-6.9 2.1z"/>';
    if(!document.getElementById("arc-defs")){ document.body.insertAdjacentHTML("afterbegin",DEFS);
      document.querySelector("#arc-defs defs").insertAdjacentHTML("beforeend",trophyDefs()+`<linearGradient id="arcTile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".5" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>`); }
    const __ico=ico;
    window.ico=function(n,s,c){ return MINE[n]?MINE[n](s,c):__ico.apply(null,arguments); };
  }
  const xpTag=n=>ico("xp",22)+"+"+n;

  /* ---------------- 0 bis. ICONES VERRE LIQUIDE ----------------
     Un seul jeu d icones pour toute l interface : un glyphe clair en
     degrade (blanc vers lavande), des details sombres, pose sur une tuile
     de verre (flou, reflet en haut, bord lumineux). Dessins maison.      */
  const D='fill="#1C1C48" fill-opacity=".72"', DS='stroke="#1C1C48" stroke-opacity=".72" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  const W='fill="url(#arcGw)"', WS='stroke="url(#arcGw)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  const GL={
    jouer:`<path d="M2.6 11.1 12 3l9.4 8.1" ${WS}/><path d="M5 10.4 12 4.4l7 6V19.6a1.9 1.9 0 0 1-1.9 1.9H14v-5a2 2 0 0 0-4 0v5H6.9A1.9 1.9 0 0 1 5 19.6z" ${W}/>`,
    reviser:`<rect x="8" y="2.5" width="12" height="15" rx="2.6" ${W} opacity=".5"/><rect x="4" y="6.5" width="12" height="15" rx="2.6" ${W}/><path d="M13 14a3 3 0 1 1-1.1-2.3" ${DS}/><path d="M12.3 9.6v2.3h-2.3" ${DS}/>`,
    ligue:`<path d="M7.3 5.4H4.6a2.6 2.6 0 0 0 3 3.9M16.7 5.4h2.7a2.6 2.6 0 0 1-3 3.9" ${WS}/><path d="M7 3h10v5.6a5 5 0 0 1-10 0z" ${W}/><path d="M10.9 13.4h2.2v3.4h-2.2z" ${W}/><path d="M7.6 20.8a2.3 2.3 0 0 1 2.3-2.3h4.2a2.3 2.3 0 0 1 2.3 2.3v.7H7.6z" ${W}/><path d="m12 5.3.8 1.6 1.8.3-1.3 1.2.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.2 1.8-.3z" ${D}/>`,
    boutique:`<path d="M6.6 3.5h10.8L21.5 9 12 21 2.5 9z" ${W}/><path d="M2.8 9h18.4M8.4 9 12 20.4 15.6 9M6.6 3.5 8.4 9 12 3.5 15.6 9l1.8-5.5" ${DS} stroke-width="1.2"/>`,
    plus:`<rect x="3" y="3" width="7.8" height="7.8" rx="2.4" ${W}/><rect x="13.2" y="3" width="7.8" height="7.8" rx="3.9" ${W} opacity=".55"/><rect x="3" y="13.2" width="7.8" height="7.8" rx="2.4" ${W} opacity=".55"/><rect x="13.2" y="13.2" width="7.8" height="7.8" rx="2.4" ${W}/>`,
    eclair:`<path d="M13.6 1.8 4.6 13.6h6.2L9.6 22.2l9.8-12.3h-6.3z" ${W}/><path d="M13.6 1.8 11 9.9" stroke="#fff" stroke-opacity=".7" stroke-width="1" fill="none"/>`,
    rappels:`<circle cx="12" cy="12" r="9.6" ${W}/><path d="M16.3 12a4.3 4.3 0 1 1-1.3-3.1" ${DS} stroke-width="2"/><path d="M15.6 5.9v3.3h-3.3" ${DS} stroke-width="2"/><circle cx="12" cy="12" r="1.3" ${D}/>`,
    boss:`<path d="M5.4 6 2.6 1.6l5 2.5M18.6 6l2.8-4.4-5 2.5" ${W}/><path d="M12 3.2 19.6 6v5.8c0 4.8-3.3 8.5-7.6 9.9-4.3-1.4-7.6-5.1-7.6-9.9V6z" ${W}/><path d="m7.8 10.6 3 1.3M16.2 10.6l-3 1.3M9.2 16.3c1.8-1.1 3.8-1.1 5.6 0" ${DS}/>`,
    examen:`<path d="M6.4 2.4h8.3L19.6 7.3V13a6 6 0 0 0-7.4 8.6H6.4a1.9 1.9 0 0 1-1.9-1.9V4.3a1.9 1.9 0 0 1 1.9-1.9z" ${W}/><path d="M8 8h5.2M8 11.5h6" ${DS}/><circle cx="17.3" cy="17.6" r="4.6" ${W}/><path d="M17.3 15.3v2.4l1.6 1" ${DS} stroke-width="1.5"/>`,
    vf:`<circle cx="15.4" cy="12" r="6.8" ${W} opacity=".55"/><circle cx="8.6" cy="12" r="6.8" ${W}/><path d="m5.7 12.1 2 2 3.8-4.2" ${DS} stroke-width="2"/><path d="m17.4 10-1.7 1.7m0-1.7 1.7 1.7" stroke="#1C1C48" stroke-opacity=".5" stroke-width="1.6" stroke-linecap="round"/>`,
    frise:`<rect x="2.6" y="14" width="5.4" height="7.6" rx="1.8" ${W} opacity=".55"/><rect x="9.3" y="10.2" width="5.4" height="11.4" rx="1.8" ${W} opacity=".78"/><rect x="16" y="6.2" width="5.4" height="15.4" rx="1.8" ${W}/><path d="M5.3 17.8h0M12 15.9h0M18.7 13.9h0" ${DS} stroke-width="2.4"/><path d="M3.4 9.6C6 5.4 10 3.2 14.6 3.2" ${WS} stroke-width="1.9"/><path d="m12.8 1.4 2.3 1.8-2 2.1" ${WS} stroke-width="1.9"/>`,
    duel:`<path d="m4 3.6 11.2 11.2M20 3.6 8.8 14.8" ${WS} stroke-width="2.6"/><path d="m12.6 17.4 4.6-4.6M11.4 17.4l-4.6-4.6" ${WS}/><circle cx="18.6" cy="18.6" r="2.3" ${W}/><circle cx="5.4" cy="18.6" r="2.3" ${W}/>`,
    defis:`<path d="M5.5 2.5v19" ${WS}/><path d="M6.2 3.6h12.3l-2.6 4.3 2.6 4.3H6.2z" ${W}/><path d="m10.6 6.2.6 1.2 1.3.2-1 .9.3 1.3-1.2-.6-1.2.6.3-1.3-1-.9 1.3-.2z" ${D}/>`,
    profil:`<circle cx="12" cy="7.8" r="4.4" ${W}/><path d="M3.6 21a8.4 8.4 0 0 1 16.8 0z" ${W}/>`,
    missions:`<rect x="4" y="3.4" width="16" height="18.2" rx="3" ${W}/><path d="M9 2.4h6v2.8H9z" ${W}/><path d="m7.6 10.2 1.4 1.4 2.4-2.6M13.6 10.3h3M7.6 16.2 9 17.6l2.4-2.6M13.6 16.3h3" ${DS}/>`,
    habitudes:`<rect x="3" y="4.6" width="18" height="16.6" rx="3.2" ${W}/><path d="M7.6 2.6v4M16.4 2.6v4" ${WS}/><path d="M3 9.5h18" ${DS} stroke-width="1.2"/><path d="m8.4 15 2.4 2.4 4.8-5" ${DS} stroke-width="2"/>`,
    erreurs:`<circle cx="12" cy="12" r="9.2" ${W}/><path d="M12 6.8v6.4" ${DS} stroke-width="2.4"/><circle cx="12" cy="16.9" r="1.4" ${D}/>`,
    cours:`<rect x="3" y="4" width="5" height="17" rx="1.4" ${W}/><rect x="9.4" y="2.6" width="5" height="18.4" rx="1.4" ${W} opacity=".6"/><path d="m15.4 5.6 4.3-1.1 3.3 15.2-4.4 1z" ${W}/><path d="M4.5 8h2M4.5 17h2M10.9 7h2" ${DS} stroke-width="1.4"/>`,
    lecon:`<path d="M11.2 6.3C9.5 4.9 7 4.2 4.3 4.2c-.7 0-1.3.6-1.3 1.3v11.9c0 .7.6 1.3 1.3 1.3 2.6 0 4.9.7 6.9 2.1z" ${W}/><path d="M12.8 6.3c1.7-1.4 4.2-2.1 6.9-2.1.7 0 1.3.6 1.3 1.3v11.9c0 .7-.6 1.3-1.3 1.3-2.6 0-4.9.7-6.9 2.1z" ${W} opacity=".7"/>`,
    modules:`<rect x="3" y="3.5" width="18" height="5" rx="2" ${W}/><rect x="3" y="10" width="18" height="5" rx="2" ${W} opacity=".7"/><rect x="3" y="16.5" width="18" height="5" rx="2" ${W} opacity=".45"/>`,
    chemin:`<path d="M6 20c0-4 12-4 12-8S6 8 6 4" ${WS} stroke-dasharray="1 3.2" opacity=".8"/><circle cx="6" cy="20" r="2.6" ${W}/><circle cx="18" cy="12" r="2.6" ${W}/><path d="m6 1.3.9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" ${W}/>`
  };
  /* glyphe seul (barre du bas) ou pose sur sa tuile de verre coloree */
  const glyph=(k,s,lab)=>svgw(s,GL[k]||GL.plus,lab);
  const tileG=(k,s,col)=>`<span class="arc-glass" style="--gc:${col||"rgba(255,255,255,.18)"};width:${s}px;height:${s}px">${glyph(k,Math.round(s*.6))}</span>`;
  const NAVG={path:"jouer",review:"reviser",league:"ligue",shop:"boutique",quests:"defis",profile:"profil",tasks:"missions",
    habits:"habitudes",exam:"examen",errors:"erreurs",courses:"cours"};
  const NAVC={quests:"#E8A21A",profile:"#D9716B",tasks:"#3F6FD8",habits:"#1E9E6A",exam:"#E5484D",errors:"#9B51E0",courses:"#1899D6",
    path:"#58CC02",review:"#1899D6",league:"#E8A21A",shop:"#1CB0F6"};
  window.arcGlyph=glyph; window.arcTile=tileG;

  /* ---------------- 1. ONGLETS : Jouer, Réviser, Défis, Ligue, Boutique ---------------- */
  const NOMS={path:"Jouer",review:"Réviser",quests:"Défis",league:"Ligue",shop:"Boutique",profile:"Profil"};
  const ICS={quests:"sun"};
  const ORDRE=["path","review","quests","league","shop","profile","tasks","habits","exam","errors","courses"];
  function arcTabs(){
    if(typeof TABS==="undefined")return;
    TABS.forEach(t=>{ if(NOMS[t.id])t.nm=NOMS[t.id]; if(ICS[t.id])t.ic=ICS[t.id]; });
    TABS.sort((a,b)=>{ const i=ORDRE.indexOf(a.id), j=ORDRE.indexOf(b.id); return (i<0?99:i)-(j<0?99:j); });
    if(typeof renderNav==="function")renderNav();
  }

  /* ---------------- 2. BARRE DU HAUT ---------------- */
  function arcTop(){
    const top=document.getElementById("mtop"); if(!top||top.dataset.arc)return;
    top.dataset.arc="1";
    top.innerHTML=`<button class="arc-cpill" id="mt-course" type="button" onclick="arcCourses()" aria-label="Changer de cours"></button>
      <button class="stat s-fire" type="button" onclick="setTab('quests')" aria-label="Série">${ico("flame",22)}<span id="mt-streak">0</span></button>
      <button class="stat s-gem" type="button" onclick="setTab('shop')" aria-label="Gemmes, ouvrir la boutique">${ico("gem",22)}<span id="mt-gems">0</span></button>
      <div class="stat s-heart" aria-label="Coeurs">${ico("heart",22)}<span id="mt-hearts">5</span></div>
      <span class="stat s-xp"><span id="mt-xp">0</span></span>
      <button class="arc-avbtn" id="mt-av" type="button" onclick="setTab('profile')" aria-label="Profil"></button>`;
  }
  function arcTopFill(){
    const c=COURSES.find(x=>x.id===S.active); const p=document.getElementById("mt-course");
    if(p&&c)p.innerHTML=(typeof badgeSVG==="function"?badgeSVG(c.id,26):"")+`<span class="nm">${esc(c.short)}</span>${ico("arrowdown",14,"var(--dim)")}`;
    const av=document.getElementById("mt-av");
    if(av&&typeof avatarSVG==="function")av.innerHTML=avatarSVG((S.avatar&&S.avatar.cfg)||avatarCfg(S.name||"Corentin"),40,false);
  }

  /* ---------------- 3. SELECTEUR DE COURS ---------------- */
  function coursePct(cid){ let n=0,d=0; courseUnits(cid).forEach(u=>{ n+=lessonsIn(u.id); d+=unitDone(u.id); }); return n?Math.round(100*d/n):0; }
  window.arcCourses=function(){
    try{ applyCats(); }catch(e){}
    let h=`<h2 class="arc-h" style="text-align:left;margin-top:0">Mes cours</h2>`;
    catList().forEach(k=>{
      const l=catCourses(k.id).filter(c=>!S.hidden.includes(c.id)); if(!l.length)return;
      h+=`<div class="arc-cat">${esc(k.nm)}</div>`;
      l.forEach(c=>{ const p=coursePct(c.id);
        h+=`<button class="arc-crow ${c.id===S.active?"on":""}" type="button" onclick="closeModal();setCourse('${c.id}')">
          ${badgeSVG(c.id,40)}<span class="i"><b>${esc(c.name)}</b><span class="bar"><i style="width:${p}%;background:var(${c.col})"></i></span></span>
          <span class="p">${p} %</span></button>`; });
    });
    h+=`<div style="height:6px"></div><button class="btn ghost" onclick="closeModal();setTab('courses')">${ico("gear",16)} Gérer mes cours</button>`;
    openModal(h);
  };

  /* ---------------- 4. ACCUEIL ---------------- */
  function weekHTML(){
    const d=new Date(), dow=(d.getDay()+6)%7, L7=["L","M","M","J","V","S","D"]; let h="";
    for(let i=0;i<7;i++){ const x=new Date(d); x.setDate(d.getDate()-(dow-i)); const k=fmtDay(x);
      const on=((S.hist||{})[k]||0)>0 || (i===dow&&S.lastDay===today());
      const gel=!on&&gelDays().includes(k);
      h+=`<div class="d ${on?"on":""} ${gel?"gel":""} ${i===dow?"now":""}"><span>${L7[i]}</span><span class="o" ${gel?'title="Jour sauvé par un gel de série"':""}>${gel?aimg("gel",24):ico("flame",on?20:18,on?undefined:"var(--line)")}</span></div>`; }
    return h;
  }
  function chestRow(){
    const h=new Date().getHours(), c=dayChests();
    let img="matin",t="",s="",cta="JOUER",act="arcResume()";
    if(h<12&&!c.matin){ t="Coffre du matin prêt"; s="Termine une leçon avant midi pour l'ouvrir"; }
    else if(h>=18&&!c.soir){ img="soir"; t="Coffre du soir prêt"; s="Termine une leçon ce soir pour l'ouvrir"; }
    else if(h<18){ img="soir"; t="Coffre du soir"; s=c.matin?"Coffre du matin ouvert. Le suivant s'ouvre à 18 h":"S'ouvre à 18 h"; cta="VOIR"; act="setTab('shop')"; }
    else { img="ouvert"; t="Coffre du jour ouvert"; s="Nouveau coffre demain matin"; cta="VOIR"; act="setTab('shop')"; }
    return `<div class="arc-card arc-chestrow" role="button" tabindex="0" onclick="${act}">${aimg(img,56)}
      <div class="t"><b>${t}</b><span>${s}</span></div><span class="cta">${cta}</span></div>`;
  }
  function resumeCard(){
    const n=nextLessonExists(), pct=Math.min(1,(S.daily.xp||0)/Math.max(1,S.goal)), C=97.4;
    const ring=`<div class="arc-ring"><svg width="92" height="92" viewBox="0 0 36 36" aria-hidden="true">
      <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="4"/>
      <circle cx="18" cy="18" r="15.5" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-dasharray="${(pct*C).toFixed(1)} ${C}" transform="rotate(-90 18 18)"/></svg>
      <span>${S.daily.xp||0}<br>/ ${S.goal} XP</span></div>`;
    if(!n)return `<div class="arc-resume"><div style="flex:1"><div class="k">Cours terminé</div><div class="t">Vise les couronnes légendaires</div>
      <button class="go" type="button" onclick="setTab('review')">Réviser</button></div>${ring}</div>`;
    const u=unitOf(n.u);
    return `<div class="arc-resume"><div style="flex:1;min-width:0"><div class="k">Reprendre</div>
      <div class="t">${esc(u.t)} · leçon ${n.l+1}</div>
      <button class="go" type="button" onclick="arcResume()">Continuer</button></div>${ring}</div>`;
  }
  window.arcResume=function(){ const n=nextLessonExists(); if(n)arcStart(n.u,n.l); else setTab("review"); };
  function play(bg,sh,icon,t,s,tag,act){
    return `<button class="arc-play" type="button" style="background:${bg};--sh:${sh}" onclick="${act}">
      ${tileG(icon,56)}<span class="pt"><b>${t}</b><span>${s}</span></span><span class="pg${/<img/.test(tag)?" img":""}">${tag}</span></button>`;
  }
  function homeHTML(){
    const cid=S.active, due=dueItems(cid,999).length, calib=typeof needsCalib==="function"&&needsCalib(cid);
    return `<div class="arc-card arc-streak"><div class="top">${ico("flame",46,"var(--orange)")}
        <div><div class="n arc-h">${S.streak} jour${S.streak>1?"s":""}</div>
        <div class="s">${S.lastDay===today()?"Série tenue aujourd'hui. Bravo.":S.streak?"Fais une leçon pour tenir ta série":"Fais une leçon pour lancer ta série"}${S.streak&&gelDays().some(x=>dayDiff(x,today())<=S.streak)?`<br><span class="gl">${aimg("gel",16)} Un gel a sauvé un jour de ta série</span>`:""}</div></div></div>
        <div class="arc-week">${weekHTML()}</div></div>
      ${calib?"":resumeCard()}
      ${chestRow()}
      <div class="arc-sec"><span>Au programme</span></div>
      ${play("#9B51E0","#7A3BB5","eclair","Éclair 60 s","Paires express, combo à battre",xpTag(20),"arcGame('eclair')")}
      ${play("#1899D6","#10729F","rappels","Rappels",due?due+" notion"+(due>1?"s":"")+" à revoir avant oubli":"Rien à revoir, tout est frais",xpTag(12),"startPractice('review')")}
      ${play("#C7478F","#93306A","boss","Boss du module","Bats le Diable pour un coffre légendaire",aimg("legendaire",38),"arcGame('boss')")}
      ${play("#E5484D","#B3363A","examen","Examen blanc","Facile · Moyen · Difficile",ico("chrono",30),"setTab('exam')")}`;
  }
  function pathView(){ return (S.settings&&S.settings.pathView)==="snake"?"snake":"cards"; }
  window.arcView=function(v){ S.settings.pathView=v; save(); sfx("click"); renderPath(); };
  function pathHead(v){
    return `<div class="arc-sec" id="arc-parcours"><span>Parcours · ${esc(cName())}</span>
      <div class="arc-seg" role="group" aria-label="Affichage du parcours">
        <button type="button" class="${v==="cards"?"on":""}" aria-pressed="${v==="cards"}" onclick="arcView('cards')">${glyph("modules",16)} Modules</button>
        <button type="button" class="${v==="snake"?"on":""}" aria-pressed="${v==="snake"}" onclick="arcView('snake')">${glyph("chemin",16)} Chemin</button></div></div>`;
  }
  function cardsHTML(){
    const cid=S.active, c=S.courses[cid]; let firstOpen=true, h="";
    courseUnits(cid).forEach(u=>{
      const unlocked=unitUnlocked(u.id), nL=lessonsIn(u.id), done=unitDone(u.id);
      let dots="", cur=false, curLi=-1;
      for(let li=0;li<nL;li++){
        const st=c.lessons[lkey(u.id,li)];
        let cls="arc-dot", g=ico("lock",16), act="lockMsg()", lab="Leçon "+(li+1)+" verrouillée";
        if(unlocked&&st){ cls+=st>=3?" gold":" done"; g=ico(st>=3?"crown":"check",18); act=`startLesson(${u.id},${li})`; lab="Refaire la leçon "+(li+1); }
        else if(unlocked&&firstOpen){ cls+=" now"; g=ico("star",18); act=`arcStart(${u.id},${li})`; firstOpen=false; cur=true; curLi=li; lab="Commencer la leçon "+(li+1); }
        dots+=`<button class="${cls}" type="button" onclick="${act}" aria-label="${lab}">${g}</button>`;
        if(li>0&&(li%3===2||(nL<3&&li===nL-1))){
          const ck=`chest-${u.id}-${li}`, got=c.lessons[ck], ready=done>li&&!got;
          dots+=`<button class="arc-dot chest ${got||ready?"":"lock"}" type="button" onclick="${ready?`openChest('${ck}')`:"chestMsg("+(got?1:0)+")"}"
            aria-label="${got?"Coffre ouvert":ready?"Ouvrir le coffre":"Coffre verrouillé"}">${aimg(got?"ouvert":"coffre",40)}</button>`;
        }
      }
      const can=unitComplete(u.id), crown=c.crowns[u.id];
      dots+=`<button class="arc-dot legend ${can?"on":""}" type="button" onclick="${can?`startLesson(${u.id},-1)`:"lockMsg()"}"
        aria-label="${crown?"Épreuve légendaire validée":"Épreuve légendaire"}">${ico(crown?"trophy":can?"crown":"lock",17)}</button>`;
      h+=`<div class="arc-card arc-mod ${cur?"cur":""} ${unlocked?"":"lock"}">
        <div class="h"><div><div class="k" style="color:var(${u.col})">${esc(u.n)}</div><div class="t">${esc(u.t)}</div></div><span class="c">${done} / ${nL}</span></div>
        <div class="arc-dots">${dots}</div>
        <div class="f"><button class="arc-mini" type="button" onclick="openGuide(${u.id})">${ico("lecon",16)} Leçon</button>
        ${cur?`<button class="arc-go" type="button" onclick="arcStart(${u.id},${curLi})">Commencer +10 XP</button>`:""}</div></div>`;
    });
    return h;
  }
  function snakeDress(body){
    body.querySelectorAll(".node.chest").forEach(n=>{
      const g=n.querySelector(".glyph"); if(!g||g.dataset.arc)return; g.dataset.arc="1";
      const lab=(n.parentElement&&n.parentElement.querySelector(".nodelabel")||{}).textContent||"";
      g.innerHTML=aimg(/ouvert/i.test(lab)?"ouvert":"coffre",74);
    });
    body.querySelectorAll(".startbub").forEach(b=>{ b.textContent="Commencer +10 XP"; });
    body.querySelectorAll(".unitbar button").forEach(b=>{ b.innerHTML=ico("lecon",15)+" Leçon"; });
    /* une lecon jamais faite commence par son cours, puis le quiz */
    body.querySelectorAll('.node[onclick^="startLesson("]').forEach(n=>{
      n.setAttribute("onclick",n.getAttribute("onclick").replace(/^startLesson\(/,"arcStart(")); });
  }

  /* ---------------- 5. LECON : corrections et pave numerique ---------------- */
  function memoOf(ex){
    const u=unitOf(ex.u); if(!u||!u.guide)return "";
    const m=/<div class="gmnemo">([\s\S]*?)<\/div>/.exec(u.guide); if(!m)return "";
    const t=m[1].replace(/<\/?(p|br|li|ul|ol|div|h\d)\b[^>]*>/g," ").replace(/<[^>]+>/g,"").replace(/\s+/g," ").trim();
    const q=/^«\s*([^»]{6,170})\s*»/.exec(t);
    return q?"« "+q[1].trim()+" »":phrase1(t);
  }
  function arcVerdict(){
    if(!L||L.mode==="exam"||!A||!A.ex)return;
    const cb=document.getElementById("checkbar"); if(!cb)return;
    const ok=cb.classList.contains("good"), bad=cb.classList.contains("bad"); if(!ok&&!bad)return;
    const v=cb.querySelector(".verdict"); if(!v||v.dataset.arc)return; v.dataset.arc="1"; v.classList.add("arcv");
    const ex=A.ex, vt=v.querySelector(".vt"), vw=v.querySelector(".vw");
    if(ok&&vt&&L.combo>=2)vt.insertAdjacentHTML("beforeend",`<span class="arc-combo">${ico("bolt",14)} Combo x${L.combo}</span>`);
    if(bad&&vw){
      const all=vw.textContent, w=String(ex.w||""), sol=(w&&all.endsWith(w))?all.slice(0,all.length-w.length).trim():"";
      if(sol)vw.innerHTML=`<span class="arc-sol">${esc(sol.replace(/^Réponse\s*:/,"Bonne réponse :"))}</span><br>${esc(w)}`;
    }
    const memo=memoOf(ex);
    if(memo)v.insertAdjacentHTML("afterend",`<div class="arc-memo">${ico("brain",20,"var(--gold)")}<span><b>Mémo :</b> ${esc(memo)}</span></div>`);
    const n=document.getElementById("numin"); if(n&&ex.t==="num")n.classList.add(ok?"arc-good":"arc-bad");
  }
  function arcPad(){
    const i=document.getElementById("numin"); if(!i||document.getElementById("arc-pad"))return;
    const tactile=window.matchMedia&&window.matchMedia("(pointer:coarse)").matches;
    if(tactile)i.setAttribute("inputmode","none");
    const k=["7","8","9","4","5","6","1","2","3",",","0","del"];
    i.parentElement.insertAdjacentHTML("beforeend",`<div class="arc-pad" id="arc-pad">${k.map(x=>
      `<button type="button" class="${x==="del"?"fn":""}" onclick="arcKey('${x}')" aria-label="${x==="del"?"Effacer":x}">${x==="del"?ico("cross",20):x}</button>`).join("")}</div>`);
  }
  window.arcKey=function(x){
    if(A&&A.done)return; const i=document.getElementById("numin"); if(!i)return;
    i.value = x==="del" ? i.value.slice(0,-1) : (i.value+x);
    i.dispatchEvent(new Event("input",{bubbles:true})); sfx("click");
  };

  /* ---------------- 6. FIN DE LECON ---------------- */
  function arcDone(snap,dxp,streakUp){
    const card=document.getElementById("mcard"); if(!card||!document.getElementById("modal").classList.contains("on"))return;
    const hero=card.querySelector("img.hero"), h2=card.querySelector("h2"), btns=[...card.querySelectorAll("button.btn")];
    const ach=[...card.querySelectorAll("p")].filter(p=>/Succès/.test(p.textContent));
    const sec=Math.max(1,Math.round((Date.now()-(snap.t0||Date.now()))/1000));
    const prec=Math.round(100*snap.ok/Math.max(1,snap.ok+snap.wrong));
    const box=(c,l,i,v)=>`<div class="b" style="--c:${c}"><div class="l">${l}</div><div class="v">${ico(i,20)}${v}</div></div>`;
    const wrap=document.createElement("div");
    wrap.innerHTML=`<div class="arc-done"><div class="hs"></div>
      <h2 class="ttl">${h2?h2.innerHTML:"Leçon terminée !"}</h2>
      <div class="sub">${snap.wrong===0?"Zéro faute. Du travail propre.":prec>=80?"Solide. Encore une et c'est acquis.":"Chaque erreur revient bientôt en rappel. C'est comme ça qu'on retient."}</div>
      ${streakUp?`<div class="arc-streakup">${ico("flame",24)} ${S.streak} jour${S.streak>1?"s":""} de série</div>`:""}
      ${snap.max>=5?`<div class="arc-combobig">${aimg("ouvert",70)}<div><div class="x">x${snap.max}</div><div style="font-size:14px;color:var(--dim)">Meilleur combo de la leçon</div></div></div>`:""}
      <div class="arc-stats">${box("var(--gold)","XP gagnés","bolt","+"+dxp)}${box("var(--green)","Précision","target",prec+" %")}${box("var(--blue)","Temps","clock",Math.floor(sec/60)+":"+String(sec%60).padStart(2,"0"))}</div></div>`;
    if(hero){
      /* une lecon reussie merite une mascotte heureuse : on choisit parmi ses poses existantes */
      const pose=snap.wrong===0?"fier":prec>=60?"content":"";
      if(pose&&typeof poseKey==="function"){ const k=poseKey(pose); if(IMG[k])hero.setAttribute("src",IMG[k]); }
      wrap.querySelector(".hs").appendChild(hero); }
    btns.forEach((b,i)=>{ if(i)wrap.appendChild(Object.assign(document.createElement("div"),{style:"height:8px"})); wrap.appendChild(b); });
    ach.forEach(p=>wrap.appendChild(p));
    card.innerHTML=""; card.appendChild(wrap);
  }

  /* ---------------- 7. NOUVEAUX JEUX ---------------- */
  let G=null;
  const CHOIX=e=>(["mcq","story","fill"].includes(e.t)&&Array.isArray(e.o)&&e.o.length>1&&typeof e.a==="number")||(e.t==="tf"&&typeof e.a==="boolean");
  function openUnits(){
    const us=courseUnits(S.active), ids=us.filter(u=>unitUnlocked(u.id)).map(u=>u.id);
    const nx=us.find(u=>!unitUnlocked(u.id)); if(nx)ids.push(nx.id);
    return ids;
  }
  function pool(test,min){
    const ids=openUnits(); let p=EXOS.filter(e=>ids.includes(e.u)&&test(e));
    if(p.length<min)p=EXOS.filter(e=>unitOf(e.u).c===S.active&&test(e));
    return p;
  }
  function award(xp,gems){
    const m=typeof boostMult==="function"?boostMult():1; xp=Math.round(xp*m);
    S.xp+=xp; S.daily.xp+=xp; S.hist=S.hist||{}; S.hist[today()]=(S.hist[today()]||0)+xp; S.league.xpWeek+=xp;
    if(S.courses[S.active])S.courses[S.active].xp+=xp; S.gems+=gems||0;
    if(xp>0){ touchDay(S.active); qprog("xp",xp); }
    save(); refreshTop(); return xp;
  }
  function stop(){ if(G&&G.timer){ clearInterval(G.timer); G.timer=null; } }
  window.arcQuit=function(){ stop(); G=null; setTab("path"); };
  const body=()=>document.getElementById("gamebody");
  const head=stats=>`<div class="arc-ghead"><button class="lquit" type="button" onclick="arcQuit()" aria-label="Quitter le jeu">${ico("cross",24,"var(--dim)")}</button>
    <div class="arc-gstats">${stats}</div></div>`;
  window.arcGame=function(k){
    stop(); const f={eclair:eclairStart,vf:vfStart,frise:friseStart,boss:bossStart,duel:duelStart}[k];
    if(!f)return; if(f()===false){ G=null; return; }
    show("game"); paint();
  };
  function paint(){ if(!G)return; ({eclair:eclairPaint,vf:vfPaint,frise:frisePaint,boss:bossPaint,duel:duelPaint})[G.k](); }
  function endScreen(o){
    stop(); const b=body(); if(!b)return;
    const A0=ARC(); if(o.rec!=null){ const r=A0.rec[G.k]||0; o.newRec=o.rec>r; if(o.newRec)A0.rec[G.k]=o.rec; save(); }
    sfx(o.win===false?"wrong":"complete"); if(o.win!==false)confetti(80);
    b.innerHTML=`<div class="arc-end">${o.img?aimg(o.img,150):""}${o.masc||""}
      ${o.big?`<div class="x">${o.big}</div>`:""}<div class="ttl">${o.title}</div><div class="muted" style="font-size:15px">${o.sub||""}</div>
      <div class="st">${o.stats.map(s=>`<div><b style="color:${s[2]||"var(--txt)"}">${s[0]}</b><span>${s[1]}</span></div>`).join("")}</div>
      <div style="width:100%;display:flex;flex-direction:column;gap:12px;margin-top:14px">
        <button class="btn gold" onclick="arcGame('${G.k}')">Rejouer</button>
        <button class="btn ghost" onclick="arcQuit()">Retour</button></div></div>`;
    G.over=true;
  }

  /* --- Éclair : relier les paires en 60 secondes --- */
  function eclairStart(){
    const all=[], vu=new Set();
    shuffle(pool(e=>e.t==="match"&&Array.isArray(e.p),2)).forEach(e=>e.p.forEach(p=>{
      const a=String(p[0]), b=String(p[1]); if(a.length>70||b.length>90||vu.has(a))return; vu.add(a); all.push([a,b]); }));
    if(all.length<5){ toast("Pas encore assez de paires dans ce cours pour l'Éclair."); return false; }
    G={k:"eclair",all,deck:shuffle(all),end:Date.now()+60000,sel:null,combo:0,best:0,found:0,miss:0};
    deal(); G.timer=setInterval(()=>{ if(!G||G.k!=="eclair"||G.over)return; if(Date.now()>=G.end)eclairEnd(); else tick(); },200);
  }
  function deal(){ if(G.deck.length<5)G.deck=G.deck.concat(shuffle(G.all)); const d=G.deck.splice(0,5);
    G.b={p:d,L:shuffle(d.map((_,i)=>i)),R:shuffle(d.map((_,i)=>i)),ok:[]}; }
  function tick(){ const r=Math.max(0,G.end-Date.now()), t=document.getElementById("arc-t"), bar=document.getElementById("arc-bar");
    if(t)t.textContent="0:"+String(Math.ceil(r/1000)).padStart(2,"0"); if(bar)bar.style.width=(100*r/60000)+"%"; }
  function eclairPaint(){
    const r=Math.max(0,G.end-Date.now()), b=G.b;
    const tile=(s,i)=>{ const txt=s==="L"?b.p[i][0]:b.p[i][1], ok=b.ok.includes(i), sel=G.sel&&G.sel.s===s&&G.sel.i===i;
      return `<button class="arc-tile ${ok?"ok":""} ${sel?"sel":""}" id="t${s}${i}" type="button" onclick="arcTap('${s}',${i})">${esc(txt)}</button>`; };
    body().innerHTML=head(`<span style="color:var(--purple)">${ico("bolt",18)} Combo x${G.combo}</span><span style="color:var(--gold)">${ico("clock",18)} <b id="arc-t">0:${String(Math.ceil(r/1000)).padStart(2,"0")}</b></span>`)
      +`<div class="arc-gbar"><i id="arc-bar" style="width:${100*r/60000}%"></i></div>
      <div class="arc-gbody"><div class="arc-gtitle">Relie chaque notion à sa définition</div>
      <div class="arc-pairs">${b.L.map((li,k)=>tile("L",li)+tile("R",b.R[k])).join("")}</div>
      <div class="arc-pips">${Array.from({length:10},(_,i)=>`<i class="${i<G.found%10||(G.found&&G.found%10===0)?"on":""}"></i>`).join("")}</div>
      <div class="muted" style="text-align:center;margin-top:10px">${G.found} paire${G.found>1?"s":""} · record : ${ARC().rec.eclair||0}</div></div>`;
  }
  window.arcTap=function(s,i){
    if(!G||G.k!=="eclair"||G.over||G.b.ok.includes(i))return;
    if(!G.sel||G.sel.s===s){ G.sel={s,i}; sfx("click"); eclairPaint(); return; }
    const other=G.sel; G.sel=null;
    if(other.i===i){ G.b.ok.push(i); G.found++; G.combo++; G.best=Math.max(G.best,G.combo); sfx(G.combo%5===0?"combo":"correct"); buzz(12);
      if(G.b.ok.length===G.b.p.length){ deal(); } eclairPaint(); }
    else { G.combo=0; G.miss++; G.end-=2000; sfx("wrong"); buzz([30,40,30]); eclairPaint();
      const e=document.getElementById("t"+s+i); if(e)e.classList.add("ko"); }
  };
  function eclairEnd(){
    const xp=award(Math.min(40,G.found*2), G.found>=10?5:G.found>=5?2:0);
    endScreen({img:"ouvert",big:"x"+G.best,title:G.best>=10?"Combo parfait !":"Temps écoulé !",
      sub:G.found+" paire"+(G.found>1?"s":"")+" trouvée"+(G.found>1?"s":"")+", "+G.miss+" erreur"+(G.miss>1?"s":""),
      rec:G.found,stats:[["+"+xp,"XP","var(--gold)"],[G.found,"paires","var(--blue)"],[(G.found>(ARC().rec.eclair||0)?"Record":(ARC().rec.eclair||0)),"record","var(--green)"]]});
  }

  /* --- Vrai ou faux express : glisser a droite si vrai, a gauche si faux --- */
  function vfStart(){
    const p=pool(e=>e.t==="tf"&&typeof e.a==="boolean",8);
    if(p.length<5){ toast("Pas encore assez d'affirmations dans ce cours."); return false; }
    G={k:"vf",deck:shuffle(p),i:0,ok:0,ko:0,combo:0,best:0,end:Date.now()+60000,flash:""};
    G.timer=setInterval(()=>{ if(!G||G.k!=="vf"||G.over)return; if(Date.now()>=G.end)vfEnd(); else tick(); },200);
  }
  function vfPaint(){
    const ex=G.deck[G.i%G.deck.length], r=Math.max(0,G.end-Date.now());
    body().innerHTML=head(`<span style="color:var(--green)">${ico("check",18)} ${G.ok}</span><span style="color:var(--gold)">${ico("clock",18)} <b id="arc-t">0:${String(Math.ceil(r/1000)).padStart(2,"0")}</b></span>`)
      +`<div class="arc-gbar"><i id="arc-bar" style="width:${100*r/60000}%"></i></div>
      <div class="arc-gbody"><div class="arc-vf"><div class="arc-vfcard" id="arc-card">
        <span class="stamp" id="st-no" style="left:18px;color:var(--red);border-color:var(--red)">FAUX</span>
        <span class="stamp" id="st-yes" style="right:18px;color:var(--green);border-color:var(--green)">VRAI</span>
        <div class="q">${esc(ex.q)}</div><div class="muted" style="font-size:13.5px">Glisse à droite si c'est vrai, à gauche si c'est faux.</div></div></div>
      <div class="arc-vfbtns"><button class="no" type="button" onclick="arcVF(false)" aria-label="Faux">${ico("cross",32,"var(--red)")}</button>
        <button class="yes" type="button" onclick="arcVF(true)" aria-label="Vrai">${ico("check",32,"var(--green)")}</button></div>
      <div class="arc-flash" id="arc-flash">${G.flash}</div></div>`;
    swipe(document.getElementById("arc-card"));
  }
  function swipe(el){
    if(!el)return; let x0=null,dx=0;
    el.addEventListener("pointerdown",e=>{ x0=e.clientX; dx=0; try{el.setPointerCapture(e.pointerId);}catch(_){} });
    el.addEventListener("pointermove",e=>{ if(x0==null)return; dx=e.clientX-x0; el.style.transition="none";
      el.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;
      const y=document.getElementById("st-yes"), n=document.getElementById("st-no");
      if(y)y.style.opacity=Math.max(0,Math.min(1,dx/90)); if(n)n.style.opacity=Math.max(0,Math.min(1,-dx/90)); });
    const up=()=>{ if(x0==null)return; x0=null; el.style.transition="";
      if(Math.abs(dx)>90)arcVF(dx>0); else { el.style.transform=""; ["st-yes","st-no"].forEach(i=>{const s=document.getElementById(i);if(s)s.style.opacity=0;}); } };
    el.addEventListener("pointerup",up); el.addEventListener("pointercancel",up);
  }
  window.arcVF=function(v){
    if(!G||G.k!=="vf"||G.over)return;
    const ex=G.deck[G.i%G.deck.length], ok=v===ex.a; grade(ex,ok,S.active);
    if(ok){ G.ok++; G.combo++; G.best=Math.max(G.best,G.combo); sfx("correct"); G.flash=`<b style="color:var(--green)">Bien vu.</b> ${esc(court(ex.w,120))}`; }
    else { G.ko++; G.combo=0; sfx("wrong"); buzz([30,40,30]); G.flash=`<b style="color:var(--red)">C'était ${ex.a?"vrai":"faux"}.</b> ${esc(court(ex.w,140))}`; }
    G.i++; vfPaint();
  };
  function vfEnd(){
    const xp=award(Math.min(40,G.ok*2), G.ok>=12?5:G.ok>=6?2:0);
    endScreen({img:"quete",title:"Temps écoulé !",sub:G.ok+" bonne"+(G.ok>1?"s":"")+" réponse"+(G.ok>1?"s":"")+" sur "+(G.ok+G.ko)+". Tes erreurs reviendront en rappel.",
      rec:G.ok,stats:[["+"+xp,"XP","var(--gold)"],[G.ok+" / "+(G.ok+G.ko),"justes","var(--green)"],["x"+G.best,"combo","var(--blue)"]]});
  }

  /* --- Frise : remettre les etapes dans l ordre --- */
  function friseStart(){
    const p=pool(e=>e.t==="order"&&Array.isArray(e.it)&&e.it.length>=3&&e.it.length<=7,3);
    if(!p.length){ toast("Pas encore de frise dans ce cours."); return false; }
    G={k:"frise",rounds:shuffle(p).slice(0,3),r:0,ok:0}; friseRound();
  }
  function friseRound(){ const ex=G.rounds[G.r]; G.placed=[]; G.bank=shuffle(ex.it.map((_,k)=>k)); G.checked=false; }
  function frisePaint(){
    const ex=G.rounds[G.r], n=ex.it.length;
    body().innerHTML=head(`<span style="color:var(--purple)">${ico("list",18)} Frise ${G.r+1} / ${G.rounds.length}</span><span style="color:var(--green)">${ico("check",18)} ${G.ok}</span>`)
      +`<div class="arc-gbody"><div class="arc-gtitle">${esc(ex.q)}</div><div class="arc-slots">
      ${Array.from({length:n},(_,j)=>{ const k=G.placed[j], full=k!=null, st=G.checked?(k===j?"good":"bad"):"";
        return `<div class="arc-slot ${full?"full":""} ${st}"><span class="n">${j+1}</span>
          <button class="v" type="button" ${full&&!G.checked?`onclick="arcFriseDel(${j})"`:""}>${full?esc(ex.it[k]):"Dépose l'étape ici"}</button></div>`; }).join("")}</div>
      ${G.checked?`<div class="arc-flash" style="text-align:left">${G.placed.every((k,j)=>k===j)?`<b style="color:var(--green)">Parfait.</b> `:`<b style="color:var(--red)">Le bon ordre :</b> ${ex.it.map((s,i)=>(i+1)+". "+esc(s)).join(" · ")}<br>`}${esc(court(ex.w,200))}</div>`
        :`<div class="arc-sec"><span>Il reste</span></div><div class="arc-bank">${G.bank.map(k=>`<button class="arc-chip ${G.placed.includes(k)?"used":""}" type="button" onclick="arcFrise(${k})">${esc(ex.it[k])}</button>`).join("")}</div>`}
      <div class="arc-foot"><button class="btn ${G.checked?"":"purple"}" ${!G.checked&&G.placed.length<n?"disabled":""} onclick="${G.checked?"arcFriseNext()":"arcFriseCheck()"}">${G.checked?(G.r+1<G.rounds.length?"Frise suivante":"Terminer"):"Vérifier"}</button></div></div>`;
  }
  window.arcFrise=function(k){ if(!G||G.checked||G.placed.includes(k))return; G.placed.push(k); sfx("click"); frisePaint(); };
  window.arcFriseDel=function(j){ if(!G||G.checked)return; G.placed.splice(j,1); frisePaint(); };
  window.arcFriseCheck=function(){ const ex=G.rounds[G.r], ok=G.placed.every((k,j)=>k===j); G.checked=true; grade(ex,ok,S.active);
    if(ok){G.ok++;sfx("correct");}else{sfx("wrong");buzz([30,40,30]);} frisePaint(); };
  window.arcFriseNext=function(){ G.r++; if(G.r>=G.rounds.length){ const xp=award(G.ok*10,G.ok===G.rounds.length?4:1);
      endScreen({img:G.ok===G.rounds.length?"ouvert":"coffre",title:G.ok===G.rounds.length?"Chronologie parfaite !":"Frises terminées",
        sub:G.ok+" frise"+(G.ok>1?"s":"")+" sur "+G.rounds.length+" dans le bon ordre",stats:[["+"+xp,"XP","var(--gold)"],[G.ok+" / "+G.rounds.length,"justes","var(--green)"]]}); return; }
    friseRound(); frisePaint(); };

  /* --- questions a choix communes au boss et au duel --- */
  function qHTML(ex,fn){
    if(!G.opt){ G.opt=ex.t==="tf"?[true,false]:shuffle(ex.o.map((_,k)=>k)); }
    return `<div class="arc-q">${ex.ctx?`<div class="muted" style="font-size:13px;margin-bottom:6px">${esc(ex.ctx)}</div>`:""}${esc(ex.q)}</div>
      <div class="arc-opts">${G.opt.map((v,j)=>{ const lab=ex.t==="tf"?(v?"Vrai":"Faux"):ex.o[v];
        let cls=""; if(G.picked!=null){ if(v===ex.a)cls="good"; else if(v===G.picked)cls="bad"; }
        return `<button class="arc-opt ${cls}" type="button" ${G.picked!=null?"disabled":""} onclick="${fn}(${j})">${esc(lab)}</button>`; }).join("")}</div>`;
  }

  /* --- Boss du module : le Diable, 5 coups pour le battre, 3 coeurs --- */
  function bossStart(){
    const n=nextLessonExists(), us=courseUnits(S.active);
    const u=(n&&unitOf(n.u))||us.filter(x=>unitUnlocked(x.id)).pop()||us[0]; if(!u){ toast("Aucun module ouvert."); return false; }
    let p=EXOS.filter(e=>e.u===u.id&&CHOIX(e)); if(p.length<8)p=p.concat(shuffle(pool(CHOIX,8)).filter(e=>!p.includes(e)));
    if(p.length<5){ toast("Pas encore assez de questions pour un boss."); return false; }
    G={k:"boss",u,hp:100,hearts:3,q:shuffle(p).slice(0,14),i:0,picked:null,opt:null};
  }
  const TAUNT=["Tu crois connaître ce module ? Prouve-le.","Encore une réponse au hasard et je gagne.","Pas mal. Mais je n'ai pas dit mon dernier mot.","Tu commences à me faire mal.","Un coup de plus et je tombe."];
  function bossPaint(){
    const ex=G.q[G.i];
    body().innerHTML=`<div class="arc-boss">`+head(`<span style="color:var(--pink,#FF86D0)">${ico("crown",18)} Boss</span><span style="color:var(--red)">${ico("heart",18)} ${G.hearts}</span>`)
      +`<div class="arc-gbody"><div class="arc-bossimg">${masc(G.picked!=null&&G.picked!==ex.a?"fier":G.hp<=40?"triste":"colere","","","diable")}
        <div class="arc-h" style="font-size:21px">Le Diable du ${esc(G.u.n)}</div>
        <div class="arc-hp"><div class="b"><i style="width:${G.hp}%"></i></div><b style="color:var(--orange)">${G.hp} PV</b></div>
        <div class="muted" style="font-size:13.5px;text-align:center">${TAUNT[Math.min(4,Math.floor((100-G.hp)/20))]}</div></div>
      ${qHTML(ex,"arcBoss")}
      ${G.picked!=null?`<div class="arc-foot"><div class="arc-flash" style="text-align:left;margin-top:0">${esc(court(ex.w,220))}</div><button class="btn" onclick="arcBossNext()">Continuer</button></div>`
        :`<div class="arc-reward">${aimg("legendaire",52)}<span>Bats-le pour gagner le <b style="color:#EF8FCF">coffre légendaire</b> : 30 gemmes et 30 XP.</span></div>`}
      </div></div>`;
  }
  window.arcBoss=function(j){ if(!G||G.picked!=null)return; const ex=G.q[G.i]; G.picked=G.opt[j]; const ok=G.picked===ex.a; grade(ex,ok,S.active);
    if(ok){ G.hp=Math.max(0,G.hp-20); sfx("correct"); buzz(20); } else { G.hearts--; sfx("wrong"); buzz([30,40,30]); } bossPaint(); };
  window.arcBossNext=function(){
    if(G.hp<=0){ const xp=award(30,30); endScreen({img:"legendaire",title:"Boss vaincu !",sub:"Le Diable du "+G.u.n+" est à terre. Le coffre légendaire est à toi.",
      stats:[["+"+xp,"XP","var(--gold)"],["+30","gemmes","var(--blue)"],[G.hearts+" / 3","coeurs","var(--red)"]]});
      arcChestFX("legendaire",{title:"Coffre légendaire !",lines:[gemLine(30),`${ico("xp",22)} <b data-n="${xp}">+${xp}</b> XP`]}); return; }
    if(G.hearts<=0||G.i+1>=G.q.length){ const xp=award(5,0); endScreen({win:false,masc:masc("fier","","width:130px;height:130px","diable"),title:"Le Diable a gagné",
      sub:"Relis la leçon du module et reviens le défier. Tes erreurs sont déjà dans tes rappels.",stats:[["+"+xp,"XP","var(--gold)"],[G.hp+" PV","restants","var(--orange)"]]}); return; }
    G.i++; G.picked=null; G.opt=null; bossPaint(); };

  /* --- Duel de ligue : memes questions, ton rival joue en meme temps --- */
  function duelStart(){
    ensureLeague(); const rows=leagueRows(), me=rows.findIndex(r=>r.me);
    const rv=rows[me>0?me-1:1]||{n:"Gabriel M."};
    const p=pool(CHOIX,7); if(p.length<5){ toast("Pas encore assez de questions pour un duel."); return false; }
    G={k:"duel",rv:{n:rv.n,cfg:rv.cfg||avatarCfg(rv.n)},acc:.55+Math.random()*.25,q:shuffle(p).slice(0,7),i:0,me:0,him:0,res:[],picked:null,opt:null};
  }
  function duelPaint(){
    const ex=G.q[G.i];
    body().innerHTML=`<div class="arc-duel"><div class="row">
      <div class="p"><span class="av">${avatarSVG((S.avatar&&S.avatar.cfg)||avatarCfg(S.name),72,false)}</span>Toi<span class="sc">${G.me}</span></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px"><button class="lquit" type="button" onclick="arcQuit()" aria-label="Quitter le duel" style="color:#fff">${ico("cross",22,"#fff")}</button><span class="vs">VS</span></div>
      <div class="p"><span class="av">${avatarSVG(G.rv.cfg,72,false)}</span>${esc(G.rv.n)}<span class="sc">${G.him}</span></div></div></div>
      <div class="arc-gbody"><div class="arc-steps">${G.q.map((_,i)=>`<i class="${G.res[i]===true?"g":G.res[i]===false?"r":""}"></i>`).join("")}</div>
      <div class="muted" style="font-size:13.5px;margin-bottom:10px">Question ${G.i+1} sur ${G.q.length} · mêmes questions pour vous deux</div>
      ${qHTML(ex,"arcDuel")}
      ${G.picked!=null?`<div class="arc-foot"><div class="arc-flash" style="text-align:left;margin-top:0"><b>${G.rvOk?esc(G.rv.n)+" a trouvé aussi.":esc(G.rv.n)+" s'est trompé."}</b> ${esc(court(ex.w,160))}</div><button class="btn" onclick="arcDuelNext()">${G.i+1<G.q.length?"Question suivante":"Voir le résultat"}</button></div>`
        :`<div class="arc-reward">${ico("gem",26,"var(--blue)")}<span>Le gagnant remporte 10 gemmes et 30 XP de ligue.</span></div>`}</div>`;
  }
  window.arcDuel=function(j){ if(!G||G.picked!=null)return; const ex=G.q[G.i]; G.picked=G.opt[j]; const ok=G.picked===ex.a; grade(ex,ok,S.active);
    G.rvOk=Math.random()<G.acc; if(ok)G.me++; if(G.rvOk)G.him++; G.res[G.i]=ok; sfx(ok?"correct":"wrong"); duelPaint(); };
  window.arcDuelNext=function(){
    if(G.i+1<G.q.length){ G.i++; G.picked=null; G.opt=null; duelPaint(); return; }
    const win=G.me>G.him, egal=G.me===G.him, xp=award(win?30:egal?15:5, win?10:0);
    endScreen({win:win||egal,img:win?"ouvert":null,masc:win?"":masc(egal?"content":"triste","","width:130px;height:130px"),
      title:win?"Duel gagné !":egal?"Égalité":"Duel perdu",sub:"Toi "+G.me+" · "+G.rv.n+" "+G.him,
      stats:[["+"+xp,"XP","var(--gold)"],[win?"+10":"0","gemmes","var(--blue)"],[G.me+" / "+G.q.length,"justes","var(--green)"]]});
  };
  function gamesHTML(){
    const t=(bg,sh,i,n,s,k)=>`<button class="arc-gtile" type="button" style="background:${bg};--sh:${sh}" onclick="arcGame('${k}')">${tileG(i,48)}<b>${n}</b><span>${s}</span></button>`;
    return `<div class="arc-games">
      ${t("#9B51E0","#7A3BB5","eclair","Éclair 60 s","Relie les paires, bats ton record","eclair")}
      ${t("#D9731A","#A5530C","vf","Vrai ou faux","Glisse les cartes à toute vitesse","vf")}
      ${t("#3F6FD8","#2A50A8","frise","Frise","Remets les étapes dans l'ordre","frise")}
      ${t("#C7478F","#93306A","boss","Boss du module","Bats le Diable, gagne un coffre","boss")}
      ${t("#1E9E6A","#157650","duel","Duel de ligue","Affronte ton rival direct","duel")}
      ${t("#E5484D","#B3363A","examen","Examen blanc","Trois niveaux, chrono","exam")}</div>`;
  }
  const __game=window.arcGame;
  window.arcGame=function(k){ if(k==="exam"){ setTab("exam"); return; } return __game(k); };

  /* ---------------- 7 bis. LA LECON AVANT LE QUIZ ----------------
     Une lecon jamais faite s ouvre sur son cours : la partie du guide qui
     colle le mieux aux quatre questions neuves. On peut la passer. Les
     lecons deja faites et l epreuve legendaire partent droit au quiz.   */
  const GOALS=/savoir faire|en examen|pour l'examen|à retenir pour/i;
  const txt=h=>String(h||"").replace(/<[^>]+>/g," ").replace(/&[a-z]+;/g," ").replace(/\s+/g," ").trim();
  function sections(u){
    return String(u.guide||"").split(/(?=<h3[\s>])/).map(p=>{
      const m=/^<h3[^>]*>([\s\S]*?)<\/h3>/.exec(p);
      return {t:m?txt(m[1]):"",h:m?p.slice(m[0].length):p};
    }).filter(s=>txt(s.h)||s.t);
  }
  const mots=t=>new Set(txt(t).toLowerCase().split(/[^a-z0-9àâäéèêëïîôöùûüç]+/).filter(w=>w.length>4));
  function lessonSec(u,li){
    const all=sections(u), cand=all.filter(s=>s.t&&!GOALS.test(s.t));
    if(!cand.length)return all[0]||null;
    const W=mots(unitExos(u.id).slice(li*4,li*4+4).map(e=>[e.q,e.ctx,e.w,(e.o||[]).join(" ")].join(" ")).join(" "));
    const nL=Math.max(1,lessonsIn(u.id)), base=Math.min(cand.length-1,Math.floor(li*cand.length/nL));
    let best=cand[base], bs=-1;
    cand.forEach((s,i)=>{ const M=mots(s.t+" "+s.h); let n=0; M.forEach(w=>{ if(W.has(w))n++; });
      const sc=n/Math.sqrt(M.size+1)-Math.abs(i-base)*.08; if(sc>bs){ bs=sc; best=s; } });
    return best;
  }
  let INTRO=null;
  window.arcStart=function(uid,li){
    const u=unitOf(uid), c=u&&S.courses[u.c];
    const done=c&&c.lessons&&c.lessons[lkey(uid,li)];
    const sec=u&&li>=0&&!done&&S.settings.arcIntro!==false?lessonSec(u,li):null;
    if(!sec)return startLesson(uid,li);
    INTRO={uid,li};
    const nL=lessonsIn(uid), min=Math.max(1,Math.round(txt(sec.h).split(" ").length/200));
    document.getElementById("intro-ttl").textContent=u.n+" · leçon "+(li+1)+"/"+nL;
    document.getElementById("introbody").innerHTML=`<div class="arc-ihero" style="background:var(${u.col})">
        <div class="k">${ico("lecon",14)} La leçon avant le quiz</div><h2>${esc(sec.t||u.t)}</h2>
        <div class="m"><span>${ico("clock",13)} ${min} min de lecture</span><span>${ico("target",13)} puis 4 questions</span><span>${ico("xp",15)} +10 XP</span></div></div>
      <div class="arc-lesson" style="--gcol:var(${u.col})">${sec.h}</div>`;
    show("intro"); const b=document.getElementById("introbody"); if(b)b.scrollTop=0;
    sfx("click");
  };
  window.arcIntroGo=function(){ const i=INTRO; INTRO=null; if(i)startLesson(i.uid,i.li); };
  window.arcIntroQuit=function(){ INTRO=null; setTab("path"); };
  window.arcIntroAll=function(){ if(INTRO)openGuide(INTRO.uid); };

  /* ---------------- 7 ter. LE GUIDE DEVIENT « LA LECON » ----------------
     Meme contenu, mieux range : les objectifs en haut, un sommaire, puis
     chaque partie repliable. On lit une partie a la fois au lieu d un mur
     de texte. Le contenu des cours n est pas touche.                     */
  function arcGuide(uid){
    const w=document.querySelector("#mcard .gwrap"); if(!w||w.dataset.arc)return; w.dataset.arc="1";
    const u=unitOf(uid);
    w.querySelectorAll(".gtag").forEach(t=>{ if(/Fiche de cours/.test(t.textContent))t.innerHTML=ico("lecon",13)+" Leçon du module"; });
    const secs=[...w.querySelectorAll(":scope > .gsec")]; if(!secs.length)return;
    const frag=document.createElement("div"); let n=0; const toc=[];
    let goals=null;
    secs.forEach(s=>{
      const h=s.querySelector(":scope > h3");
      if(!h){ if(txt(s.innerHTML)){ s.classList.add("arc-lesson"); frag.appendChild(s); } else s.remove(); return; }
      const t=txt(h.innerHTML); h.remove();
      if(GOALS.test(t)&&!goals){ goals=document.createElement("div"); goals.className="arc-goals arc-lesson";
        goals.innerHTML=`<div class="k">${ico("target",15)} ${esc(t)}</div>`; while(s.firstChild)goals.appendChild(s.firstChild); s.remove(); return; }
      n++; const d=document.createElement("details"); d.className="arc-acc"; d.id="arc-g"+n; if(n===1)d.open=true;
      d.innerHTML=`<summary><span class="n">${n}</span><span class="t">${esc(t)}</span><span class="ch">${ico("arrowdown",16)}</span></summary>`;
      const b=document.createElement("div"); b.className="b arc-lesson"; while(s.firstChild)b.appendChild(s.firstChild); d.appendChild(b);
      frag.appendChild(d); toc.push(t); s.remove();
    });
    const anchor=w.querySelector(".gtag")?w.querySelector(".gtag").parentElement:w.querySelector(".ghero");
    const head=document.createElement("div");
    if(goals)head.appendChild(goals);
    if(toc.length>2)head.insertAdjacentHTML("beforeend",`<div class="arc-toc" role="navigation" aria-label="Sommaire">${toc.map((t,i)=>
      `<button type="button" onclick="arcToc(${i+1})">${i+1}. ${esc(court(t,34))}</button>`).join("")}</div>`);
    anchor.after(head); head.after(frag);
    while(frag.firstChild)head.parentNode.insertBefore(frag.firstChild,frag);
    frag.remove();
    w.style.setProperty("--gcol",`var(${u.col})`);
    w.insertAdjacentHTML("afterbegin",`<button class="arc-mclose" type="button" onclick="closeModal()" aria-label="Fermer la leçon">${ico("cross",22,"#fff")}</button>`);
  }
  window.arcToc=function(i){ const d=document.getElementById("arc-g"+i); if(!d)return; d.open=true; d.scrollIntoView({behavior:"smooth",block:"start"}); };

  /* ---------------- 7 quater. PROFIL ET REVISER RANGES ----------------
     Chaque titre de section devient une carte repliable : tout reste la,
     on ouvre seulement ce qu on cherche. L etat ouvert est retenu.       */
  const OUV={profile:{"Statistiques":1},review:{"Pratique personnalisée":1}};
  const SICO={"Statistiques":"chart","Analyse":"chart","Badges":"medal","Succès":"trophy","Progression":"book","Réglages":"gear",
    "Ton compagnon":"heart","Onglets":"grid","Synchronisation":"refresh","Rappels":"bell","Sauvegarde":"save","Zone":"lock",
    "Pratique":"target","Maîtrise":"chart"};
  function arcAcc(root,key){
    if(!root||root.querySelector(":scope > .arc-acc"))return;
    let cur=null;
    [...root.children].forEach(el=>{
      if(el.classList&&el.classList.contains("section-t")){
        const t=txt(el.innerHTML), k=Object.keys(SICO).find(x=>t.indexOf(x)===0);
        cur=document.createElement("details"); cur.className="arc-acc pf"; cur.open=!!OUV[key][t];
        cur.innerHTML=`<summary><span class="n">${ico(SICO[k]||"star",17)}</span><span class="t">${esc(t)}</span><span class="ch">${ico("arrowdown",16)}</span></summary><div class="b"></div>`;
        cur.addEventListener("toggle",function(){ OUV[key][t]=this.open?1:0; });
        root.insertBefore(cur,el); cur.lastElementChild.appendChild(el);
        if(/^Réglages/.test(t))cur.lastElementChild.classList.add("arc-setbox");
        return;
      }
      if(cur)cur.lastElementChild.appendChild(el);
    });
    root.querySelectorAll(".arc-setbox").forEach(b=>{
      const g=document.createElement("div"); g.className="arc-setgrid";
      [...b.children].forEach(x=>{ if(x.classList.contains("section-t"))return; g.appendChild(x); });
      b.appendChild(g);
    });
  }

  /* ---------------- 7 quinquies. BARRE DU BAS : cinq cases ----------------
     Jouer, Réviser, Ligue, Boutique et Plus. Défis, Profil et les autres
     onglets passent dans Plus. La série (flamme) ouvre toujours les Défis,
     l avatar ouvre toujours le Profil.                                     */
  const PRIO=["path","review","league","shop"];
  let TAB="path";
  function navSplit(){
    const vis=visibleTabs(), main=[];
    PRIO.forEach(id=>{ const t=vis.find(x=>x.id===id); if(t)main.push(t); });
    vis.forEach(t=>{ if(main.length<4&&!main.includes(t)&&t.id!=="profile")main.push(t); });
    return {main,reste:vis.filter(t=>!main.includes(t))};
  }
  function arcNav(){
    const mt=document.getElementById("mtabs"); if(!mt||typeof visibleTabs!=="function")return;
    const {main,reste}=navSplit();
    /* icones seules : un libelle debordait de sa bulle. Le nom reste lu par
       VoiceOver (aria-label) et apparait au survol (title). */
    mt.innerHTML=main.map(t=>`<button class="navitem${t.id===TAB?" on":""}" data-tab="${t.id}" type="button" aria-label="${esc(t.nm)}" title="${esc(t.nm)}"><span class="ic">${glyph(NAVG[t.id]||"plus",28)}</span></button>`).join("")
      +`<button class="navitem${reste.some(t=>t.id===TAB)?" on":""}" id="arc-more" type="button" onclick="moreTabs()" aria-label="Plus" title="Plus"><span class="ic">${glyph("plus",28)}</span></button>`;
    if(typeof bindNav==="function")bindNav();
  }
  function arcMoreTabs(){
    const {reste}=navSplit();
    openModal(`<h2 class="arc-h" style="margin:0;text-align:left">Plus</h2>
      <div class="arc-more">${reste.map(t=>`<button type="button" class="${t.id===TAB?"on":""}" onclick="closeModal();setTab('${t.id}')">
        ${tileG(NAVG[t.id]||"plus",48,NAVC[t.id])}${esc(t.nm)}</button>`).join("")}</div>
      <button class="btn ghost" onclick="closeModal()">Fermer</button>`);
  }

  /* ---------------- 7 sexies. CATEGORIES DE COURS ----------------
     Renommer, ajouter, supprimer une categorie vide, deplacer un cours
     (glisser par sa poignee, ou bouton Deplacer). Les reglages vivent dans
     S.cats et s appliquent par dessus CATS et COURSES : rien n est perdu,
     une categorie d origine renommee ou supprimee revient si on efface S.cats. */
  const ORIG={cats:null,course:{}};
  const CCOL=["--blue","--gold","--red","--orange","--purple","--green","--pink"];
  function catCfg(){ if(!S.cats||typeof S.cats!=="object")S.cats={}; const g=S.cats;
    g.ren=g.ren||{}; g.add=g.add||[]; g.del=g.del||[]; g.mv=g.mv||{}; return g; }
  function applyCats(){
    if(typeof CATS==="undefined"||typeof S==="undefined"||!S)return;
    if(!ORIG.cats){ ORIG.cats=CATS.map(k=>Object.assign({},k)); COURSES.forEach(c=>{ ORIG.course[c.id]=c.cat; }); }
    const g=catCfg(), nom=k=>Object.assign({},k,g.ren[k.id]?{nm:g.ren[k.id]}:{});
    CATS.length=0;
    ORIG.cats.concat(g.add).forEach(k=>{ if(!g.del.includes(k.id))CATS.push(nom(k)); });
    COURSES.forEach(c=>{ const m=g.mv[c.id]; c.cat=(m&&CATS.some(k=>k.id===m))?m:ORIG.course[c.id]; });
  }
  let ORG=false, EDIT=null;
  const allCats=()=>{ const l=CATS.slice(); if(catCourses("autre").length)l.push(CAT_AUTRE); return l; };
  function orgHTML(){
    const box=k=>{ const l=catCourses(k.id), n=l.length, fixe=k.id==="autre";
      const hd=EDIT===k.id?`<div class="arc-catedit"><input id="arc-catin" type="text" maxlength="40" value="${esc(k.nm)}" aria-label="Nom de la catégorie"
          onkeydown="if(event.key==='Enter')arcCatSave('${k.id}')"><button class="btn sm" type="button" onclick="arcCatSave('${k.id}')">OK</button></div>`
        :`<div class="hd"><span class="ci">${catIcon(k,36)}</span><span class="nm">${esc(k.nm)}</span><span class="ct">${n} cours</span>
          ${fixe?"":`<button type="button" onclick="arcCatRen('${k.id}')" aria-label="Renommer ${esc(k.nm)}">${ico("pencil",18)}</button>
          <button type="button" ${n?"disabled":""} onclick="arcCatDel('${k.id}')" aria-label="Supprimer ${esc(k.nm)}">${ico("trash",18)}</button>`}</div>`;
      return `<div class="arc-catbox" data-cat="${k.id}">${hd}<div class="arc-chips">${n?l.map(c=>`<div class="arc-cchip" data-cid="${c.id}">
          <span class="gr" data-grip="1" aria-hidden="true">${ico("grid",20)}</span>${typeof badgeSVG==="function"?badgeSVG(c.id,30):""}<span class="tx">${esc(c.name)}</span>
          <button class="mv" type="button" onclick="arcCatMove('${c.id}')">Déplacer</button></div>`).join("")
        :`<div class="vide">Glisse un cours ici</div>`}</div></div>`; };
    return `<div class="section-t" style="margin-top:4px">Mes catégories</div>
      <div class="arc-orgbar"><button class="btn blue" type="button" onclick="arcCatAdd()">${ico("plus",16)} Nouvelle catégorie</button>
        <button class="btn" type="button" onclick="arcOrg(false)">Terminé</button></div>
      <p class="muted" style="margin:-4px 2px 12px">Glisse un cours par sa poignée vers une autre catégorie, ou touche Déplacer. Une catégorie vide peut être supprimée.</p>
      <div class="arc-cats">${allCats().map(box).join("")}</div>`;
  }
  function orgPaint(){ const b=document.getElementById("coursesbody"); if(!b)return; b.innerHTML=orgHTML(); bindDrag(b);
    const i=document.getElementById("arc-catin"); if(i){ i.focus(); i.select(); } }
  window.arcOrg=function(on){ ORG=!!on; EDIT=null; renderCourses(); };
  const catSaved=()=>{ applyCats(); save(); orgPaint(); };
  window.arcCatRen=function(id){ EDIT=id; orgPaint(); };
  window.arcCatSave=function(id){ const i=document.getElementById("arc-catin"), v=i?i.value.replace(/\s+/g," ").trim():"";
    if(v)catCfg().ren[id]=v; EDIT=null; catSaved(); };
  window.arcCatAdd=function(){ const g=catCfg(), id="c"+Date.now().toString(36);
    g.add.push({id,nm:"Nouvelle catégorie",d:"Ma catégorie",icon:"\u{1F4C1}",col:CCOL[g.add.length%CCOL.length]});
    EDIT=id; catSaved(); };
  window.arcCatDel=function(id){ if(catCourses(id).length){ toast("Vide d'abord cette catégorie."); return; }
    const g=catCfg(); if(g.add.some(k=>k.id===id))g.add=g.add.filter(k=>k.id!==id); else if(!g.del.includes(id))g.del.push(id);
    delete g.ren[id]; if(S.catOpen===id)S.catOpen=""; catSaved(); toast("Catégorie supprimée."); };
  function moveTo(cid,cat){ const g=catCfg(); if(!cid||!cat||cat==="autre")return;
    if(cat===ORIG.course[cid])delete g.mv[cid]; else g.mv[cid]=cat;
    applyCats(); save(); sfx("click"); }
  window.arcCatMove=function(cid){
    const c=COURSES.find(x=>x.id===cid); if(!c)return;
    openModal(`<h2 class="arc-h" style="margin:0 0 4px;text-align:left">Déplacer</h2><p class="muted" style="text-align:left;margin:0 0 12px">${esc(c.name)}</p>
      <div style="display:flex;flex-direction:column;gap:8px">${CATS.map(k=>`<button class="arc-crow ${k.id===c.cat?"on":""}" type="button" onclick="closeModal();arcCatTo('${cid}','${k.id}')">
        ${catIcon(k,36)}
        <span class="i"><b>${esc(k.nm)}</b></span></button>`).join("")}</div>
      <div style="height:10px"></div><button class="btn ghost" onclick="closeModal()">Annuler</button>`);
  };
  window.arcCatTo=function(cid,cat){ moveTo(cid,cat); orgPaint(); };
  /* glisser deposer au doigt : la poignee seule bloque le defilement,
     le reste de la carte laisse la liste defiler normalement */
  function bindDrag(root){
    root.querySelectorAll(".arc-cchip [data-grip]").forEach(gr=>{
      gr.style.touchAction="none";
      gr.addEventListener("pointerdown",e=>{
        const chip=gr.closest(".arc-cchip"), cid=chip.dataset.cid, r=chip.getBoundingClientRect(), sc=root.closest(".scroll")||root;
        const gh=chip.cloneNode(true); gh.classList.add("arc-ghost"); gh.style.width=r.width+"px"; gh.style.left=r.left+"px"; gh.style.top=r.top+"px";
        document.body.appendChild(gh); chip.classList.add("drag");
        const dx=e.clientX-r.left, dy=e.clientY-r.top; let over=null, raf=null, lastY=e.clientY;
        try{ gr.setPointerCapture(e.pointerId); }catch(_){}
        const edge=()=>{ const b=sc.getBoundingClientRect(); if(lastY<b.top+60)sc.scrollTop-=12; else if(lastY>b.bottom-110)sc.scrollTop+=12; raf=requestAnimationFrame(edge); };
        raf=requestAnimationFrame(edge);
        const mv=ev=>{ lastY=ev.clientY; gh.style.left=(ev.clientX-dx)+"px"; gh.style.top=(ev.clientY-dy)+"px";
          const t=document.elementFromPoint(ev.clientX,ev.clientY), b=t&&t.closest(".arc-catbox");
          if(b!==over){ if(over)over.classList.remove("over"); over=b; if(over)over.classList.add("over"); } };
        const up=()=>{ cancelAnimationFrame(raf); gr.removeEventListener("pointermove",mv); gr.removeEventListener("pointerup",up); gr.removeEventListener("pointercancel",up);
          gh.remove(); chip.classList.remove("drag"); const cat=over&&over.dataset.cat; if(over)over.classList.remove("over");
          const c=COURSES.find(x=>x.id===cid); if(cat&&c&&cat!==c.cat){ moveTo(cid,cat); orgPaint(); } };
        gr.addEventListener("pointermove",mv); gr.addEventListener("pointerup",up); gr.addEventListener("pointercancel",up);
        e.preventDefault();
      });
    });
  }

  /* ---------------- 7 septies. ICONES DE COURS EN VERRE ----------------
     Une icone par cours, dessinee pour son sujet (plus de « page » par
     defaut). Tuile de la couleur du cours, reflet de verre, glyphe clair. */
  const W6='fill="url(#arcGw)"', D6='fill="#1C1C48" fill-opacity=".62"', DS6='stroke="#1C1C48" stroke-opacity=".62" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  const WS6='stroke="url(#arcGw)" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  const CB={
    MRC:`<rect x="12" y="34" width="8" height="16" rx="2.5" ${W6} opacity=".6"/><rect x="24" y="26" width="8" height="24" rx="2.5" ${W6} opacity=".8"/><rect x="36" y="16" width="8" height="34" rx="2.5" ${W6}/><path d="M12 16l12 9 8-5 14 14" ${WS6} stroke-width="4"/><path d="M47 26v9h-9" ${WS6} stroke-width="4"/>`,
    BANQUE:`<path d="M32 9 53 20v3H11v-3z" ${W6}/><rect x="15" y="26" width="6" height="18" rx="2" ${W6}/><rect x="29" y="26" width="6" height="18" rx="2" ${W6}/><rect x="43" y="26" width="6" height="18" rx="2" ${W6}/><rect x="10" y="46" width="44" height="7" rx="3" ${W6}/><circle cx="32" cy="16.5" r="2.6" ${D6}/>`,
    PATRI:`<path d="M10 30 32 12l22 18" ${WS6} stroke-width="5"/><path d="M16 28 32 15l16 13v21a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3z" ${W6}/><circle cx="32" cy="33" r="5.5" ${D6}/><path d="M32 38v8M32 42h4" ${DS6} stroke-width="3.2"/>`,
    NEGO:`<path d="M8 16a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H20l-8 7v-7.6A6 6 0 0 1 8 26z" ${W6} opacity=".62"/><path d="M24 30a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6h-2v8l-9-8h-9a6 6 0 0 1-6-6z" ${W6}/><path d="M32 35h14M32 40h9" ${DS6} stroke-width="3"/>`,
    NON:`<path d="M10 18a8 8 0 0 1 8-8h28a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H30l-10 9v-9h-2a8 8 0 0 1-8-8z" ${W6}/><text x="32" y="33" text-anchor="middle" font-family="Baloo 2,Nunito,system-ui,sans-serif" font-weight="800" font-size="16" fill="#1C1C48" fill-opacity=".75">NON</text>`,
    NUTRI:`<path d="M32 22c-4-5-15-5-18 4-3 9 2 22 9 25 3 1 6 0 9-1 3 1 6 2 9 1 7-3 12-16 9-25-3-9-14-9-18-4z" ${W6}/><path d="M32 22c0-6 2-10 6-12" ${WS6} stroke-width="3.4"/><path d="M36 14c4-5 11-5 14-2-3 5-10 6-14 2z" ${W6} opacity=".85"/><path d="M20 30c-1 4 0 8 2 11" ${DS6} stroke-width="2.6" opacity=".5"/>`,
    SPINO:`<circle cx="32" cy="32" r="21" ${W6} opacity=".35"/><circle cx="32" cy="32" r="15" ${W6}/><path d="M32 17 36 32 32 47 28 32z" ${D6}/><path d="M32 17 36 32h-8z" fill="#FF6B6B"/><path d="M32 6v5M32 53v5M6 32h5M53 32h5M13.6 13.6l3.5 3.5M46.9 46.9l3.5 3.5M13.6 50.4l3.5-3.5M46.9 17.1l3.5-3.5" ${WS6} stroke-width="3.4"/>`,
    MMA:`<path d="M24 8h16l12 12v16L40 48H24L12 36V20z" ${W6} opacity=".3"/><path d="M24 8h16l12 12v16L40 48H24L12 36V20z" ${WS6} stroke-width="4"/><path d="M18 14l28 28M46 14 18 42M12 28h40M32 8v40" ${WS6} stroke-width="1.6" opacity=".7"/><path d="M14 56h36" ${WS6} stroke-width="4" opacity=".8"/><path d="M20 48v8M44 48v8" ${WS6} stroke-width="3.4"/>`,
    TENNIS:`<circle cx="36" cy="30" r="17" ${W6}/><path d="M21.5 22c7 3 9 13 4 22M50.5 38c-7-3-9-13-4-22" ${DS6} stroke-width="3"/><path d="M8 56l14-14" ${WS6} stroke-width="6"/><circle cx="12" cy="18" r="5" fill="#E7FF6B"/>`,
    STYLE:`<path d="M22 12 32 21l10-9 11 6-6 32H17l-6-32z" ${W6}/><path d="M32 21l-5 5 5 21 5-21z" ${D6}/><path d="M22 12l10 9-6 6-7-9zM42 12l-10 9 6 6 7-9z" ${W6} opacity=".75"/>`,
    HUMOUR:`<rect x="24" y="8" width="16" height="26" rx="8" ${W6}/><path d="M28 16h8M28 21h8M28 26h8" ${DS6} stroke-width="2.2"/><path d="M17 28a15 15 0 0 0 30 0" ${WS6} stroke-width="4"/><path d="M32 43v9M22 55h20" ${WS6} stroke-width="4.4"/>`,
    POKER:`<rect x="10" y="16" width="24" height="34" rx="5" ${W6} opacity=".62" transform="rotate(-14 22 33)"/><rect x="27" y="11" width="26" height="36" rx="5" ${W6}/><path d="M40 18c4 4 8 7 8 11a4 4 0 0 1-7 2.6l1.4 5.4h-4.8l1.4-5.4A4 4 0 0 1 32 29c0-4 4-7 8-11z" ${D6}/>`,
    DAMES:`<ellipse cx="32" cy="44" rx="20" ry="9" ${D6}/><ellipse cx="32" cy="40" rx="20" ry="9" ${W6}/><ellipse cx="32" cy="30" rx="20" ry="9" ${W6} opacity=".7"/><ellipse cx="32" cy="25" rx="20" ry="9" ${W6}/><ellipse cx="32" cy="25" rx="11" ry="4.6" ${DS6} stroke-width="2.4"/><path d="m32 20.8 1.4 2.8 3.1.4-2.3 2.1.6 3.1-2.8-1.5-2.8 1.5.6-3.1-2.3-2.1 3.1-.4z" ${D6}/>`,
    YT:`<rect x="8" y="14" width="48" height="34" rx="11" ${W6}/><path d="M27 23.5 41 31l-14 7.5z" fill="#FF3B3B"/><path d="M14 56h36" ${WS6} stroke-width="4" opacity=".6"/>`,
    RISK:`<path d="M32 8 52 15v15c0 13-9 21-20 25-11-4-20-12-20-25V15z" ${W6}/><path d="M22 31l7 7 13-14" ${DS6} stroke-width="5.4"/>`,
    NIETZ:`<rect x="13" y="12" width="28" height="15" rx="4" ${W6} transform="rotate(-32 27 19.5)"/><path d="M28 26 48 52" ${WS6} stroke-width="7"/><path d="M14 18l6 10" ${DS6} stroke-width="2.4" transform="rotate(-32 27 19.5)"/>`,
    CUISINE:`<path d="M18 30a9 9 0 0 1 4-17 11 11 0 0 1 20 0 9 9 0 0 1 4 17v10H18z" ${W6}/><rect x="18" y="42" width="28" height="10" rx="3" ${W6} opacity=".8"/><path d="M26 30v8M32 28v10M38 30v8" ${DS6} stroke-width="2.6"/>`
  };
  const CATG={ecole:`<path d="M6 24 32 12l26 12-26 12z" ${W6}/><path d="M16 30v12c5 5 27 5 32 0V30L32 38z" ${W6} opacity=".8"/><path d="M54 25v14" ${WS6} stroke-width="3"/><circle cx="54" cy="42" r="3.4" ${W6}/>`,
    jeux:`<rect x="8" y="20" width="48" height="26" rx="13" ${W6}/><path d="M20 28v10M15 33h10" ${DS6} stroke-width="3.4"/><circle cx="42" cy="30" r="3" ${D6}/><circle cx="48" cy="36" r="3" ${D6}/>`,
    sport:`<circle cx="32" cy="32" r="21" ${W6}/><path d="M32 11v42M11 32h42M17 17c9 7 9 23 0 30M47 17c-9 7-9 23 0 30" ${DS6} stroke-width="2.6"/>`};
  Object.assign(CATG,{
    diver:`<path d="M8 26h48v24a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z" ${W6}/><path d="M8 18l44-9 2 9-44 9z" ${W6} opacity=".8"/><path d="m16 16.5 5 7M27 14.2l5 7M38 12l5 7" ${DS6} stroke-width="3"/><path d="M8 34h48" ${DS6} stroke-width="2.4"/>`,
    style:CB.STYLE, livres:`<path d="M32 10a14 14 0 0 1 8 25.5V42H24v-6.5A14 14 0 0 1 32 10z" ${W6}/><rect x="25" y="45" width="14" height="5" rx="2.5" ${W6} opacity=".8"/><path d="M28 54h8" ${WS6} stroke-width="3.4"/><path d="M28 30l4-5 4 5" ${DS6} stroke-width="2.6"/>`,
    perso:CB.SPINO, autre:`<path d="M8 20a4 4 0 0 1 4-4h14l5 5h21a4 4 0 0 1 4 4v23a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z" ${W6}/><path d="M8 28h48" ${DS6} stroke-width="2.4"/>`});
  CATG.sport=CB.MMA; 
  function catIcon(k,size){ const s=size||44, art=CATG[k.id]||CATG.autre;
    return `<svg class="arc-cb" viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true" style="display:block;flex:none">
      <rect x="2" y="2" width="60" height="60" rx="19" style="fill:var(${k.col||"--blue"})"/><rect x="2" y="2" width="60" height="60" rx="19" fill="url(#arcTile)"/>
      <path d="M8 22c0-8 6-14 14-14h20c8 0 14 6 14 14-8-4-16-5-24-5s-16 1-24 5z" fill="#fff" fill-opacity=".28"/>
      <rect x="2.8" y="2.8" width="58.4" height="58.4" rx="18.2" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.4"/>
      <g style="filter:drop-shadow(0 1.5px 1.5px rgba(0,0,0,.28))">${art}</g></svg>`; }
  window.arcCatIcon=catIcon;
  function glassBadge(cid,size){
    const c=COURSES.find(x=>x.id===cid)||{col:"--blue"}, s=size||44;
    const art=CB[cid]||CATG[c.cat]||CATG.ecole;
    return `<svg class="cbadge arc-cb" viewBox="0 0 64 64" width="${s}" height="${s}" role="img" aria-label="${esc(c.short||cid)}" style="display:block;flex:none">
      <rect x="2" y="2" width="60" height="60" rx="19" style="fill:var(${c.col})"/>
      <rect x="2" y="2" width="60" height="60" rx="19" fill="url(#arcTile)"/>
      <path d="M8 22c0-8 6-14 14-14h20c8 0 14 6 14 14-8-4-16-5-24-5s-16 1-24 5z" fill="#fff" fill-opacity=".28"/>
      <rect x="2.8" y="2.8" width="58.4" height="58.4" rx="18.2" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.4"/>
      <g style="filter:drop-shadow(0 1.5px 1.5px rgba(0,0,0,.28))">${art}</g></svg>`;
  }

  /* ---------------- 7 octies. TROPHEES DES DIVISIONS ----------------
     Un vrai trophee par division, en metal colore : la coupe grandit et
     s orne a chaque palier (etoile, lauriers, gemme, ailes, couronne). */
  const METAL=[["#F7C08F","#CD7F32","#6E3C12"],["#FFFFFF","#C7CCD6","#6F7787"],["#FFF3A6","#FFC800","#A06C00"],
    ["#C4F0FF","#1CB0F6","#0A5580"],["#FFC2C2","#FF4B4B","#8E1626"],["#F5E3FF","#CE82FF","#5E2399"]];
  const trophyDefs=()=>METAL.map((m,i)=>`<linearGradient id="arcL${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${m[0]}"/><stop offset=".45" stop-color="${m[1]}"/><stop offset="1" stop-color="${m[2]}"/></linearGradient>`).join("");
  function trophySVG(i,size,lab){
    const g=`url(#arcL${i})`, m=METAL[i]||METAL[0], s=size||48;
    const laur=i>=2?`<g fill="${m[1]}" stroke="${m[2]}" stroke-width=".8">${[0,1,2,3].map(k=>`<ellipse cx="${13-k*1.3}" cy="${44-k*7}" rx="2.6" ry="5" transform="rotate(${-30+k*10} ${13-k*1.3} ${44-k*7})"/><ellipse cx="${51+k*1.3}" cy="${44-k*7}" rx="2.6" ry="5" transform="rotate(${30-k*10} ${51+k*1.3} ${44-k*7})"/>`).join("")}</g>`:"";
    const wings=i>=4?`<path d="M18 22C9 20 4 13 3 6c6 3 10 3 15 8zM46 22c9-2 14-9 15-16-6 3-10 3-15 8z" fill="${g}" stroke="${m[2]}" stroke-width="1"/>`:"";
    const crown=i>=5?`<path d="M22 8l4 5 6-8 6 8 4-5-2 9H24z" fill="#FFD84D" stroke="#A06C00" stroke-width="1"/>`:"";
    const emb=[`<circle cx="32" cy="25" r="5" fill="${m[0]}" stroke="${m[2]}" stroke-width="1.2"/>`,
      `<path d="m32 18.5 2 4.1 4.5.6-3.3 3.1.8 4.5-4-2.1-4 2.1.8-4.5-3.3-3.1 4.5-.6z" fill="#fff" stroke="${m[2]}" stroke-width="1"/>`,
      `<path d="m32 17.5 2.3 4.7 5.2.7-3.8 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1-3.8-3.6 5.2-.7z" fill="#fff" stroke="${m[2]}" stroke-width="1"/>`,
      `<path d="M26 22.5 29 18h6l3 4.5-6 8z" fill="#E8FAFF" stroke="#0A5580" stroke-width="1.1"/><path d="M26 22.5h12M29 18l3 12.5L35 18" stroke="#0A5580" stroke-width=".8" fill="none"/>`,
      `<path d="M32 31c-6-4-8-7-8-10a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 3-2 6-8 10z" fill="#FFE1E1" stroke="#8E1626" stroke-width="1.1"/>`,
      `<path d="M25 22 28.5 17h7l3.5 5-7 9z" fill="#fff" stroke="#5E2399" stroke-width="1.1"/><path d="M25 22h14M28.5 17 32 31l3.5-14" stroke="#5E2399" stroke-width=".8" fill="none"/>`][i]||"";
    return `<svg class="arc-trophy" viewBox="0 0 64 64" width="${s}" height="${s}" ${lab?`role="img" aria-label="${esc(lab)}"`:'aria-hidden="true"'}>
      ${wings}${laur}
      <path d="M19 15h-5a7 7 0 0 0 7 11M45 15h5a7 7 0 0 1-7 11" fill="none" stroke="${g}" stroke-width="4" stroke-linecap="round"/>
      <path d="M18 12h28v12c0 9-6 16-14 16s-14-7-14-16z" fill="${g}" stroke="${m[2]}" stroke-width="1.2"/>
      <path d="M22 14v9c0 4 1.5 7.5 4 10" stroke="#fff" stroke-opacity=".55" stroke-width="2.4" stroke-linecap="round" fill="none"/>
      <rect x="29" y="39" width="6" height="7" fill="${g}"/>
      <path d="M21 46h22a3 3 0 0 1 3 3v8H18v-8a3 3 0 0 1 3-3z" fill="${g}" stroke="${m[2]}" stroke-width="1.2"/>
      <rect x="24" y="50" width="16" height="3.4" rx="1.7" fill="${m[2]}" fill-opacity=".45"/>
      ${emb}${crown}</svg>`;
  }
  window.arcTrophy=trophySVG;

  /* ---------------- 7 nonies. OUVERTURE DES COFFRES ----------------
     Une vraie sequence : le coffre tombe, tremble de plus en plus fort,
     s ouvre dans un eclair, des rayons tournent, les gemmes jaillissent,
     puis la recompense monte. Chaque coffre a son ambiance. On peut
     toucher l ecran pour passer directement a la recompense.            */
  const THEMES={
    coffre:{img:"coffre",open:"ouvert",a:"#FFC800",b:"#FF8A00",bg:"#2A1E0A",nm:"Coffre"},
    matin:{img:"matin",open:"matin",a:"#FFB347",b:"#FF6F91",bg:"#3A1A2A",nm:"Coffre du matin"},
    soir:{img:"soir",open:"soir",a:"#8C7CFF",b:"#3FD0FF",bg:"#0E1033",nm:"Coffre du soir"},
    legendaire:{img:"legendaire",open:"legendaire",a:"#FF6FD8",b:"#FFD84D",bg:"#2A0B2E",nm:"Coffre légendaire"},
    quete:{img:"quete",open:"quete",a:"#3DDC97",b:"#1CB0F6",bg:"#08261E",nm:"Coffre de quête"}};
  let FX=null;
  window.arcChestFX=function(kind,o){
    o=o||{}; const t=THEMES[kind]||THEMES.coffre;
    if(FX)FX.remove();
    const reduit=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const parts=Array.from({length:kind==="legendaire"?34:24},(_,k)=>{ const a=(k/(kind==="legendaire"?34:24))*Math.PI*2+Math.random()*.3,
      d=110+Math.random()*120, gem=k%3===0; return `<i class="${gem?"g":"s"}" style="--x:${Math.round(Math.cos(a)*d)}px;--y:${Math.round(Math.sin(a)*d-40)}px;--r:${Math.round(Math.random()*540-270)}deg;--d:${(Math.random()*.25).toFixed(2)}s">${gem?ico("gem",22):""}</i>`; }).join("");
    const rew=(o.lines||[]).map(l=>`<div class="rw">${l}</div>`).join("");
    const d=document.createElement("div");
    d.className="arc-fx"+(reduit?" fast":""); d.setAttribute("role","dialog"); d.setAttribute("aria-label",o.title||t.nm);
    d.style.cssText=`--a:${t.a};--b:${t.b};--bg:${t.bg}`;
    d.innerHTML=`<div class="bgl"></div>${kind==="soir"?`<div class="stars">${Array.from({length:26},()=>`<b style="left:${Math.random()*100}%;top:${Math.random()*70}%;animation-delay:${(Math.random()*2).toFixed(2)}s"></b>`).join("")}</div>`:""}
      <div class="stage"><div class="rays"></div><div class="halo"></div>
        <div class="box">${aimg(t.img,170,"closed")}${aimg(t.open,170,"opened")}</div>
        <div class="beam"></div><div class="flash"></div><div class="parts">${parts}</div></div>
      <div class="card"><div class="k">${esc(t.nm)}</div><div class="ttl">${esc(o.title||"Coffre ouvert !")}</div>${rew}
        <button class="btn gold" type="button">Récupérer</button></div>
      <div class="skip">Touche pour passer</div>`;
    document.body.appendChild(d); FX=d;
    sfx("click"); buzz&&buzz(15);
    const T=[setTimeout(()=>{ buzz&&buzz(25); },900),setTimeout(()=>{ d.classList.add("open"); sfx("complete"); buzz&&buzz([40,30,60]);
        try{ confetti(kind==="legendaire"?120:70,[t.a,t.b,"#fff"]); }catch(e){} },reduit?200:1650),
      setTimeout(()=>{ d.classList.add("done"); count(); },reduit?400:2350)];
    function count(){ d.querySelectorAll("[data-n]").forEach(el=>{ const n=+el.dataset.n, t0=performance.now();
      const st=now=>{ const p=Math.min(1,(now-t0)/700); el.textContent="+"+Math.round(n*(1-Math.pow(1-p,3))); if(p<1)requestAnimationFrame(st); }; requestAnimationFrame(st); }); }
    const close=()=>{ T.forEach(clearTimeout); d.classList.add("out"); setTimeout(()=>{ d.remove(); if(FX===d)FX=null; if(o.onDone)o.onDone(); },260); };
    d.addEventListener("click",e=>{
      if(e.target.closest(".btn")){ close(); return; }
      if(!d.classList.contains("done")){ T.forEach(clearTimeout); d.classList.add("open","done"); count(); }
    });
  };
  const gemLine=n=>`${ico("gem",22)} <b data-n="${n}">+${n}</b> gemmes`;
  const QFX=[];
  function playQ(){ const q=QFX.shift(); if(!q)return;
    arcChestFX("quete",{title:"Quête terminée !",lines:[esc(q.t),gemLine(q.n)],onDone:()=>{ if(QFX.length)setTimeout(playQ,300); }}); }

  /* ---------------- 7 decies. SERIE JUSTE ----------------
     1. La serie affichee retombe a 0 des qu un jour est vraiment manque
        (avant, l ancien chiffre restait affiche jusqu a la lecon suivante).
     2. Un gel de serie qui sauve un jour manque est note et montre dans la
        semaine (flocon), pour que « 2 jours » ne surprenne plus.          */
  function streakFix(){
    if(typeof S==="undefined"||!S||!S.lastDay)return;
    const d=dayDiff(S.lastDay,today());
    if(d>2||(d===2&&!(S.freezes>0))){ if(S.streak){ S.streak=0; save(); } }
    Object.keys(S.courses||{}).forEach(k=>{ const c=S.courses[k]; if(!c||!c.lastDay)return;
      const e=dayDiff(c.lastDay,today()); if((e>2||(e===2&&!(S.freezes>0)))&&c.streak)c.streak=0; });
  }
  const gelDays=()=>{ if(!Array.isArray(S.gelDays))S.gelDays=[]; return S.gelDays; };

  /* ---------------- 8. BRANCHEMENTS ---------------- */
  function boot(){
    document.body.classList.add("arcade");
    if(!document.getElementById("sc-game")){
      const ref=document.getElementById("sc-lesson");
      if(ref)ref.insertAdjacentHTML("afterend",`<section class="screen" id="sc-game"><div class="scroll" id="gamebody"></div></section>`);
    }
    if(!document.getElementById("sc-intro")){
      const ref=document.getElementById("sc-lesson");
      if(ref)ref.insertAdjacentHTML("afterend",`<section class="screen" id="sc-intro" aria-label="Leçon avant le quiz">
        <div class="arc-ihead"><button class="lquit" type="button" onclick="arcIntroQuit()" aria-label="Fermer la leçon">${ico("cross",24,"var(--dim)")}</button>
          <div class="ttl" id="intro-ttl"></div><button class="arc-skip" type="button" onclick="arcIntroGo()">Passer</button></div>
        <div class="arc-ibody" id="introbody"></div>
        <div class="arc-ifoot"><button class="btn" type="button" onclick="arcIntroGo()">J'ai compris, au quiz</button>
          <button class="arc-mini" type="button" style="justify-content:center" onclick="arcIntroAll()">${ico("lecon",16)} Toute la leçon du module</button></div></section>`);
    }
    arcIcons();
    try{ applyCats(); }catch(e){}
    if(typeof renderCourses==="function"){ const __rc=renderCourses; window.renderCourses=function(){
      applyCats(); if(ORG){ orgPaint(); return; }
      __rc.apply(null,arguments);
      const b=document.getElementById("coursesbody");
      if(b){ b.insertAdjacentHTML("afterbegin",`<button class="btn ghost" type="button" style="margin:4px 0 6px" onclick="arcOrg(true)">${ico("pencil",16)} Organiser mes catégories</button>`);
        b.querySelectorAll(".cattile").forEach(t=>{ const m=/openCat\('([^']*)'\)/.exec(t.getAttribute("onclick")||""), k=m&&allCats().find(x=>x.id===m[1]), ci=t.querySelector(".ci");
          if(k&&ci){ ci.style.background="none"; ci.innerHTML=catIcon(k,44); } });
        const hd=b.querySelector(".cathead .ci"), ko=allCats().find(x=>x.id===S.catOpen); if(hd&&ko){ hd.style.background="none"; hd.innerHTML=catIcon(ko,40); }
        b.querySelectorAll(".courseline").forEach(r=>{ const m=/setCourse\('([^']+)'\)/.exec(r.innerHTML), cf=r.querySelector(".cf"); if(m&&cf){ cf.style.background="none"; cf.innerHTML=glassBadge(m[1],40); } }); }
    }; }
    if(typeof renderNav==="function"){ const __rn=renderNav; window.renderNav=function(){ __rn.apply(null,arguments); arcNav(); }; }
    window.moreTabs=arcMoreTabs;
    arcTop(); arcTabs();

    const __show=show;
    window.show=function(id){ __show.apply(null,arguments); document.body.classList.toggle("arc-focus",id==="lesson"||id==="game"||id==="intro"); };
    const __setTab=setTab;
    window.setTab=function(t){ if(G){ stop(); G=null; } INTRO=null; TAB=t; const r=__setTab.apply(null,arguments);
      const m=document.getElementById("arc-more"); if(m)m.classList.toggle("on",navSplit().reste.some(x=>x.id===t));
      return r; };
    const __og=openGuide;
    window.openGuide=function(uid){ __og.apply(null,arguments); try{ arcGuide(uid); }catch(e){ if(window.console)console.error("guide arcade",e); } };
    const __refresh=refreshTop;
    window.refreshTop=function(){ try{ streakFix(); }catch(e){} __refresh.apply(null,arguments); arcTopFill(); };

    const __rp=renderPath;
    window.renderPath=function(){
      try{ applyCats(); }catch(e){}
      __rp.apply(null,arguments);
      const b=document.getElementById("pathbody"); if(!b)return;
      const fam=b.querySelector(":scope > .chipline"); if(fam)fam.remove();
      [...b.children].forEach(d=>{ if(d.querySelector&&d.querySelector('[onclick^="setCourse"]'))d.remove(); });
      const v=pathView(), first=b.querySelector(".unitbar");
      /* le test de niveau ou le niveau evalue passent juste sous la serie */
      const pre=[]; for(const n of [...b.children]){ if(n===first)break; pre.push(n); }
      b.insertAdjacentHTML("afterbegin",`<div class="arc-home">${homeHTML()}</div>`);
      const st=b.querySelector(".arc-streak"); if(st)pre.slice().reverse().forEach(n=>st.after(n));
      const tmp=document.createElement("div"); tmp.innerHTML=pathHead(v);
      if(first)b.insertBefore(tmp.firstElementChild,first); else b.appendChild(tmp.firstElementChild);
      if(v==="cards"){ b.querySelectorAll(".unitbar,.pathnodes").forEach(n=>n.remove()); b.insertAdjacentHTML("beforeend",cardsHTML()); }
      else snakeDress(b);
    };
    const __oc=openChest;
    window.openChest=function(k){ const g0=S.gems; __oc.apply(null,arguments); const n=S.gems-g0; closeModal();
      arcChestFX("coffre",{title:"Coffre ouvert !",lines:[gemLine(n)],onDone:()=>{ renderPath(); refreshTop(); }}); };
    if(typeof chestMoment==="function"){ const __cm=chestMoment; window.chestMoment=function(){ const r=__cm.apply(null,arguments);
      if(!r)return r; const k=/matin/.test(r)?"matin":"soir";
      setTimeout(()=>arcChestFX(k,{title:k==="matin"?"Coffre du matin ouvert !":"Coffre du soir ouvert !",
        lines:[gemLine(15),`${aimg(k==="matin"?"potion2":"potion15",30)} Une potion ${k==="matin"?"x2":"x1,5"} offerte`]}),900);
      return ""; }; }
    if(typeof qprog==="function"){ const __qp=qprog; window.qprog=function(){ const avant=((S.quests||{}).list||[]).map(q=>q.done);
      const r=__qp.apply(null,arguments);
      ((S.quests||{}).list||[]).forEach((q,i)=>{ if(q.done&&!avant[i])QFX.push({n:q.r,t:q.n}); });
      if(QFX.length&&!document.body.classList.contains("arc-focus"))playQ();
      return r; }; }
    if(typeof touchDay==="function"){ const __td=touchDay; window.touchDay=function(){ const avant=S.lastDay; const ev=__td.apply(null,arguments);
      if(ev==="freeze"&&avant){ const p=avant.split("-").map(Number); gelDays().push(fmtDay(new Date(p[0],p[1]-1,p[2]+1))); save(); }
      return ev; }; }
    window.badgeSVG=glassBadge;
    streakFix();

    const __rq=renderQ;
    window.renderQ=function(ex){ __rq.apply(null,arguments); if(ex&&ex.t==="num")arcPad(); };
    const __nq=nextQ;
    window.nextQ=function(){ if(L&&!L.t0)L.t0=Date.now(); return __nq.apply(null,arguments); };
    const __dc=doCheck;
    window.doCheck=function(){ __dc.apply(null,arguments); try{ arcVerdict(); }catch(e){} };
    const __fin=finish;
    window.finish=function(){
      const snap=L?{t0:L.t0,ok:L.ok,wrong:L.wrong,max:L.maxCombo}:null, xp0=S.xp, st0=S.streak;
      __fin.apply(null,arguments);
      if(snap)try{ arcDone(snap,S.xp-xp0,S.streak!==st0); }catch(e){}
      if(QFX.length)setTimeout(playQ,1400);
    };

    const __rl=renderLeague;
    window.renderLeague=function(){
      __rl.apply(null,arguments);
      const b=document.getElementById("leaguebody"); if(!b)return;
      const t=b.querySelector(".trophies");
      if(t&&!t.dataset.arc){ t.dataset.arc="1"; t.className="arc-cups";
        t.innerHTML=LEAGUES.map((l,i)=>`<div class="cup ${i<=S.league.tier?"on":""} ${i===S.league.tier?"cur":""}" title="${esc(l.n)}">${trophySVG(i,i===S.league.tier?56:40,l.n)}<i></i></div>`).join("");
        const hd=t.previousElementSibling; if(hd&&hd.firstElementChild)hd.firstElementChild.remove(); if(hd)hd.parentNode.insertBefore(t,hd);
      }
      const big=b.querySelector('div[style*="font-size:56px"]'); if(big&&!big.dataset.arc){ big.dataset.arc="1"; big.style.fontSize="0"; big.innerHTML=trophySVG(S.league.tier,88,LEAGUES[S.league.tier].n); }
      b.querySelectorAll(".zone").forEach(z=>{ if(z.dataset.arc)return; z.dataset.arc="1";
        const dn=z.classList.contains("dn"), mid=/Maintien/.test(z.textContent);
        if(!mid)z.innerHTML=ico(dn?"arrowdown":"arrowup",16)+" "+esc(z.textContent)+" "+ico(dn?"arrowdown":"arrowup",16); });
      if(!b.querySelector(".arc-nudge")){
        const rows=leagueRows(), me=rows.findIndex(r=>r.me), rv=me>0?rows[me-1]:null, z=b.querySelector(".zone");
        const gap=rv?Math.max(1,rv.x-rows[me].x+1):0;
        const pot=boostOn()?`<div class="arc-card arc-nudge" onclick="setTab('shop')">${aimg("potion2",46)}<span class="t">Potion active : encore <b>${boostLeft()}</b>. Chaque XP compte double ou plus.</span></div>`
          :rv?`<div class="arc-card arc-nudge" onclick="${(inv().p2||0)>0?"drinkPotion('p2');renderLeague()":"setTab('shop')"}">${aimg("potion2",46)}<span class="t">Double tes XP pendant 15 min pour rattraper <b>${esc(rv.n)}</b> (${gap} XP d'écart).</span><span class="p">${(inv().p2||0)>0?"BOIRE":ico("gem",16)+" 100"}</span></div>`:"";
        const duel=rv?`<div class="arc-card arc-nudge" onclick="arcGame('duel')">${ico("trophy",38,"var(--gold)")}<span class="t">Défie <b>${esc(rv.n)}</b> en duel : 7 questions, 10 gemmes au gagnant.</span><span class="p" style="color:var(--gold)">DUEL</span></div>`:"";
        if(z)z.insertAdjacentHTML("beforebegin",pot+duel);
      }
    };

    const __rs=renderShop;
    window.renderShop=function(){
      __rs.apply(null,arguments);
      const K=["potion15","potion2","potion3","matin","soir","gel",null,"coffre"];
      document.querySelectorAll("#shopbody .shopit .si").forEach((s,i)=>{ if(K[i])s.innerHTML=aimg(K[i],84); });
    };

    const __rqu=renderQuests;
    window.renderQuests=function(){
      __rqu.apply(null,arguments);
      document.querySelectorAll("#questsbody .quest").forEach((q,i)=>{ const ic=q.querySelector(".qi"); if(!ic)return;
        const done=/100%/.test((q.querySelector(".qbar>div")||{style:{}}).style.width||"");
        ic.innerHTML=aimg(done?"ouvert":i%2?"quete":"coffre",56); });
      const b=document.getElementById("questsbody");
      if(b&&!b.querySelector(".arc-daily"))b.insertAdjacentHTML("beforeend",`<div class="arc-daily"><div class="arc-sec"><span>Ma journée</span></div>
        ${play("#1E9E6A","#157650","habitudes","Mes habitudes",(S.habits||[]).length+" habitude"+((S.habits||[]).length>1?"s":"")+" à cocher","Voir","setTab('habits')")}
        ${play("#3F6FD8","#2A50A8","missions","Missions","Tes tâches du jour, rangées par l'IA","Voir","setTab('tasks')")}</div>`);
    };

    const __rr=renderReview;
    window.renderReview=function(){
      __rr.apply(null,arguments);
      const b=document.getElementById("reviewbody"); if(!b||b.querySelector(".arc-games"))return;
      b.insertAdjacentHTML("afterbegin",`<div class="arc-sec" style="margin-top:4px"><span>Jeux · ${esc(cName())}</span></div>${gamesHTML()}`);
      arcAcc(b,"review");
    };

    const __rpf=renderProfile;
    window.renderProfile=function(){
      __rpf.apply(null,arguments);
      const pb=document.querySelector("#profilebody .pbanner"); if(!pb||document.querySelector("#profilebody .arc-goalcard"))return;
      const c=COURSES.find(x=>x.id===S.active), p=coursePct(S.active);
      pb.insertAdjacentHTML("afterend",`<div class="arc-card arc-goalcard"><div style="flex:1"><b>Finis le cours ${esc(c?c.short:"")} pour décrocher sa couronne de maître</b><span>${p} % du cours accompli</span></div>${masc("content","","width:74px;height:74px")}</div>`);
      arcAcc(document.getElementById("profilebody"),"profile");
    };

    if(typeof S!=="undefined"&&S){ refreshTop(); if(document.getElementById("sc-path").classList.contains("on"))renderPath(); }
    /* l ancien design ne doit plus apparaitre au lancement : la page reste
       masquee (voir le bloc DESIGN:ARCADE:TETE) jusqu ici */
    document.documentElement.classList.remove("arc-wait");
  }
  try{ boot(); }catch(e){ document.documentElement.classList.remove("arc-wait"); if(window.console)console.error("design arcade",e); }
})();
