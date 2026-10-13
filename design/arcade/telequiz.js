/* =====================================================================
   TELECOMMANDE, MODE QUIZ (demande du 12/10/2026)
   Dès que la télécommande est connectée et qu'une question s'affiche,
   la télé montre la question en grand et le téléphone ne montre que de
   gros boutons adaptés au format (comme une manette de Kahoot) :
   QCM et vrai ou faux en gros boutons de couleur, calcul au pavé numérique,
   curseur, phrase à reconstituer, paires, classement, remise en ordre.
   Aucun exercice n'est réécrit : le PC lit la question affichée et
   rejoue les gestes du joueur sur le vrai moteur.
   Les formats visuels (plateau, courbe, main de poker...) gardent la
   télécommande classique, avec le bouton Curseur pour y revenir à tout moment.
   ===================================================================== */
(function(){
  "use strict";
  const T=window.__tele; if(!T||window.__teleQ)return;
  const {hooks,H,P,$id,esc,clamp,pSend}=T;
  const $q=s=>document.querySelector(s), $$q=s=>Array.from(document.querySelectorAll(s));
  const CHOICE=["tf","mcq","fill","story","cards","dames","studio","spot","color","outfit","thumb"];
  const PAL=["#E5484D","#1CB0F6","#F5B800","#3FB950","#9B51E0","#FF8A00","#E6559A","#18B8A8"];
  const txt=e=>(e&&e.textContent||"").replace(/\s+/g," ").trim();
  const vis=e=>{ if(!e)return false; const r=e.getBoundingClientRect(); if(r.width<2||r.height<2)return false; const cs=window.getComputedStyle(e); return cs.display!=="none"&&cs.visibility!=="hidden"; };
  const btn=()=>$id("btn-check");
  const ready=()=>{ const b=btn(); return !!(b&&!b.disabled); };
  const num=v=>String(v).replace(".",",");

  /* ---------------- PC : lire la question affichee ---------------- */
  function choiceEls(){ return $$q("#qwrap .choice[data-v], #qwrap .swcard[data-v], #qwrap .fitcard[data-v]:not([data-s]), #qwrap .thumbcard[data-v]"); }
  function actions(root){
    const l=$$q(root).filter(e=>!e.disabled&&vis(e)).slice(0,3);
    return l.length?{k:"btns",list:l.map(e=>txt(e).slice(0,30)||"OK"),root}:null; }
  function actionEls(root){ return $$q(root).filter(e=>!e.disabled&&vis(e)).slice(0,3); }
  const ROOTS=["#mcard .btn","#sc-intro .arc-ifoot .btn:first-child","#qwrap .btn, #checkbar .btn"];
  function spec(){
    const m=$id("modal"); if(m&&m.classList.contains("on")&&!$q("#mcard .tele-card")&&!$q("#mcard .tele-big")){ const a=actions(ROOTS[0]); if(a)return a; }
    const sc=(document.querySelector(".screen.on")||{}).id||"";
    if(sc==="sc-intro")return actions(ROOTS[1]);
    if(sc!=="sc-lesson")return null;
    const cw=$id("calc-wrap");
    if(cw){ const use=cw.querySelector("#calc-use button");
      const cs=typeof calcState==="function"?calcState():{exp:txt($id("calc-exp")),pos:0};
      return {k:"cl",ex:cs.exp,pos:cs.pos,res:txt($id("calc-res")),use:use?txt(use).replace(/^Utiliser\s*/,"").replace(/\s*comme réponse$/,""):"",
        kb:Array.from(cw.querySelectorAll(".ckey")).map(b=>[+b.dataset.i,txt(b),/\b(fn|op|del|eq)\b/.exec(b.className)?RegExp.$1:""])}; }
    const qw=$id("qwrap");
    if(!qw||!qw.querySelector(".qkind")||typeof A==="undefined"||!A||!A.ex)return actions(ROOTS[2]);
    const ex=A.ex, t=ex.t;
    if(A.done){ const cb=$id("checkbar"); return {k:"res",ok:cb&&cb.classList.contains("good")?true:(cb&&cb.classList.contains("bad")?false:null),vt:txt($q("#verdict .vt")).slice(0,40),go:txt(btn()).slice(0,24)||"Continuer"}; }
    const rd=ready();
    if(CHOICE.includes(t)){
      const els=choiceEls(); if(!els.length)return null;
      els.forEach((e,i)=>{ for(let c=0;c<8;c++)e.classList.remove("tq-c"+c); e.classList.add("tq-c"+(t==="tf"?(e.dataset.v==="1"?3:0):i)); });
      return {k:"c",t,l:els.map((e,i)=>{ const kk=e.querySelector(".kk"), body=txt(e).replace(txt(kk),"").trim();
        const lab=t==="tf"?(e.dataset.v==="1"?"Vrai":"Faux"):(t==="spot"?body:String.fromCharCode(65+i));
        const sub=(t==="tf"||t==="spot"||!body||body.length>16||/^(color|outfit|thumb)$/.test(t))?"":body; return [lab.slice(0,16),sub]; }),c:t==="tf"?els.map(e=>e.dataset.v==="1"?3:0):null,rd}; }
    if(t==="multi"){ const els=$$q("#qwrap .mchk"); return {k:"m",l:els.map((e,i)=>String.fromCharCode(65+i)),s:els.map(e=>e.classList.contains("sel")?1:0),rd}; }
    if(t==="num"){ const i=$id("numin"); return {k:"n",v:i?i.value:"",rd,calc:typeof openCalc==="function"?1:0}; }
    if(t==="slider"){ const r=$q("#qwrap input.sld"); if(!r)return null; return {k:"s",min:+r.min,max:+r.max,step:+r.step||1,v:+r.value,pre:ex.pre||"",un:ex.un||"",rd}; }
    if(t==="tiles"||t==="eq"){ const bank=$$q('#qwrap [id^="tk"]').map(e=>({i:+e.id.slice(2),w:txt(e),u:e.classList.contains("used")?1:0}));
      return {k:"t",b:bank,s:$$q("#tgt > *").map(txt),rd,calc:t==="eq"&&typeof openCalc==="function"?1:0}; }
    if(t==="match"){ const L=$$q('#qwrap [id^="ml"]'), R=$$q('#qwrap [id^="mr"]');
      return {k:"p",L:L.map((e,i)=>({i,t:txt(e),d:e.classList.contains("good")?1:0,s:e.classList.contains("sel")?1:0})),R:R.map((e,i)=>({i,t:txt(e),d:e.classList.contains("good")?1:0})),rd}; }
    if(t==="sort"){ const rows=$$q("#qwrap .sortrow"); if(!rows.length)return null;
      return {k:"o",it:rows.map(r=>{ const b=r.querySelector(".sortbin.sel"); return {k:+r.id.slice(2),t:txt(r.querySelector(".sortit")),b:b?+b.dataset.b:-1}; }),bins:$$q("#qwrap .sortrow:first-child .sortbin").map(txt),rd}; }
    if(t==="order"){ return {k:"r",it:$$q("#olist .orow .choice").map(txt),rd}; }
    return null; }
  /* la question et toutes les reponses doivent tenir a l ecran de la tele :
     on part d un grand zoom, puis on le reduit tant que ca deborde */
  const FIT={key:"",z:1};
  function fit(){
    const qw=$id("qwrap"); if(!qw)return;
    const base=clamp((window.innerWidth||1280)/650,1.3,3);
    const key=((typeof A!=="undefined"&&A&&A.ex&&A.ex.i)||"")+"|"+(typeof A!=="undefined"&&A&&A.done?1:0)+"|"+base+"|"+(window.innerHeight||0);
    if(key!==FIT.key){ FIT.key=key; FIT.z=base; }
    let z=FIT.z; const set=v=>document.documentElement.style.setProperty("--tz",v.toFixed(3));
    set(z);
    for(let n=0;n<16&&z>0.45&&qw.scrollHeight>qw.clientHeight+2;n++){ z=z*0.94; set(z); }
    FIT.z=z; }
  hooks.spec=function(){
    let q=null; try{ q=H.on&&H.hasPhone?spec():null; }catch(e){ q=null; }
    const tv=!!(q&&q.k!=="btns");
    document.body.classList.toggle("tele-tv",tv);
    /* telecommande active : l'ecran de la tele est horizontal, on agrandit et on occupe toute la largeur */
    const on=!!(H.on&&H.hasPhone);
    document.body.classList.toggle("tele-on",on);
    if(on)document.documentElement.style.setProperty("--tzs",clamp((window.innerWidth||1280)/1100,1,1.6).toFixed(2));
    if(tv){ document.documentElement.style.setProperty("--tzc",clamp((window.innerHeight||720)/900,1,1.25).toFixed(2)); try{ fit(); }catch(e){} }
    return q; };

  /* ---------------- PC : rejouer les gestes du joueur ---------------- */
  const later=(f,ms)=>setTimeout(f,ms||0);
  const clickIf=e=>{ if(e&&typeof e.click==="function")e.click(); };
  hooks.msg=function(m){
    if(typeof A==="undefined"||!A)return;
    switch(m.t){
      case "opt": { const e=choiceEls()[+m.i]; if(!e||A.done)break; e.click(); later(()=>{ const b=btn(); if(b&&!b.disabled&&!A.done)b.click(); },70); break; }
      case "mt": clickIf($$q("#qwrap .mchk")[+m.i]); break;
      case "sld": { const r=$q("#qwrap input.sld"); if(!r||A.done)break; const mn=+r.min, mx=+r.max, st=+r.step||1;
        r.value=String(clamp(Math.round((+m.v-mn)/st)*st+mn,mn,mx)); r.dispatchEvent(new Event("input",{bubbles:true})); r.dispatchEvent(new Event("change",{bubbles:true})); break; }
      case "tile": clickIf($id("tk"+(+m.i))); break;
      case "untile": clickIf($$q("#tgt > *")[+m.i]); break;
      case "mL": clickIf($id("ml"+(+m.i))); break;
      case "mR": clickIf($id("mr"+(+m.i))); break;
      case "sort": clickIf($q('#sr'+(+m.k)+' .sortbin[data-b="'+(+m.b)+'"]')); break;
      case "ord": { const row=$$q("#olist .orow")[+m.p]; if(row){ const bs=row.querySelectorAll(".oarr button"); clickIf(bs[m.d<0?0:1]); } break; }
      case "calc": if(typeof openCalc==="function"&&!A.done)openCalc(); break;
      case "ck": clickIf($q('#calc-wrap .ckey[data-i="'+(+m.i)+'"]')); break;
      case "cset": if(typeof calcSet==="function")calcSet(+m.i); break;
      case "cmove": if(typeof calcMove==="function")calcMove(+m.d); break;
      case "calcuse": clickIf($q("#calc-use button")); break;
      case "calcclose": if(typeof closeCalc==="function")closeCalc(); break;
      case "act": { const sc=(document.querySelector(".screen.on")||{}).id||""; const m2=$id("modal"); const root=(m2&&m2.classList.contains("on"))?ROOTS[0]:(sc==="sc-intro"?ROOTS[1]:ROOTS[2]); clickIf(actionEls(root)[+m.i]); break; }
    }
  };

  /* ---------------- TELEPHONE : les gros boutons ---------------- */
  const Q={key:"",lock:0,last:null};
  const svgOk='<svg viewBox="0 0 24 24" width="96" height="96" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
  const svgKo='<svg viewBox="0 0 24 24" width="96" height="96" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="#fff" stroke-width="3.4" stroke-linecap="round" fill="none"/></svg>';
  const svgOn='<svg viewBox="0 0 24 24" width="84" height="84" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
  const send=o=>{ pSend(o); try{ if(navigator.vibrate)navigator.vibrate(12); }catch(e){} };
  const validBtn=(q,txtv)=>`<button type="button" class="rq-go" data-a="check" ${q.rd?"":"disabled"}>${esc(txtv||"Valider")}</button>`;
  function keyOf(q){ const c=Object.assign({},q); if(q.k==="s")delete c.v; if(q.k==="n")delete c.v; if(q.k==="cl"){ delete c.ex; delete c.pos; delete c.res; delete c.use; } return JSON.stringify(c); }
  const calcExp=q=>typeof calcExpHtml==="function"?calcExpHtml(q.ex||"",q.pos==null?(q.ex||"").length:q.pos):esc(q.ex||"0");
  const calcBtn=q=>q.calc?`<button type="button" class="rq-sec" data-a="calc">Calculatrice</button>`:"";
  function view(q){
    switch(q.k){
      case "c": { const n=q.l.length; return `<div class="rq-grid n${Math.min(n,8)}">${q.l.map((x,i)=>`<button type="button" class="rq-c" style="--c:${PAL[q.c?q.c[i]:i]}" data-a="opt" data-i="${i}"><b>${esc(x[0])}</b>${x[1]?`<small>${esc(x[1])}</small>`:""}</button>`).join("")}</div>`; }
      case "m": return `<div class="rq-grid n${Math.min(q.l.length,8)}">${q.l.map((x,i)=>`<button type="button" class="rq-c rq-m ${q.s[i]?"on":""}" style="--c:${PAL[i]}" data-a="mt" data-i="${i}"><b>${x}</b>${q.s[i]?svgOn.replace('width="84" height="84"','width="30" height="30"'):""}</button>`).join("")}</div>${validBtn(q)}`;
      case "n": return `<div class="rq-num"><div class="rq-disp" id="rq-disp">${esc(q.v||"")}</div><div class="rq-keys">${["7","8","9","4","5","6","1","2","3",",","0","-"].map(k=>`<button type="button" data-a="key" data-k="${k}">${k}</button>`).join("")}<button type="button" data-a="key" data-k="back" class="w">Effacer</button></div></div><div class="rq-row">${calcBtn(q)}${validBtn(q)}</div>`;
      case "s": return `<div class="rq-sld"><div class="rq-big" id="rq-sv">${esc(q.pre+num(q.v)+q.un)}</div><input type="range" id="rq-range" min="${q.min}" max="${q.max}" step="${q.step}" value="${q.v}"><div class="rq-ends"><span>${esc(q.pre+num(q.min)+q.un)}</span><span>${esc(q.pre+num(q.max)+q.un)}</span></div></div>${validBtn(q)}`;
      case "t": return `<div class="rq-built">${q.s.length?q.s.map((w,i)=>`<button type="button" class="rq-w b" data-a="untile" data-i="${i}">${esc(w)}</button>`).join(""):'<span class="rq-hint">Touche les mots dans l\'ordre</span>'}</div><div class="rq-bank">${q.b.map(b=>`<button type="button" class="rq-w ${b.u?"u":""}" data-a="tile" data-i="${b.i}" ${b.u?"disabled":""}>${esc(b.w)}</button>`).join("")}</div><div class="rq-row">${calcBtn(q)}${validBtn(q)}</div>`;
      case "p": { return `<div class="rq-pairs"><div>${q.L.map(x=>`<button type="button" class="rq-p ${x.d?"d":""} ${x.s?"s":""}" data-a="mL" data-i="${x.i}" ${x.d?"disabled":""}>${esc(x.t)}</button>`).join("")}</div><div>${q.R.map(x=>`<button type="button" class="rq-p r ${x.d?"d":""}" data-a="mR" data-i="${x.i}" ${x.d?"disabled":""}>${esc(x.t)}</button>`).join("")}</div></div>${validBtn(q)}`; }
      case "o": { const cur=Q.cur!=null&&Q.cur<q.it.length?Q.cur:Math.max(0,q.it.findIndex(x=>x.b<0)); const it=q.it[cur>=0?cur:0];
        return `<div class="rq-dots">${q.it.map((x,i)=>`<button type="button" class="${i===cur?"on":""} ${x.b>=0?"d":""}" data-a="cur" data-i="${i}" aria-label="Élément ${i+1}"></button>`).join("")}</div>
          <div class="rq-card">${esc(it.t)}</div>
          <div class="rq-grid n${Math.min(q.bins.length,8)}">${q.bins.map((b,i)=>`<button type="button" class="rq-c ${it.b===i?"on":""}" style="--c:${PAL[i]}" data-a="sort" data-k="${it.k}" data-b="${i}"><b>${esc(b)}</b></button>`).join("")}</div>${validBtn(q)}`; }
      case "r": return `<div class="rq-ord">${q.it.map((x,p)=>`<div class="rq-orow"><i>${p+1}</i><span>${esc(x)}</span><button type="button" data-a="ord" data-p="${p}" data-d="-1" aria-label="Monter">&#9650;</button><button type="button" data-a="ord" data-p="${p}" data-d="1" aria-label="Descendre">&#9660;</button></div>`).join("")}</div>${validBtn(q)}`;
      case "cl": return `<div class="rq-calc"><div class="rq-cscr"><div class="rq-cexp" id="rq-cexp" aria-label="Expression, touche pour placer le curseur">${calcExp(q)}</div><div class="rq-cmv"><button type="button" data-a="cmove" data-d="-1" aria-label="Curseur à gauche">&#9664;</button><button type="button" data-a="cmove" data-d="1" aria-label="Curseur à droite">&#9654;</button></div><div class="rq-cres" id="rq-cres">${esc(q.res||"")}</div></div>
        <div class="rq-ckeys">${q.kb.map(k=>`<button type="button" class="rq-ck ${k[2]} ${k[1]==="="?"w2":""}" data-a="ck" data-i="${k[0]}">${esc(k[1])}</button>`).join("")}</div>
        <div class="rq-row"><button type="button" class="rq-sec" data-a="calcclose">Fermer</button><button type="button" class="rq-go" id="rq-cuse" data-a="calcuse" ${q.use?"":"hidden"}>${esc("Utiliser "+q.use)}</button></div></div>`;
      case "res": { const c=q.ok===true?"ok":(q.ok===false?"ko":"nt"); return `<button type="button" class="rq-res ${c}" data-a="check"><span>${q.ok===true?svgOk:(q.ok===false?svgKo:"")}</span><b>${esc(q.ok===null?"Réponse enregistrée":(q.vt||(q.ok?"Bien joué":"Raté")))}</b><em>${esc(q.go)}</em></button>`; }
      case "btns": return `<div class="rq-btns">${q.list.map((l,i)=>`<button type="button" class="rq-act" style="--c:${PAL[[3,1,2][i]]}" data-a="act" data-i="${i}">${esc(l)}</button>`).join("")}</div>`;
    }
    return ""; }
  function bump(q){
    /* retours legers sans reconstruire la vue : saisie, curseur */
    if(q.k==="n"){ const d=$id("rq-disp"); if(d)d.textContent=q.v||""; }
    if(q.k==="cl"){ const e=$id("rq-cexp"), r=$id("rq-cres"), u=$id("rq-cuse"); if(e)e.innerHTML=calcExp(q); if(r)r.textContent=q.res||"";
      if(u){ u.hidden=!q.use; u.textContent="Utiliser "+q.use; } }
    if(q.k==="s"){ const r=$id("rq-range"), v=$id("rq-sv"); if(v)v.textContent=q.pre+num(q.v)+q.un; if(r&&document.activeElement!==r&&+r.value!==q.v)r.value=q.v; }
  }
  hooks.render=function(){
    const root=$id("tele-rc"), box=$id("rq")||$id("rc-q"), fr=$id("rc-free"); if(!root||!box)return;
    const s=P.st||{}, q=s.q||null, on=!!(q&&!P.free);
    if(fr){ fr.hidden=!q; fr.textContent=P.free?"Quiz":"Curseur"; }
    root.classList.toggle("quiz",on);
    if(!on){ if(box.innerHTML){ box.innerHTML=""; } Q.key=""; Q.last=null; return; }
    const k=keyOf(q);
    if(k!==Q.key){
      if(q.k==="o"&&(!Q.last||Q.last.k!=="o"||Q.last.it.length!==q.it.length))Q.cur=null;
      Q.key=k; box.innerHTML=view(q); box.dataset.k=q.k; Q.lock=0;
      if(q.k==="res"){ try{ if(navigator.vibrate)navigator.vibrate(q.ok===false?[60,40,60]:q.ok?[30]:[10]); }catch(e){} }
    } else bump(q);
    Q.last=q; };

  /* gestes sur la vue (delegation) */
  function bind(){
    const box=$id("rc-q"); if(!box||box.dataset.b)return; box.dataset.b="1";
    box.addEventListener("click",e=>{
      const sp=e.target.closest&&e.target.closest("#rq-cexp");
      if(sp){ const c=e.target.closest("[data-i]"); let i=(Q.last&&Q.last.ex||"").length;
        if(c){ const r=c.getBoundingClientRect(); i=+c.dataset.i+((e.clientX-r.left)>r.width/2?1:0); } send({t:"cset",i}); return; }
      const b=e.target.closest("button[data-a]"); if(!b||b.disabled)return; const a=b.dataset.a, d=b.dataset;
      if(a==="opt"){ if(Q.lock)return; Q.lock=1; b.classList.add("sel"); box.classList.add("lock"); setTimeout(()=>{ Q.lock=0; box.classList.remove("lock"); },1600); send({t:"opt",i:+d.i}); }
      else if(a==="check")send({t:"check"});
      else if(a==="mt")send({t:"mt",i:+d.i});
      else if(a==="key")send({t:"key",k:d.k});
      else if(a==="tile")send({t:"tile",i:+d.i});
      else if(a==="untile")send({t:"untile",i:+d.i});
      else if(a==="mL")send({t:"mL",i:+d.i});
      else if(a==="mR")send({t:"mR",i:+d.i});
      else if(a==="sort"){ send({t:"sort",k:+d.k,b:+d.b}); const l=Q.last; if(l&&l.k==="o"){ const i=l.it.findIndex(x=>x.k===+d.k), nx=l.it.findIndex((x,j)=>j>i&&x.b<0); Q.cur=nx>=0?nx:(l.it.findIndex(x=>x.b<0&&x.k!==+d.k)); if(Q.cur<0)Q.cur=i; } }
      else if(a==="cur"){ Q.cur=+d.i; Q.key=""; hooks.render(); }
      else if(a==="ord")send({t:"ord",p:+d.p,d:+d.d});
      else if(a==="act")send({t:"act",i:+d.i});
      else if(a==="calc")send({t:"calc"});
      else if(a==="ck")send({t:"ck",i:+d.i});
      else if(a==="cmove")send({t:"cmove",d:+d.d});
      else if(a==="calcuse")send({t:"calcuse"});
      else if(a==="calcclose")send({t:"calcclose"});
    });
    box.addEventListener("input",e=>{ const r=e.target; if(r.id==="rq-range"){ const q=Q.last; if(q){ const v=$id("rq-sv"); if(v)v.textContent=q.pre+num(+r.value)+q.un; } send({t:"sld",v:+r.value}); } });
    const fr=$id("rc-free"); if(fr&&!fr.dataset.b){ fr.dataset.b="1"; fr.addEventListener("click",()=>{ P.free=!P.free; Q.key=""; if(T.P.rt)hooks.render(); }); }
  }
  const __r=hooks.render; hooks.render=function(){ bind(); __r(); };
  window.__teleQ={spec,view,Q};
})();
