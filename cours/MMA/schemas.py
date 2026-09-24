# Schémas SVG du cours MMA.
# Les fichiers uNNN.js contiennent des repères @@NOM@@ (ou @@NOM:g@@ pour un guide)
# que ce script remplace par le dessin correspondant : python3 cours/MMA/schemas.py
import glob, json, os, re

D = 'stroke="var(--dim)"'
T = 'fill="var(--txt)"'

def wrap(inner, w=200, h=200, guide=False):
    cls = ' class="gsvg"' if guide else ''
    return ('<svg%s viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" role="img" '
            'style="font-family:inherit">%s</svg>') % (cls, w, h, inner)

def txt(x, y, s, size=10, fill='var(--txt)', anchor='middle', weight='700'):
    return '<text x="%s" y="%s" font-size="%s" fill="%s" text-anchor="%s" font-weight="%s">%s</text>' % (x, y, size, fill, anchor, weight, s)

# --- Silhouette de face avec cibles numérotées -----------------------------
CIBLES = {  # numéro: (x, y, nom)
    1: (100, 38, 'menton'), 2: (84, 26, 'tempe'), 3: (100, 82, 'plexus'),
    4: (84, 104, 'foie'), 5: (118, 100, 'côtes'), 6: (84, 150, 'cuisse'), 7: (80, 182, 'mollet')}

def silhouette():
    s = '<g fill="var(--card2)" %s stroke-width="2">' % D
    s += '<circle cx="100" cy="26" r="16"/>'                      # tête
    s += '<rect x="93" y="41" width="14" height="8" rx="3"/>'      # cou
    s += '<path d="M72 50 Q100 44 128 50 L124 118 Q100 124 76 118 Z"/>'   # tronc
    s += '<path d="M72 52 L56 92 L62 96 L78 62 Z"/><path d="M128 52 L144 92 L138 96 L122 62 Z"/>'  # bras
    s += '<path d="M78 118 L74 196 L90 196 L99 124 Z"/><path d="M122 118 L126 196 L110 196 L101 124 Z"/>'  # jambes
    s += '</g>'
    return s

def body(show=(1, 2, 3, 4, 5, 6, 7), mark=None, labels=False, guide=False):
    s = silhouette()
    for n in show:
        x, y, nom = CIBLES[n]
        col = 'var(--red)' if (mark is None or n == mark) else 'var(--dim2)'
        s += '<circle cx="%d" cy="%d" r="7" fill="%s" stroke="var(--bg)" stroke-width="1.5"/>' % (x, y, col)
        s += txt(x, y + 3.5, str(n), 9, 'var(--bg)')
        if labels:
            lx = 160 if x >= 100 else 40
            s += '<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="var(--dim2)" stroke-width="1"/>' % (x, y, lx, y)
            s += txt(lx + (3 if lx > 100 else -3), y + 3, nom, 9, 'var(--dim)', 'start' if lx > 100 else 'end', '600')
    if mark and not labels:
        s += txt(100, 214, 'Quelle cible ?', 10, 'var(--gold)')
        return wrap(s, 200, 220, guide)
    return wrap(s, 200, 205, guide)

# --- Pieds vus de dessus : gardes ------------------------------------------
def pied(x, y, rot, col):
    return ('<g transform="translate(%d %d) rotate(%d)"><ellipse cx="0" cy="0" rx="9" ry="18" fill="%s"/>'
            '<circle cx="0" cy="-20" r="4" fill="%s"/></g>') % (x, y, rot, col, col)

def garde(kind='orthodoxe', guide=False):
    s = txt(100, 16, 'vu de dessus, face à l\'adversaire', 9, 'var(--dim)', weight='600')
    s += '<path d="M100 24 L100 40" stroke="var(--gold)" stroke-width="2"/><path d="M94 32 L100 22 L106 32" fill="none" stroke="var(--gold)" stroke-width="2"/>'
    if kind == 'orthodoxe':
        s += pied(80, 80, 20, 'var(--blue)') + pied(120, 140, 40, 'var(--blue)')
        s += txt(62, 84, 'G', 11, 'var(--blue)') + txt(140, 146, 'D', 11, 'var(--blue)')
        s += txt(100, 190, 'Garde orthodoxe : pied gauche devant', 10)
    else:
        s += pied(120, 80, -20, 'var(--pink)') + pied(80, 140, -40, 'var(--pink)')
        s += txt(138, 84, 'D', 11, 'var(--pink)') + txt(60, 146, 'G', 11, 'var(--pink)')
        s += txt(100, 190, 'Fausse garde : pied droit devant', 10)
    return wrap(s, 200, 200, guide)

def ouverte_fermee(kind='ouverte', guide=False):
    s = txt(100, 14, 'vu de dessus', 9, 'var(--dim)', weight='600')
    # bleu en bas, face vers le haut, orthodoxe : pied gauche devant (à gauche de l'image)
    s += pied(84, 118, 10, 'var(--blue)') + pied(118, 168, 30, 'var(--blue)')
    s += txt(66, 122, 'G', 10, 'var(--blue)')
    if kind == 'ouverte':  # rouge gaucher, face vers le bas : pied droit devant, du même côté de l'image
        s += pied(84, 80, 190, 'var(--red)') + pied(118, 30, 210, 'var(--red)')
        s += txt(66, 84, 'D', 10, 'var(--red)')
        s += '<path d="M64 99 L104 99" stroke="var(--gold)" stroke-width="2" stroke-dasharray="3 3"/>'
        s += txt(100, 196, 'Garde ouverte : pieds avant face à face', 10)
    else:  # rouge orthodoxe : pied gauche devant, à droite de l'image
        s += pied(118, 80, 170, 'var(--red)') + pied(84, 30, 150, 'var(--red)')
        s += txt(136, 84, 'G', 10, 'var(--red)')
        s += txt(100, 196, 'Garde fermée : pieds avant en diagonale', 10)
    return wrap(s, 200, 205, guide)

# --- Distances ---------------------------------------------------------------
def distances(mark=None, guide=False):
    zones = [('Longue', 'pieds, teep', 'var(--blue)'), ('Moyenne', 'poings', 'var(--green)'),
             ('Courte', 'clinch, genoux, coudes', 'var(--gold)'), ('Sol', 'lutte au sol, JJB', 'var(--red)')]
    s = ''
    for i, (n, d, c) in enumerate(zones):
        y = 20 + i * 42
        op = '1' if (mark is None or mark == i) else '.25'
        s += '<rect x="20" y="%d" width="%d" height="34" rx="8" fill="%s" opacity="%s"/>' % (y, 160 - i * 30, c, op)
        s += txt(28, y + 15, n if mark is None else ('?' if mark == i else n), 11, 'var(--bg)', 'start')
        if mark is None:
            s += txt(28, y + 28, d, 9, 'var(--bg)', 'start', '600')
    return wrap(s, 200, 195, guide)

# --- Octogone -----------------------------------------------------------------
def octogone(mode='centre', guide=False):
    import math
    pts = ' '.join('%.1f,%.1f' % (100 + 80 * math.cos(math.radians(22.5 + 45 * k)), 100 + 80 * math.sin(math.radians(22.5 + 45 * k))) for k in range(8))
    s = '<polygon points="%s" fill="var(--card2)" stroke="var(--dim)" stroke-width="3"/>' % pts
    s += '<circle cx="100" cy="100" r="22" fill="none" stroke="var(--dim2)" stroke-dasharray="4 4"/>'
    if mode == 'centre':
        s += '<circle cx="100" cy="100" r="9" fill="var(--blue)"/><circle cx="150" cy="130" r="9" fill="var(--red)"/>'
        s += txt(100, 196, 'Bleu tient le centre, rouge est repoussé', 10)
    elif mode == 'cage':
        s += '<circle cx="55" cy="150" r="9" fill="var(--red)"/><circle cx="72" cy="132" r="9" fill="var(--blue)"/>'
        s += '<path d="M82 124 L64 144" stroke="var(--gold)" stroke-width="2"/>'
        s += txt(100, 196, 'Rouge dos à la cage, bleu le presse', 10)
    else:  # couper la cage
        s += '<circle cx="140" cy="60" r="9" fill="var(--red)"/><circle cx="105" cy="100" r="9" fill="var(--blue)"/>'
        s += '<path d="M150 70 Q170 110 150 150" fill="none" stroke="var(--red)" stroke-width="2" stroke-dasharray="4 3"/>'
        s += '<path d="M112 108 L140 128" stroke="var(--blue)" stroke-width="3"/><path d="M132 130 L142 129 L138 120" fill="none" stroke="var(--blue)" stroke-width="3"/>'
        s += txt(100, 196, 'Couper la cage : bleu coupe la trajectoire', 10)
    return wrap(s, 200, 205, guide)

# --- Positions au sol, vues de dessus ----------------------------------------
def capsule(x, y, w, h, rot, col):
    return '<rect x="%d" y="%d" width="%d" height="%d" rx="%d" fill="%s" transform="rotate(%d %d %d)"/>' % (x - w // 2, y - h // 2, w, h, min(w, h) // 2, col, rot, x, y)

def tete(x, y, col):
    return '<circle cx="%d" cy="%d" r="11" fill="%s" stroke="var(--bg)" stroke-width="2"/>' % (x, y, col)

def position(kind, show_name=True, guide=False):
    B, R = 'var(--blue)', 'var(--red)'
    s = '<rect x="5" y="5" width="190" height="170" rx="10" fill="var(--card)"/>'
    # combattant du dessous (bleu), sur le dos, tête en haut
    s += capsule(100, 90, 34, 70, 0, B) + tete(100, 44, B)
    s += capsule(88, 142, 12, 46, 0, B) + capsule(112, 142, 12, 46, 0, B)
    names = {'garde': 'Garde fermée (rouge dans la garde)', 'montee': 'Montée (rouge assis sur le ventre)',
             'lateral': 'Contrôle latéral (rouge en travers)', 'dos': 'Dos (rouge derrière, crochets)',
             'demi': 'Demi-garde (une jambe piégée)'}
    if kind == 'garde':
        s += capsule(100, 118, 34, 56, 0, R) + tete(100, 86, R)
        s += '<path d="M84 130 Q70 100 92 96" stroke="%s" stroke-width="10" fill="none" stroke-linecap="round"/>' % B
        s += '<path d="M116 130 Q130 100 108 96" stroke="%s" stroke-width="10" fill="none" stroke-linecap="round"/>' % B
    elif kind == 'montee':
        s += capsule(100, 96, 30, 40, 0, R) + tete(100, 64, R)
        s += capsule(72, 102, 10, 34, -15, R) + capsule(128, 102, 10, 34, 15, R)
    elif kind == 'lateral':
        s += capsule(142, 84, 70, 30, 0, R) + tete(100, 80, R)
    elif kind == 'dos':
        s = '<rect x="5" y="5" width="190" height="170" rx="10" fill="var(--card)"/>'
        s += capsule(100, 100, 36, 72, 0, R) + tete(100, 52, R)
        s += capsule(100, 90, 30, 62, 0, B) + tete(100, 44, B)
        s += '<path d="M84 110 Q74 124 90 132" stroke="%s" stroke-width="8" fill="none" stroke-linecap="round"/>' % R
        s += '<path d="M116 110 Q126 124 110 132" stroke="%s" stroke-width="8" fill="none" stroke-linecap="round"/>' % R
        s += '<path d="M82 54 Q100 68 118 54" stroke="%s" stroke-width="6" fill="none"/>' % R
    elif kind == 'demi':
        s += capsule(118, 104, 32, 58, 20, R) + tete(108, 72, R)
        s += '<path d="M112 150 Q126 136 132 128" stroke="%s" stroke-width="10" fill="none" stroke-linecap="round"/>' % B
    lab = names[kind] if show_name else 'Quelle position ?'
    s += txt(100, 192, lab, 10, 'var(--gold)' if not show_name else 'var(--txt)')
    return wrap(s, 200, 200, guide)

# --- Sprawl, vue de côté ------------------------------------------------------
def sprawl(guide=False):
    s = '<line x1="10" y1="170" x2="190" y2="170" stroke="var(--dim2)" stroke-width="2"/>'
    # attaquant bleu : plonge de gauche à droite vers les jambes
    s += '<path d="M22 168 L52 160 L108 146" stroke="var(--blue)" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    s += '<circle cx="120" cy="146" r="10" fill="var(--blue)"/>'
    s += '<path d="M104 150 L140 164" stroke="var(--blue)" stroke-width="7" stroke-linecap="round"/>'
    # défenseur rouge : poitrine sur la tête et le dos, hanches basses, jambes projetées loin derrière
    s += '<circle cx="96" cy="112" r="10" fill="var(--red)"/>'
    s += '<path d="M104 118 L134 132 L186 166" stroke="var(--red)" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    s += '<path d="M104 122 L98 140" stroke="var(--red)" stroke-width="7" stroke-linecap="round"/>'
    s += txt(100, 30, 'Sprawl (rouge) contre double jambe', 10) + txt(100, 46, 'hanches lourdes, jambes projetées en arrière', 9, 'var(--dim)', weight='600')
    return wrap(s, 200, 190, guide)

# --- Phases du combat -----------------------------------------------------------
def phases(guide=False):
    s = ''
    items = [('Distance', 'var(--blue)', 20), ('Clinch', 'var(--gold)', 75), ('Sol', 'var(--red)', 130)]
    for n, c, x in items:
        s += '<rect x="%d" y="40" width="50" height="40" rx="8" fill="%s"/>' % (x, c) + txt(x + 25, 64, n, 10, 'var(--bg)')
    s += '<path d="M70 60 L75 60 M125 60 L130 60" stroke="var(--txt)" stroke-width="2"/>'
    s += '<path d="M45 90 Q100 130 155 90" fill="none" stroke="var(--dim)" stroke-width="2" stroke-dasharray="4 3"/>'
    s += txt(100, 126, 'amenée au sol directe', 9, 'var(--dim)', weight='600')
    s += '<path d="M155 30 Q100 0 45 30" fill="none" stroke="var(--green)" stroke-width="2"/>' + txt(100, 18, 'se relever', 9, 'var(--green)', weight='600')
    return wrap(s, 200, 140, guide)

# --- Coups de pied, jambe vue de côté ----------------------------------------
def jambe(mark=None, guide=False):
    s = '<path d="M90 20 L84 100 L88 180 L120 184 L112 174 L104 100 L112 20 Z" fill="var(--card2)" stroke="var(--dim)" stroke-width="2"/>'
    zones = {1: (97, 62, 'cuisse externe : low kick'), 2: (93, 136, 'mollet externe : calf kick'), 3: (99, 100, 'genou : zone fragile')}
    for n, (x, y, nom) in zones.items():
        col = 'var(--red)' if (mark is None or mark == n) else 'var(--dim2)'
        s += '<circle cx="%d" cy="%d" r="8" fill="%s" stroke="var(--bg)" stroke-width="1.5"/>' % (x, y, col) + txt(x, y + 3.5, str(n), 9, 'var(--bg)')
        if mark is None:
            s += txt(128, y + 3, nom, 9, 'var(--dim)', 'start', '600')
    if mark:
        s += txt(100, 200, 'Quelle zone ?', 10, 'var(--gold)')
    return wrap(s, 200 if mark else 260, 205, guide)

DESSINS = {
    'CORPS': lambda g: body(labels=True, guide=g),
    'CORPS_MENTON': lambda g: body(mark=1, guide=g), 'CORPS_TEMPE': lambda g: body(mark=2, guide=g),
    'CORPS_PLEXUS': lambda g: body(mark=3, guide=g), 'CORPS_FOIE': lambda g: body(mark=4, guide=g),
    'CORPS_COTES': lambda g: body(mark=5, guide=g), 'CORPS_CUISSE': lambda g: body(mark=6, guide=g),
    'CORPS_MOLLET': lambda g: body(mark=7, guide=g),
    'GARDE_ORTHO': lambda g: garde('orthodoxe', g), 'GARDE_FAUSSE': lambda g: garde('fausse', g),
    'OUVERTE': lambda g: ouverte_fermee('ouverte', g), 'FERMEE': lambda g: ouverte_fermee('fermee', g),
    'DISTANCES': lambda g: distances(guide=g), 'DIST_0': lambda g: distances(0, g), 'DIST_1': lambda g: distances(1, g),
    'DIST_2': lambda g: distances(2, g), 'DIST_3': lambda g: distances(3, g),
    'OCTO_CENTRE': lambda g: octogone('centre', g), 'OCTO_CAGE': lambda g: octogone('cage', g), 'OCTO_COUPER': lambda g: octogone('couper', g),
    'POS_GARDE': lambda g: position('garde', True, g), 'POS_MONTEE': lambda g: position('montee', True, g),
    'POS_LATERAL': lambda g: position('lateral', True, g), 'POS_DOS': lambda g: position('dos', True, g), 'POS_DEMI': lambda g: position('demi', True, g),
    'Q_GARDE': lambda g: position('garde', False, g), 'Q_MONTEE': lambda g: position('montee', False, g),
    'Q_LATERAL': lambda g: position('lateral', False, g), 'Q_DOS': lambda g: position('dos', False, g), 'Q_DEMI': lambda g: position('demi', False, g),
    'SPRAWL': lambda g: sprawl(g), 'PHASES': lambda g: phases(g),
    'JAMBE': lambda g: jambe(guide=g), 'JAMBE_1': lambda g: jambe(1, g), 'JAMBE_2': lambda g: jambe(2, g), 'JAMBE_3': lambda g: jambe(3, g),
}

if __name__ == '__main__':
    base = os.path.dirname(os.path.abspath(__file__))
    for f in sorted(glob.glob(base + '/u*.js')):
        s = open(f, encoding='utf-8').read()
        def rep(m):
            nom, g = m.group(1), m.group(2) == ':g'
            svg = DESSINS[nom](g)
            return svg.replace('"', "'") if g else svg.replace('"', "'")
        n = re.subn(r'@@([A-Z0-9_]+)(:g)?@@', rep, s)
        if n[1]:
            open(f, 'w', encoding='utf-8').write(n[0]); print(os.path.basename(f), n[1], 'schémas')
