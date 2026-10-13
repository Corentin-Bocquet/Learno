/*EXAMEN*/
{
cases:[
{id:"mains",t:"Au Cercle de Vincennes : qui gagne le pot ?",mods:[43],
 ctx:"Table de No Limit Hold'em à six joueurs. Au showdown, le board est As Ks Qs Js Td (s pique, h coeur, d carreau, c trèfle). Léa a la dame de pique en main, Marc a le roi de coeur et le deux de trèfle, Sam a le neuf de carreau et le huit de trèfle. Un débutant demande dans quel ordre les mains se classent.",
 cards:[
 {t:"order",q:"Classe ces mains de la plus forte à la plus faible.",it:["Quinte flush","Carré","Full","Couleur","Quinte","Brelan","Double paire"],w:"Piège classique : la couleur bat la quinte, et le full bat la couleur. Après le brelan viennent la double paire, la paire et la carte haute."},
 {t:"story",q:"Que réponds-tu au débutant ?",sc:[{who:"Le débutant",txt:"Le board est A K Q J T. Léa a une dame de pique, moi un roi de coeur. Qui gagne ?"}],
  o:["Le pot est partagé : le board seul forme la quinte de l'As au dix", "Léa gagne seule, car elle a une carte de pique en main au showdown", "Marc gagne avec le roi, car le roi de coeur est plus fort que tout", "Sam gagne avec ses deux cartes basses qui améliorent la quinte du board"],a:0,w:"Tu n'es pas obligé d'utiliser tes deux cartes. Si le board est AKQJT, tout le monde a la même quinte, on partage le pot."},
 {t:"num",q:"Une main de départ au Hold'em : combien y a-t-il de combinaisons possibles de 2 cartes parmi 52 ?",a:1326,tol:1,w:"52 x 51 / 2 = 1 326 combinaisons, regroupées en 169 mains de départ distinctes."},
 {t:"sort",q:"Cette main bat-elle une quinte ?",bins:["Bat la quinte","Perd contre la quinte"],it:[["Couleur",0],["Full",0],["Brelan",1],["Double paire",1],["Carré",0]],w:"De la plus forte à la plus faible : quinte flush, carré, full, couleur, quinte, brelan, double paire, paire, carte haute."},
 {t:"tf",q:"L'As peut compter comme le 1 dans la quinte A-2-3-4-5, appelée la roue.",a:true,w:"Vrai : l'As est la plus haute carte, mais aussi le 1 dans la roue."}
 ]},
{id:"positions",t:"Le bouton vaut de l'argent : positions et déroulé",mods:[44],
 ctx:"Tu joues en 6-max au Cercle de Vincennes. Tu as AJo. Tu es UTG à la première main, puis au bouton à la suivante. Un joueur te dit qu'il ouvre les mêmes mains partout, par principe.",
 cards:[
 {t:"order",q:"Classe les positions dans l'ordre de parole préflop, du premier au dernier (hors blindes).",it:["UTG","MP / HJ","CO (cutoff)","BTN (bouton)"],w:"Le bouton parle en dernier postflop, la meilleure position. SB et BB jouent en premier postflop."},
 {t:"story",q:"Que réponds-tu à ce joueur ?",sc:[{who:"Le joueur",txt:"J'ouvre les mêmes mains partout. Pourquoi tu serres UTG et tu élargis au bouton ?"}],
  o:["Agir en dernier donne plus d'information : la main vaut plus en position", "Au bouton, on a des cartes plus fortes qu'ailleurs en moyenne à la table", "Les blindes sont forcées de payer, donc on gagne toujours contre elles", "Il n'y a aucune différence entre les positions en 6-max, jamais d'écart"],a:0,w:"La position est le seul avantage gratuit du poker. Un joueur solide ouvre environ 18 % de ses mains UTG et plus de 40 % au bouton."},
 {t:"match",q:"Associe chaque position à sa particularité.",p:[["UTG","Parle en premier préflop, la pire position"],["CO","Juste avant le bouton"],["BTN","Parle en dernier postflop"],["SB et BB","Misent à l'aveugle, jouent en premier postflop"]],w:"Les blindes misent à l'aveugle. Le bouton est la meilleure place."},
 {t:"num",q:"Un joueur ouvre 18 % de ses mains UTG et 43 % au bouton. De combien de points de pourcentage la range du bouton est-elle plus large ?",a:25,tol:0.5,un:" points",w:"43 - 18 = 25 points de pourcentage de mains en plus."},
 {t:"tf",q:"Le No Limit signifie que la mise maximale est fixée à la taille du pot.",a:false,w:"Faux : No Limit veut dire que tu peux miser tout ton tapis à n'importe quel moment. À chaque tour tu peux checker, miser, suivre, relancer ou te coucher."}
 ]},
{id:"combos",t:"AK ou paire de dames ? Compter les combinaisons",mods:[45,53],
 ctx:"Un adversaire relance préflop depuis le UTG. Sur le board As Kd 7h, tu te demandes s'il a AK, AA, KK ou 77. Tu dois compter les combinaisons, pas faire confiance à ton intuition.",
 cards:[
 {t:"match",q:"Associe chaque main au nombre de combinaisons préflop.",p:[["Une paire comme AA","6"],["Une main assortie comme AKs","4"],["Une main dépareillée comme AKo","12"],["AK en tout","16"]],w:"6, 4, 12, 16. Les mains dépareillées sont deux fois plus fréquentes que les paires, alors qu'on a l'impression du contraire."},
 {t:"num",q:"Préflop, combien de combinaisons de AK (assortis ou non) contre combien de QQ ? Donne la différence AK moins QQ.",a:10,tol:0.1,w:"AK : 16 combinaisons, QQ : 6. Différence : 10. Tu compares 16 combinaisons contre 6."},
 {t:"num",q:"Sur le board As Kd 7h, combien de combinaisons de AK reste-t-il (3 As et 3 Rois non vus) ?",a:9,tol:0.1,h:"3 As restants multipliés par 3 Rois restants.",w:"3 x 3 = 9 combinaisons de double paire AK, contre 3 pour chacun des brelans AA, KK et 77 (C(3,2) = 3). La double paire est bien plus fréquente."},
 {t:"story",q:"Que conclus-tu pour payer ou non à la river ?",sc:[{who:"Toi",txt:"Il a 9 combos de AK et 3 combos de chaque brelan. Je dois le payer avec ma double paire ?"}],
  o:["Compte aussi les blockers : le comptage décide, pas l'intuition", "Paye toujours : tu bats la moitié de sa range, donc le call est bon", "Couche toujours : un brelan est toujours possible, mieux vaut prudence", "Tout dépend de la couleur de ta main uniquement, rien d'autre ne compte"],a:0,w:"C'est ce genre de comptage, pas l'intuition, qui décide d'un call à la river."},
 {t:"tf",q:"Tenir une carte retire cette carte de la range de l'adversaire : c'est l'effet de blocage (removal).",a:true,w:"Vrai : tenir l'As de pique sur un board avec trois piques retire toutes les couleurs à l'As de sa range."}
 ]},
{id:"ranges",t:"Penser en range : les fréquences d'ouverture",mods:[46],
 ctx:"En 6-max à 100 bb, tu veux construire ta stratégie d'ouverture. Tu hésites sur la taille, la fréquence par position et sur le fait de jouer K9s UTG. La table passe souvent à tapis court en tournoi.",
 cards:[
 {t:"match",q:"Associe chaque position à sa fréquence d'ouverture de référence.",p:[["UTG","environ 18 %"],["HJ","environ 22 %"],["CO","environ 27 %"],["BTN","environ 43 %"],["SB","environ 40 %, relance ou mixte"]],w:"Chaque siège vers le bouton ajoute des mains."},
 {t:"sort",q:"Cette raison élargit-elle ou resserre-t-elle la range d'ouverture ?",bins:["Élargit","Resserre"],it:[["Être au bouton",0],["Plus de joueurs derrière toi",1],["Des blindes qui se couchent trop",0],["Être UTG",1]],w:"La position, le nombre d'adversaires restants et leur passivité décident."},
 {t:"num",q:"Tu ouvres à 2,5 bb avec des blindes de 1 et 0,5 bb déjà dans le pot. Si les deux blindes se couchent, quel est ton gain en bb ?",a:1.5,tol:0.01,un:" bb",w:"Les blindes valent 0,5 + 1 = 1,5 bb. Tu gagnes 1,5 bb sans combattre."},
 {t:"story",q:"Que conseilles-tu pour la taille d'ouverture en tournoi ?",sc:[{who:"Un ami",txt:"En cash je mets 2,5 bb partout. En tournoi aussi, non ?"}],
  o:["En tournoi, on descend souvent à 2 ou 2,2 bb : tapis courts, blindes lourdes", "Toujours 5 bb en tournoi pour protéger sa main contre les relances adverses", "Jamais plus de 1 bb, sinon on perd son tapis en quelques mains seulement", "La taille d'ouverture doit varier selon la main reçue, et jamais selon le tapis"],a:0,w:"En cash game moderne, on ouvre entre 2 et 2,5 bb quelle que soit la position."},
 {t:"tf",q:"Les mains dépareillées entrent dans une range d'ouverture avant leurs équivalents assortis, car elles sont plus fréquentes.",a:false,w:"Faux : les mains assorties entrent avant leurs équivalents dépareillés, car la couleur ajoute de l'équité et de la jouabilité. Exemple d'une range UTG serrée, environ 11 à 15 % : 77+, A3s+, K9s+, QTs+, JTs, T9s, AQo+, KQo."}
 ]},
{id:"outs",t:"Tirage couleur au flop : outs, règle de 2 et 4 et cote du pot",mods:[47],
 ctx:"Flop : Ks 9s 4d. Tu as As 7s : tirage couleur à la nuts. Le pot est à 100. L'adversaire mise 50. Il reste de la profondeur derrière. Tu dois décider : payer ou te coucher.",
 cards:[
 {t:"match",q:"Associe chaque tirage à son nombre d'outs.",p:[["Tirage couleur","9"],["Tirage quinte bilatérale","8"],["Tirage quinte ventral","4"],["Deux surcartes","6"],["Couleur + quinte","15"]],w:"Un out est une carte qui transforme ta main en main gagnante. Ne compte jamais deux fois la même carte."},
 {t:"num",q:"Avec 9 outs au flop (deux cartes à venir), quelle est l'équité approchée par la règle des 4, en % ?",a:36,tol:0.5,un:" %",w:"9 x 4 = 36 % (valeur exacte 34,97 %). Au turn : 9 x 2 = 18 % (exacte 19,6 %)."},
 {t:"num",q:"Pot de 100, l'adversaire mise 50. Quelle équité faut-il pour suivre à l'équilibre, en % ?",a:25,tol:0.1,un:" %",h:"mise à suivre divisée par (pot + mise + ta mise).",w:"50 / (100 + 50 + 50) = 50 / 200 = 25 %. Tu paies 50 pour gagner 150, dans un pot final de 200."},
 {t:"story",q:"Que décides-tu ?",sc:[{who:"Toi",txt:"J'ai 36 % d'équité et il m'en faut 25 %. Je paye ?"}],
  o:["Oui : 36 % > 25 %, et la cote implicite est un bonus","Non : la règle des 4 surestime toujours l'équité","Non : un tirage ne se paye jamais au flop","Oui, mais seulement si l'adversaire a un tapis court"],a:0,w:"Avec un tirage couleur à 35 %, tu suis largement. La cote implicite justifie parfois de suivre même avec une cote immédiate insuffisante."},
 {t:"multi",q:"Coche les conditions de la cote implicite.",o:["Ton tirage doit être discret","L'adversaire doit avoir du tapis derrière","L'adversaire doit être capable de te payer si tu touches","L'adversaire doit montrer toutes ses cartes avant","Le tirage doit être le plus visible possible pour la table"],a:[0,1,2],w:"Cote implicite : ce que tu comptes gagner en plus si tu touches. Trois conditions : tirage discret, adversaire avec du tapis, adversaire capable de payer."}
 ]},
{id:"ev",t:"Équité et espérance : la décision, pas le résultat",mods:[48],
 ctx:"Tu as AKs et ton adversaire QQ : tu perds le coup. Plus tard, tu bluffes 50 dans un pot de 100 : il se couche une fois sur deux. Ton ami dit qu'il gagne 60 % de ses mains et qu'il perd quand même de l'argent.",
 cards:[
 {t:"match",q:"Associe chaque affrontement à l'équité de la première main.",p:[["AA contre KK","82 %"],["Paire contre deux surcartes","55 %"],["AK contre AQ","74 %"],["AKs contre QQ","46 %"],["Tirage couleur contre top paire (flop)","35 %"]],w:"Paire contre deux surcartes : le fameux coin flip. AK contre AQ : domination."},
 {t:"num",q:"Bluff de 50 dans un pot de 100. Quel est le point mort, en % de folds nécessaires ?",a:33.3,tol:0.5,un:" %",h:"mise / (mise + pot).",w:"50 / (50 + 100) = 33 %. Si tu penses qu'il se couche plus d'une fois sur trois, le bluff est rentable."},
 {t:"num",q:"Il se couche une fois sur deux (p = 0,5). Gain si fold : 100. Perte sinon : 50. Quelle est l'espérance du bluff ?",a:25,tol:0.5,un:" €",w:"EV = 0,5 x 100 - 0,5 x 50 = 50 - 25 = +25. Le bluff est rentable."},
 {t:"story",q:"Que dis-tu à ton ami qui gagne 60 % de ses mains et perd de l'argent ?",sc:[{who:"Ton ami",txt:"Je gagne 60 % de mes mains, mais je suis en négatif. C'est de la malchance, non ?"}],
  o:["Le poker se joue sur la taille des pots, pas sur le nombre de mains gagnées", "Oui, c'est de la malchance pure, ça va revenir tout seul avec le temps", "Il faut jouer encore plus de mains pour compenser les pertes accumulées", "Gagner 60 % des mains garantit un profit sur la durée, c'est mathématique"],a:0,w:"Un joueur qui gagne 60 % de ses mains peut perdre de l'argent, un joueur qui en gagne 20 % peut être très rentable."},
 {t:"tf",q:"Après une main perdue, la bonne question est : la décision était-elle la bonne avec l'information disponible ?",a:true,w:"Vrai : le résultat n'est pas la qualité de la décision."}
 ]},
{id:"flop",t:"K72 arc-en-ciel ou 987 à deux couleurs : lire le flop",mods:[49],
 ctx:"Tu as ouvert au bouton, la grosse blinde a payé. Flop 1 : Ks 7d 2c. Flop 2 : 9h 8h 7s. Tu hésites sur le c-bet. Un joueur te dit qu'il mise toujours le flop quand il a ouvert.",
 cards:[
 {t:"sort",q:"Quelle texture ?",bins:["Sec","Coordonné","Pairé","Monotone"],it:[["K72 arc-en-ciel",0],["987 à deux couleurs",1],["883",2],["Trois piques",3]],w:"Sec : peu de tirages. Coordonné : beaucoup de tirages. Pairé : réduit les mains fortes. Monotone : range de couleur limitée."},
 {t:"match",q:"Associe chaque situation au c-bet conseillé.",p:[["Flop sec avec avantage de range","25 à 33 % du pot, très souvent"],["Flop coordonné, ranges proches","60 à 75 %, plus sélectif"],["Flop qui favorise l'adversaire","Check fréquent"]],w:"La petite mise sur flop sec demande peu de folds pour être rentable."},
 {t:"num",q:"Pot de 100 et mise de 33 : de combien de pourcents de folds as-tu besoin pour que le bluff soit rentable ?",a:25,tol:1,un:" %",w:"33 / (33 + 100) = 25 %. 33 % du pot n'a besoin de passer que 25 % du temps."},
 {t:"story",q:"Que dis-tu au joueur qui mise toujours le flop ?",sc:[{who:"Le joueur",txt:"J'ai ouvert, je mise toujours le flop. C'est ça le c-bet, non ?"}],
  o:["C'est la fuite la plus facile à exploiter : on le laisse miser et on relance sur les flops qui ne lui appartiennent pas", "C'est la bonne stratégie pour gagner à tous les coups, sur tous les flops du jeu", "C'est correct seulement sur les flops pairés, mais une erreur sur tous les autres", "C'est correct si tu as ouvert depuis le UTG, et seulement dans ce cas précis ici"],a:0,w:"La question centrale : quelle range touche le mieux ce flop ? Sur A72, celui qui a ouvert a beaucoup plus d'As."},
 {t:"tf",q:"Sur un flop humide, une petite mise de 25 % du pot est la meilleure taille, car elle rend les tirages incertains.",a:false,w:"Faux : une petite mise donne une cote trop belle aux tirages. Sur un flop coordonné, on mise 60 à 75 % du pot, plus sélectif, ou on checke."}
 ]},
{id:"turn",t:"Le turn : double barrel et tapis effectif",mods:[50],
 ctx:"Tu as fait un c-bet au flop et ton adversaire a payé. Le turn est un As. Le pot est à 100 et tu as 300 derrière. Tu envisages un deuxième barrel de 66 % du pot.",
 cards:[
 {t:"num",q:"Mise de 66 dans un pot de 100 : quel pourcentage de folds te faut-il (arrondi à l'entier) ?",a:40,tol:1,un:" %",w:"66 / (66 + 100) = 39,8 %, soit environ 40 %. Un deuxième barrel a besoin de moins de folds qu'il n'y paraît."},
 {t:"num",q:"Le pot est à 100 et il te reste 300 derrière. Quel est le SPR (tapis effectif divisé par le pot) ?",a:3,tol:0.1,w:"300 / 100 = 3. SPR bas, top paire se joue jusqu'au tapis. SPR haut, elle devient une main de contrôle de pot."},
 {t:"multi",q:"Coche les bonnes cartes pour tirer un deuxième barrel.",o:["Les surcartes qui complètent ta range et pas la sienne","Les cartes qui apportent des tirages à ta main","Les cartes qui tuent les tirages suivis au flop","Les cartes qui complètent clairement sa range et pas la tienne","N'importe quelle carte, sans analyse"],a:[0,1,2],w:"Un As au turn favorise celui qui a ouvert. Un 5 change presque rien."},
 {t:"story",q:"Que réponds-tu à un ami qui checke tout le turn avec ses mains faibles ?",sc:[{who:"Ton ami",txt:"Je checke le turn avec toutes mes mains faibles et je mise les fortes."}],
  o:["Ta range de check est trop faible : la river devient injouable", "C'est parfait : ça cache tes mains fortes aux yeux de tous les adversaires", "Tu dois checker toutes tes mains fortes aussi, à chaque fois sans exception", "Le turn n'a aucune importance dans ta stratégie, seule la river compte vraiment"],a:0,w:"Checker le turn avec uniquement des mains faibles rend la river injouable. Quelle est ma range de check ?"},
 {t:"tf",q:"Le turn est la rue la plus travaillée par les joueurs intermédiaires.",a:false,w:"Faux : c'est la rue la moins travaillée, et celle où les erreurs sont les plus lourdes."}
 ]},
{id:"river",t:"La river : valeur, bluff et thin value",mods:[51],
 ctx:"River. Le pot est à 100. Tu as une main moyenne (paire de huit) et tu envisages de miser 50 pour de la valeur fine. Tu as aussi un tirage couleur manqué avec l'As de pique et tu envisages un bluff. Le board contient trois piques.",
 cards:[
 {t:"num",q:"Tu mises 50 dans un pot de 100 (50 % du pot). Quelle proportion de bluffs dans ta range de mise ?",a:25,tol:0.5,un:" %",h:"mise / (pot + 2 x mise).",w:"50 / (100 + 100) = 25 % de bluffs, 75 % de valeur."},
 {t:"match",q:"Associe chaque taille de mise à la proportion de bluffs.",p:[["50 % du pot","25 % de bluffs"],["100 % du pot","33 % de bluffs"],["200 % du pot","40 % de bluffs"]],w:"Plus tu mises gros, plus tu as le droit de bluffer souvent."},
 {t:"story",q:"Quel bluff choisir ?",sc:[{who:"Toi",txt:"J'ai le tirage couleur manqué avec l'As de pique, ou une paire de six. Lequel je bluffe ?"}],
  o:["L'As de pique : aucune valeur d'abattage, et il retire des couleurs à sa range", "La paire de six : elle gagne parfois à l'abattage, donc elle vaut mieux", "Les deux de la même façon : tout dépend de la taille de mise uniquement", "Aucun des deux : on ne bluffe jamais à la river, c'est une règle de base"],a:0,w:"On bluffe avec les mains sans valeur d'abattage qui bloquent les mains payantes de l'adversaire."},
 {t:"story",q:"Que dis-tu au joueur qui checke sa paire de huit ?",sc:[{who:"Le joueur",txt:"J'ai paire de huit, je checke : il va me payer avec quoi ?"}],
  o:["Une main plus faible peut payer : miser petit est un thin value bet", "Rien ne peut payer, donc check est correct, et c'est même la seule ligne", "Il faut miser tapis pour ne pas être battu par une carte inattendue ici", "Il vaut mieux bluffer que miser pour la valeur, c'est plus sûr à la river"],a:0,w:"La majorité des joueurs checkent trop de mains qui auraient été payées."},
 {t:"tf",q:"À la river, il n'y a plus d'équité : la seule question est de savoir si une main plus faible peut payer.",a:true,w:"Vrai : si oui, on mise pour la valeur. Si non, on mise pour bluffer, ou on checke."}
 ]},
{id:"threebet",t:"3-bet, 4-bet et squeeze : tailles et choix de bluffs",mods:[52],
 ctx:"Au CO, un joueur ouvre à 2,5 bb. Un autre le suit. Tu es au bouton. Tu as A5s. Plus tard, un joueur ouvre depuis le bouton à 45 % de ses mains et tu es dans les blindes avec TT.",
 cards:[
 {t:"num",q:"Un joueur ouvre à 2,5 bb. Tu 3-bets en position (3 x l'ouverture). Quelle taille en bb ?",a:7.5,tol:0.1,un:" bb",w:"3 x 2,5 = 7,5 bb. Hors de position : 4 x 2,5 = 10 bb."},
 {t:"num",q:"Même ouverture à 2,5 bb, tu 3-bets hors de position (4 x l'ouverture). Quelle taille en bb ?",a:10,tol:0.1,un:" bb",w:"Hors de position, tu paies plus cher pour compenser le désavantage postflop, et donner une cote moins bonne aux mains spéculatives."},
 {t:"story",q:"Que fais-tu au bouton avec A5s, face à l'ouverture et un caller ?",sc:[{who:"Toi",txt:"Open, un caller, j'ai A5s au bouton. Je squeeze ?"}],
  o:["Oui : A5s bloque AA, AK et AQ et floppe des tirages, le squeeze est rentable", "Non : A5s est une main trop faible pour relancer dans ce spot précis ici", "Non : un squeeze se fait uniquement avec AA ou KK, jamais avec un bluff", "Oui, mais seulement avec KJo, une main dépareillée moyenne, pas avec A5s"],a:0,w:"Squeeze : 3-bet après un open et un ou plusieurs callers. L'ouvreur est engagé, le caller n'a pas de force. Les mains dépareillées moyennes comme KJo sont les pires bluffs."},
 {t:"match",q:"Associe chaque construction à sa situation.",p:[["3-bet polarisé","Monstres plus bluffs choisis, par défaut hors de position"],["3-bet linéaire","Haut de range en bloc, contre un bouton qui ouvre 45 %"],["4-bet","2,2 à 2,5 fois le 3-bet"],["Squeeze","+ 1 bb par caller supplémentaire"]],w:"Open, 3-bet, 4-bet, squeeze : quatre vocabulaires, quatre tailles. Hors de position on paie plus cher pour compenser le désavantage postflop."},
 {t:"tf",q:"Le squeeze est le spot le plus rentable du préflop moderne.",a:true,w:"Vrai : l'ouvreur est engagé, le caller a montré une main moyenne sans force, donc l'équité en fold est énorme."}
 ]},
{id:"mdf",t:"MDF et alpha : combien de mains défendre",mods:[54],
 ctx:"À la river, l'adversaire mise pot (100 dans 100). Tu as une main moyenne. Tu te demandes combien de mains défendre pour ne pas être exploité. Puis tu joues contre un joueur passif qui ne bluffe jamais à la river.",
 cards:[
 {t:"num",q:"Mise de 75 % du pot : quel est l'alpha (fréquence de fold nécessaire au bluff), en % ?",a:43,tol:1,un:" %",h:"mise / (mise + pot) avec pot = 100, mise = 75.",w:"75 / (75 + 100) = 42,9 %, soit 43 %. MDF = 57 %."},
 {t:"match",q:"Associe chaque mise à sa MDF.",p:[["33 % du pot","75 %"],["50 % du pot","67 %"],["100 % du pot","50 %"],["200 % du pot","33 %"]],w:"MDF = 1 - alpha. Si tu couches plus de 50 % face à une mise pot, n'importe quelle main devient un bluff rentable contre toi."},
 {t:"num",q:"Face à une mise de 100 dans un pot de 100, tu défends 50 mains sur 100 de ta range. Combien de mains couches-tu au minimum à l'équilibre ?",a:50,tol:0.1,w:"MDF = 50 %. Tu défends 50 mains et en couches 50."},
 {t:"story",q:"Que fais-tu contre un joueur qui ne bluffe jamais à la river ?",sc:[{who:"Toi",txt:"Il ne bluffe jamais. Je dois quand même défendre 50 % de ma range ?"}],
  o:["Non : couche très au-delà de la MDF, c'est correct", "Oui : la MDF est une obligation absolue contre tous les adversaires", "Oui : paye avec toutes les mains moyennes, quelle que soit la mise", "Non : relance avec toutes les mains moyennes pour le faire douter"],a:0,w:"La MDF est une borne théorique, pas une obligation. La théorie protège du pire adversaire, elle ne maximise pas contre l'adversaire réel."},
 {t:"tf",q:"Les blockers de ta main sont une raison de payer plus que la MDF.",a:true,w:"Vrai : la hiérarchie des raisons de payer est la fréquence de bluff réelle, les blockers, puis la MDF comme garde-fou."}
 ]},
{id:"range",t:"Polarisée ou condensée : la taille découle de la range",mods:[55],
 ctx:"Sur un board A-K-Q, tu as ouvert préflop et ton adversaire a payé en grosse blinde. Tu dois choisir ta taille de mise. Tu as aussi un ami qui check toutes ses mains faibles et mise toutes ses mains fortes.",
 cards:[
 {t:"sort",q:"Range polarisée ou condensée ?",bins:["Polarisée","Condensée"],it:[["Très fortes mains et bluffs, rien au milieu",0],["Beaucoup de mains moyennes, peu d'extrêmes",1],["On mise gros",0],["On mise petit ou on checke",1]],w:"La taille de mise découle de la forme de la range, jamais l'inverse."},
 {t:"story",q:"Pourquoi as-tu le droit de mettre la pression maximale sur A-K-Q ?",sc:[{who:"Toi",txt:"J'ai ouvert, il a payé en grosse blinde. Sur A-K-Q, je mise gros ?"}],
  o:["Tu as l'avantage de nuts : plus de AK, AQ et KQ dans ta range", "Parce que tu es en position, quelle que soit la range de l'adversaire", "Parce que tu as une main faible et un bluff à faire dans ce spot ici", "Parce que la mise est toujours rentable sur un board pairé comme celui-là"],a:0,w:"La grosse mise appartient à celui qui possède les combinaisons les plus fortes qui n'existent pas dans la range adverse."},
 {t:"story",q:"Que dis-tu à ton ami qui check ses mains faibles seulement ?",sc:[{who:"Ton ami",txt:"Je check toutes mes mains faibles et je mise toutes les fortes. C'est clair, non ?"}],
  o:["Ta range de check se fait attaquer : checke aussi des mains fortes", "C'est parfait : ça simplifie ta stratégie et ça la rend plus lisible", "Tu dois checker uniquement les mains fortes, jamais les mains faibles", "Tu dois miser toutes tes mains faibles pour qu'elles gagnent de la valeur"],a:0,w:"Un slowplay structurel protège tout ce qu'il y a de faible dans la range de check. Très différent du slowplay par gourmandise."},
 {t:"order",q:"Remets dans l'ordre la construction d'une range, en partant de la fin.",it:["Choisir ce qu'on veut avoir à la river","Décider quelles mains continuent à miser au turn","Décider quelles mains misent et checkent au flop","Transformer certaines mains en bluff à la river"],w:"Une range se construit à l'envers : on part de ce qu'on veut avoir à la river, et on remonte."},
 {t:"tf",q:"Avec une range condensée, on mise gros pour mettre la pression maximale.",a:false,w:"Faux : miser gros avec une range condensée est la faute de construction la plus courante. Une range condensée mise petit ou checke."}
 ]},
{id:"exploit",t:"VPIP, PFR et fold to c-bet : lire et exploiter les adversaires",mods:[56],
 ctx:"Tu as les statistiques de quatre adversaires : A (VPIP 45, PFR 8), B (VPIP 22, PFR 20), C (fold to c-bet 70 %), D (ne bluffe jamais à la river). Tu dois choisir les ajustements.",
 cards:[
 {t:"match",q:"Associe chaque profil au bon ajustement.",p:[["VPIP 45 / PFR 8, passif large","Ne pas bluffer, value bet très large et très souvent"],["VPIP 22 / PFR 20, serré agressif","Respect préflop, attaquer sa fréquence de fold au flop"],["Fold to c-bet supérieur à 60 %","Miser 33 % du pot sur tous les flops"],["Ne bluffe jamais à la river","Coucher les mains moyennes, très au-delà de la MDF"],["Calling station","Supprimer les bluffs, élargir les value bets"],["Maniaque","Arrêter de relancer, payer plus large"]],w:"On ne bluffe pas un passif large qui paie tout : on mise pour la valeur, très large et très souvent. Un ajustement par profil."},
 {t:"story",q:"Que fais-tu après trois folds observés ?",sc:[{who:"Toi",txt:"Il vient de se coucher trois fois au flop. Je mise 100 % des flops contre lui ?"}],
  o:["Non : trois observations ne prouvent rien, attends la confirmation", "Oui : ajuste immédiatement à fond sur cet échantillon, c'est plus rentable", "Non : ignore toujours les statistiques de l'adversaire, elles mentent souvent", "Oui : change de stratégie dès la première main perdue, sans attendre davantage"],a:0,w:"Un ajustement doit reposer sur un échantillon, pas sur une main."},
 {t:"sort",q:"Équilibre ou exploitation ?",bins:["Équilibre (GTO)","Exploitation"],it:[["Ne perd contre personne, gagne presque rien contre les mauvais",0],["Identifier une fuite et l'attaquer",1],["Accepter de devenir soi-même exploitable sur cet axe",1],["Se protéger du pire adversaire",0]],w:"L'argent réel vient de l'exploitation : identifier une fuite et l'attaquer, en acceptant de devenir soi-même exploitable sur cet axe."},
 {t:"num",q:"L'adversaire C se couche 70 % du temps face à un c-bet. Tu mises 33 % du pot, il te faut 25 % de folds. Combien de points de pourcentage de marge as-tu ?",a:45,tol:0.5,un:" points",w:"70 - 25 = 45 points de marge. Contre un fold to c-bet supérieur à 60 %, on mise 33 % du pot sur tous les flops."},
 {t:"tf",q:"Un joueur avec VPIP 22 et PFR 20 est un passif large.",a:false,w:"Faux : c'est un serré agressif. VPIP 45 et PFR 8 est un passif large."}
 ]},
{id:"bankroll",t:"Bankroll, variance et tilt : le protocole",mods:[57],
 ctx:"Tu joues du cash game avec des caves de 100 euros et des tournois à 20 euros. Tu viens de perdre trois caves de suite. Tu ouvres une table de plus pour te refaire. Tu te demandes combien tu dois avoir en bankroll.",
 cards:[
 {t:"num",q:"Cash game : 30 à 50 caves. Avec des caves de 100 €, quelle bankroll minimum (30 caves) ?",a:3000,tol:1,un:" €",w:"30 x 100 = 3 000 euros au minimum, 5 000 euros pour 50 caves."},
 {t:"num",q:"Tournois MTT : 100 à 200 buy-ins. Avec des buy-ins de 20 €, quelle bankroll minimum ?",a:2000,tol:1,un:" €",w:"100 x 20 = 2 000 euros, 4 000 euros pour 200 buy-ins. La distribution des gains est extrêmement asymétrique."},
 {t:"sort",q:"Signe de tilt ou bonne discipline ?",bins:["Signe de tilt","Bonne discipline"],it:[["Jouer plus de mains que d'habitude",0],["Ouvrir une table de plus pour se refaire",0],["Fixer un stop-loss avant de commencer",1],["Revoir les mains le lendemain",1],["Relancer sans plan",0]],w:"Le tilt est une dégradation de la qualité de décision sous charge émotionnelle."},
 {t:"story",q:"Que dis-tu à ton ami qui joue trois caves de plus pour se refaire ?",sc:[{who:"Ton ami",txt:"J'ai perdu trois caves, la table est bonne, je reste pour me refaire."}],
  o:["Stop-loss atteint : arrête, même si la table est bonne, revois les mains demain", "Reste : la table est bonne, tu vas te refaire en quelques mains seulement", "Joue plus vite pour rattraper les pertes avant la fin de la session ici", "Augmente la limite pour récupérer plus vite ce que tu as perdu ce soir"],a:0,w:"S'arrêter sur ce seuil, sans exception. Juger la décision, pas le résultat."},
 {t:"tf",q:"Un joueur gagnant peut perdre sur 100 000 mains : c'est la distribution normale des résultats.",a:true,w:"Vrai : confondre résultat et qualité de décision est la première cause de faillite au poker."}
 ]},
{id:"icm",t:"Sur la bulle : ICM, bubble factor et push or fold",mods:[58],
 ctx:"Tournoi MTT, vous êtes sur la bulle. Tu as un tapis moyen. Un joueur tapis court (10 bb) pousse. Tu as une main à équité neutre en jetons. Un gros tapis attaque tes blindes.",
 cards:[
 {t:"story",q:"Que fais-tu avec une main à équité neutre en jetons contre un tapis ?",sc:[{who:"Toi",txt:"Le call est neutre en équité de jetons. En cash je paierais. Là, sur la bulle ?"}],
  o:["Je couche : un call à équité neutre est perdant en argent réel avec l'ICM", "Je paye : une équité neutre suffit toujours pour justifier un call ici", "Je relance : l'ICM impose d'attaquer toujours, quelle que soit la main", "Peu importe : la bulle n'affecte pas la valeur des jetons restants du tout"],a:0,w:"Le tapis moyen se couche, le gros tapis attaque, le tapis court est bloqué."},
 {t:"num",q:"Le bubble factor est de 1,5. Tu risques de perdre 100 jetons-valeur. Combien de gain-valeur te faut-il à peu près pour compenser (100 x 1,5) ?",a:150,tol:1,w:"Perdre te coûte 1,5 fois ce que gagner te rapporte. Plus il est élevé, plus tu dois resserrer."},
 {t:"sort",q:"Push or fold ou jeu normal ?",bins:["Push or fold","Jeu normal"],it:[["8 bb",0],["12 bb",0],["40 bb",1],["15 bb",0],["100 bb",1]],w:"En dessous de 12 à 15 bb, la seule question est tapis ou poubelle."},
 {t:"multi",q:"Coche les erreurs qui coûtent le plus cher en tournoi.",o:["Jouer la bulle comme du cash game","Ne pas attaquer les tapis moyens quand on est gros tapis","Refuser un tapis marginal en début de tournoi par peur de sortir","Apprendre par coeur une table de push-fold pour les tapis courts","Resserrer au maximum à chaque niveau, sans raison"],a:[0,1,2],w:"Les tables de push-fold sont un savoir mécanique, le gain le plus immédiat pour un joueur de tournoi."},
 {t:"tf",q:"En cash game, un jeton vaut un euro. En tournoi, la valeur d'un jeton décroît à mesure que tu en accumules.",a:true,w:"Vrai : doubler ton tapis ne double pas tes chances de gagner le tournoi."}
 ]},
{id:"expert",t:"Les nœuds d'expert : mixte, multiway, donk bet",mods:[59],
 ctx:"Tu joues avec un solveur ouvert à côté. À 3 joueurs, au flop, tu tiens une main moyenne. Le solveur te donne 60 % mise, 40 % check pour une main. Un ami copie les tailles du solveur sans copier ses ranges.",
 cards:[
 {t:"story",q:"Que conclus-tu de 60 % mise, 40 % check ?",sc:[{who:"Toi",txt:"Le solveur dit 60 % mise, 40 % check pour cette main. C'est de l'hésitation ?"}],
  o:["Non : c'est la signature de l'équilibre, on ne peut plus t'exploiter", "Oui : le solveur n'est pas sûr de lui, il hésite entre deux actions", "Non : il faut toujours jouer l'action la moins fréquente, par principe", "Oui : tu dois jouer au hasard entre les deux actions, sans autre critère"],a:0,w:"Pour un humain, choisir une action pure proche de la fréquence dominante coûte très peu d'espérance."},
 {t:"sort",q:"Heads-up ou multiway (3 joueurs et plus) ?",bins:["Multiway","Heads-up"],it:[["Les bluffs perdent presque toute leur valeur",0],["La MDF s'applique par joueur",1],["Les ranges de valeur se resserrent nettement",0],["La stratégie est proche du jeu de valeur pur",0]],w:"À 3 joueurs et plus, la MDF ne s'applique plus par joueur."},
 {t:"story",q:"Que dis-tu à ton ami qui copie les tailles ?",sc:[{who:"Ton ami",txt:"Je copie les tailles du solveur : petite mise, grosse mise, surmise."}],
  o:["L'erreur d'expert est de recopier les tailles sans les ranges qui vont avec", "Parfait : les tailles suffisent pour copier un solveur, rien d'autre", "Il faut aussi copier les couleurs des cartes, c'est ce qui compte vraiment", "Les tailles du solveur sont inutiles en pratique, ne les copie jamais"],a:0,w:"Petite mise avec une range large, grosse mise ou surmise avec une range polarisée."},
 {t:"match",q:"Associe chaque concept à sa définition.",p:[["Donk bet","Miser hors de position contre l'agresseur de la rue précédente"],["Node locking","Figer la stratégie adverse sur son comportement réel, puis recalculer"],["Stratégie mixte","Un mélange d'actions à l'équilibre"]],w:"Le niveau au-dessus : l'expert cherche l'écart entre la stratégie adverse et l'équilibre, et il attaque cet écart."},
 {t:"tf",q:"Le donk bet est toujours une faute, quelle que soit la carte du turn.",a:false,w:"Faux : il redevient correct quand la carte du turn favorise fortement la range du défenseur."}
 ]}
]
}
