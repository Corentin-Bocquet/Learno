// liste les questions a choix et la longueur de chaque option (* = bonne)
const fs=require('fs');const f=process.argv[2];
const t=fs.readFileSync(f,'utf8').split('/*EXOS*/')[1];
const ex=eval('['+t.trim().replace(/,\s*$/,'')+']');
let n=0,lg=0;
ex.forEach(e=>{ if(!['mcq','fill','story'].includes(e.t))return; n++;
  const L=e.o.map(x=>x.length), b=L[e.a], longest=L.every((x,k)=>k===e.a||b>x); if(longest)lg++;
  console.log((longest?'LONG ':'     ')+e.i+' '+L.map((x,k)=>k===e.a?'*'+x:x).join(' '));});
console.log('=> '+lg+'/'+n+' plus longues ('+Math.round(100*lg/Math.max(1,n))+'%) | types:',JSON.stringify(ex.reduce((a,e)=>(a[e.t]=(a[e.t]||0)+1,a),{})),'| total',ex.length);
