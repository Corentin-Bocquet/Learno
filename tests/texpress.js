/* Couche confort (01/10/2026) : calculatrice, réponses équivalentes, corrections
   lisibles, glossaire, potions et jauge, gel, épreuve légendaire obligatoire,
   leçon avant chaque quiz, écran de chargement et réglage anti-zoom. */
const fs=require('fs'), path=require('path');
const {JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const errs=[], ko=m=>errs.push(m);
const vc=new VirtualConsole();
vc.on("jsdomError",e=>{if(!/getContext|HTMLMediaElement|Not implemented/.test(e.message))errs.push("jsdom: "+e.message.slice(0,180))});
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/",virtualConsole:vc,
  beforeParse(w){
    w.HTMLMediaElement.prototype.play=()=>Promise.resolve(); w.HTMLMediaElement.prototype.pause=()=>{};
    w.fetch=()=>Promise.reject(new Error("hors ligne"));
    w.matchMedia=w.matchMedia||(q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}));
  }});
const w=dom.window, doc=w.document, E=x=>w.eval(x);
const wait=ms=>new Promise(r=>setTimeout(r,ms));

/* Cours express (12/10/2026) : chaque exercice d un module n est pose qu une fois. */
(async()=>{
await wait(2500);
const go=doc.querySelector("#ob-go"); if(go)go.dispatchEvent(new w.MouseEvent("click",{bubbles:true})); await wait(200);
E("if(typeof authSkip==='function')authSkip()"); await wait(100);
const cid="PATRI";
E(`S.active=${JSON.stringify(cid)};if(!S.courses[S.active])S.courses[S.active]=courseState();`);
const us=E(`courseUnits(S.active).map(u=>u.id)`);
const normal=E(`lessonsIn(${us[0]})`);
if(normal!==8)ko("mode normal : 8 lecons attendues, "+normal);
E("S.settings.express=true");
const vus={}; let rappelsHors=0;
us.slice(0,3).forEach((uid,ui)=>{
  const nL=E(`lessonsIn(${uid})`), n=E(`unitExos(${uid}).length`);
  if(nL!==Math.ceil(n/6))ko("express : "+nL+" lecons pour "+n+" exercices");
  for(let li=0;li<nL;li++){
    const q=E(`buildLesson(${uid},${li},"normal").queue.map(e=>e.i+"|"+e.u)`);
    if(q.length<3||q.length>7)ko("express : lecon de "+q.length+" questions");
    q.forEach(s=>{ const [i,u]=s.split("|"); if(+u===uid)vus[i]=(vus[i]||0)+1; else if(us.indexOf(+u)>=ui)rappelsHors++;
      E(`S.items[${JSON.stringify(i)}]={n:1,c:1,t:Date.now(),s:1}`); });
    E(`S.courses[S.active].lessons[lkey(${uid},${li})]=3`);
  }
  E(`unitExos(${uid})`).forEach(e=>{ const k=vus[e.i]||0; if(k<1||k>2)ko("express : "+e.i+" vu "+k+" fois"); });
});
if(rappelsHors)ko("express : "+rappelsHors+" rappels hors des modules deja faits");
const dbl=Object.values(vus).filter(k=>k>1).length;
if(dbl>3*2)ko("express : trop de doublons ("+dbl+")");
E("renderProfile()"); await wait(30);
if(!/Cours express/.test(doc.body.innerHTML))ko("bouton Cours express absent des reglages");
E("S.settings.express=false");
if(E(`lessonsIn(${us[0]})`)!==8)ko("le mode normal ne revient pas");
console.log(errs.length?errs.join("\n"):"texpress OK");
process.exit(errs.length?1:0);
})();
