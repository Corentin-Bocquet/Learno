"""Injecte la couche de design Arcade dans index.html.

Sources : design/arcade/arcade.css et design/arcade/arcade.js.
Le bloc vit entre <!-- DESIGN:ARCADE:DEBUT --> et <!-- DESIGN:ARCADE:FIN -->,
tout a la fin du fichier, apres toutes les autres couches (il les enveloppe).
On n edite jamais ce bloc a la main : on modifie les sources puis on relance
  python3 tools/design.py
"""
import io, os, re
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
P = os.path.join(R, 'index.html')
css = io.open(os.path.join(R, 'design/arcade/arcade.css'), encoding='utf-8').read().strip()
# glossaire (donnees) puis la couche Arcade, puis la couche confort qui l enveloppe
lire = lambda f: io.open(os.path.join(R, 'design/arcade', f), encoding='utf-8').read().strip()
js = '\n'.join(lire(f) for f in ('glossaire.js', 'arcade.js', 'extras.js'))
for nom, txt in (('css', css), ('js', js)):
    assert '\u2014' not in txt, 'tiret cadratin interdit dans ' + nom
    assert not re.search('[\U0001F300-\U0001FAFF☀-➿]', txt), 'emoji litteral interdit dans ' + nom
s = io.open(P, encoding='utf-8').read()
s = re.sub(r'\n?<!-- DESIGN:ARCADE:DEBUT -->.*?<!-- DESIGN:ARCADE:FIN -->\n?', '\n', s, flags=re.S)
s = s.rstrip('\n') + '\n'
# tete de page : tout le contenu reste masque tant que la couche Arcade n a pas
# fini de s installer, sinon l ancien design s affiche quelques secondes au
# lancement (fichier de 5 Mo sur un reseau mobile). Si l attente depasse
# 0,3 s, un chargement anime aux couleurs d Arcade apparait, sinon rien.
# Filets de securite : 4 s apres l evenement load, puis 30 s quoi qu il arrive.
s = re.sub(r'<!-- DESIGN:ARCADE:TETE:DEBUT -->.*?<!-- DESIGN:ARCADE:TETE:FIN -->\n?', '', s, flags=re.S)
tete = ('<!-- DESIGN:ARCADE:TETE:DEBUT -->\n'
        '<style>html.arc-wait body{background:#141432}html.arc-wait body>*{visibility:hidden!important}'
        'html.arc-wait body::before{content:"Learno";position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;'
        'padding-top:150px;font:800 30px/1 "Baloo 2","Nunito",system-ui,sans-serif;letter-spacing:.5px;color:#F4F4FF;'
        'background:radial-gradient(60% 45% at 50% 42%,#2B2B6A 0,#141432 70%);animation:arcLIn .45s .3s both}'
        'html.arc-wait body::after{content:"";position:fixed;left:50%;top:50%;width:84px;height:84px;margin:-74px 0 0 -42px;z-index:2147483647;'
        'border-radius:28px;border:5px solid transparent;'
        'background:linear-gradient(#22224A,#22224A) padding-box,conic-gradient(from 0deg,#58CC02,#1CB0F6,#CE82FF,#FFC800,#58CC02) border-box;'
        'box-shadow:0 0 34px rgba(206,130,255,.45),inset 0 2px 0 rgba(255,255,255,.18);'
        'animation:arcLIn .45s .3s both,arcLSpin 1.6s cubic-bezier(.6,.1,.4,.9) .3s infinite}'
        '@keyframes arcLIn{from{opacity:0}to{opacity:1}}'
        '@keyframes arcLSpin{0%{transform:rotate(0) scale(1);border-radius:28px}50%{transform:rotate(180deg) scale(.86);border-radius:42px}'
        '100%{transform:rotate(360deg) scale(1);border-radius:28px}}'
        '@media (prefers-reduced-motion:reduce){html.arc-wait body::after{animation:arcLIn .45s .3s both}}</style>\n'
        '<script>(function(){var d=document.documentElement;d.classList.add("arc-wait");'
        'var off=function(){d.classList.remove("arc-wait")};'
        'window.addEventListener("load",function(){setTimeout(off,4000)});setTimeout(off,30000);'
        'var m=document.getElementById("meta-theme");if(m)m.setAttribute("content","#141432");})();</script>\n'
        '<!-- DESIGN:ARCADE:TETE:FIN -->\n')
# pas de zoom au double toucher ni a la saisie d un nombre (iPhone)
s = re.sub(r'<meta name="viewport" content="[^"]*">',
           '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">', s, count=1)
assert s.count('</head>') == 1
s = s.replace('</head>', tete + '</head>', 1)
bloc ='<!-- DESIGN:ARCADE:DEBUT -->\n<style>\n' + css + '\n</style>\n<script>\n' + js + '\n</script>\n<!-- DESIGN:ARCADE:FIN -->\n'
s += bloc
# police des titres
ancien = 'family=Nunito:wght@600;700;800;900&display=swap'
if 'family=Baloo+2' not in s and ancien in s:
    s = s.replace(ancien, 'family=Baloo+2:wght@600;700;800&family=Nunito:wght@600;700;800;900&display=swap', 1)
io.open(P, 'w', encoding='utf-8').write(s)
print('design arcade injecte :', len(css), 'car. de CSS,', len(js), 'car. de JS')
