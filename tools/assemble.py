import io,glob,os,re,sys
BASE=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','cours')
P=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','index.html')
TITRES={'PATRI':'TRANSMISSION DU PATRIMOINE','NEGO':'NEGOCIATION BANCAIRE','FISCA':'FISCALITE IMMOBILIERE ET FINANCIERE','FOOT':'FOOTBALL','ECHECS':'ECHECS','RUBIK':'RUBIK','NON':'OSER DIRE NON',
        'NUTRI':'NUTRITION','SPINO':'SPINOZA','MMA':'MMA','TENNIS':'TENNIS','EPSAL':'EPARGNE SALARIALE ET ASSURANCE-VIE'}
ORDRE=['PATRI','NEGO','FISCA','NON','NUTRI','SPINO','MMA','TENNIS','FOOT','ECHECS','RUBIK','EPSAL']
s=io.open(P,encoding='utf-8').read()
s=re.sub(r'<!-- PATRI:DEBUT -->.*?<!-- PATRI:FIN -->\n','',s,flags=re.S)
s=re.sub(r'<!-- COURS:\w+:DEBUT -->.*?<!-- COURS:\w+:FIN -->\n','',s,flags=re.S)
s=re.sub(r'<!-- EXAMEN:\w+:DEBUT -->.*?<!-- EXAMEN:\w+:FIN -->\n','',s,flags=re.S)
s=re.sub(r'<!-- MINDMAP:\w+:DEBUT -->.*?<!-- MINDMAP:\w+:FIN -->\n','',s,flags=re.S)
blocks=''
for cid in ORDRE:
    d=BASE+'/'+cid
    fs=sorted(glob.glob(d+'/u*.js'))
    if not fs: continue
    units=[];exos=[]
    for f in fs:
        t=io.open(f,encoding='utf-8').read()
        a=t.split('/*UNIT*/')[1]; u,e=a.split('/*EXOS*/')
        units.append(u.strip().rstrip(',')); exos.append(e.strip().rstrip(','))
    blocks+=('<!-- COURS:%s:DEBUT -->\n<script>\n/* =====================================================================\n'
      '   COURS %s : %s\n   %d modules de 32 exercices. Genere depuis les fichiers sources du cours.\n'
      '   ===================================================================== */\n'
      'UNITS.push(\n%s\n);\nEXOS.push(\n%s\n);\n</script>\n<!-- COURS:%s:FIN -->\n')%(cid,cid,TITRES[cid],len(fs),',\n'.join(units),',\n'.join(exos),cid)
    print(cid,len(fs),'modules')
# banques de l'examen pratique : cours/<CID>/examen.js (tous les cours, meme sans modules dans cours/)
for cid in sorted(os.listdir(BASE)):
    f=BASE+'/'+cid+'/examen.js'
    if not os.path.exists(f): continue
    t=io.open(f,encoding='utf-8').read()
    assert '/*EXAMEN*/' in t, f
    cas=t.split('/*EXAMEN*/')[1].strip().rstrip(';').rstrip()
    blocks+=('<!-- EXAMEN:%s:DEBUT -->\n<script>\n/* Examen pratique %s : banque de cas. Genere depuis cours/%s/examen.js */\n'
      'window.PEXAM=window.PEXAM||{};PEXAM["%s"]=%s;\n</script>\n<!-- EXAMEN:%s:FIN -->\n')%(cid,cid,cid,cid,cas,cid)
    print(cid,'examen pratique')
# mind maps magiques : cours/<CID>/mindmap.txt (texte brut, voir design/arcade/mindmap.js), injectees dans window.MMAP[CID]
import json
for cid in sorted(os.listdir(BASE)):
    f=BASE+'/'+cid+'/mindmap.txt'
    if not os.path.exists(f): continue
    t=io.open(f,encoding='utf-8').read().strip()
    assert '\u2014' not in t, f
    blocks+=('<!-- MINDMAP:%s:DEBUT -->\n<script>\n/* Mind map magique %s. Genere depuis cours/%s/mindmap.txt */\n'
      'window.MMAP=window.MMAP||{};MMAP["%s"]=%s;\n</script>\n<!-- MINDMAP:%s:FIN -->\n')%(cid,cid,cid,cid,json.dumps(t,ensure_ascii=False).replace('</','<\\/'),cid)
    print(cid,'mind map magique')
anchor='<script>\n/* =====================================================================\n   MULTILINGO v2'
assert s.count(anchor)==1
s=s.replace(anchor,blocks+anchor)
io.open(P,'w',encoding='utf-8').write(s)
