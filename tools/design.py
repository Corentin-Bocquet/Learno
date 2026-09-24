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
js = io.open(os.path.join(R, 'design/arcade/arcade.js'), encoding='utf-8').read().strip()
for nom, txt in (('css', css), ('js', js)):
    assert '\u2014' not in txt, 'tiret cadratin interdit dans ' + nom
    assert not re.search('[\U0001F300-\U0001FAFF☀-➿]', txt), 'emoji litteral interdit dans ' + nom
s = io.open(P, encoding='utf-8').read()
s = re.sub(r'\n?<!-- DESIGN:ARCADE:DEBUT -->.*?<!-- DESIGN:ARCADE:FIN -->\n?', '\n', s, flags=re.S)
s = s.rstrip('\n') + '\n'
# tete de page : la page reste masquee tant que la couche Arcade n a pas
# fini de s installer, sinon l ancien design s affiche une a deux secondes
# au lancement. Filet de securite : on la devoile au bout de 6 s quoi qu il arrive.
s = re.sub(r'<!-- DESIGN:ARCADE:TETE:DEBUT -->.*?<!-- DESIGN:ARCADE:TETE:FIN -->\n?', '', s, flags=re.S)
tete = ('<!-- DESIGN:ARCADE:TETE:DEBUT -->\n'
        '<style>html.arc-wait body{background:#141432}html.arc-wait #shell{visibility:hidden}</style>\n'
        '<script>(function(){var d=document.documentElement;d.classList.add("arc-wait");'
        'setTimeout(function(){d.classList.remove("arc-wait")},6000);'
        'var m=document.getElementById("meta-theme");if(m)m.setAttribute("content","#141432");})();</script>\n'
        '<!-- DESIGN:ARCADE:TETE:FIN -->\n')
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
