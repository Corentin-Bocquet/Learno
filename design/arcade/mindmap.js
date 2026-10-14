/* =====================================================================
   MIND MAP MAGIQUE (demande de Corentin du 14/10/2026)
   A la fin de chaque cours, sous l'examen pratique : les grandes idees du
   cours en une carte tres courte (le 20 % qui explique les 80 %). Les
   mots sont floutes. Un toucher les revele avec une animation, un second
   toucher les recouvre. L'apprenant devine ce qui se cache, puis verifie :
   c'est de la recuperation en memoire, pas de la relecture.
   Trois profondeurs : Essentiel, Approfondi, Expert (memes noeuds, de plus
   en plus de details). Les sources vivent dans cours/<CID>/mindmap.txt,
   injectees par tools/assemble.py dans window.MMAP[CID] (texte brut).
   Format du texte :
     # Grande idee            une branche (toujours visible, c'est l'ancre)
     - mot cle                un noeud a la profondeur 1 (niveau Essentiel)
     -- detail                un noeud a la profondeur 2 (niveau Approfondi)
     --- precision            un noeud a la profondeur 3 (niveau Expert)
     -- [1] detail            force le niveau : visible des l'Essentiel
   Aucune note, aucun XP : tout passe par des enveloppes, rien n'est modifie.
   ===================================================================== */
(function(){
  "use strict";
  if(typeof COURSES==="undefined"||typeof renderPath!=="function")return;
  const MM=window.MMAP=window.MMAP||{};
  const $id=i=>document.getElementById(i);
  const E=s=>typeof esc==="function"?esc(s):String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const COL=["#58CC02","#1CB0F6","#CE82FF","#FFC800","#FF9600","#FF5A5F","#2BD9B0","#FF86D0","#8C9EFF","#A3E635","#F59E0B","#38BDF8"];
  const NIV=[{n:1,nm:"Essentiel",d:"Les grandes idées"},{n:2,nm:"Approfondi",d:"Un cran de détail"},{n:3,nm:"Expert",d:"Presque tout"}];
  const LS="learno.mm.niveau";

  /* ---------------- lecture du texte ---------------- */
  function parse(src){
    const branches=[]; let cur=null, stack=[];
    String(src||"").split("\n").forEach(raw=>{
      const ln=raw.trim(); if(!ln)return;
      let m=/^#\s*(.+)$/.exec(ln);
      if(m){ cur={t:m[1].trim(),l:1,k:[],id:"b"+branches.length}; branches.push(cur); stack=[cur]; return; }
      m=/^(-+)\s*(?:\[(\d)\]\s*)?(.+)$/.exec(ln); if(!m||!cur)return;
      const d=m[1].length, parent=stack[d-1]; if(!parent)return;
      const lvl=m[2]?+m[2]:Math.min(d,3);
      const n={t:m[3].trim(),l:Math.max(lvl,parent.l),k:[],id:parent.id+"."+parent.k.length};
      parent.k.push(n); stack.length=d; stack[d]=n;
    });
    return branches;
  }
  window.mmParse=parse;
  const treeOf=cid=>MM[cid]?parse(MM[cid]):[];
  const nodes=(n,niv,acc)=>{ n.k.forEach(c=>{ if(c.l<=niv){ acc.push(c); nodes(c,niv,acc); } }); return acc; };
  const visibles=(tree,niv)=>tree.reduce((a,b)=>nodes(b,niv,a),[]);

  /* ---------------- etat : ce qui est revele, par cours ---------------- */
  const REV={};            /* cid -> Set d'identifiants de noeuds reveles */
  const ST={cid:null,niv:1};
  const rev=cid=>REV[cid]||(REV[cid]=new Set());
  const lireNiv=()=>{ try{ const v=+localStorage.getItem(LS); return v>=1&&v<=3?v:1; }catch(e){ return 1; } };
  const ecrireNiv=v=>{ try{ localStorage.setItem(LS,String(v)); }catch(e){} };

  /* ---------------- dessin ---------------- */
  const glyph=(s)=>`<svg class="arc-ico" viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true">
    <path d="M12 12 5.4 6.2M12 12l7-5.4M12 12l-6.6 6M12 12l7 5.6" stroke="url(#arcGw)" stroke-width="2" stroke-linecap="round" fill="none"/>
    <circle cx="12" cy="12" r="3.9" fill="url(#arcGw)"/><circle cx="12" cy="12" r="1.5" fill="#1C1C48" fill-opacity=".72"/>
    <circle cx="5" cy="5.8" r="2.3" fill="url(#arcGw)" opacity=".85"/><circle cx="19.6" cy="6.2" r="2.3" fill="url(#arcGw)" opacity=".85"/>
    <circle cx="5" cy="18.4" r="2.3" fill="url(#arcGw)" opacity=".7"/><circle cx="19.6" cy="18" r="2.3" fill="url(#arcGw)" opacity=".7"/></svg>`;
  const tile=(s,col)=>`<span class="arc-glass" style="--gc:${col||"rgba(255,255,255,.18)"};width:${s}px;height:${s}px">${glyph(Math.round(s*.6))}</span>`;
  const cross=`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" fill="none"/></svg>`;

  function liste(n,niv,rv,idx){
    const ks=n.k.filter(c=>c.l<=niv); if(!ks.length)return "";
    return `<ul class="mm-l">`+ks.map(c=>{ const on=rv.has(c.id);
      return `<li><button type="button" class="mm-n${on?" on":""}" data-id="${c.id}" aria-pressed="${on}" style="--d:${(idx.i++%12)*45}ms">
        <span class="mm-t">${E(c.t)}</span></button>${liste(c,niv,rv,idx)}</li>`; }).join("")+`</ul>`;
  }
  function brancheHTML(b,i,niv,rv,idx){
    const col=COL[i%COL.length], tous=nodes(b,niv,[]);
    return `<section class="mm-b" data-b="${b.id}" style="--bc:${col}">
      <header class="mm-bh"><h3>${E(b.t)}</h3>${tous.length?`<button type="button" class="mm-bt" data-b="${b.id}">Voir</button>`:""}</header>
      ${liste(b,niv,rv,idx)}</section>`;
  }
  function corps(){
    const tree=treeOf(ST.cid), rv=rev(ST.cid), c=COURSES.find(x=>x.id===ST.cid)||{name:""}, idx={i:0};
    const b=$id("mm-body"); if(!b)return;
    b.innerHTML=`<div class="mm-root"><span>${E(c.short||c.name)}</span></div>
      <p class="mm-tip">Devine d'abord ce qui se cache derrière chaque case, puis touche-la pour vérifier. Un second toucher la recouvre.</p>
      <div class="mm-grid">${tree.map((br,i)=>brancheHTML(br,i,ST.niv,rv,idx)).join("")}</div>`;
    compteur();
  }
  function compteur(){
    const tree=treeOf(ST.cid), vis=visibles(tree,ST.niv), rv=rev(ST.cid);
    const n=vis.filter(x=>rv.has(x.id)).length, t=vis.length;
    const el=$id("mm-cnt"); if(el)el.innerHTML=`<b>${n}</b> / ${t} révélés`;
    const bar=$id("mm-bar"); if(bar)bar.style.width=(t?Math.round(100*n/t):0)+"%";
    document.querySelectorAll(".mm-bt").forEach(btn=>{
      const b=tree.find(x=>x.id===btn.dataset.b); if(!b)return;
      const v=nodes(b,ST.niv,[]); btn.textContent=v.every(x=>rv.has(x.id))?"Cacher":"Voir";
    });
  }
  function segment(){
    return NIV.map(x=>`<button type="button" class="mm-sg${x.n===ST.niv?" on":""}" data-niv="${x.n}"><b>${x.nm}</b><small>${x.d}</small></button>`).join("");
  }

  /* ---------------- ouverture ---------------- */
  window.mmOpen=function(cid){
    cid=cid||(typeof S!=="undefined"&&S&&S.active); if(!cid||!MM[cid])return;
    ST.cid=cid; ST.niv=lireNiv();
    let ov=$id("mm-ov"); if(ov)ov.remove();
    const c=COURSES.find(x=>x.id===cid)||{name:""};
    ov=document.createElement("div"); ov.id="mm-ov"; ov.className="mm-ov"; ov.setAttribute("role","dialog"); ov.setAttribute("aria-label","Mind map magique");
    ov.innerHTML=`<div class="mm-top"><button type="button" class="mm-x" id="mm-x" aria-label="Fermer">${cross}</button>
        <div class="mm-tt"><b>Mind map magique</b><span>${E(c.name)}</span></div></div>
      <div class="mm-ctl"><div class="mm-seg" id="mm-seg">${segment()}</div>
        <div class="mm-acts"><span class="mm-cnt" id="mm-cnt"></span>
          <button type="button" class="mm-a" id="mm-all">Tout révéler</button><button type="button" class="mm-a" id="mm-none">Tout cacher</button></div>
        <div class="mm-prog"><i id="mm-bar"></i></div></div>
      <div class="mm-body" id="mm-body"></div>`;
    document.body.appendChild(ov);
    document.documentElement.classList.add("mm-lock");
    corps();
    ov.addEventListener("click",e=>{
      const t=e.target.closest("button"); if(!t)return;
      if(t.id==="mm-x"){ mmClose(); return; }
      const rv=rev(ST.cid);
      if(t.classList.contains("mm-n")){
        const id=t.dataset.id, on=!rv.has(id);
        on?rv.add(id):rv.delete(id);
        t.classList.toggle("on",on); t.setAttribute("aria-pressed",String(on)); t.style.setProperty("--d","0ms"); compteur(); return; }
      if(t.classList.contains("mm-sg")){
        ST.niv=+t.dataset.niv; ecrireNiv(ST.niv);
        $id("mm-seg").innerHTML=segment(); corps(); return; }
      if(t.classList.contains("mm-bt")){
        const b=treeOf(ST.cid).find(x=>x.id===t.dataset.b); if(!b)return;
        const v=nodes(b,ST.niv,[]), tous=v.every(x=>rv.has(x.id));
        v.forEach(x=>tous?rv.delete(x.id):rv.add(x.id));
        ov.querySelectorAll('.mm-b[data-b="'+b.id+'"] .mm-n').forEach((el,i)=>{ el.style.setProperty("--d",(i*45)+"ms"); el.classList.toggle("on",!tous); el.setAttribute("aria-pressed",String(!tous)); });
        compteur(); return; }
      if(t.id==="mm-all"||t.id==="mm-none"){
        const all=t.id==="mm-all", v=visibles(treeOf(ST.cid),ST.niv);
        v.forEach(x=>all?rv.add(x.id):rv.delete(x.id));
        ov.querySelectorAll(".mm-n").forEach((el,i)=>{ el.style.setProperty("--d",Math.min(i*30,700)+"ms"); el.classList.toggle("on",all); el.setAttribute("aria-pressed",String(all)); });
        compteur(); }
    });
    requestAnimationFrame(()=>ov.classList.add("in"));
  };
  function mmClose(){
    const ov=$id("mm-ov"); if(!ov)return;
    document.documentElement.classList.remove("mm-lock");
    ov.classList.remove("in"); setTimeout(()=>{ if(ov.parentNode)ov.remove(); },220);
  }
  window.mmClose=mmClose;
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&$id("mm-ov"))mmClose(); });

  /* ---------------- l'entree en fin de parcours, sous l'examen pratique ---------------- */
  const __rp=window.renderPath;
  window.renderPath=function(){
    __rp.apply(this,arguments);
    try{
      const b=$id("pathbody"); if(!b)return;
      const old=b.querySelector(".mm-end"); if(old)old.remove();
      const cid=S.active; if(!MM[cid])return;
      const tree=treeOf(cid), n=visibles(tree,1).length;
      const html=`<div class="mm-end"><button class="arc-play" type="button" style="background:#7C4DFF;--sh:#5A32C8" onclick="mmOpen('${cid}')">
        ${tile(56)}<span class="pt"><b>Mind map magique</b><span>${tree.length} grandes idées à deviner, puis à révéler</span></span><span class="pg">${n} mots clés</span></button></div>`;
      const pex=b.querySelector(".pex-end");
      if(pex)pex.insertAdjacentHTML("afterend",html); else b.insertAdjacentHTML("beforeend",html);
    }catch(e){ if(window.console)console.error("mind map magique",e); }
  };
})();
