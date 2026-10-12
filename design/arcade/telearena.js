/* =====================================================================
   TELECOMMANDE, QUIZ A PLUSIEURS (demande du 12/10/2026)
   Comme Kahoot : la télé affiche la question, chaque téléphone est une
   manette de quatre gros boutons. Désactivé par défaut. On choisit le
   nombre de joueurs dans la fenêtre de la télécommande (1 = solo, rien
   ne change). Quand tout le monde est là, un compte à rebours lance la
   partie. Questions tirées de ce que le cours actuel a déjà fait étudier
   (mêmes règles que les jeux). La partie ne touche ni l'XP ni les
   gemmes de personne : c'est un jeu de salon.
   ===================================================================== */
(function(){
  "use strict";
  const T=window.__tele; if(!T||!window.__teleQ||window.__teleA)return;
  const {hooks,H,P,$id,esc,clamp,pSend}=T;
  const PAL=["#E5484D","#1CB0F6","#F5B800","#3FB950","#9B51E0","#FF8A00","#E6559A","#18B8A8"];
  const cfg={count:5,rev:6,nq:10,tq:20,pool:null};
  const M={on:false,n:1,tq:20,ph:"off",pl:{},ord:[],qs:[],qi:0,q:null,t0:0,tm:null,cd:0,ans:{}};
  const sfxs=k=>{ try{ if(typeof sfx==="function")sfx(k); }catch(e){} };
  const shuffle=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const names=()=>M.ord.map(id=>M.pl[id]);

  /* ---------------- questions ---------------- */
  function pickQuestions(){
    let list=[]; try{ list=cfg.pool?cfg.pool():(window.arcPool&&window.arcChoix?window.arcPool(window.arcChoix):[]); }catch(e){ list=[]; }
    const out=[];
    shuffle(list).forEach(e=>{
      if(out.length>=cfg.nq)return;
      const q=String(e.q||"").trim(); if(!q)return;
      if(e.t==="tf"){ out.push({q,o:["Vrai","Faux"],a:e.a?0:1,w:e.w||"",c:[3,0]}); return; }
      const idx=shuffle(e.o.map((_,k)=>k)).slice(0,4); if(!idx.includes(e.a))idx[idx.length-1]=e.a;
      const o=shuffle(idx); out.push({q,o:o.map(k=>e.o[k]),a:o.indexOf(e.a),w:e.w||"",c:null}); });
    return out; }

  /* ---------------- machine a etats (cote PC) ---------------- */
  const tvq=()=>M.q&&M.ph==="q";
  function stopTimers(){ clearInterval(M.tm); M.tm=null; }
  function lobbyCheck(){
    if(M.ph!=="lobby")return;
    if(M.ord.length>=M.n&&M.ord.length>=2){ if(M.ph==="lobby"){ M.ph="count"; M.cd=cfg.count; tick(); } } }
  function tick(){
    stopTimers(); paint();
    M.tm=setInterval(()=>{
      if(M.ph==="count"){ M.cd--; if(M.cd<=0){ nextQ(); return; } paint(); }
      else if(M.ph==="q"){ const left=M.q.t*1000-(Date.now()-M.t0); if(left<=0){ reveal(); return; } bar(left); }
      else if(M.ph==="rev"){ M.cd--; if(M.cd<=0){ nextQ(); return; } paint(); }
    },M.ph==="q"?200:1000); }
  function nextQ(){
    stopTimers();
    if(M.qi>=M.qs.length){ M.ph="end"; sfxs("complete"); paint(); tickPush(); return; }
    M.q=Object.assign({},M.qs[M.qi],{t:M.tq,i:M.qi}); M.ans={}; M.ph="q"; M.t0=Date.now(); paint(); tick(); }
  function reveal(){
    if(M.ph!=="q")return; stopTimers(); M.ph="rev"; M.cd=cfg.rev;
    const T0=M.q.t*1000, good={};
    M.ord.forEach(id=>{ const a=M.ans[id], p=M.pl[id]; const ok=!!a&&a.i===M.q.a;
      const gain=ok?Math.round(1000-500*clamp(a.ms/T0,0,1)):0; p.streak=ok?(p.streak||0)+1:0; p.score+=gain; p.last={ok,gain,none:!a}; good[id]=ok; });
    const rk=M.ord.slice().sort((a,b)=>M.pl[b].score-M.pl[a].score); rk.forEach((id,i)=>{ M.pl[id].rank=i+1; });
    M.qi++; sfxs(Object.values(good).some(Boolean)?"correct":"wrong"); paint(); tick(); }
  function startLobby(n){
    stopTimers(); M.on=true; M.n=n; M.tq=cfg.tq; M.ph="lobby"; M.pl={}; M.ord=[]; M.qi=0; M.q=null; M.ans={};
    M.qs=pickQuestions();
    if(M.qs.length<Math.min(4,cfg.nq)){ M.ph="none"; }
    ensureDom(); paint(); try{ closeModal(); }catch(e){} }
  function stopAll(){ stopTimers(); M.on=false; M.ph="off"; const a=$id("tele-arena"); if(a)a.remove(); document.body.classList.remove("tele-arena"); }

  /* ---------------- messages des telephones ---------------- */
  hooks.msg=(function(base){ return function(m){
    if(M.on){
      if(m.t==="join"){ const id=String(m.pid||"").slice(0,6); if(!id)return;
        const nm=String(m.name||"").replace(/[<>]/g,"").trim().slice(0,14)||("Joueur "+(M.ord.length+1));
        if(M.pl[id]){ M.pl[id].name=nm; }
        else if(M.ord.length<8&&(M.ph==="lobby"||M.ph==="count")){ M.pl[id]={id,name:nm,score:0,streak:0,rank:0,last:null}; M.ord.push(id); sfxs("click"); }
        paint(); lobbyCheck(); return; }
      if(m.t==="ans"){ const id=String(m.pid||""); if(M.ph!=="q"||!M.pl[id]||M.ans[id])return;
        const i=+m.i; if(!(i>=0&&i<M.q.o.length))return; M.ans[id]={i,ms:Date.now()-M.t0}; paint();
        if(M.ord.every(x=>M.ans[x]))reveal(); return; }
      if(m.t==="go"){ if(M.ph==="lobby"&&M.ord.length>=1){ M.ph="count"; M.cd=Math.min(cfg.count,3); tick(); } else if(M.ph==="rev"){ nextQ(); } else if(M.ph==="end"){ startLobby(M.n); } return; }
      if(m.t==="stop"){ stopAll(); return; }
      return; }
    base(m); }; })(hooks.msg);

  /* ---------------- ecran de la tele ---------------- */
  function ensureDom(){
    if($id("tele-arena"))return;
    const a=document.createElement("div"); a.id="tele-arena"; document.body.appendChild(a); document.body.classList.add("tele-arena");
    a.addEventListener("click",e=>{ const b=e.target.closest("[data-ta]"); if(!b)return; const k=b.dataset.ta;
      if(k==="stop")stopAll(); else if(k==="go")hooks.msg({r:"p",t:"go"}); }); }
  function podium(){
    const rk=M.ord.slice().sort((a,b)=>M.pl[b].score-M.pl[a].score);
    return `<div class="ta-pod">${rk.slice(0,3).map((id,i)=>`<div class="ta-p p${i+1}"><b>${esc(M.pl[id].name)}</b><span>${M.pl[id].score} pts</span><i>${i+1}</i></div>`).join("")}</div>
      <ol class="ta-rest">${rk.slice(3).map((id,i)=>`<li><b>${i+4}</b>${esc(M.pl[id].name)}<span>${M.pl[id].score}</span></li>`).join("")}</ol>`; }
  function board(){
    const rk=M.ord.slice().sort((a,b)=>M.pl[b].score-M.pl[a].score).slice(0,5);
    return `<ol class="ta-board">${rk.map((id,i)=>{ const p=M.pl[id]; return `<li class="${p.last&&p.last.ok?"ok":""}"><b>${i+1}</b><span>${esc(p.name)}</span><em>${p.last&&p.last.gain?"+"+p.last.gain:""}</em><strong>${p.score}</strong></li>`; }).join("")}</ol>`; }
  function bar(left){ const f=$id("ta-bar"), n=$id("ta-sec"); if(f)f.style.width=Math.max(0,100*left/(M.q.t*1000))+"%"; if(n)n.textContent=Math.ceil(left/1000); }
  const stop='<button type="button" class="ta-stop" data-ta="stop">Arrêter la partie</button>';
  function paint(){
    const a=$id("tele-arena"); if(!a)return;
    const code=H.code||"", url=location.origin+location.pathname+"?tele="+code;
    if(M.ph==="none"){ a.innerHTML=`${stop}<div class="ta-mid"><h1>Pas assez de questions</h1><p>Le quiz à plusieurs pioche dans ce que ton cours actuel t'a déjà fait étudier. Fais d'abord quelques leçons, puis reviens.</p></div>`; return; }
    if(M.ph==="lobby"||M.ph==="count"){
      a.innerHTML=`${stop}<div class="ta-lobby"><div class="ta-l"><h1>Quiz à plusieurs</h1>
        <p>Sur ton téléphone : Learno, Plus, Télécommande, puis entre le code ou scanne le QR code.</p>
        <div class="ta-code">${esc(code)}</div>${T.qrSvg?T.qrSvg(url,200):""}</div>
        <div class="ta-r"><h2>${M.ord.length} / ${M.n} joueur${M.n>1?"s":""}</h2>
        <div class="ta-chips">${names().map((p,i)=>`<span style="--c:${PAL[i%8]}">${esc(p.name)}</span>`).join("")||"<em>En attente des téléphones...</em>"}</div>
        ${M.ph==="count"?`<div class="ta-count">${M.cd}</div><p>La partie commence...</p>`:(M.ord.length>=1?`<button type="button" class="btn" data-ta="go">Lancer maintenant</button>`:"")}</div></div>`; return; }
    if(M.ph==="q"||M.ph==="rev"){
      const q=M.q, rev=M.ph==="rev", cnt=q.o.map((_,i)=>M.ord.filter(id=>M.ans[id]&&M.ans[id].i===i).length);
      const done=M.ord.filter(id=>M.ans[id]).length;
      a.innerHTML=`${stop}<div class="ta-top"><span>Question ${q.i+1} / ${M.qs.length}</span><span class="ta-sec" id="ta-sec">${rev?"":q.t}</span></div>
        <div class="ta-barw"><i id="ta-bar" style="width:${rev?0:100}%"></i></div>
        <div class="ta-q">${esc(q.q)}</div>
        <div class="ta-opts n${q.o.length}">${q.o.map((o,i)=>`<div class="ta-o ${rev?(i===q.a?"ok":"no"):""}" style="--c:${PAL[q.c?q.c[i]:i]}"><b>${q.c?"":String.fromCharCode(65+i)}</b><span>${esc(o)}</span>${rev?`<em>${cnt[i]}</em>`:""}</div>`).join("")}</div>
        ${rev?`<div class="ta-foot">${board()}${q.w?`<p class="ta-why">${esc(q.w).slice(0,220)}</p>`:""}</div>`:`<div class="ta-foot"><p class="ta-wait">${done} / ${M.ord.length} ont répondu</p></div>`}`;
      if(!rev)bar(Math.max(0,q.t*1000-(Date.now()-M.t0))); return; }
    if(M.ph==="end"){ a.innerHTML=`${stop}<div class="ta-mid"><h1>Classement final</h1>${podium()}<button type="button" class="btn" data-ta="go">Rejouer</button></div>`; } }
  function tickPush(){ /* l'etat part au telephone par le sondage habituel */ }

  /* ---------------- ce que voit chaque telephone ---------------- */
  hooks.spec=(function(base){ return function(){
    if(!M.on)return base();
    document.body.classList.remove("tele-tv");
    const pls=M.ord.map(id=>[id,M.pl[id].name]);
    if(M.ph==="none")return {k:"ax",t:"Pas assez de questions étudiées pour jouer à plusieurs."};
    if(M.ph==="lobby"||M.ph==="count")return {k:"al",n:M.n,p:pls,cd:M.ph==="count"?M.cd:0};
    if(M.ph==="q")return {k:"aq",i:M.q.i,o:M.q.o.map((o,i)=>[M.q.c?o:String.fromCharCode(65+i),M.q.c?"":(o.length<=16?o:"")]),c:M.q.c,a:M.ord.filter(id=>M.ans[id]),nn:M.ord.length};
    if(M.ph==="rev"){ const r={}; M.ord.forEach(id=>{ const p=M.pl[id]; r[id]=[p.last&&p.last.ok?1:0,p.last?p.last.gain:0,p.score,p.rank,p.last&&p.last.none?1:0]; }); return {k:"ar",i:M.q.i,r,a:M.q.a,nn:M.ord.length}; }
    if(M.ph==="end"){ const r={}; M.ord.forEach(id=>{ r[id]=[M.pl[id].score,M.ord.slice().sort((a,b)=>M.pl[b].score-M.pl[a].score).indexOf(id)+1]; }); return {k:"ae",r,nn:M.ord.length}; }
    return null; }; })(hooks.spec);
  hooks.stop=(function(base){ return function(){ if(M.on)stopAll(); if(base)base(); }; })(hooks.stop);

  /* ---------------- telephone : vues ---------------- */
  const K={key:"",name:"",lock:0};
  const myName=()=>{ let v=""; try{ v=localStorage.getItem("learno_tele_name")||""; }catch(e){} return v; };
  const rankTxt=r=>r===1?"1er":r+"e";
  function view(q){
    const me=P.pid;
    switch(q.k){
      case "ax": return `<div class="rq-res nt"><b>${esc(q.t)}</b></div>`;
      case "al": { const joined=q.p.some(x=>x[0]===me);
        if(!joined)return `<div class="ra-join"><b>Quiz à plusieurs</b><p>Choisis ton prénom pour rejoindre la partie.</p><input id="ra-name" maxlength="14" autocomplete="off" placeholder="Ton prénom" value="${esc(myName())}"><button type="button" class="rq-go" data-a="join">Rejoindre</button></div>`;
        return `<div class="ra-join"><b>Tu es dans la partie</b><p>${q.cd?"Départ dans "+q.cd+"...":"En attente des autres joueurs ("+q.p.length+" / "+q.n+")"}</p><div class="ra-list">${q.p.map(x=>`<span class="${x[0]===me?"me":""}">${esc(x[1])}</span>`).join("")}</div>${q.cd||q.p.length<1?"":`<button type="button" class="rq-go" data-a="go">Lancer maintenant</button>`}</div>`; }
      case "aq": { const did=q.a.includes(me); if(did)return `<div class="rq-res nt"><b>Réponse envoyée</b><em>${q.a.length} / ${q.nn}</em></div>`;
        return `<div class="rq-grid n${Math.min(q.o.length,8)}">${q.o.map((x,i)=>`<button type="button" class="rq-c" style="--c:${PAL[q.c?q.c[i]:i]}" data-a="ans" data-i="${i}"><b>${esc(x[0])}</b>${x[1]?`<small>${esc(x[1])}</small>`:""}</button>`).join("")}</div>`; }
      case "ar": { const r=q.r[me]; if(!r)return `<div class="rq-res nt"><b>Regarde la télé</b></div>`;
        const c=r[4]?"nt":(r[0]?"ok":"ko");
        return `<button type="button" class="rq-res ${c}" data-a="next"><b>${r[4]?"Trop tard":(r[0]?"Bonne réponse":"Raté")}</b>${r[1]?`<span class="ra-gain">+${r[1]}</span>`:""}<em>${r[2]} pts, ${rankTxt(r[3])} sur ${q.nn}</em></button>`; }
      case "ae": { const r=q.r[me]; return `<div class="ra-join"><b>Partie terminée</b><p>${r?rankTxt(r[1])+" sur "+q.nn+" avec "+r[0]+" points":"Merci d'avoir regardé"}</p><button type="button" class="rq-go" data-a="go">Rejouer</button></div>`; }
    }
    return ""; }
  hooks.render=(function(base){ return function(){
    const root=$id("tele-rc"), box=$id("rc-q"), fr=$id("rc-free"); if(!root||!box){ base(); return; }
    const q=(P.st||{}).q;
    if(!(q&&typeof q.k==="string"&&q.k.charAt(0)==="a"&&q.k.length===2)){ if(K.key){ K.key=""; box.innerHTML=""; } base(); return; }
    if(fr){ fr.hidden=false; fr.textContent=P.free?"Quiz":"Curseur"; }
    root.classList.toggle("quiz",!P.free);
    if(P.free){ if(K.key){ K.key=""; box.innerHTML=""; } return; }
    /* la vue ne se reconstruit que si elle change pour CE joueur : un toucher en cours ne doit jamais etre perdu */
    const joined=q.k==="al"&&q.p.some(x=>x[0]===P.pid);
    const key=q.k==="aq"?JSON.stringify([q.k,q.i,q.o,q.c,q.a.includes(P.pid)]):(q.k==="al"&&!joined?"al|"+q.n:JSON.stringify(q));
    if(key!==K.key){
      const had=($id("ra-name")||{}).value; K.key=key; box.innerHTML=view(q); box.dataset.k=q.k; K.lock=0;
      const inp=$id("ra-name"); if(inp&&had!=null)inp.value=had;
      if(q.k==="ar"){ const r=q.r[P.pid]; try{ if(navigator.vibrate)navigator.vibrate(r&&r[0]?[30]:[60,40,60]); }catch(e){} }
    } }; })(hooks.render);
  (function(){ const box=()=>$id("rc-q");
    document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("#rc-q button[data-a]"); if(!b||b.disabled)return; const a=b.dataset.a;
      if(a==="join"){ const nm=(($id("ra-name")||{}).value||"").trim(); try{ localStorage.setItem("learno_tele_name",nm); }catch(_){} pSend({t:"join",pid:P.pid,name:nm}); }
      else if(a==="ans"){ if(K.lock)return; K.lock=1; b.classList.add("sel"); box().classList.add("lock"); pSend({t:"ans",pid:P.pid,i:+b.dataset.i}); try{ if(navigator.vibrate)navigator.vibrate(14); }catch(_){} }
      else if(a==="go"||a==="next")pSend({t:"go"}); },true); })();

  /* ---------------- fenetre de la tele : choisir le nombre de joueurs ---------------- */
  hooks.hostPanel=function(){
    const slot=$id("tele-multi-slot"); if(!slot)return;
    const draw=()=>{ slot.innerHTML=`<div class="tele-multi"><div class="tm-row"><span>Joueurs</span><div class="tm-step"><button type="button" data-m="-" aria-label="Moins">-</button><b id="tm-n">${M.n}</b><button type="button" data-m="+" aria-label="Plus">+</button></div></div>
      ${M.n>1?`<div class="tm-row"><span>Temps par question</span><div class="tm-chips">${[15,20,30].map(s=>`<button type="button" data-t="${s}" class="${cfg.tq===s?"on":""}">${s} s</button>`).join("")}</div></div>
      <p class="tele-p small">Quiz à plusieurs, comme Kahoot. Les questions viennent de ce que ton cours actuel t'a déjà fait étudier. Aucun point n'est gagné ni perdu sur ton compte.</p>
      <button type="button" class="btn" data-m="open">Ouvrir le salon pour ${M.n} joueurs</button>`:`<p class="tele-p small">1 joueur : mode solo. Passe à 2 ou plus pour jouer à la Kahoot.</p>`}</div>`; };
    M.n=M.on?M.n:1; draw();
    slot.onclick=e=>{ const b=e.target.closest("button"); if(!b)return;
      if(b.dataset.m==="+"){ M.n=Math.min(8,M.n+1); draw(); } else if(b.dataset.m==="-"){ M.n=Math.max(1,M.n-1); draw(); }
      else if(b.dataset.t){ cfg.tq=+b.dataset.t; draw(); }
      else if(b.dataset.m==="open")startLobby(M.n); }; };
  window.__teleA={cfg,M,startLobby,stopAll,reveal,nextQ};
})();
