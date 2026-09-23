import io,glob,os,re,sys
BASE=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','cours')
P=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','index.html')
TITRES={'PATRI':'TRANSMISSION DU PATRIMOINE','NEGO':'NEGOCIATION BANCAIRE','NON':'OSER DIRE NON',
        'NUTRI':'NUTRITION','SPINO':'SPINOZA','MMA':'MMA','TENNIS':'TENNIS'}
ORDRE=['PATRI','NEGO','NON','NUTRI','SPINO','MMA','TENNIS']
s=io.open(P,encoding='utf-8').read()
s=re.sub(r'<!-- PATRI:DEBUT -->.*?<!-- PATRI:FIN -->\n','',s,flags=re.S)
s=re.sub(r'<!-- COURS:\w+:DEBUT -->.*?<!-- COURS:\w+:FIN -->\n','',s,flags=re.S)
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
anchor='<script>\n/* =====================================================================\n   MULTILINGO v2'
assert s.count(anchor)==1
s=s.replace(anchor,blocks+anchor)
io.open(P,'w',encoding='utf-8').write(s)
