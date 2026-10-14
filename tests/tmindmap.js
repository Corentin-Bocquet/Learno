/* Mind map magique : cours/<CID>/mindmap.txt (texte) et moteur design/arcade/mindmap.js.
   node tests/tmindmap.js            tous les cours
   CID=FISCA node tests/tmindmap.js  un seul cours
   Charte (demande de Corentin du 14/10/2026) : tres court, le 20 % qui explique les 80 %.
   - un mot ou deux, trois ou quatre quand il faut pour comprendre, jamais une phrase
   - au plus 6 fleches par notion a l'Essentiel, un peu plus aux niveaux detailles
   - trois niveaux de plus en plus fournis, memes noeuds
   - aucun tiret cadratin, aucun emoji, aucune ligne mal formee
   - le moteur : mots floutes, un toucher revele, un second recouvre, entree sous l'examen pratique */
const fs=require('fs');const path=require('path');
const {JSDOM,VirtualConsole}=(()=>{try{return require('jsdom')}catch(e){return require('/tmp/node_modules/jsdom')}})();
const html=fs.readFileSync(process.env.LEARNO_HTML||path.join(__dirname,'..','index.html'),'utf8');
const errs=[];const vc=new VirtualConsole();
vc.on("jsdomError",e=>{if(!/getContext|HTMLMediaElement|Not implemented/.test(e.message))errs.push("jsdom: "+e.message.slice(0,160))});
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/",virtualConsole:vc,
  beforeParse(w){ w.HTMLMediaElement.prototype.play=()=>Promise.resolve(); w.HTMLMediaElement.prototype.pause=()=>{};
    w.fetch=()=>Promise.reject(new Error("hors ligne")); }});
const w=dom.window, doc=w.document, E=x=>w.eval(x), ko=m=>errs.push(m);
const click=el=>el&&el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));
const ONLY=process.env.CID||"";
const MAXK={1:6,2:8,3:10};
const nmots=t=>t.replace(/(\d) (?=\d{3}\b)/g,'$1').split(/\s+/).filter(x=>/[\p{L}\p{N}]/u.test(x)).length;

setTimeout(()=>{
  const ids=E("COURSES.map(c=>c.id)").filter(c=>!ONLY||c===ONLY);
  const MM=E("window.MMAP||{}");
  const stats=[];
  ids.forEach(cid=>{
    const src=MM[cid];
    if(!src){ ko(cid+" : pas de mind map magique (cours/"+cid+"/mindmap.txt)"); return; }
    if(/—/.test(src))ko(cid+" : tiret cadratin interdit");
    if(/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(src))ko(cid+" : emoji litteral interdit");
    src.split("\n").forEach((ln,i)=>{ const t=ln.trim(); if(t&&!/^#\s*\S/.test(t)&&!/^-+\s*(\[[123]\]\s*)?\S/.test(t))ko(cid+" : ligne "+(i+1)+" mal formee : "+t.slice(0,40)); });
    const tree=w.mmParse(src);
    if(tree.length<4||tree.length>12)ko(cid+" : "+tree.length+" grandes idees (entre 4 et 12 attendues)");
    const seen=new Set();
    const compte={1:0,2:0,3:0}, mots={1:0};
    const walk=(n,niv,depth)=>{
      if(seen.has(n.id))ko(cid+" : identifiant double "+n.id); seen.add(n.id);
      const nw=nmots(n.t);
      if(nw>(depth===0?6:7))ko(cid+" : \""+n.t+"\" fait "+nw+" mots (une phrase, pas un mot cle)");
      if(n.t.length>46)ko(cid+" : \""+n.t+"\" est trop long ("+n.t.length+" caracteres)");
      if(/!\s*$|[a-zéèêàç]{3}\.\s*$/.test(n.t))ko(cid+" : \""+n.t+"\" finit comme une phrase");
      n.k.forEach(c=>{ if(c.l<n.l)ko(cid+" : \""+c.t+"\" apparait avant son parent"); if(c.l>3)ko(cid+" : niveau "+c.l+" inconnu"); walk(c,niv,depth+1); });
      [1,2,3].forEach(L=>{ const k=n.k.filter(c=>c.l<=L).length; if(k>MAXK[L])ko(cid+" : \""+n.t+"\" a "+k+" fleches au niveau "+L+" (maximum "+MAXK[L]+")");
        if(depth>0||true){} });
    };
    tree.forEach(b=>{
      walk(b,1,0);
      if(b.k.filter(c=>c.l<=1).length<2)ko(cid+" : \""+b.t+"\" a moins de 2 mots cles a l'Essentiel");
      const all=n=>n.k.forEach(c=>{ for(let L=c.l;L<=3;L++)compte[L]++; if(c.l<=1)mots[1]+=nmots(c.t); all(c); }); all(b);
    });
    if(!(compte[2]>compte[1]*1.25))ko(cid+" : le niveau Approfondi doit etre nettement plus fourni que l'Essentiel ("+compte[2]+" contre "+compte[1]+")");
    if(!(compte[3]>compte[2]))ko(cid+" : le niveau Expert doit etre plus fourni que l'Approfondi ("+compte[3]+" contre "+compte[2]+")");
    if(compte[1]>100)ko(cid+" : l'Essentiel compte "+compte[1]+" noeuds, c'est trop (100 au plus, le 20 % qui explique les 80 %)");
    if(compte[1]<18)ko(cid+" : l'Essentiel compte seulement "+compte[1]+" noeuds (18 au moins)");
    if(compte[3]>260)ko(cid+" : l'Expert compte "+compte[3]+" noeuds (260 au plus, ca doit rester concis)");
    const moy=mots[1]/Math.max(1,compte[1]);
    if(moy>3.9)ko(cid+" : mots clés trop longs a l'Essentiel ("+moy.toFixed(1)+" mots en moyenne, 3,9 au plus)");
    stats.push(cid+" "+tree.length+" idees, "+compte[1]+"/"+compte[2]+"/"+compte[3]+" noeuds, "+moy.toFixed(1)+" mots");
  });

  /* ---------- le moteur, sur un cours ---------- */
  const cid=ids.includes("FISCA")?"FISCA":ids.find(c=>MM[c]);
  if(cid){
    E("S.active="+JSON.stringify(cid)); E("renderPath()");
    const pb=doc.getElementById("pathbody");
    const card=pb&&pb.querySelector(".mm-end");
    if(!card)ko("l'entree Mind map magique est absente du parcours");
    else{
      const pex=pb.querySelector(".pex-end");
      if(pex&&pex.nextElementSibling!==card)ko("la mind map doit venir juste sous l'examen pratique");
      if(pb.querySelectorAll(".mm-end").length!==1)ko("l'entree de la mind map est en double apres un second rendu");
    }
    E("renderPath()"); if(pb&&pb.querySelectorAll(".mm-end").length!==1)ko("entree en double apres un second renderPath");
    E("mmOpen("+JSON.stringify(cid)+")");
    const ov=doc.getElementById("mm-ov");
    if(!ov)ko("mmOpen n'ouvre rien");
    else{
      const n0=ov.querySelectorAll(".mm-n").length;
      if(!n0)ko("aucun mot cle affiche");
      if(ov.querySelectorAll(".mm-n.on").length)ko("des mots sont reveles des l'ouverture");
      if(!ov.querySelectorAll(".mm-b h3").length)ko("les grandes idees ne sont pas affichees");
      const cnt=()=>doc.getElementById("mm-cnt").textContent.replace(/\s+/g," ");
      if(!/^0 \/ \d+/.test(cnt()))ko("compteur initial inattendu : "+cnt());
      const a=ov.querySelector(".mm-n"); click(a);
      if(!a.classList.contains("on")||a.getAttribute("aria-pressed")!=="true")ko("un toucher ne revele pas");
      if(!/^1 \//.test(cnt()))ko("le compteur ne suit pas la revelation : "+cnt());
      click(a);
      if(a.classList.contains("on")||a.getAttribute("aria-pressed")!=="false")ko("un second toucher ne recouvre pas");
      click(a);
      /* changer de niveau garde ce qui est revele et ajoute des mots */
      click(ov.querySelector('.mm-sg[data-niv="2"]'));
      const n2=ov.querySelectorAll(".mm-n").length; if(n2<=n0)ko("le niveau 2 n'ajoute pas de mots ("+n0+" puis "+n2+")");
      if(!doc.getElementById("mm-ov").querySelector('.mm-n.on'))ko("le niveau 2 oublie ce qui etait revele");
      click(ov.querySelector('.mm-sg[data-niv="3"]'));
      const n3=ov.querySelectorAll(".mm-n").length; if(n3<=n2)ko("le niveau 3 n'ajoute pas de mots ("+n2+" puis "+n3+")");
      click(ov.querySelector('.mm-sg[data-niv="1"]'));
      if(ov.querySelectorAll(".mm-n").length!==n0)ko("retour au niveau 1 : nombre de mots different");
      /* tout reveler, tout cacher, une branche */
      click(doc.getElementById("mm-all"));
      if(ov.querySelectorAll(".mm-n:not(.on)").length)ko("Tout reveler laisse des mots caches");
      if(!new RegExp("^"+n0+" / "+n0).test(cnt()))ko("compteur apres Tout reveler : "+cnt());
      click(doc.getElementById("mm-none"));
      if(ov.querySelectorAll(".mm-n.on").length)ko("Tout cacher laisse des mots reveles");
      const bt=ov.querySelector(".mm-bt"), br=bt.closest(".mm-b");
      click(bt); if(br.querySelectorAll(".mm-n:not(.on)").length)ko("Voir une branche ne la revele pas complete");
      click(bt); if(br.querySelectorAll(".mm-n.on").length)ko("Cacher une branche ne la recouvre pas");
      /* clavier et fermeture */
      doc.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Escape",bubbles:true}));
      if(doc.documentElement.classList.contains("mm-lock"))ko("Echap ne libere pas le defilement");
      E("mmOpen("+JSON.stringify(cid)+")"); click(doc.getElementById("mm-x"));
      if(doc.documentElement.classList.contains("mm-lock"))ko("la croix ne libere pas le defilement");
      /* la feuille de style : texte flou tant que non revele, respect de l'encoche */
      const css=[...doc.querySelectorAll("style")].map(s=>s.textContent).join("\n");
      if(!/\.mm-t\{[^}]*filter:blur\(/.test(css))ko("le texte n'est pas floute dans la feuille de style");
      if(!/\.mm-n\.on \.mm-t\{[^}]*filter:blur\(0\)/.test(css))ko("rien ne retire le flou a la revelation");
      if(!/\.mm-ov\{[^}]*env\(safe-area-inset-top\)/.test(css))ko("la mind map ne respecte pas l'encoche");
      if(!/\.mm-body\{[^}]*env\(safe-area-inset-bottom\)/.test(css))ko("la mind map ne respecte pas la marge du bas");
      if(!/prefers-reduced-motion/.test(css.slice(css.indexOf(".mm-ov{"))))ko("pas de repli pour le mouvement reduit");
    }
  }
  console.log(stats.join("\n"));
  if(errs.length){ console.log("\nECHECS ("+errs.length+")"); errs.slice(0,60).forEach(e=>console.log(" - "+e)); if(errs.length>60)console.log(" ... et "+(errs.length-60)+" autres"); process.exit(1); }
  console.log("\nmind map magique : OK ("+stats.length+" cours)"); process.exit(0);
},2500);
