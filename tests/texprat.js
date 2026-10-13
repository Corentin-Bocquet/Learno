/* Examen pratique : banques de cas (cours/<CID>/examen.js) et moteur (design/arcade/exprat.js).
   node tests/texprat.js            toutes les banques
   CID=PATRI node tests/texprat.js  une seule banque
   - structure des cas et des cartes, charte (pas de tiret cadratin, explications, biais de longueur)
   - tirage pour 15, 30, 60 et 90 minutes, identique en cours express ou non
   - note sur 20 : tout juste = 20, tout faux = tres bas, credit partiel, temps ecoule
   - aucune carte de l'examen n'entre dans la repetition espacee ni dans les erreurs */
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

function answer(ex,correct){
  if(["tf","mcq","fill","story","cards","spot","dames","studio"].includes(ex.t)){
    const btns=[...doc.querySelectorAll("#qwrap .choice")];
    const good=btns.find(b=>{const r=b.dataset.v;return ex.t==="tf"?((r==="1")===ex.a):(parseInt(r)===ex.a);});
    click(correct?good:btns.find(b=>b!==good));
  }else if(ex.t==="num"){const i=doc.querySelector("#numin");i.value=correct?String(ex.a):"-99999";
    i.dispatchEvent(new w.Event("input",{bubbles:true}));}
  else if(ex.t==="tiles"||ex.t==="eq"){
    const sel=ex.t==="eq"?".chip":".tile";
    (correct?ex.a:[...ex.a].reverse()).forEach(x=>{
      const t=[...doc.querySelectorAll("#bank "+sel)].find(b=>!b.classList.contains("used")&&b.textContent===x);
      click(t);});}
  else if(ex.t==="match"){ex.p.forEach((pr,i)=>{
      const tgt=correct?pr[1]:ex.p[(i+1)%ex.p.length][1];
      click([...doc.querySelectorAll('[id^="ml"]')].find(b=>b.textContent===pr[0]&&!b.classList.contains("good")));
      click([...doc.querySelectorAll('[id^="mr"]')].find(b=>b.textContent===tgt&&!b.classList.contains("good")));});
    if(doc.querySelector("#btn-check").disabled){ex.p.forEach(pr=>{
      click([...doc.querySelectorAll('[id^="ml"]')].find(b=>b.textContent===pr[0]&&!b.classList.contains("good")));
      click([...doc.querySelectorAll('[id^="mr"]')].find(b=>b.textContent===pr[1]&&!b.classList.contains("good")));});}}
  else if(ex.t==="slider"){ w.eval("sliderMove("+(correct?ex.a:ex.min)+")");}
  else if(ex.t==="sort"){ ex.it.forEach((it,k)=>w.eval("sortTap("+k+","+(correct?it[1]:(it[1]+1)%ex.bins.length)+")"));}
  else if(ex.t==="multi"){
    /* le moteur tire parfois d autres propositions : on repond d apres ce qui est affiche */
    const sh=w.eval("A.ex"); const want=correct?sh.a:[sh.o.map((_,k)=>k).find(k=>!sh.a.includes(k))];
    want.forEach(k=>click(doc.querySelector('#qwrap .mchk[data-m="'+k+'"]')));}
  else if(ex.t==="order"){ if(!correct){ w.eval("moveO(0,1)"); w.eval("moveO(1,1)"); }
    for(let p=0;correct&&p<80;p++){const o=w.eval("A.order.slice()");let sw=false;
      for(let i=0;i<o.length-1;i++){if(o[i]>o[i+1]){w.eval("moveO("+i+",1)");sw=true;break;}}if(!sw)break;}}
  const b=doc.querySelector("#btn-check");
  if(b.disabled){ko("bouton bloqué "+ex.i+" ("+ex.t+")");return false;}
  click(b);
  return true;
}
/* joue un examen en entier ; mode : "juste", "faux" */
function jouer(cid,min,mode){
  E(`pexStart(${JSON.stringify(cid)},${min})`);
  if(!E("!!(L&&L.pex)")){ko(cid+" : l'examen ne démarre pas");return null;}
  const n=E("L.queue.length");
  for(let k=0;k<n;k++){
    const ex=E("A&&A.ex"); if(!ex){ko(cid+" : pas de rendu à la question "+(k+1));return null;}
    if(!doc.querySelector("#exam-bar"))ko(cid+" : barre d'examen absente");
    const src=E("L.queue["+k+"]");
    answer(ex,mode==="juste");
    click(doc.querySelector("#btn-check"));  /* question suivante ou fin */
  }
  const note=E("(S.pexams&&S.pexams.length)?S.pexams[S.pexams.length-1]:null");
  return {n,note,body:doc.getElementById("exambody").textContent};
}

setTimeout(()=>{
  E("S.settings.hearts=false;S.admin=true");
  const noms=JSON.parse(E("JSON.stringify(Object.keys(window.PEXAM||{}))")).filter(c=>!ONLY||c===ONLY);
  if(!noms.length)ko("aucune banque d'examen pratique"+(ONLY?" pour "+ONLY:""));
  const tout=JSON.parse(E("JSON.stringify(Object.keys(window.PEXAM||{}))"));
  console.log("banques :",tout.join(", "));
  const EMOJI=/[\u{1F300}-\u{1FAFF}☀-➿]/u;
  noms.forEach(cid=>{
    const B=JSON.parse(E(`JSON.stringify(PEXAM[${JSON.stringify(cid)}])`));
    if(!E(`!!COURSES.find(c=>c.id==='${cid}')`))ko(cid+" : cours absent de COURSES");
    const cases=B.cases||[], docs=B.docs||[];
    const unites=JSON.parse(E(`JSON.stringify(UNITS.filter(u=>u.c==='${cid}').map(u=>u.id))`));
    if(cases.length<8)ko(cid+" : "+cases.length+" cas (minimum 8)");
    const ids={}; let totMin=0, nCartes=0; const fmt={}, ch=[]; let tfV=0, tfN=0; const idxs=[0,0,0,0,0,0]; let nIdx=0;
    docs.forEach((d,i)=>{ if(!d.t||!d.h)ko(cid+" : document "+i+" incomplet"); if(/—/.test(d.t+d.h))ko(cid+" : tiret cadratin dans un document"); });
    cases.forEach(cs=>{
      if(ids[cs.id])ko(cid+" : cas en double "+cs.id); ids[cs.id]=1;
      if(!cs.t||!/[a-zà-ÿ]/.test(cs.t))ko(cid+"/"+cs.id+" : titre manquant");
      if(!cs.ctx||cs.ctx.length<60)ko(cid+"/"+cs.id+" : énoncé trop court");
      if(!Array.isArray(cs.mods)||!cs.mods.length)ko(cid+"/"+cs.id+" : modules à revoir manquants");
      else cs.mods.forEach(u=>{ if(!unites.includes(u))ko(cid+"/"+cs.id+" : module "+u+" inconnu"); });
      if(cs.cards.length<3||cs.cards.length>7)ko(cid+"/"+cs.id+" : "+cs.cards.length+" cartes (3 à 7)");
      if(/—/.test(JSON.stringify(cs)))ko(cid+"/"+cs.id+" : tiret cadratin");
      if(EMOJI.test(JSON.stringify(cs)))ko(cid+"/"+cs.id+" : emoji littéral");
      totMin+=E(`pexCaseMin(${JSON.stringify(cs)})`);
      cs.cards.forEach((e,n)=>{
        const id=cid+"/"+cs.id+"#"+(n+1); nCartes++; fmt[e.t]=(fmt[e.t]||0)+1;
        const need={mcq:['o','a'],fill:['o','a'],story:['o','a','sc'],tf:['a'],num:['a'],tiles:['a'],eq:['a'],match:['p'],order:['it'],slider:['min','max','a'],sort:['bins','it'],multi:['o','a']}[e.t];
        if(!need){ko(id+" : type "+e.t+" non géré par l'examen");return;}
        need.forEach(k=>{ if(e[k]===undefined)ko(id+" : manque "+k); });
        if(!e.q)ko(id+" : pas de question"); if(!e.w||e.w.length<40)ko(id+" : explication trop courte");
        if(["mcq","fill","story"].includes(e.t)){ if(!(e.a>=0&&e.a<e.o.length))ko(id+" : index"); if(e.o.length<3)ko(id+" : moins de 3 choix");
          ch.push(e); idxs[e.a]++; nIdx++; }
        if(e.o&&new Set(e.o).size!==e.o.length)ko(id+" : propositions identiques");
        if(e.t==="tf"){ if(typeof e.a!=="boolean")ko(id+" : tf sans booléen"); tfN++; if(e.a)tfV++; }
        if(e.t==="num"&&typeof e.a!=="number")ko(id+" : num sans nombre");
        if(e.t==="slider"&&!(e.a>=e.min&&e.a<=e.max))ko(id+" : slider hors bornes");
        if(e.t==="multi"&&(!e.a.length||e.a.length===e.o.length||e.a.some(k=>k>=e.o.length)))ko(id+" : multi invalide");
        if(e.t==="sort"&&(e.it.some(x=>!(x[1]>=0&&x[1]<e.bins.length))||new Set(e.it.map(x=>x[1])).size<2))ko(id+" : sort invalide");
        if(e.t==="story"&&!(Array.isArray(e.sc)&&e.sc.length))ko(id+" : story sans dialogue");
        if(e.t==="num"&&e.tol==null)ko(id+" : num sans tolérance");
        if(/—/.test(JSON.stringify(e)))ko(id+" : tiret cadratin");
        if(EMOJI.test(JSON.stringify(e)))ko(id+" : emoji littéral");
      });
    });
    const nf=Object.keys(fmt).length;
    if(nf<6)ko(cid+" : "+nf+" formats seulement (minimum 6)");
    if((fmt.story||0)<4&&!["MRC","NUTRI","MMA","TENNIS","FOOT","ECHECS","RUBIK","SPINO"].includes(cid))ko(cid+" : moins de 4 conversations");
    if((fmt.mcq||0)>nCartes*.3)ko(cid+" : trop de QCM classiques ("+fmt.mcq+")");
    if(totMin<80)ko(cid+" : "+Math.round(totMin)+" minutes de matière, il en faut 80 au moins pour remplir 90 minutes");
    let lg=0, rat=[]; ch.forEach(e=>{const L=e.o.map(x=>x.length),b=L[e.a],o=L.filter((_,k)=>k!==e.a);
      if(o.every(x=>b>x))lg++; rat.push(b/(o.reduce((a,c)=>a+c,0)/o.length));});
    const part=ch.length?lg/ch.length:0, moy=rat.length?rat.reduce((a,c)=>a+c,0)/rat.length:1;
    if(part>.34)ko(cid+" : bonne réponse la plus longue dans "+Math.round(part*100)+"% des cas");
    if(ch.length>=30&&part<.12)ko(cid+" : bonne réponse presque jamais la plus longue ("+Math.round(part*100)+"%)");
    if(moy>1.12)ko(cid+" : bonnes réponses trop longues en moyenne ("+moy.toFixed(2)+")");
    if(ch.length>=20&&moy<.88)ko(cid+" : bonnes réponses trop courtes en moyenne ("+moy.toFixed(2)+")");
    if(ch.length>=20&&part<.08)ko(cid+" : bonne réponse presque jamais la plus longue ("+Math.round(part*100)+"%)");
    if(tfN>=8&&(tfV/tfN<.35||tfV/tfN>.65))ko(cid+" : vrai ou faux déséquilibré ("+tfV+"/"+tfN+")");
    console.log(cid,":",cases.length,"cas,",nCartes,"cartes,",Math.round(totMin),"min,",nf,"formats | longue:",Math.round(part*100)+"%","ratio",moy.toFixed(2));
  });

  /* ---------- moteur : tirage, note, isolation ---------- */
  const cid=ONLY||noms[0];
  if(cid){
    [15,30,60,90].forEach(min=>{
      for(const express of [false,true]){
        E(`S.settings.express=${express}`);
        const r=JSON.parse(E(`(()=>{pexStart(${JSON.stringify(cid)},${min});const q=L.queue;const o={n:q.length,m:Math.round(10*L.pex.cases.reduce((a,c)=>a+pexCaseMin(PEXAM[${JSON.stringify(cid)}].cases.find(x=>x.id===c.id)),0))/10,ids:q.map(e=>e.i),cases:L.pex.cases.length};examQuit();return JSON.stringify(o)})()`));
        if(!r.n)ko(cid+" "+min+" min : aucune question");
        if(r.ids.some(i=>!/^px_/.test(i)))ko(cid+" : une carte de l'examen n'est pas de la banque");
        if(r.m>min*1.08+.01)ko(cid+" "+min+" min : "+r.m+" minutes de matière, trop pour la durée");
        if(min>=60&&r.m<min*.6)ko(cid+" "+min+" min : seulement "+r.m+" minutes de matière");
        if(min>=30&&r.cases<2)ko(cid+" "+min+" min : un seul cas");
        if(!express)console.log("  "+min+" min :",r.cases,"cas,",r.n,"questions,",r.m,"min de matière");
      }
    });
    E("S.settings.express=false");
    /* tout juste : 20 sur 20 */
    let r=jouer(cid,90,"juste");
    if(r){
      if(!r.note||r.note.note!==20)ko(cid+" : tout juste donne "+(r.note&&r.note.note)+" au lieu de 20");
      if(!/\/ 20/.test(r.body)||!/Très bien/.test(r.body))ko(cid+" : écran de résultat incomplet");
      console.log("  tout juste :",r.note&&r.note.note,"/ 20 sur",r.n,"questions");
    }
    /* tout faux : tres bas, correction detaillee */
    r=jouer(cid,60,"faux");
    if(r){
      if(!r.note||r.note.note>8)ko(cid+" : tout faux donne "+(r.note&&r.note.note));
      if(!/Correction détaillée/.test(r.body)||!/Bonne réponse|Les bonnes/.test(r.body))ko(cid+" : correction détaillée absente");
      console.log("  tout faux  :",r.note&&r.note.note,"/ 20");
    }
    /* isolation : rien dans la repetition espacee ni les erreurs */
    const pol=JSON.parse(E(`JSON.stringify({items:Object.keys(S.items||{}).filter(k=>/^px_/.test(k)),mist:(S.mistakes||[]).filter(k=>/^px_/.test(k))})`));
    if(pol.items.length||pol.mist.length)ko(cid+" : l'examen pollue la répétition espacée ("+pol.items.length+"/"+pol.mist.length+")");
    /* temps ecoule : les questions non traitees valent zero */
    E(`pexStart(${JSON.stringify(cid)},30)`);
    const ex0=E("A&&A.ex"); answer(ex0,true); click(doc.querySelector("#btn-check"));
    E("L.exam.t0-=L.exam.limit+5000;examChrono()");
    const nb=E("S.pexams[S.pexams.length-1]");
    if(!/temps écoulé/.test(doc.getElementById("exambody").textContent))ko(cid+" : fin par temps écoulé non signalée");
    if(!(nb.note<20))ko(cid+" : temps écoulé sans pénalité");
    console.log("  temps écoulé :",nb.note,"/ 20");
    /* entrees : onglet Examen et fin de parcours */
    E("S.active="+JSON.stringify(cid)+";setTab('exam')");
    const c=doc.getElementById("pex-card");
    if(!c)ko(cid+" : carte Examen pratique absente de l'onglet Examen");
    else if(c.querySelectorAll(".pex-dur").length!==4)ko(cid+" : il faut 4 durées");
    E("S.active="+JSON.stringify(cid)+";setTab('path')");
    if(!doc.querySelector("#pathbody .pex-end"))ko(cid+" : entrée absente en fin de parcours");
    if(E(`!!(PEXAM[${JSON.stringify(cid)}].docs||[]).length`)){
      E(`pexStart(${JSON.stringify(cid)},15)`);
      if(!doc.getElementById("pex-docs"))ko(cid+" : bouton des tableaux absent");
      else { click(doc.getElementById("pex-docs")); if(!doc.querySelector(".pex-doc"))ko(cid+" : documents non affichés"); E("closeModal();examQuit()"); }
    }
  }
  console.log("ERREURS:",errs.length,errs.slice(0,15));
  process.exit(0);
},1500);
