/* Telecommande, quiz a plusieurs (12/10/2026) : une tele (PC) et deux telephones
   jouent une partie complete via un faux serveur Realtime. */
const fs=require('fs'), path=require('path');
const {JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const errs=[], ko=m=>errs.push(m), wait=ms=>new Promise(r=>setTimeout(r,ms));
["telearena.js","telearena.css"].forEach(f=>{
  const s=fs.readFileSync(path.join(__dirname,'..','design','arcade',f),'utf8');
  if(s.includes("\u2014"))ko("tiret cadratin dans "+f);
  if(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/u.test(s))ko("emoji litteral dans "+f);
});
/* faux serveur Realtime */
const hub={topics:{},log:[]};
function makeWS(){
  return class MockWS{
    constructor(url){ this.url=url; this.readyState=0; hub.log.push(url); this.topic=null;
      setTimeout(()=>{ this.readyState=1; this.onopen&&this.onopen(); },5); }
    send(s){ const m=JSON.parse(s);
      if(m.event==="phx_join"){ this.topic=m.topic; (hub.topics[m.topic]=hub.topics[m.topic]||new Set()).add(this); this.joinPayload=m.payload;
        setTimeout(()=>this.onmessage&&this.onmessage({data:JSON.stringify({topic:m.topic,event:"phx_reply",ref:m.ref,payload:{status:"ok",response:{}}})}),5); }
      else if(m.event==="heartbeat"){ setTimeout(()=>this.onmessage&&this.onmessage({data:JSON.stringify({topic:"phoenix",event:"phx_reply",ref:m.ref,payload:{status:"ok"}})}),5); }
      else if(m.event==="broadcast"){ (hub.topics[m.topic]||new Set()).forEach(o=>{ if(o!==this&&o.readyState===1)setTimeout(()=>o.onmessage&&o.onmessage({data:JSON.stringify({topic:m.topic,event:"broadcast",payload:m.payload})}),3); }); } }
    close(){ this.readyState=3; if(this.topic&&hub.topics[this.topic])hub.topics[this.topic].delete(this); setTimeout(()=>this.onclose&&this.onclose(),1); }
  };
}
function boot(url){
  const vc=new VirtualConsole(); vc.on("jsdomError",e=>{ if(!/getContext|HTMLMediaElement|Not implemented/.test(e.message))errs.push("jsdom: "+e.message.slice(0,180)); });
  const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url,virtualConsole:vc,
    beforeParse(w){ w.HTMLMediaElement.prototype.play=()=>Promise.resolve(); w.HTMLMediaElement.prototype.pause=()=>{};
      w.fetch=()=>Promise.reject(new Error("hors ligne")); w.WebSocket=makeWS();
      w.matchMedia=w.matchMedia||(q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}));
      /* jsdom n a pas de mise en page : chaque element mesure 100 x 40 */
      w.Element.prototype.getBoundingClientRect=function(){ return {left:10,top:10,width:100,height:40,right:110,bottom:50,x:10,y:10}; }; } });
  return dom;
}


(async()=>{
const host=boot("http://localhost/Learno/"), hw=host.window, hd=hw.document, HE=x=>hw.eval(x);
await wait(2500);
const go=hd.querySelector("#ob-go"); if(go)go.dispatchEvent(new hw.MouseEvent("click",{bubbles:true})); await wait(200);
HE("if(typeof authSkip==='function')authSkip()"); await wait(100);
const A=hw.__teleA; if(!A)ko("window.__teleA absent");
const clk=(w,el)=>el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));
const st=ms=>wait(ms||700);

/* reglages rapides et questions fournies */
A.cfg.count=1; A.cfg.rev=3; A.cfg.nq=3; A.cfg.tq=15;
A.cfg.pool=()=>hw.eval("EXOS.filter(e=>(e.t==='mcq'||e.t==='tf')&&e.q&&(e.t==='tf'||(e.o&&e.o.length>=4))).slice(0,20)");

/* 1. fenetre de la tele : le nombre de joueurs est reglable, solo par defaut */
HE("teleHost()"); await st(200);
const code=hw.__tele.H.code;
if(!hd.querySelector("#tele-multi-slot .tm-step"))ko("reglage du nombre de joueurs absent");
if(hd.getElementById("tm-n").textContent!=="1")ko("le mode solo doit etre le defaut");
if(hd.querySelector('#tele-multi-slot [data-m="open"]'))ko("le salon ne doit pas etre propose en solo");
clk(hw,hd.querySelector('#tele-multi-slot [data-m="+"]')); await st(100);
if(hd.getElementById("tm-n").textContent!=="2"||!hd.querySelector('#tele-multi-slot [data-m="open"]'))ko("passer a 2 joueurs ne propose pas le salon");
clk(hw,hd.querySelector('#tele-multi-slot [data-t="15"]'));
clk(hw,hd.querySelector('#tele-multi-slot [data-m="open"]')); await st(200);
if(!hd.querySelector("#tele-arena .ta-lobby"))ko("salon absent sur la tele");
if(!hd.querySelector("#tele-arena svg.tele-qr")||!hd.querySelector("#tele-arena .ta-code"))ko("code ou QR absent du salon");

/* 2. deux telephones rejoignent */
const until=async(f,ms)=>{ const t=Date.now(); while(Date.now()-t<(ms||15000)){ try{ if(f())return true; }catch(e){} await wait(100); } return false; };
const pa=boot("http://localhost/Learno/?tele="+code), pb=boot("http://localhost/Learno/?tele="+code);
const A1={w:pa.window,d:pa.window.document}, B1={w:pb.window,d:pb.window.document};
const rqA=()=>A1.d.getElementById("rc-q"), rqB=()=>B1.d.getElementById("rc-q");
await until(()=>A1.d.getElementById("ra-name")&&B1.d.getElementById("ra-name"),30000);
const join=async(X,nm,n)=>{ const i=X.d.getElementById("ra-name"); if(!i){ ko("formulaire de prenom absent ("+nm+")"); return; } i.value=nm; clk(X.w,X.d.querySelector('[data-a="join"]')); await until(()=>A.M.ord.length>=n,8000); };
await join(A1,"Léa",1);
if(A.M.ord.length!==1)ko("le premier joueur n est pas enregistre");
await join(B1,"<b>Tom</b>",2);
if(A.M.ord.length!==2)ko("deux joueurs attendus : "+A.M.ord.length);
if(hd.querySelector(".ta-chips b"))ko("un prenom avec du HTML s affiche tel quel sur la tele");
const chipsTxt=()=>(hd.querySelector(".ta-chips")||{}).textContent||"";
if(!/Tom/.test(chipsTxt())&&A.M.ph==="lobby"||A.M.ph==="count"&&!/Tom/.test(chipsTxt()))ko("prenom absent de la tele");

/* 3. question 1 : Lea juste, Tom faux */
await until(()=>A.M.ph==="q"&&A.M.q.i===0,10000);
if(A.M.ph!=="q")ko("la partie ne demarre pas apres le compte a rebours : "+A.M.ph);
const btns=X=>[...X.d.querySelectorAll("#rc-q .rq-c")];
await until(()=>btns(A1).length>=2&&btns(B1).length>=2,8000);
if(!hd.querySelector("#tele-arena .ta-opts .ta-o"))ko("question absente de la tele");
if(btns(A1).length<2)ko("boutons de reponse absents sur le telephone");
const good=A.M.q.a, bad=(good+1)%btns(A1).length;
clk(A1.w,btns(A1)[good]);
await until(()=>/Réponse envoyée/.test(rqA().textContent),8000);
if(!/Réponse envoyée/.test(rqA().textContent))ko("Lea ne voit pas sa reponse envoyee : "+rqA().textContent);
if(A.M.ph!=="q")ko("la question ne doit pas finir avant la reponse de Tom");
clk(B1.w,btns(B1)[bad]);
await until(()=>A.M.ph==="rev",8000);
if(A.M.ph!=="rev")ko("la question doit finir quand tout le monde a repondu : "+A.M.ph);
const ids=A.M.ord, la=A.M.pl[ids[0]], to=A.M.pl[ids[1]];
if(!(la.score>=500&&la.score<=1000))ko("points de Lea : "+la.score);
if(to.score!==0)ko("Tom ne doit rien marquer : "+to.score);
await until(()=>rqA().querySelector(".rq-res.ok")&&rqB().querySelector(".rq-res.ko"),8000);
if(!rqA().querySelector(".rq-res.ok"))ko("Lea ne voit pas Bonne reponse");
if(!rqB().querySelector(".rq-res.ko"))ko("Tom ne voit pas Rate");
if(!hd.querySelector("#tele-arena .ta-o.ok")||!hd.querySelector("#tele-arena .ta-board"))ko("correction ou classement absents de la tele");

/* 4. question 2 : Tom ne repond pas, le temps fait finir la question */
await until(()=>A.M.ph==="q"&&A.M.q.i===1,12000);
if(A.M.ph!=="q"||A.M.q.i!==1)ko("la question 2 ne demarre pas : "+A.M.ph);
await until(()=>btns(A1).length>=2,8000);
A.M.t0-=14200;   /* il ne reste que 0,8 s : Tom n a rien envoye */
clk(A1.w,btns(A1)[A.M.q.a]);
await until(()=>A.M.pl[ids[1]].last&&A.M.pl[ids[1]].last.none,8000);
if(!(A.M.pl[ids[1]].last&&A.M.pl[ids[1]].last.none))ko("le temps doit terminer la question (Tom sans reponse)");
if(A.M.pl[ids[1]].score!==0)ko("Tom ne marque rien sans reponse");
await until(()=>/Trop tard/.test(rqB().textContent),8000);
if(!/Trop tard/.test(rqB().textContent))ko("Tom devrait voir Trop tard : "+rqB().textContent);

/* 5. un faux joueur ou un message hors partie est ignore */
const before=JSON.stringify(A.M.pl);
hw.__tele.hooks.msg({r:"p",t:"ans",pid:"ZZZZZZ",i:0});
if(JSON.stringify(A.M.pl)!==before)ko("un joueur inconnu a modifie la partie");

/* 6. question 3 puis podium */
await until(()=>A.M.ph==="q"&&A.M.q.i===2,12000);
if(A.M.ph!=="q"||A.M.q.i!==2)ko("la question 3 ne demarre pas : "+A.M.ph);
await until(()=>btns(A1).length>=2&&btns(B1).length>=2,8000);
clk(A1.w,btns(A1)[A.M.q.a]);
clk(B1.w,btns(B1)[A.M.q.a]);
await until(()=>A.M.ph==="end",15000);
if(A.M.ph!=="end")ko("la partie doit se terminer apres 3 questions : "+A.M.ph);
if(hd.querySelectorAll("#tele-arena .ta-p").length!==2)ko("podium incomplet");
if(!/Léa/.test(hd.querySelector("#tele-arena .ta-p.p1").textContent))ko("Lea devrait gagner");
await until(()=>/1er sur 2/.test(rqA().textContent)&&/2e sur 2/.test(rqB().textContent),8000);
if(!/1er sur 2/.test(rqA().textContent))ko("rang de Lea : "+rqA().textContent);
if(!/2e sur 2/.test(rqB().textContent))ko("rang de Tom : "+rqB().textContent);

/* 7. arret : la tele et les telephones reprennent leur aspect normal */
clk(hw,hd.querySelector("#tele-arena .ta-stop")); await st(1000);
if(hd.getElementById("tele-arena")||A.M.on)ko("l arene reste apres Arreter");
if(A1.d.getElementById("tele-rc").classList.contains("quiz")&&/Partie terminee|Partie terminée/.test(rqA().textContent))ko("le telephone reste en fin de partie");

/* 8. pas assez de questions */
A.cfg.pool=()=>[]; A.startLobby(2); await st(200);
if(!/Pas assez/.test((hd.getElementById("tele-arena")||{}).textContent||""))ko("message pas assez de questions absent");
A.stopAll();

console.log(errs.length?errs.map(e=>" - "+e).join("\n"):"quiz a plusieurs : tout est bon");
console.log("ERREURS: "+errs.length);
host.window.close(); pa.window.close(); pb.window.close();
process.exit(errs.length?1:0);
})().catch(e=>{ console.log(errs.map(x=>" - "+x).join("\n")); console.log(" - plantage: "+(e&&e.stack||e)); console.log("ERREURS: 1"); process.exit(1); });
