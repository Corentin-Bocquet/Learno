/* =====================================================================
   EXAMEN PRATIQUE (demande de Corentin du 13/10/2026)
   Un examen par cours, fait uniquement de cas pratiques et d'exercices,
   note sur 20, en 15, 30, 60 ou 90 minutes. Il se passe a tout moment,
   meme sans avoir fini les modules, et il est identique que le cours soit
   en mode express ou non : il ne puise jamais dans EXOS, seulement dans
   sa propre banque de cas (cours/<CID>/examen.js, injectee dans PEXAM).
   Tout passe par des enveloppes autour du mode examen existant : le
   moteur, les exercices et l'examen blanc ne sont pas modifies.
   Aucun exercice de la banque n'entre dans la repetition espacee.
   ===================================================================== */
(function(){
  "use strict";
  if(typeof COURSES==="undefined"||typeof renderExam!=="function"||typeof examFinish!=="function")return;
  const PX=window.PEXAM=window.PEXAM||{};
  const $id=i=>document.getElementById(i);
  const E=s=>typeof esc==="function"?esc(s):String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const fr=n=>String(n).replace(".",",");
  /* l'enonce en fiche (extras.js) transforme tout « Libelle : valeur » en tableau : on garde ce rendu pour les donnees
     (libelle de trois mots au plus) et on neutralise les phrases de recit en remplacant les deux-points par le signe de rapport */
  const narr=t=>String(t||"").replace(/([.!?])\s+/g,"$1\n").split("\n").map(p=>{ const m=/^(.+?)\s:\s(.+)$/.exec(p);
    return m&&m[1].trim().split(/\s+/).length>=4?m[1]+" \u2236 "+m[2]:p; }).join(" ");
  const DUREES=[
    {min:15,nm:"Rapide",d:"Un ou deux cas"},
    {min:30,nm:"Court",d:"Deux ou trois cas"},
    {min:60,nm:"Standard",d:"Le format d'une vraie épreuve"},
    {min:90,nm:"Complet",d:"Tous les cas, conditions réelles"}
  ];
  /* points par type de question (un calcul pese plus qu'un vrai ou faux) et temps prevu en minutes */
  const PTS={tf:1,mcq:1,fill:1,slider:1.5,story:1.5,multi:2,sort:2,match:2,order:2,tiles:2,num:3,eq:3};
  const MIN={tf:.7,mcq:1,fill:1,slider:1.3,story:1.5,multi:1.8,sort:2,match:2,order:2,tiles:2,num:3,eq:3};
  const ptsOf=c=>c.pts!=null?c.pts:(PTS[c.t]||1.5);
  const minOf=c=>c.mn!=null?c.mn:(MIN[c.t]||1.5);
  const caseMin=cs=>Math.round(10*cs.cards.reduce((a,c)=>a+minOf(c),0))/10;
  const bankOf=cid=>{ const b=PX[cid]; return b&&Array.isArray(b.cases)?b.cases:[]; };
  const docsOf=cid=>{ const b=PX[cid]; return b&&Array.isArray(b.docs)?b.docs:[]; };
  window.pexCaseMin=caseMin; window.pexPts=ptsOf;

  /* ---------------- tirage des cas ---------------- */
  function shuf(a){ return typeof shuffle==="function"?shuffle(a.slice()):a.slice().sort(()=>Math.random()-.5); }
  function tirer(cid,min){
    const vu=((S.pexSeen||{})[cid])||{};
    /* les cas jamais traites d'abord, puis les moins recents */
    const ordre=shuf(bankOf(cid)).sort((a,b)=>(vu[a.id]||0)-(vu[b.id]||0));
    const sel=[]; let tot=0;
    ordre.forEach(cs=>{ const m=caseMin(cs); if(tot+m<=min*1.08){ sel.push(cs); tot+=m; } });
    if(!sel.length&&ordre.length)sel.push(ordre.slice().sort((a,b)=>caseMin(a)-caseMin(b))[0]);
    return shuf(sel);
  }
  function cartes(cid,cs){
    return cs.cards.map((c,n)=>{
      const e=Object.assign({},c);
      /* dans les sources la bonne reponse peut etre ecrite en premier : l'ordre est melange a chaque examen */
      if(["mcq","story","fill"].includes(e.t)&&Array.isArray(e.o)&&typeof e.a==="number"){
        const bonne=e.o[e.a]; e.o=shuf(e.o); e.a=e.o.indexOf(bonne);
      }
      e.i="px_"+cid+"_"+cs.id+"_"+(n+1);
      if(cs.mods&&cs.mods.length&&e.u==null)e.u=cs.mods[0];
      e.cas=cid+"-"+cs.id; e.k=n+1;
      e.ck=cs.t+" · question "+(n+1)+" sur "+cs.cards.length;
      e.ctx=narr([cs.ctx,c.ctx].filter(Boolean).join(" "));
      if(!e.tab&&cs.tab)e.tab=cs.tab;
      if(!e.svg&&cs.svg)e.svg=cs.svg;
      if(e.d==null)e.d=.5;
      e.pex=cs.id; e.pp=ptsOf(c);
      return e;
    });
  }

  /* ---------------- depart ---------------- */
  window.pexStart=function(cid,min){
    const cases=tirer(cid,min); if(!cases.length){ toast("Pas encore de cas pour ce cours."); return; }
    const queue=[], caseOf=[];
    cases.forEach((cs,ci)=>cartes(cid,cs).forEach(e=>{ queue.push(e); caseOf.push(ci); }));
    L={uid:null,li:null,cid,mode:"exam",queue,idx:0,wrong:0,ok:0,combo:0,maxCombo:0,repeat:[],errors:[],
       pex:{cid,min,cases:cases.map(cs=>({id:cs.id,t:cs.t,mods:cs.mods||[]})),caseOf},
       exam:{log:[],t0:Date.now(),limit:min*60000,fmt:-1,lvl:0}};
    show("lesson");
    const hw=$id("ls-hearts-w"); if(hw)hw.style.display="none";
    examBar(true); docsBtn(cid); nextQ(); examPaint();
    if(EXAM_TICK)clearInterval(EXAM_TICK);
    EXAM_TICK=setInterval(examChrono,500);
    toast("Examen pratique · "+cases.length+" cas, "+queue.length+" questions, "+min+" minutes. Aucune correction avant la fin.",4600);
  };
  /* les tableaux fournis le jour de l'examen : un bouton dans la barre du haut ouvre les documents */
  function docsBtn(cid){
    const d=docsOf(cid), bar=$id("exam-bar"); if(!d.length||!bar)return;
    const b=document.createElement("button"); b.type="button"; b.className="tbtn pex-docs"; b.id="pex-docs";
    b.innerHTML=ico("book",14)+" Tableaux"; b.onclick=()=>pexDocs(cid);
    const warn=bar.querySelector(".warn"); if(warn)bar.insertBefore(b,warn); else bar.appendChild(b);
  }
  window.pexDocs=function(cid){
    const d=docsOf(cid); if(!d.length)return;
    openModal(`<h2 style="margin-top:0">Documents fournis</h2><p class="muted" style="margin:0 0 10px;font-size:13px">Comme à l'examen : les tableaux sont donnés, c'est la méthode qui est notée.</p>`+
      d.map((x,i)=>`<details class="pex-doc" ${i===0?"open":""}><summary>${E(x.t)}</summary><div class="pex-docb">${x.h}</div></details>`).join("")+
      `<div style="height:10px"></div><button class="btn" type="button" onclick="closeModal()">Fermer</button>`);
  };
  window.pexOpen=function(){
    setTab("exam");
    setTimeout(()=>{ const c=$id("pex-card"); if(c&&c.scrollIntoView)c.scrollIntoView({block:"start"}); },60);
  };

  /* ---------------- le moteur : enveloppes ---------------- */
  /* rien de la banque n'entre dans la repetition espacee ni dans les erreurs */
  const __gr=window.grade;
  window.grade=function(){ if(typeof L!=="undefined"&&L&&L.pex)return; return __gr.apply(this,arguments); };

  function frac(ex){
    if(ex.t==="multi"){ const sel=A.sel||[], bon=sel.filter(k=>ex.a.includes(k)).length, mauv=sel.length-bon;
      return Math.max(0,(bon-mauv)/ex.a.length); }
    if(ex.t==="sort"){ const s=A.sort||{}; return ex.it.filter((it,k)=>s[k]===it[1]).length/ex.it.length; }
    return null;
  }
  function mine(ex){
    try{
      if(["mcq","fill","story"].includes(ex.t))return A.val!=null?String(ex.o[A.val]):"";
      if(ex.t==="tf")return A.val===true?"Vrai":A.val===false?"Faux":"";
      if(ex.t==="num"||ex.t==="slider")return A.val==null?"":fr(String(A.val))+(ex.un||"");
      if(ex.t==="multi")return (A.sel||[]).map(k=>ex.o[k]).join(" / ");
    }catch(e){}
    return "";
  }
  const __dc=window.doCheck;
  window.doCheck=function(){
    if(typeof L==="undefined"||!L||!L.pex||!A||!A.ex)return __dc.apply(this,arguments);
    const ex=A.ex; let f=null, m="";
    try{ f=frac(ex); m=mine(ex); }catch(e){}
    const n0=L.exam.log.length;
    const r=__dc.apply(this,arguments);
    const e=L.exam.log[L.exam.log.length-1];
    if(e&&L.exam.log.length>n0){ e.f=e.ok?1:(f==null?0:f); e.m=m; e.pp=ex.pp||ptsOf(ex); e.pex=ex.pex; }
    return r;
  };
  const __ep=window.examPaint;
  window.examPaint=function(){
    if(typeof L!=="undefined"&&L&&L.pex){
      const d=$id("exam-dots"); if(!d)return;
      d.innerHTML="";
      return;
    }
    return __ep.apply(this,arguments);
  };
  const __ef=window.examFinish;
  window.examFinish=function(){
    if(typeof L!=="undefined"&&L&&L.pex)return pexFinish.apply(null,arguments);
    return __ef.apply(this,arguments);
  };

  /* ---------------- resultat : note sur 20 ---------------- */
  function mention(n){
    return n>=16?"Très bien":n>=14?"Bien":n>=12?"Assez bien":n>=10?"Passable":"Insuffisant";
  }
  function ansText(ex){
    try{
      if(ex.t==="tf")return ex.a?"Vrai":"Faux";
      if(["mcq","fill","story"].includes(ex.t))return String(ex.o[ex.a]);
      if(ex.t==="num")return fr(ex.a)+(ex.un||"");
      if(ex.t==="slider")return fr(ex.a)+(ex.un||"");
      if(ex.t==="tiles"||ex.t==="eq")return ex.a.join(" ");
    }catch(e){}
    return "";
  }
  function pexFinish(tempsEcoule){
    if(EXAM_TICK){ clearInterval(EXAM_TICK); EXAM_TICK=null; }
    const P=L.pex, log=L.exam.log, q=L.queue;
    const duree=Math.round((Date.now()-L.exam.t0)/1000);
    const rows=q.map((ex,i)=>{ const x=log[i]; const p=ex.pp||ptsOf(ex);
      return {ex,x,p,got:x?p*(x.f==null?(x.ok?1:0):x.f):0,ci:P.caseOf[i]}; });
    const tot=rows.reduce((a,r)=>a+r.p,0), pts=rows.reduce((a,r)=>a+r.got,0);
    const note=Math.round(2*20*pts/(tot||1))/2;
    const cl=note>=14?"good":note>=10?"mid":"bad";
    const parCas=P.cases.map((c,ci)=>{ const rs=rows.filter(r=>r.ci===ci);
      return {id:c.id,t:c.t,mods:c.mods,rows:rs,got:rs.reduce((a,r)=>a+r.got,0),max:rs.reduce((a,r)=>a+r.p,0)}; });
    S.pexams=S.pexams||[];
    S.pexams.push({ts:Date.now(),cid:P.cid,min:P.min,note,pts:Math.round(10*pts)/10,tot,sec:duree,n:q.length,
      cases:parCas.map(c=>({id:c.id,t:c.t,g:Math.round(10*c.got)/10,m:c.max}))});
    S.pexams=S.pexams.slice(-40);
    S.pexSeen=S.pexSeen||{}; S.pexSeen[P.cid]=S.pexSeen[P.cid]||{};
    P.cases.forEach(c=>{ S.pexSeen[P.cid][c.id]=Date.now(); });
    S.xp+=(typeof XP_X!=="undefined"?XP_X:1)*Math.round(note);
    save();
    const mot=note>=16?"Tu es prêt. Les cas ne te font plus peur.":note>=14?"Solide. Il reste quelques points à aller chercher.":
      note>=12?"C'est correct, mais l'examen se joue sur le détail : reprends les points perdus ci-dessous.":
      note>=10?"Tu passes de justesse. Retravaille les modules signalés puis refais un examen.":
      "Pas encore. C'est une information, pas un jugement : les modules ci-dessous sont ta priorité.";
    const faibles=[]; parCas.forEach(c=>{ if(c.max&&c.got/c.max<.6)c.mods.forEach(u=>{ if(!faibles.includes(u)&&unitOf(u))faibles.push(u); }); });
    let h=`<div class="pex-res">
      <div class="pex-note ${cl}"><span id="pex-n">0</span><small>/ 20</small></div>
      <div class="pex-men ${cl}">${mention(note)}</div>
      <div class="muted pex-sub">${fr(Math.round(10*pts)/10)} points sur ${fr(tot)} · ${Math.floor(duree/60)} min ${duree%60} s sur ${P.min} min${tempsEcoule?" · temps écoulé":""}</div>
      <p class="pex-mot">${E(mot)}</p></div>
      <h2 class="section-t">Cas par cas</h2>`;
    parCas.forEach(c=>{ const pc=c.max?Math.round(100*c.got/c.max):0, col=pc>=70?"var(--green)":pc>=50?"var(--gold)":"var(--red)";
      h+=`<div class="rowline"><div class="lbl" style="font-size:13px">${E(c.t)}</div>
        <div style="width:110px"><div class="mbar"><div style="width:${pc}%;background:${col}"></div></div></div>
        <div style="min-width:86px;text-align:right;white-space:nowrap;color:${col}">${fr(Math.round(10*c.got)/10)} / ${fr(c.max)}</div></div>`; });
    if(faibles.length){
      h+=`<h2 class="section-t">Modules à retravailler en priorité</h2>`;
      faibles.slice(0,6).forEach(u=>{ const un=unitOf(u);
        h+=`<div class="rowline"><div class="lbl" style="font-size:13px">${E(un.n)} : ${E(un.t)}</div>
          <button class="chip" type="button" onclick="examQuit();setTimeout(()=>openGuide(${u}),120)">Ouvrir la leçon</button></div>`; });
    }
    h+=`<h2 class="section-t">Correction détaillée</h2>`;
    parCas.forEach((c,ci)=>{
      const pleine=c.max&&c.got>=c.max-1e-6;
      h+=`<details class="pex-det" ${pleine?"":"open"}><summary><b>${E(c.t)}</b><span>${fr(Math.round(10*c.got)/10)} / ${fr(c.max)}</span></summary>`;
      c.rows.forEach((r,n)=>{
        const ex=r.ex, x=r.x, ok=x&&x.ok, part=x&&!x.ok&&x.f>0;
        const cls=!x?"na":ok?"ok":part?"part":"ko", marque=!x?"Non traité":ok?"Juste":part?"Partiel":"Faux";
        const blk=(typeof arcSolBlock==="function"&&arcSolBlock(ex))||"";
        const bonne=blk?`<div class="arc-solbox">${blk}</div>`:(ansText(ex)?`<div class="pex-bonne"><b>Bonne réponse :</b> ${E(ansText(ex))}</div>`:"");
        const tienne=(!ok&&x&&x.m)?`<div class="pex-tienne"><b>Ta réponse :</b> ${E(x.m)}</div>`:"";
        const w=typeof arcFormatW==="function"?arcFormatW(ex.w):E(ex.w||"");
        h+=`<div class="pex-q ${cls}"><div class="pex-qh"><span class="pex-tag">${marque}</span><span class="pex-pt">${fr(Math.round(10*r.got)/10)} / ${fr(r.p)}</span></div>
          <div class="pex-qq">${n+1}. ${E(ex.q)}</div>${ok?"":tienne+bonne}<div class="pex-w">${w}</div></div>`;
      });
      h+=`</details>`;
    });
    h+=`<div style="height:12px"></div><button class="btn" type="button" onclick="examQuit()">${ico("check",16)} Terminer</button>
      <div style="height:8px"></div><button class="btn ghost" type="button" onclick="examQuit();setTimeout(()=>pexStart('${P.cid}',${P.min}),150)">Refaire un examen de ${P.min} minutes</button>`;
    examBar(false);
    $id("exambody").innerHTML=h;
    L=null; killCalc(); show("exam");
    try{ window.scrollTo(0,0); let n=$id("exambody"); while(n){ n.scrollTop=0; n=n.parentElement; } }catch(e){}
    document.querySelectorAll(".navitem").forEach(b=>b.classList.toggle("on",b.dataset.tab==="exam"));
    if(typeof sfx==="function")sfx(note>=12?"complete":"wrong");
    if(note>=14&&typeof confetti==="function")confetti(note>=16?110:70);
    const el=$id("pex-n");
    if(el){ el.textContent="0"; setTimeout(()=>{ const t0=performance.now();
      (function st(t){ const k=Math.min(1,(t-t0)/900), e=1-Math.pow(1-k,3); el.textContent=fr(Math.round(2*note*e)/2); if(k<1)requestAnimationFrame(st); else el.textContent=fr(note); })(t0); },200); }
  }
  window.pexFinish=pexFinish;

  /* ---------------- l'entree dans l'onglet Examen ---------------- */
  function histHTML(cid){
    const h=(S.pexams||[]).filter(x=>x.cid===cid).slice(-5).reverse();
    if(!h.length)return `<p class="muted pex-none">Aucun examen pratique passé sur ce cours. Le premier sert de point zéro.</p>`;
    const moy=Math.round(10*h.reduce((a,b)=>a+b.note,0)/h.length)/10;
    return `<div class="pex-hist">`+h.map(r=>{ const cl=r.note>=14?"good":r.note>=10?"mid":"bad";
      return `<div class="rowline"><div class="lbl" style="font-size:13px">${new Date(r.ts).toLocaleDateString("fr-FR",{day:"2-digit",month:"short"})} · ${r.min} min · ${r.n} questions</div>
        <div class="pex-hn ${cl}">${fr(r.note)} / 20</div></div>`; }).join("")+`</div>
      <p class="muted" style="margin-top:8px;font-size:12.5px">Moyenne sur tes ${h.length} derniers examens pratiques : <b>${fr(moy)} / 20</b>.</p>`;
  }
  function cardHTML(cid){
    const bank=bankOf(cid); if(!bank.length)return "";
    const c=COURSES.find(x=>x.id===cid)||{name:""};
    const tot=Math.round(bank.reduce((a,cs)=>a+caseMin(cs),0)), nq=bank.reduce((a,cs)=>a+cs.cards.length,0);
    const tile=typeof arcTile==="function"?arcTile("examen",46,"rgba(255,255,255,.2)"):"";
    return `<div class="card pex-card" id="pex-card">
      <div class="pex-head">${tile}<div><h3>Examen pratique</h3>
        <div class="muted" style="font-size:12.5px">${E(c.name)} · ${bank.length} cas, ${nq} questions en banque</div></div></div>
      <p class="pex-intro">Que des <b>cas pratiques</b> et des <b>exercices</b>, comme à l'évaluation : tirés des notes, des TD et des exercices du cours.
        Note sur <b>20</b>, chronomètre, aucune correction avant la fin. Tu peux le passer <b>à tout moment</b>, même sans avoir fini les modules.
        Il est le même en cours express ou non, et il passe d'abord les cas que tu n'as pas encore faits.</p>
      <div class="pex-durs">${DUREES.map(d=>`<button class="pex-dur" type="button" onclick="pexStart('${cid}',${d.min})">
        <b>${d.min} min</b><span>${d.nm}</span><small>${E(d.d)}</small></button>`).join("")}</div>
      <h4 class="pex-h4">Tes derniers résultats</h4>${histHTML(cid)}
    </div>`;
  }
  const __re=window.renderExam;
  window.renderExam=function(){
    __re.apply(this,arguments);
    try{
      const b=$id("exambody"); if(!b)return;
      const old=$id("pex-card"); if(old)old.remove();
      const html=cardHTML(S.active); if(!html)return;
      const first=b.querySelector(".card");
      const sep=`<h2 class="section-t pex-sep">Examen blanc : le quiz du cours</h2>`;
      const wrap=document.createElement("div"); wrap.innerHTML=html+sep;
      const frag=document.createDocumentFragment(); while(wrap.firstChild)frag.appendChild(wrap.firstChild);
      if(first)first.after(frag); else b.prepend(frag);
    }catch(e){ if(window.console)console.error("examen pratique",e); }
  };

  /* ---------------- l'entree en fin de parcours ---------------- */
  const __rp=window.renderPath;
  window.renderPath=function(){
    __rp.apply(this,arguments);
    try{
      const b=$id("pathbody"); if(!b)return;
      const old=b.querySelector(".pex-end"); if(old)old.remove();
      const cid=S.active; if(!bankOf(cid).length)return;
      const tile=typeof arcTile==="function"?arcTile("examen",56):"";
      b.insertAdjacentHTML("beforeend",`<div class="pex-end"><div class="arc-sec"><span>Pour finir</span></div>
        <button class="arc-play" type="button" style="background:#E5484D;--sh:#B3363A" onclick="pexOpen()">
        ${tile}<span class="pt"><b>Examen pratique</b><span>Cas et exercices, noté sur 20 · 15 à 90 min</span></span><span class="pg">Quand tu veux</span></button></div>`);
    }catch(e){ if(window.console)console.error("fin de parcours",e); }
  };
})();
