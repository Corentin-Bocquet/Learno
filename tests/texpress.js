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

/* 1. chaque module de chaque cours : 18 exercices au plus (20 si un cas pratique l impose) */
const tous=E(`UNITS.map(u=>[u.id,unitExos(u.id).length,expressPool(u.id).length,expressPool(u.id).every(e=>e.u===u.id),new Set(expressPool(u.id).map(e=>e.i)).size])`);
let reduits=0;
tous.forEach(([id,n,m,ok,uniq])=>{
  if(!ok||uniq!==m)ko("module "+id+" : pool express incoherent");
  if(n<=18){ if(m!==n)ko("module "+id+" : petit module modifie"); }
  else { reduits++; if(m<18||m>21)ko("module "+id+" : "+m+" exercices express pour "+n); }
});
/* un cas pratique en plusieurs cartes n est jamais coupe */
const coupes=E(`UNITS.filter(u=>{const a=unitExos(u.id),b=expressPool(u.id);if(a.length<=18)return false;
  const cas={};a.forEach(e=>{if(e.cas)(cas[e.cas]=cas[e.cas]||[]).push(e.i)});
  const ids=new Set(b.map(e=>e.i));return Object.values(cas).some(g=>{const k=g.filter(i=>ids.has(i)).length;return k>0&&k<g.length;});}).length`);
if(coupes)ko(coupes+" modules avec un cas pratique coupe");
/* l ordre du module est conserve */
const desordre=E(`UNITS.filter(u=>{const a=unitExos(u.id).map(e=>e.i),b=expressPool(u.id).map(e=>a.indexOf(e.i));
  return unitExos(u.id).length>18&&b.some((x,i)=>i&&x<b[i-1]&&!expressPool(u.id)[i].cas);}).length`);
if(desordre)ko(desordre+" modules dont l ordre n est pas conserve");

/* 2. parcours : chaque exercice du module une seule fois, rappels des modules precedents */
const vus={}; let rappelsHors=0, rappels=0;
us.slice(0,3).forEach((uid,ui)=>{
  const nL=E(`lessonsIn(${uid})`), n=E(`expressPool(${uid}).length`);
  if(nL!==Math.ceil(n/5))ko("express : "+nL+" lecons pour "+n+" exercices");
  for(let li=0;li<nL;li++){
    const q=E(`buildLesson(${uid},${li},"normal").queue.map(e=>e.i+"|"+e.u)`);
    if(q.length<3||q.length>7)ko("express : lecon de "+q.length+" questions");
    q.forEach(s=>{ const [i,u]=s.split("|"); if(+u===uid)vus[i]=(vus[i]||0)+1; else if(us.indexOf(+u)>=ui)rappelsHors++; else rappels++;
      E(`S.items[${JSON.stringify(i)}]={n:1,c:1,t:Date.now(),s:1}`); });
    E(`S.courses[S.active].lessons[lkey(${uid},${li})]=3`);
  }
  E(`expressPool(${uid})`).forEach(e=>{ const k=vus[e.i]||0; if(k!==1)ko("express : "+e.i+" vu "+k+" fois dans son module"); });
});
if(rappelsHors)ko("express : "+rappelsHors+" rappels hors des modules deja faits");
if(rappels<6)ko("express : trop peu de rappels d anciens modules ("+rappels+")");

/* 3. l epreuve legendaire pioche toujours dans tout le module */
const leg=E(`(function(){const u=${us[1]};const q=buildLesson(u,0,"legend").queue;return [q.length,q.every(e=>e.u===u),unitExos(u).length]})()`);
if(leg[0]!==10||!leg[1])ko("epreuve legendaire express : "+JSON.stringify(leg));
console.log("modules reduits a 18 :",reduits,"| rappels sur 3 modules :",rappels);
/* 4. express : tout est ouvert dans le desordre, epreuves legendaires comprises */
E("S.settings.express=false");
E(`S.active="NEGO";`);
const nu=E(`courseUnits("NEGO").map(u=>u.id)`), dernier=nu[nu.length-1], milieu=nu[Math.floor(nu.length/2)];
if(E(`unitUnlocked(${dernier})`))ko("mode normal : le dernier module devrait rester verrouille");
E("S.settings.express=true");
nu.forEach(id=>{ if(!E(`unitUnlocked(${id})`))ko("express : module "+id+" verrouille"); });
/* un module du milieu, sans rien avoir fait avant : leçon sans rappel, pas d erreur */
const q0=E(`buildLesson(${milieu},0,"normal").queue.map(e=>e.u)`);
if(!q0.length||q0.some(u=>u!==milieu))ko("express : lecon du module du milieu incoherente "+JSON.stringify(q0));
/* un module fait, puis un autre module fait avant lui : rappels venus de tous les modules deja vus */
E(`unitExos(${dernier}).slice(0,6).forEach(e=>{S.items[e.i]={n:1,c:1,t:Date.now()-86400000,s:1}})`);
const q1=E(`buildLesson(${nu[0]},0,"normal").queue.map(e=>e.u)`);
if(!q1.includes(dernier))ko("express : aucun rappel du module deja fait plus loin dans le cours");
if(q1.some(u=>u!==nu[0]&&u!==dernier))ko("express : rappel d un module jamais vu");
/* l epreuve legendaire se lance sans rien avoir fait avant */
E(`startLesson(${dernier},-1)`); await wait(50);
const lg=E(`[L&&L.mode,L&&L.queue.length]`);
if(lg[0]!=="legend"||lg[1]!==10)ko("express : epreuve legendaire non lancee "+JSON.stringify(lg));
E(`L=null;show("path")`);
/* le bouton de l epreuve n est pas verrouille dans le chemin */
E("renderPath()"); await wait(50);
const verrous=doc.querySelectorAll("#sc-path .arc-card.arc-mod.lock").length, legendes=doc.querySelectorAll("#sc-path .arc-dot.legend.on").length;
if(verrous)ko("express : "+verrous+" modules encore verrouilles dans le chemin");
if(legendes<nu.length)ko("express : "+legendes+" epreuves legendaires actives sur "+nu.length);
/* les jeux ne piochent que dans les modules commences */
const jeu=E(`arcPool(()=>true).map(e=>e.u)`);
if(jeu.some(u=>u!==dernier))ko("express : un jeu pioche dans un module jamais commence");
E("S.settings.express=false");
if(E(`unitUnlocked(${dernier})`))ko("retour au mode normal : modules de nouveau verrouilles attendu");
E("S.settings.express=true");

E("renderProfile()"); await wait(30);
if(!/Cours express/.test(doc.body.innerHTML))ko("bouton Cours express absent des reglages");
E("S.settings.express=false");
if(E(`lessonsIn(${us[0]})`)!==8)ko("le mode normal ne revient pas");
console.log("cours express : "+(errs.length?"a corriger":"tout est bon")); console.log("ERREURS: "+errs.length+(errs.length?"\n"+errs.join("\n"):""));
process.exit(errs.length?1:0);
})();
