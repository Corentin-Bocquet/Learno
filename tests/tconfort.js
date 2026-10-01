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

(async()=>{
await wait(2500);
const go=doc.querySelector("#ob-go"); if(go)go.dispatchEvent(new w.MouseEvent("click",{bubbles:true})); await wait(200);
E("if(typeof authSkip==='function')authSkip()"); await wait(100);

/* 0. regles de redaction des sources */
["glossaire.js","arcade.js","extras.js","arcade.css"].forEach(f=>{
  const s=fs.readFileSync(path.join(__dirname,'..','design','arcade',f),'utf8');
  if(s.includes("\u2014"))ko("tiret cadratin dans "+f);
  if(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/u.test(s))ko("emoji litteral dans "+f);
});
if(!/name="viewport" content="[^"]*maximum-scale=1/.test(html))ko("viewport sans maximum-scale=1 (zoom a la saisie)");
if(!/touch-action:manipulation/.test(html))ko("touch-action:manipulation absent (zoom au double toucher)");
if(/setTimeout\(function\(\)\{d\.classList\.remove\("arc-wait"\)\},6000\)/.test(html))ko("le masque de lancement se leve encore au bout de 6 s");
if(!/arcLSpin/.test(html))ko("ecran de chargement anime absent");

/* 1. calculatrice */
const C=[["2(3+4)",14],["2^10",1024],["200+10%",220],["√(16)+2²",8],["-2^2",-4],["log(1000)",3],["5(2+3)(1+1)",50],["(1+0,05)^2",1.1025],["3π",3*Math.PI]];
C.forEach(([x,v])=>{ let r; try{ r=E(`arcCalcEval(${JSON.stringify(x)})`); }catch(e){ r="erreur"; }
  if(typeof r!=="number"||Math.abs(r-v)>1e-9)ko("calcul faux : "+x+" = "+r+" au lieu de "+v); });
E("openCalc()"); await wait(30);
const touches=[...doc.querySelectorAll("#calc-wrap .ckey")].map(b=>b.textContent.trim());
["xʸ","x²","√","ln","eˣ","log","π","%","Ans","(",")"].forEach(k=>{ if(!touches.includes(k))ko("touche absente : "+k); });
E("closeCalc()");
console.log("calculatrice :",touches.length,"touches");

/* 2. reponses equivalentes */
const t=(id,ws)=>E(`arcTilesOk(EXOS.find(e=>e.i===${JSON.stringify(id)}),${JSON.stringify(ws)})`);
if(!t("101a",["EL","=","LGD","x","PD","x","EAD"]))ko("formule commutee refusee (EL = LGD x PD x EAD)");
if(!t("101a",["PD","x","LGD","x","EAD","=","EL"]))ko("formule aux cotes inverses refusee");
if(t("101a",["EL","=","LGD","+","PD","x","EAD"]))ko("formule fausse acceptee");
if(!t("29l","Habille-toi pour l'heure , le lieu et les gens présents".split(" ")))ko("variante juste de 29l refusee");
if(t("29l","Habille-toi pour les gens présents , l'heure et le lieu".split(" ")))ko("variante non listee acceptee");
const usu=E(`EXOS.find(e=>e.i==="p137_22").a`);
if(t("p137_22",usu.slice().reverse()))ko("phrase dans le desordre acceptee");
const n=(a,v)=>E(`arcNumOk({t:"num",a:${a}},${JSON.stringify(v)})`);
[["1234.567","1 234,57"],["1234.567","1235"],["1234.567","1.234,57"],["1234.567","1200+34,567"],["0.6","0,60"]].forEach(([a,v])=>{ if(!n(a,v))ko("nombre juste refuse : "+v+" pour "+a); });
[["0.6","1"],["1234.567","1230"],["12.5","13"]].forEach(([a,v])=>{ if(n(a,v))ko("nombre faux accepte : "+v+" pour "+a); });
E(`(()=>{const e=EXOS.find(x=>x.i==="101a");S.active=unitOf(e.u).c;L=buildLesson(e.u,0,"normal");L.queue=[e];show("lesson");renderQ(e);
  ["PD","x","LGD","x","EAD","=","EL"].forEach(wd=>{ const k=A.bank.findIndex((b,j)=>b===wd&&!A.tiles.some(t=>t.k===j)); if(k>=0)tileAdd(k); }); doCheck(); })()`);
await wait(30);
if(!doc.querySelector("#checkbar.good"))ko("la formule equivalente n est pas validee en lecon");
if(!doc.querySelector("#checkbar .arc-alt"))ko("pas de message « ta formulation est juste aussi »");

/* 3. corrections lisibles */
E(`(()=>{const e=EXOS.find(x=>x.t==="sort");L=buildLesson(e.u,0,"normal");L.queue=[e];show("lesson");renderQ(e);
  e.it.forEach((it,k)=>sortTap(k,(it[1]+1)%e.bins.length)); doCheck(); })()`);
await wait(30);
const vw=doc.querySelector("#checkbar .vw");
if(!vw||!vw.querySelector(".arc-solbin"))ko("classement corrige sans liste par case");
if(vw&&/ · /.test(vw.textContent))ko("correction encore separee par des points medians");
E(`(()=>{const e=EXOS.find(x=>x.t==="match");L=buildLesson(e.u,0,"normal");L.queue=[e];show("lesson");renderQ(e);A.miss=true;A.val=true;doCheck();})()`);
await wait(30);
const vm=doc.querySelector("#checkbar .vw");
if(!vm||!vm.querySelector(".arc-soltab .r"))ko("paires corrigees sans tableau");
if(vm&&/→/.test(vm.textContent))ko("fleche encore presente dans la correction des paires");

/* 4. lecons : formules sans fleches ASCII */
E(`S.active="MRC";save();openGuide(UNITS.find(u=>/class="formula">Bilan/.test(u.guide)).id)`); await wait(50);
const f=[...doc.querySelectorAll("#mcard .formula")].find(x=>/Bilan/.test(x.textContent));
if(!f||!f.classList.contains("arc-fml"))ko("formule de lecon non mise en forme");
if(f&&/->/.test(f.textContent))ko("fleche ASCII encore visible dans une formule");
if(f&&!f.querySelector(".arc-arw"))ko("fleche dessinee absente");
E("closeModal()");

/* 5. glossaire */
const G=E("window.ARC_GLOSS.length"); if(G<150)ko("glossaire trop court : "+G);
const bad=E(`window.ARC_GLOSS.filter(g=>!g.t||!g.d||!g.x||(g.c&&g.c.split(" ").some(c=>!COURSES.find(x=>x.id===c)))).map(g=>g.t)`);
if(bad.length)ko("entrees de glossaire incompletes : "+bad.join(", "));
E(`(()=>{const e=EXOS.find(x=>x.i==="p141_05");S.active="PATRI";L=buildLesson(e.u,0,"normal");L.queue=[e];show("lesson");renderQ(e);})()`);
await wait(30);
const terms=[...doc.querySelectorAll("#qwrap .gterm")].map(x=>x.textContent);
console.log("mots expliques dans l enonce :",terms.join(", "));
if(!terms.length)ko("aucun mot du metier souligne dans un enonce de patrimoine");
doc.querySelector("#qwrap .gterm").dispatchEvent(new w.MouseEvent("click",{bubbles:true})); await wait(30);
if(!doc.querySelector("#arc-gpop .arc-gp-card .x"))ko("la bulle « En clair » ne s ouvre pas avec son exemple");
if(doc.querySelector("#qwrap .choice .gterm"))ko("un mot souligne dans un bouton de reponse");
if(!doc.querySelector("#qwrap .arc-ctx .r.kv"))ko("enonce non presente en fiche");

/* 6. potions et jauge */
const P=E(`SHOP.filter(x=>x.m===3).map(x=>x.min).sort((a,b)=>a-b).join(",")`);
if(P!=="10,20,30,45")ko("potions x3 attendues 10, 20, 30 et 45 min, trouve : "+P);
if(E(`SHOP.filter(x=>x.min===45).length`)<3)ko("il manque des potions de 45 min");
const cher=E(`[1.5,2,3].every(m=>{const l=SHOP.filter(x=>x.m===m).sort((a,b)=>a.min-b.min);return l.every((x,i)=>!i||x.prix>l[i-1].prix);})`);
if(!cher)ko("une potion plus longue ne coute pas plus cher");
E(`S.gems=2000;save();setTab("shop")`); await wait(50);
if(doc.querySelectorAll("#shopbody .arc-pcard").length!==3)ko("la boutique doit montrer 3 cartes de potions");
E(`buyPotion("p3c");drinkPotion("p3c")`); await wait(1100);
if(!doc.querySelector("#arc-boost .pill .t")||!/\d\d:\d\d/.test(doc.querySelector("#arc-boost .pill .t").textContent))ko("jauge de potion absente ou sans minuteur");

/* 7. gel plus cher */
const g0=E("S.gems"), f0=E("S.freezes"); E("buyFreeze()");
if(g0-E("S.gems")!==150||E("S.freezes")!==f0+1)ko("le gel doit couter 150 gemmes");
if(!/150/.test((doc.querySelector('#shopbody [onclick*="buyFreeze"]')||{}).textContent||""))ko("prix du gel non affiche a 150");

/* 8. epreuve legendaire obligatoire */
E(`S.active="PATRI";S.courses.PATRI.lessons={};S.courses.PATRI.crowns={};save()`);
const us=E(`courseUnits("PATRI").map(u=>u.id)`), u0=us[0], nl=E(`lessonsIn(${u0})`);
E(`for(let i=0;i<${nl};i++)S.courses.PATRI.lessons[lkey(${u0},i)]=2;save()`);
if(E(`unitUnlocked(${us[1]})`))ko("module suivant ouvert sans epreuve legendaire");
const nx=E("JSON.stringify(nextLessonExists())");
if(nx!==JSON.stringify({u:u0,l:-1}))ko("Continuer ne mene pas a l epreuve legendaire : "+nx);
E(`S.courses.PATRI.crowns[${u0}]=true;save()`);
if(!E(`unitUnlocked(${us[1]})`))ko("module suivant ferme malgre la couronne");
E(`delete S.courses.PATRI.crowns[${u0}];S.courses.PATRI.lessons[lkey(${us[1]},0)]=2;save()`);
if(!E(`unitUnlocked(${us[1]})`))ko("un module deja commence ne doit pas se refermer");

/* 9. la lecon avant chaque quiz, meme en enchainant */
E(`S.courses.PATRI.lessons={};S.courses.PATRI.crowns={};S.courses.PATRI.lessons[lkey(${u0},0)]=2;save();chainNext()`); await wait(50);
if(!doc.getElementById("sc-intro").classList.contains("on"))ko("enchainer saute la lecon avant le quiz");

console.log("glossaire :",G,"entrees | potions :",E("SHOP.length"),"| gel : 150");
console.log("ERREURS:",errs.length,JSON.stringify(errs));
process.exit(0);
})();
