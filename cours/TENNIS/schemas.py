# Schémas SVG du cours TENNIS (court vu de dessus).
# Les fichiers uNNN.js contiennent des repères @@NOM@@ (ou @@NOM:g@@ pour un guide)
# remplacés par le dessin correspondant : python3 cours/TENNIS/schemas.py
import glob, os, re

def wrap(inner, w=140, h=216, guide=False):
    cls = ' class="gsvg"' if guide else ''
    return ('<svg%s viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" role="img" '
            'style="font-family:inherit">%s</svg>') % (cls, w, h, inner)

def txt(x, y, s, size=8, fill='var(--txt)', anchor='middle', weight='700'):
    return '<text x="%s" y="%s" font-size="%s" fill="%s" text-anchor="%s" font-weight="%s">%s</text>' % (x, y, size, fill, anchor, weight, s)

# Court : doubles de x=31 à x=109 (78 px pour 10,97 m), fond de court y=15 et y=184, filet y=99.5
X0, X1, Y0, Y1, NET = 31, 109, 15, 184, 99.5
SX0, SX1 = 40.7, 99.3          # couloirs de simple
SV0, SV1 = 54, 145             # lignes de service
CX = 70                        # ligne médiane

def court(label=None):
    s = '<rect x="%s" y="%s" width="%s" height="%s" fill="var(--green-d)" rx="2"/>' % (X0 - 6, Y0 - 6, X1 - X0 + 12, Y1 - Y0 + 12)
    L = 'stroke="var(--txt)" stroke-width="1.2" fill="none"'
    s += '<rect x="%s" y="%s" width="%s" height="%s" %s/>' % (X0, Y0, X1 - X0, Y1 - Y0, L)
    s += '<line x1="%s" y1="%s" x2="%s" y2="%s" %s/>' % (SX0, Y0, SX0, Y1, L)
    s += '<line x1="%s" y1="%s" x2="%s" y2="%s" %s/>' % (SX1, Y0, SX1, Y1, L)
    s += '<line x1="%s" y1="%s" x2="%s" y2="%s" %s/>' % (SX0, SV0, SX1, SV0, L)
    s += '<line x1="%s" y1="%s" x2="%s" y2="%s" %s/>' % (SX0, SV1, SX1, SV1, L)
    s += '<line x1="%s" y1="%s" x2="%s" y2="%s" %s/>' % (CX, SV0, CX, SV1, L)
    s += '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="var(--gold)" stroke-width="2"/>' % (X0 - 6, NET, X1 + 6, NET)
    s += '<line x1="%s" y1="%s" x2="%s" y2="%s" %s/>' % (CX, Y1, CX, Y1 - 3, L)
    s += '<line x1="%s" y1="%s" x2="%s" y2="%s" %s/>' % (CX, Y0, CX, Y0 + 3, L)
    if label:
        s += txt(70, 212, label, 7.5)
    return s

def joueur(x, y, col='var(--blue)'):
    return '<circle cx="%s" cy="%s" r="4.5" fill="%s" stroke="var(--bg)" stroke-width="1"/>' % (x, y, col)

def fleche(x1, y1, x2, y2, col='var(--gold)', dash=False):
    d = ' stroke-dasharray="3 2"' if dash else ''
    import math
    a = math.atan2(y2 - y1, x2 - x1)
    hx1, hy1 = x2 - 6 * math.cos(a - .4), y2 - 6 * math.sin(a - .4)
    hx2, hy2 = x2 - 6 * math.cos(a + .4), y2 - 6 * math.sin(a + .4)
    return ('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="1.8"%s/>'
            '<polygon points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="%s"/>') % (x1, y1, x2, y2, col, d, x2, y2, hx1, hy1, hx2, hy2, col)

def cible(x, y, lab, on=True):
    col = 'var(--red)' if on else 'var(--dim2)'
    return '<circle cx="%s" cy="%s" r="4.8" fill="%s" stroke="var(--bg)" stroke-width="1"/>' % (x, y, col) + txt(x, y + 2.6, lab, 6, 'var(--bg)')

def service(mark=None, guide=False):
    # serveur en bas, côté égalité (à droite de la marque centrale), sert dans le carré de gauche en face
    s = court('Côté égalité : T, Corps, Ext.' if mark is None else 'Quel placement ?')
    s += joueur(78, 188)
    tg = {'T': (66, 62), 'C': (55.5, 68), 'E': (45, 74)}
    for k, (x, y) in tg.items():
        on = (mark is None or mark == k)
        lab = k if (mark is None or mark != k) else '?'
        s += fleche(78, 184, x + (2 if k == 'T' else 0), y + 6, 'var(--gold)' if on else 'var(--dim2)', dash=not on)
        s += cible(x, y, lab, on)
    return wrap(s, 140, 216, guide)

def croise(guide=False):
    s = court('Croisé (plein), ligne (pointillé)' if guide else 'Deux frappes depuis le fond')
    s += joueur(92, 178)
    s += fleche(92, 174, 48, 30, 'var(--gold)')
    s += fleche(92, 174, 94, 30, 'var(--pink)', dash=True)
    return wrap(s, 140, 216, guide)

def zones(guide=False):
    s = court('Les trois zones du joueur')
    s += '<rect x="25" y="186" width="90" height="13" fill="var(--red)" opacity=".7"/>' + txt(70, 195.5, 'défense', 7, 'var(--bg)')
    s += '<rect x="31" y="160" width="78" height="24" fill="var(--gold)" opacity=".45"/>' + txt(70, 175, 'neutre', 7, 'var(--bg)')
    s += '<rect x="31" y="118" width="78" height="40" fill="var(--green)" opacity=".5"/>' + txt(70, 141, 'attaque', 7, 'var(--bg)')
    return wrap(s, 140, 216, guide)

def filet(guide=False):
    s = '<line x1="10" y1="120" x2="190" y2="120" stroke="var(--dim)" stroke-width="2"/>'
    s += '<line x1="30" y1="120" x2="30" y2="72" stroke="var(--txt)" stroke-width="2"/>' + '<line x1="170" y1="120" x2="170" y2="72" stroke="var(--txt)" stroke-width="2"/>'
    s += '<path d="M30 72 Q100 86 170 72" stroke="var(--gold)" stroke-width="2" fill="none"/>'
    s += txt(30, 64, '1,07 m', 9) + txt(100, 76, '0,914 m', 9) + txt(170, 64, '1,07 m', 9)
    s += txt(100, 140, 'Le filet est plus bas au centre', 10) + txt(100, 154, 'le croisé passe au-dessus du point bas', 8, 'var(--dim)', weight='600')
    return wrap(s, 200, 165, guide)

def inside_out(guide=False):
    s = court('Décalé : croisé (pointillé)' if guide else 'Deux options du coup droit décalé')
    s += joueur(52, 176)
    s += fleche(52, 172, 50, 30, 'var(--gold)')
    s += fleche(52, 172, 94, 32, 'var(--pink)', dash=True)
    return wrap(s, 140, 216, guide)

def approche(guide=False):
    # balle courte au centre : on approche long de ligne puis on se place face à la balle
    s = court('Approche, puis on suit la balle' if guide else 'Que fait le joueur ?')
    s += joueur(90, 150)
    s += fleche(90, 146, 96, 32, 'var(--gold)')
    s += fleche(90, 150, 84, 118, 'var(--blue)', dash=True)
    s += '<circle cx="84" cy="114" r="4.5" fill="none" stroke="var(--blue)" stroke-width="1.5"/>'
    s += joueur(96, 22, 'var(--red)')
    return wrap(s, 140, 216, guide)

def double(kind='classique', guide=False):
    lab = {'classique': 'Formation classique', 'australienne': 'Formation australienne', 'i': 'Formation en I'}[kind]
    s = court(lab if guide else 'Quelle formation ?')
    if kind == 'classique':
        s += joueur(80, 188) + joueur(52, 118, 'var(--blue)')
    elif kind == 'australienne':
        s += joueur(80, 188) + joueur(82, 118, 'var(--blue)')
    else:
        s += joueur(71, 188) + '<circle cx="70" cy="114" r="4.5" fill="var(--blue)" stroke="var(--bg)"/>'
    s += joueur(50, 12, 'var(--red)') + joueur(86, 80, 'var(--red)')
    return wrap(s, 140, 216, guide)

DESSINS = {
    'SERVICE': lambda g: service(None, g), 'SERVICE_T': lambda g: service('T', g),
    'SERVICE_C': lambda g: service('C', g), 'SERVICE_E': lambda g: service('E', g),
    'CROISE': lambda g: croise(g), 'ZONES': lambda g: zones(g), 'FILET': lambda g: filet(g),
    'INSIDE': lambda g: inside_out(g), 'DOUBLE_CLASSIQUE': lambda g: double('classique', g),
    'DOUBLE_AUS': lambda g: double('australienne', g), 'DOUBLE_I': lambda g: double('i', g),
    'APPROCHE': lambda g: approche(g),
}

if __name__ == '__main__':
    base = os.path.dirname(os.path.abspath(__file__))
    for f in sorted(glob.glob(base + '/u*.js')):
        s = open(f, encoding='utf-8').read()
        n = re.subn(r'@@([A-Z0-9_]+)(:g)?@@', lambda m: DESSINS[m.group(1)](m.group(2) == ':g').replace('"', "'"), s)
        if n[1]:
            open(f, 'w', encoding='utf-8').write(n[0]); print(os.path.basename(f), n[1], 'schémas')
