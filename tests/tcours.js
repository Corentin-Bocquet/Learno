/* Charte des cours : un test générique, paramétré par CID.
   CID=NEGO node tests/tcours.js
   - 32 exercices et 8 leçons par module, guide riche (mise en situation, mnémotechnique)
   - formats variés, au moins 4 conversations par module, 8 QCM classiques maximum
   - aucune bonne réponse repérable à sa longueur
   - pas de doublon, pas de tiret cadratin, une explication à chaque exercice
   - couverture des notions : chaque ligne de cours/<CID>/notions.txt doit apparaître
     dans au moins un guide et dans plusieurs exercices (5 pour une notion marquée *, 3 sinon) */
const fs=require('fs');const path=require('path');
const {JSDOM,VirtualConsole}=(()=>{try{return require('jsdom')}catch(e){return require('/tmp/node_modules/jsdom')}})();
const CID=process.env.CID; if(!CID){console.log("ERREURS: 1 [ 'CID manquant' ]");process.exit(0);}
const html=fs.readFileSync(process.env.LEARNO_HTML||path.join(__dirname,'..','index.html'),'utf8');
const errs=[];const vc=new VirtualConsole();
vc.on("jsdomError",e=>{if(!/getContext|HTMLMediaElement|Not implemented/.test(e.message))errs.push("jsdom: "+e.message.slice(0,160))});
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/",virtualConsole:vc,
  beforeParse(w){ w.HTMLMediaElement.prototype.play=()=>Promise.resolve(); w.HTMLMediaElement.prototype.pause=()=>{};
    w.fetch=()=>Promise.reject(new Error("hors ligne")); }});
const w=dom.window, E=x=>w.eval(x), ko=m=>errs.push(m);
const norm=s=>String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[’']/g,"'");

setTimeout(()=>{
  const C=JSON.parse(E(`JSON.stringify(COURSES.find(c=>c.id==='${CID}')||null)`));
  if(!C){ko("cours "+CID+" absent de COURSES");}
  else{
    if(!C.mix)ko("le cours doit porter mix:true");
    if(!C.cat||!E(`!!CATS.find(k=>k.id==='${C.cat}')`))ko("catégorie inconnue : "+C.cat);
    if(!/ : /.test(C.name))ko("nom du cours sans promesse (format « Sujet : promesse ») : "+C.name);
  }
  const U=JSON.parse(E(`JSON.stringify(courseUnits('${CID}').map(u=>({id:u.id,n:unitExos(u.id).length,l:lessonsIn(u.id),g:u.guide||''})))`));
  const MIN=+(process.env.MIN_UNITS||12);
  if(U.length<MIN)ko(CID+" : "+U.length+" modules (minimum "+MIN+")");
  const X=JSON.parse(E(`JSON.stringify(EXOS.filter(e=>unitOf(e.u)&&unitOf(e.u).c==='${CID}'))`));
  console.log(CID,":",U.length,"modules,",X.length,"exercices");
  U.forEach(u=>{
    if(u.n!==32)ko("module "+u.id+" : "+u.n+" exercices au lieu de 32");
    if(u.l!==8)ko("module "+u.id+" : "+u.l+" leçons au lieu de 8");
    if(u.g.length<2500)ko("module "+u.id+" : guide trop court ("+u.g.length+")");
    if(!/gmnemo/.test(u.g))ko("module "+u.id+" : pas de moyen mnémotechnique");
    if(!/gstory/.test(u.g))ko("module "+u.id+" : pas de mise en situation");
    if(/—/.test(u.g))ko("tiret cadratin dans le guide "+u.id);
    const l=X.filter(e=>e.u===u.id), ty=new Set(l.map(e=>e.t));
    if(ty.size<8)ko("module "+u.id+" : "+ty.size+" formats seulement");
    if(l.filter(e=>e.t==="story").length<4)ko("module "+u.id+" : moins de 4 conversations");
    if(l.filter(e=>e.t==="mcq").length>8)ko("module "+u.id+" : trop de QCM classiques");
  });
  const parType={}; X.forEach(e=>parType[e.t]=(parType[e.t]||0)+1);
  console.log("formats :",JSON.stringify(parType));
  /* longueur des réponses */
  const ch=X.filter(e=>["mcq","fill","story"].includes(e.t)); let lg=0, rat=[];
  ch.forEach(e=>{const L=e.o.map(x=>x.length),b=L[e.a],o=L.filter((_,k)=>k!==e.a);
    if(o.every(x=>b>x))lg++; rat.push(b/(o.reduce((a,c)=>a+c,0)/o.length));});
  const part=ch.length?lg/ch.length:0, moy=rat.length?rat.reduce((a,c)=>a+c,0)/rat.length:1;
  console.log("bonne réponse la plus longue :",Math.round(part*100)+"% | ratio :",moy.toFixed(2));
  if(part>.34)ko("bonne réponse la plus longue dans "+Math.round(part*100)+"% des cas");
  if(ch.length>=40&&part<.12)ko("bonne réponse presque jamais la plus longue ("+Math.round(part*100)+"%)");
  if(moy>1.12)ko("bonnes réponses trop longues en moyenne ("+moy.toFixed(2)+")");
  /* rédaction */
  const vus={};
  X.forEach(e=>{
    const k=norm(e.q+"|"+(e.ctx||"")+"|"+JSON.stringify(e.sc||"")+"|"+JSON.stringify(e.it||e.p||""));
    if(vus[k])ko("doublon : "+e.i+" et "+vus[k]); vus[k]=e.i;
    if(!e.w||e.w.length<40)ko("explication trop courte : "+e.i);
    if(/—/.test(JSON.stringify(e)))ko("tiret cadratin : "+e.i);
    if(e.o&&new Set(e.o).size!==e.o.length)ko("propositions identiques : "+e.i);
    if(e.t==="multi"&&e.a.length===e.o.length)ko("toutes les cases justes : "+e.i);
    if(e.t==="sort"&&new Set(e.it.map(x=>x[1])).size<2)ko("classement à une case : "+e.i);
  });
  /* couverture des notions */
  const fn=path.join(__dirname,'..','cours',CID,'notions.txt');
  if(!fs.existsSync(fn))ko("fichier des notions absent : cours/"+CID+"/notions.txt");
  else{
    const guides=norm(U.map(u=>u.g.replace(/<[^>]+>/g," ")).join(" "));
    const textes=X.map(e=>norm(JSON.stringify(e)));
    const lignes=fs.readFileSync(fn,'utf8').split(/\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith('#'));
    let manques=0;
    lignes.forEach(li=>{
      const coeur=li.startsWith('*'), vars=li.replace(/^\*/,'').split('|').map(s=>norm(s.trim())).filter(Boolean);
      const dansGuide=vars.some(v=>guides.includes(v));
      const nEx=textes.filter(t=>vars.some(v=>t.includes(v))).length, min=coeur?5:3;
      if(!dansGuide){ko("notion absente des guides : "+vars[0]);manques++;}
      if(nEx<min){ko("notion trop peu entraînée ("+nEx+"/"+min+") : "+vars[0]);manques++;}
    });
    console.log("notions vérifiées :",lignes.length,"| manquantes :",manques);
  }
  if(errs.length){console.log("\nERREURS:",errs.length,errs.slice(0,60));process.exit(0);}
  console.log("\nERREURS: 0 []");process.exit(0);
},3000);
