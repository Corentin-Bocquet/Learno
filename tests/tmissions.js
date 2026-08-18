const fs=require('fs');const {JSDOM,VirtualConsole}=require('/tmp/node_modules/jsdom');
const path=require('path');
function learnoHTML(){
  const c=[process.env.LEARNO_HTML,
           path.join(__dirname,'..','index.html'),
           path.join(__dirname,'..','risklingo_v2.html'),
           '/sessions/lucid-wonderful-shannon/mnt/outputs/risklingo_v2.html'];
  for(const p of c){ if(p&&require('fs').existsSync(p))return p; }
  throw new Error("index.html introuvable");
}

const html=fs.readFileSync(learnoHTML(),'utf8');
const errs=[];const vc=new VirtualConsole();
vc.on("jsdomError",e=>{if(!/getContext|HTMLMediaElement/.test(e.message))errs.push(e.message.slice(0,160))});
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/",virtualConsole:vc});
const w=dom.window,doc=w.document;
w.HTMLMediaElement.prototype.play=()=>Promise.resolve();w.HTMLMediaElement.prototype.pause=()=>{};
const click=el=>el&&el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));
// stub cowork
const TASKS=[{id:"g1",title:"Réviser le thème 11 de MRC",due:"2026-08-12",status:"needsAction"},
             {id:"g2",title:"Prendre rendez-vous chez le coiffeur",status:"needsAction"},
             {id:"g3",title:"Envoyer le dossier d'alternance à l'école",due:"2026-08-09",status:"needsAction"},
             {id:"g4",title:"Monter le short YouTube sur les taux",status:"needsAction"}];
let mcpCalls=0;
w.cowork={
  callMcpTool:async(n,a)=>{mcpCalls++;return {structuredContent:{data:{items:{tasks:TASKS}}}};},
  askClaude:async(p,d)=>{
    if(/listes/.test(p))return JSON.stringify({listes:[{n:"Master",c:"#1CB0F6"},{n:"YouTube",c:"#FF4B4B"},{n:"Perso",c:"#2DD4BF"}],
      affectations:[{id:"g1",liste:"Master"},{id:"g3",liste:"Master"},{id:"g4",liste:"YouTube"},{id:"g2",liste:"Perso"}]});
    return JSON.stringify(TASKS.map((t,i)=>({id:t.id,cat:["Études","Perso","Administratif","Pro"][i],prio:i+1,xp:[35,10,25,40][i],
      kind:i===1?"reel":"ia",subs:i===0?["Relire le cours","Faire les exos"]:[]})));
  }
};
click(doc.querySelector("#ob-go"));
w.eval("setTab('tasks')");
console.log("listes par défaut:",w.eval("S.tasks.lists.map(l=>l.n).join(', ')"));
(async()=>{
 await w.eval("syncTasks(true)");
 await new Promise(r=>setTimeout(r,80));
 console.log("missions importées:",w.eval("S.tasks.items.length"),"| appels MCP:",mcpCalls);
 await w.eval("analyzeTasks()");
 await new Promise(r=>setTimeout(r,80));
 console.log("répartition:",w.eval("S.tasks.lists.map(l=>l.n+'('+tasksOf(l.id).length+')').join(' ')"));
 console.log("lignes compactes:",doc.querySelectorAll("#tasksbody .trow2").length,"| panneaux ouverts:",doc.querySelectorAll("#tasksbody .tpanel").length);
 const first=doc.querySelector("#tasksbody .trowhead");
 click(first);
 console.log("après clic → panneaux:",doc.querySelectorAll("#tasksbody .tpanel").length,
   "| boutons d'action:",doc.querySelectorAll("#tasksbody .tpanel .tbtn").length);
 // déplacer
 const id=w.eval("S.tasks.items[0].id");
 w.eval(`moveToList('${id}', S.tasks.lists[1].id)`);
 console.log("après déplacement:",w.eval("S.tasks.lists.map(l=>l.n+'('+tasksOf(l.id).length+')').join(' ')"));
 // IA listes
 await w.eval("aiLists()");
 await new Promise(r=>setTimeout(r,80));
 console.log("listes proposées par l'IA:",w.eval("S.tasks.lists.map(l=>l.n+'('+tasksOf(l.id).length+')').join(' ')"));
 // créer / renommer / supprimer une liste
 w.eval("askAddList()"); doc.querySelector("#nl-name").value="Sport"; w.eval("addList()");
 console.log("après création:",w.eval("S.tasks.lists.map(l=>l.n).join(', ')"));
 const lid=w.eval("S.tasks.lists[S.tasks.lists.length-1].id");
 w.eval(`renameList('${lid}')`); doc.querySelector("#rl-name").value="Muscu"; w.eval(`doRenameList('${lid}')`);
 console.log("après renommage:",w.eval("S.tasks.lists.map(l=>l.n).join(', ')"));
 w.eval(`doDelList('${lid}')`);
 console.log("après suppression:",w.eval("S.tasks.lists.map(l=>l.n).join(', ')"));
 // validation XP
 const xp0=w.eval("S.xp"); const t0=w.eval("S.tasks.items[0].id");
 w.eval(`doTask('${t0}',true)`); if(doc.querySelector("#modal.on"))w.eval("confirmTask('"+t0+"')");
 console.log("XP:",xp0,"->",w.eval("S.xp"));
 // profil : avatar
 w.eval("setTab('profile')");
 const sv=doc.querySelector("#profilebody .avbig svg");
 console.log("viewBox avatar:",sv&&sv.getAttribute("viewBox"));
 console.log("ERREURS:",errs.length,errs.slice(0,5));
 process.exit(0);
})();
