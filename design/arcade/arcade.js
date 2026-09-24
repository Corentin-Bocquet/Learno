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
      h+=`<div class="d ${on?"on":""} ${i===dow?"now":""}"><span>${L7[i]}</span><span class="o">${ico("flame",18,on?"#fff":"var(--line)")}</span></div>`; }
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
  window.arcResume=function(){ const n=nextLessonExists(); if(n)startLesson(n.u,n.l); else setTab("review"); };
  function play(bg,sh,icon,t,s,tag,act){
    return `<button class="arc-play" type="button" style="background:${bg};--sh:${sh}" onclick="${act}">
      <span class="pi">${ico(icon,30,"#fff")}</span><span class="pt"><b>${t}</b><span>${s}</span></span><span class="pg">${tag}</span></button>`;
  }
  function homeHTML(){
    const cid=S.active, due=dueItems(cid,999).length, calib=typeof needsCalib==="function"&&needsCalib(cid);
    return `<div class="arc-card arc-streak"><div class="top">${ico("flame",46,"var(--orange)")}
        <div><div class="n arc-h">${S.streak} jour${S.streak>1?"s":""}</div>
        <div class="s">${S.lastDay===today()?"Série tenue aujourd'hui. Bravo.":"Fais une leçon pour tenir ta série"}</div></div></div>
        <div class="arc-week">${weekHTML()}</div></div>
      ${calib?"":resumeCard()}
      ${chestRow()}
      <div class="arc-sec"><span>Au programme</span></div>
      ${play("#9B51E0","#7A3BB5","bolt","Éclair 60 s","Paires express, combo à battre","+20 XP","arcGame('eclair')")}
      ${play("#1899D6","#10729F","target","Rappels",due?due+" notion"+(due>1?"s":"")+" à revoir avant oubli":"Rien à revoir, tout est frais","+12 XP","startPractice('review')")}
      ${play("#C7478F","#93306A","crown","Boss du module","Bats le Diable pour un coffre légendaire","Coffre","arcGame('boss')")}
      ${play("#E5484D","#B3363A","exam","Examen blanc","Facile · Moyen · Difficile","Chrono","setTab('exam')")}`;
  }
  function pathView(){ return (S.settings&&S.settings.pathView)==="snake"?"snake":"cards"; }
  window.arcView=function(v){ S.settings.pathView=v; save(); sfx("click"); renderPath(); };
  function pathHead(v){
    return `<div class="arc-sec" id="arc-parcours"><span>Parcours · ${esc(cName())}</span>
      <div class="arc-seg" role="group" aria-label="Affichage du parcours">
        <button type="button" class="${v==="cards"?"on":""}" aria-pressed="${v==="cards"}" onclick="arcView('cards')">${ico("list",15)} Modules</button>
        <button type="button" class="${v==="snake"?"on":""}" aria-pressed="${v==="snake"}" onclick="arcView('snake')">${ico("star",15)} Chemin</button></div></div>`;
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
        else if(unlocked&&firstOpen){ cls+=" now"; g=ico("star",18); act=`startLesson(${u.id},${li})`; firstOpen=false; cur=true; curLi=li; lab="Commencer la leçon "+(li+1); }
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
        <div class="f"><button class="arc-mini" type="button" onclick="openGuide(${u.id})">${ico("book",15)} Guide</button>
        ${cur?`<button class="arc-go" type="button" onclick="startLesson(${u.id},${curLi})">Commencer +10 XP</button>`:""}</div></div>`;
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
      stats:[["+"+xp,"XP","var(--gold)"],["+30","gemmes","var(--blue)"],[G.hearts+" / 3","coeurs","var(--red)"]]}); return; }
    if(G.hearts<=0||G.i+1>=G.q.length){ const xp=award(5,0); endScreen({win:false,masc:masc("fier","","width:130px;height:130px","diable"),title:"Le Diable a gagné",
      sub:"Relis le guide du module et reviens le défier. Tes erreurs sont déjà dans tes rappels.",stats:[["+"+xp,"XP","var(--gold)"],[G.hp+" PV","restants","var(--orange)"]]}); return; }
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
    const t=(bg,sh,i,n,s,k)=>`<button class="arc-gtile" type="button" style="background:${bg};--sh:${sh}" onclick="arcGame('${k}')">${ico(i,28,"#fff")}<b>${n}</b><span>${s}</span></button>`;
    return `<div class="arc-games">
      ${t("#9B51E0","#7A3BB5","bolt","Éclair 60 s","Relie les paires, bats ton record","eclair")}
      ${t("#D9731A","#A5530C","check","Vrai ou faux","Glisse les cartes à toute vitesse","vf")}
      ${t("#3F6FD8","#2A50A8","list","Frise","Remets les étapes dans l'ordre","frise")}
      ${t("#C7478F","#93306A","crown","Boss du module","Bats le Diable, gagne un coffre","boss")}
      ${t("#1E9E6A","#157650","trophy","Duel de ligue","Affronte ton rival direct","duel")}
      ${t("#E5484D","#B3363A","exam","Examen blanc","Trois niveaux, chrono","exam")}</div>`;
  }
  const __game=window.arcGame;
  window.arcGame=function(k){ if(k==="exam"){ setTab("exam"); return; } return __game(k); };

  /* ---------------- 8. BRANCHEMENTS ---------------- */
  function boot(){
    document.body.classList.add("arcade");
    if(!document.getElementById("sc-game")){
      const ref=document.getElementById("sc-lesson");
      if(ref)ref.insertAdjacentHTML("afterend",`<section class="screen" id="sc-game"><div class="scroll" id="gamebody"></div></section>`);
    }
    arcTop(); arcTabs();

    const __show=show;
    window.show=function(id){ __show.apply(null,arguments); document.body.classList.toggle("arc-focus",id==="lesson"||id==="game"); };
    const __setTab=setTab;
    window.setTab=function(t){ if(G){ stop(); G=null; } return __setTab.apply(null,arguments); };
    const __refresh=refreshTop;
    window.refreshTop=function(){ __refresh.apply(null,arguments); arcTopFill(); };

    const __rp=renderPath;
    window.renderPath=function(){
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
    window.openChest=function(k){ __oc.apply(null,arguments); const d=document.querySelector("#mcard > div"); if(d)d.innerHTML=aimg("ouvert",130); };

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
    };

    const __rl=renderLeague;
    window.renderLeague=function(){
      __rl.apply(null,arguments);
      const b=document.getElementById("leaguebody"); if(!b)return;
      const t=b.querySelector(".trophies");
      if(t&&!t.dataset.arc){ t.dataset.arc="1"; t.className="arc-cups";
        t.innerHTML=LEAGUES.map((l,i)=>`<div class="cup ${i<=S.league.tier?"on":""} ${i===S.league.tier?"cur":""}" title="${esc(l.n)}">${ico("trophy",i===S.league.tier?52:40,l.c)}<i></i></div>`).join("");
        const hd=t.previousElementSibling; if(hd&&hd.firstElementChild)hd.firstElementChild.remove(); if(hd)hd.parentNode.insertBefore(t,hd);
      }
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
        ${play("#1E9E6A","#157650","check","Mes habitudes",(S.habits||[]).length+" habitude"+((S.habits||[]).length>1?"s":"")+" à cocher","Voir","setTab('habits')")}
        ${play("#3F6FD8","#2A50A8","tasks","Missions","Tes tâches du jour, rangées par l'IA","Voir","setTab('tasks')")}</div>`);
    };

    const __rr=renderReview;
    window.renderReview=function(){
      __rr.apply(null,arguments);
      const b=document.getElementById("reviewbody"); if(!b||b.querySelector(".arc-games"))return;
      b.insertAdjacentHTML("afterbegin",`<div class="arc-sec" style="margin-top:4px"><span>Jeux · ${esc(cName())}</span></div>${gamesHTML()}`);
    };

    const __rpf=renderProfile;
    window.renderProfile=function(){
      __rpf.apply(null,arguments);
      const pb=document.querySelector("#profilebody .pbanner"); if(!pb||document.querySelector("#profilebody .arc-goalcard"))return;
      const c=COURSES.find(x=>x.id===S.active), p=coursePct(S.active);
      pb.insertAdjacentHTML("afterend",`<div class="arc-card arc-goalcard"><div style="flex:1"><b>Finis le cours ${esc(c?c.short:"")} pour décrocher sa couronne de maître</b><span>${p} % du cours accompli</span></div>${masc("content","","width:74px;height:74px")}</div>`);
    };

    if(typeof S!=="undefined"&&S){ refreshTop(); if(document.getElementById("sc-path").classList.contains("on"))renderPath(); }
  }
  try{ boot(); }catch(e){ if(window.console)console.error("design arcade",e); }
})();
