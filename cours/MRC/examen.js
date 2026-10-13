/*EXAMEN*/
{
docs:[
{t:"Les formules du cours",h:`<ul><li>Spread : rendement = (nominal promis / prix)^(1/T) - 1, spread = rendement - taux sans risque.</li>
<li>Binomial (taux continus) : p* = (e^(r dt) - d) / (u - d), valeur = e^(-r dt) x [p* x C(haut) + (1 - p*) x C(bas)].</li>
<li>Itô : dF = (dF/dX) dX + (dF/dt) dt + 1/2 (d2F/dX2) dX2, avec dt x dt = 0, dt x dz = 0, dz x dz = dt.</li>
<li>Black et Scholes : C = S N(d1) - K e^(-rT) N(d2), avec d1 = [ln(S/K) + (r + sigma2/2) T] / (sigma racine(T)) et d2 = d1 - sigma racine(T).</li>
<li>Parité put-call : p = c + K e^(-rT) - S.</li>
<li>Merton : Ve = Va N(d1) - F e^(-rT) N(d2), dette D = Va - Ve, YtM = -(1/T) ln(D / F), spread = YtM - r, PD = N(-d2) = 1 - N(d2).</li>
<li>CDS : valeur de la jambe prime = valeur de la jambe protection. PD semestrielle = 1 - racine(1 - PD annuelle).</li>
<li>Basket CDS, corrélation nulle : P(k défauts sur n) = C(n, k) p^k (1 - p)^(n - k). Probabilité jointe : P(X et Y) = rho x racine(pX (1 - pX) pY (1 - pY)) + pX pY.</li></ul>`}
],
cases:[
{id:"zc",t:"Le spread d'une obligation zéro-coupon privée",mods:[1],
 ctx:"Une obligation zéro-coupon d'État à 1 an a un rendement sans risque de 4 %. Une obligation zéro-coupon privée de même maturité, de nominal 100, a une probabilité de défaut de 8 % et un taux de recouvrement de 60 %. Le marché n'exige aucune prime de risque. Formules fournies.",
 cards:[
 {t:"num",q:"Quel est le prix de l'obligation privée ?",a:93.08,tol:0.02,h:"Flux espéré actualisé au taux sans risque.",w:"Flux espéré = 0,92 x 100 + 0,08 x 60 = 96,8. Prix = 96,8 / 1,04 = 93,08."},
 {t:"num",q:"Quel est le rendement de l'obligation privée, calculé sur le flux promis, en % ?",a:7.44,tol:0.02,un:" %",h:"Nominal promis divisé par le prix, moins 1.",w:"Rendement = 100 / 93,0769 - 1 = 7,438 %. Le rendement se calcule toujours sur le flux promis, jamais sur le flux espéré."},
 {t:"num",q:"Quel est le spread de crédit, en % ?",a:3.44,tol:0.02,un:" %",w:"Spread = rendement - taux sans risque = 7,44 % - 4 % = 3,44 %. Il rémunère la perte attendue (probabilité de défaut et recouvrement)."},
 {t:"mcq",q:"Que mesure la prime de risque dans un spread de crédit ?",o:["La part du spread due à l'aversion au risque du marché","La part du spread due à la probabilité de défaut seule","La part du spread due à l'écart de liquidité entre deux émissions","La part du spread due au taux de recouvrement de l'émetteur"],a:0,w:"Prime de risque = spread avec aversion - spread sans aversion. Le spread intègre la perte attendue (PD et recouvrement) plus la prime de risque."},
 {t:"tf",q:"Pour calculer le rendement d'une obligation risquée, on utilise le flux espéré plutôt que le nominal promis.",a:false,w:"Faux : le rendement se calcule sur le flux promis. Le flux espéré sert à calculer le prix."}
 ]},
{id:"payoff",t:"Actionnaire, créancier : call, put et arbitrage",mods:[2,3],
 ctx:"Une entreprise a une dette de valeur faciale F = 100 à l'échéance. La valeur de ses actifs V(T) peut valoir 130 dans un bon scénario, 80 dans un mauvais. L'actionnaire est limité à sa mise (responsabilité limitée).",
 cards:[
 {t:"num",q:"Quel est le gain de l'actionnaire si V(T) = 130 ?",a:30,tol:0.01,w:"Gain = max(V(T) - F ; 0) = max(130 - 100 ; 0) = 30. L'actionnaire détient un call sur l'actif de la firme, de strike F."},
 {t:"num",q:"Quel est le gain du créancier si V(T) = 80 ?",a:80,tol:0.01,w:"Gain = min(V(T) ; F) = min(80 ; 100) = 80. Le créancier perd 20 : il est vendeur d'un put sur l'actif de la firme."},
 {t:"mcq",q:"Quelle est la position du créancier ?",o:["Achat d'un zéro-coupon sans risque et vente d'un put","Achat d'un put et vente d'un zéro-coupon sans risque","Achat d'un call et achat d'un zéro-coupon sans risque","Vente d'un call et vente d'un zéro-coupon sans risque"],a:0,w:"Créance risquée = ZC sans risque de valeur faciale F moins un put vendu (strike F, maturité T). L'inverse est une erreur classique, corrigée dans le TD vrai ou faux."},
 {t:"tf",q:"Un call américain sur un titre sans dividende vaut la même chose qu'un call européen : on n'exerce jamais avant l'échéance.",a:true,w:"Vrai : pour un call sans dividende, l'exercice anticipé n'est jamais optimal. Pour un put américain, il peut l'être : il vaut plus que le put européen."},
 {t:"match",q:"Associe chaque acteur à son profil de gain.",p:[["Actionnaire","Call sur l'actif de la firme"],["Créancier","ZC sans risque moins un put vendu"],["Valeur des actions","Prime du call"],["Valeur faciale de la dette","Prix d'exercice"]],w:"Merton, 1974 : l'actionnaire possède une option d'achat sur les actifs de l'entreprise, de prix d'exercice la valeur faciale de la dette, la prime étant la valeur des actions."}
 ]},
{id:"binom",t:"Le call à deux périodes : la méthode binomiale",mods:[3],
 ctx:"Un titre vaut S0 = 40. À chaque période (1 an), il est multiplié par u = 1,25 ou par d = 0,8. Taux sans risque continu r = 4 %. On évalue un call européen de strike K = 40 à 2 ans. Le corrigé du cours utilise les taux continus. Formules fournies.",
 cards:[
 {t:"num",q:"Quelle est la probabilité risque neutre p* d'une hausse ?",a:0.535,tol:0.002,h:"p* = (e^(r dt) - d) / (u - d).",w:"e^0,04 = 1,04081. p* = (1,04081 - 0,8) / (1,25 - 0,8) = 0,24081 / 0,45 = 0,5351."},
 {t:"num",q:"Quel est le payoff du call dans l'état haut-haut ?",a:22.5,tol:0.01,w:"S(uu) = 40 x 1,25 x 1,25 = 62,5. C(uu) = max(62,5 - 40 ; 0) = 22,5. Dans l'état haut-bas, S(ud) = 40 : payoff nul."},
 {t:"num",q:"Quelle est la valeur du call aujourd'hui ?",a:5.95,tol:0.02,h:"Remonter l'arbre en deux étapes, en actualisant à chaque période.",w:"C(haut, 1 an) = e^(-0,04) x 0,5351 x 22,5 = 11,568. C0 = e^(-0,04) x 0,5351 x 11,568 = 5,948."},
 {t:"order",q:"Remets dans l'ordre la méthode de valorisation par l'arbre.",it:["Calculer u, d et la probabilité risque neutre p*","Construire l'arbre des prix du sous-jacent","Calculer les payoffs à l'échéance","Remonter l'arbre en actualisant au taux sans risque"],w:"Méthode du TD : p*, arbre, payoffs, puis remontée de l'arbre avec e^(-r dt)."},
 {t:"tf",q:"Un call américain de mêmes caractéristiques sur ce titre vaudrait plus que ce call européen.",a:false,w:"Faux : sans dividende, il n'est pas intéressant d'exercer le call avant l'échéance. Call américain égal call européen."}
 ]},
{id:"ito",t:"Brownien géométrique et lemme d'Itô",mods:[4,5],
 ctx:"Le prix d'un actif suit dS = mu S dt + sigma S dz. On applique le lemme d'Itô à des fonctions de S. Rappel : dt x dt = 0, dt x dz = 0, dz x dz = dt. Formules fournies.",
 cards:[
 {t:"num",q:"Pour Y = ln(X) avec mu = 10 % et sigma = 20 %, quelle est la dérive de dY, en % ?",a:8,tol:0.01,un:" %",h:"dY = (mu - sigma2/2) dt + sigma dz.",w:"mu - sigma2/2 = 0,10 - 0,02 = 0,08, soit 8 %. C'est ce résultat qui donne la loi normale de ln(Va) au thème 10."},
 {t:"num",q:"Pour Y = exp(X) avec dX = mu dt + sigma dz, mu = 6 % et sigma = 30 %, quel est le facteur de dt dans dY / exp(X), en % ?",a:10.5,tol:0.01,un:" %",w:"dY = exp(X) [ (mu + sigma2/2) dt + sigma dz ]. 0,06 + 0,045 = 0,105, soit 10,5 %."},
 {t:"multi",q:"Quelles hypothèses de Black et Scholes sont vraies ?",o:["Le trend mu du sous-jacent est constant","La volatilité sigma est constante","Le marché est efficient, sans coût de transaction","Le portefeuille de réplication rapporte le taux sans risque","La variance instantanée dépend du temps"],a:[0,1,2,3],w:"Un brownien géométrique a un sigma constant : « variance dépendante du temps » est faux. Le portefeuille de duplication sans risque rapporte r."},
 {t:"tf",q:"Deux actifs de tendances mu différentes mais de même sigma donnent le même prix d'option.",a:true,w:"Vrai : mu n'apparaît pas dans la formule de pricing. Il est remplacé par r grâce au raisonnement d'arbitrage."},
 {t:"match",q:"Associe chaque produit de la table de multiplication stochastique à sa valeur.",p:[["dt x dt","0"],["dt x dz","0"],["dz x dz","dt"]],w:"C'est la table du lemme d'Itô : seul dz x dz = dt survit, d'où le terme en sigma2/2."}
 ]},
{id:"bs",t:"Black et Scholes et la parité put-call",mods:[6,7],
 ctx:"Un call européen porte sur un titre de prix S = 50, strike K = 48, maturité 6 mois, volatilité 30 %, taux sans risque 3 %. Excel donne N(d1) = 0,6440 et N(d2) = 0,5624. e^(-0,03 x 0,5) = 0,98511. Formules fournies.",
 cards:[
 {t:"num",q:"Quelle est la valeur de d1 ?",a:0.369,tol:0.002,h:"d1 = [ln(S/K) + (r + sigma2/2) T] / (sigma racine(T)).",w:"ln(50/48) = 0,04082. (r + sigma2/2) T = (0,03 + 0,045) x 0,5 = 0,0375. Numérateur 0,07832. Dénominateur 0,3 x racine(0,5) = 0,21213. d1 = 0,3692."},
 {t:"num",q:"Quelle est la valeur du call ?",a:5.61,tol:0.03,w:"C = 50 x 0,6440 - 48 x 0,98511 x 0,5624 = 32,20 - 26,59 = 5,61."},
 {t:"num",q:"Quelle est la valeur du put européen de même strike, par la parité ?",a:2.89,tol:0.03,h:"p = c + K e^(-rT) - S.",w:"p = 5,61 + 48 x 0,98511 - 50 = 5,61 + 47,29 - 50 = 2,90, soit environ 2,89 avec les valeurs exactes."},
 {t:"mcq",q:"La maturité d'un autre call est donnée en 35 jours. Comment l'utilises-tu dans la formule ?",o:["35 / 365 année, soit 0,09589","35 année, sans aucune conversion","35 / 12 année, soit environ 2,92","35 / 100 année, soit exactement 0,35"],a:0,w:"Piège du TD Excel : la maturité est donnée en jours, il faut la convertir en années (35 / 365)."},
 {t:"tf",q:"Dans la formule de Black et Scholes, N(.) est la fonction de répartition de la loi normale centrée réduite.",a:true,w:"Vrai : N(d1) et N(d2) se lisent dans Excel avec LOI.NORMALE.STANDARD."}
 ]},
{id:"merton",t:"Merton : de l'option au spread d'une entreprise",mods:[8],
 ctx:"Une entreprise a une valeur d'actif Va = 120, une dette de valeur faciale F = 80 à 3 ans, une volatilité d'actif de 25 % et un taux sans risque de 4 %. Excel donne N(d1) = 0,9236 et N(d2) = 0,8406. e^(-0,04 x 3) = 0,88692. Formules fournies.",
 cards:[
 {t:"num",q:"Quelle est la valeur des fonds propres Ve ?",a:51.19,tol:0.1,h:"Ve = Va N(d1) - F e^(-rT) N(d2).",w:"Ve = 120 x 0,9236 - 80 x 0,88692 x 0,8406 = 110,83 - 59,64 = 51,19."},
 {t:"num",q:"Quelle est la valeur de marché de la dette ?",a:68.81,tol:0.1,w:"D = Va - Ve = 120 - 51,19 = 68,81 (équilibre du bilan). Méthode 2 : D = F e^(-rT) - P(0)."},
 {t:"num",q:"Quel est le rendement à maturité (YtM) de la dette, en % ?",a:5.02,tol:0.03,un:" %",h:"YtM = -(1/T) ln(D / F).",w:"ln(68,81 / 80) = -0,1507. YtM = 0,1507 / 3 = 5,02 %."},
 {t:"num",q:"Quel est le spread de la dette, en % ?",a:1.02,tol:0.03,un:" %",w:"Spread = YtM - r = 5,02 % - 4 % = 1,02 %."},
 {t:"tf",q:"Dans le modèle de Merton, la valeur de la dette se retrouve soit par le bilan (Va - Ve), soit par la parité put-call (F e^(-rT) - P).",a:true,w:"Vrai : ce sont les deux méthodes du cours pour trouver la valeur de la dette."}
 ]},
{id:"rachat",t:"Racheter de la dette : volatilité implicite, spread et PD",mods:[9,10],
 ctx:"Une entreprise a un actif Va = 100, une dette F = 60 à 5 ans, r = 3 %. La volatilité implicite, déduite des fonds propres comptables, est de 30 %. Avant rachat : N(d2) = 0,7421. Elle rachète 20 de dette : F passe à 40, avec Va et la volatilité inchangés. Après rachat : N(d2) = 0,8951 et la dette vaut 33,53. Formules fournies.",
 cards:[
 {t:"num",q:"Quelle est la probabilité de défaut avant le rachat, en % ?",a:25.79,tol:0.05,un:" %",h:"PD = N(-d2) = 1 - N(d2).",w:"PD = 1 - 0,7421 = 0,2579, soit 25,79 %. La probabilité de défaut sous risque neutre est N(-d2), donc 1 - N(d2)."},
 {t:"num",q:"Quelle est la probabilité de défaut après le rachat, en % ?",a:10.49,tol:0.05,un:" %",w:"PD = 1 - 0,8951 = 0,1049, soit 10,49 %. Le rachat fait tomber la PD de 15 points."},
 {t:"num",q:"Quel est le YtM de la dette après rachat, en % ?",a:3.53,tol:0.03,un:" %",h:"YtM = -(1/T) ln(D / F).",w:"ln(33,53 / 40) = -0,1765. YtM = 0,1765 / 5 = 3,53 %. Spread après rachat = 3,53 % - 3 % = 0,53 %."},
 {t:"mcq",q:"Que modifie le rachat dans le modèle ?",o:["Seule la valeur faciale F diminue, la valeur de l'actif et la volatilité restent inchangées","La valeur de l'actif baisse du montant racheté, alors que la volatilité reste inchangée","La volatilité de l'actif baisse nettement, car il y a moins de dette à financer ensuite","Le taux sans risque baisse aussi, car l'entreprise est moins endettée qu'avant le rachat"],a:0,w:"Méthode en 5 étapes : on cherche sigma implicite, on calcule spread avant, on diminue F, on recalcule le spread après, on compare."},
 {t:"mcq",q:"Un client a déjà un spread de 0,08 % pour une cible de 1 % : que conclure ?",o:["Aucun rachat n'est nécessaire : la cible est déjà atteinte","Il faut racheter la totalité de la dette pour tenir la cible","Il faut racheter la moitié de la dette pour passer sous 0,05 %","Il faut refaire le calcul avec une volatilité plus basse"],a:0,w:"Piège du TD FFBC : avant de conclure à une action, on vérifie si la cible n'est pas déjà atteinte."}
 ]},
{id:"pd",t:"Probabilité de défaut et sensibilités du modèle",mods:[10,11],
 ctx:"Cas de base de Merton : valeur de l'actif 100, dette 40, taux sans risque 5 %, maturité 1 an, volatilité 40 %. On étudie l'effet de chaque paramètre sur la probabilité de défaut (PD), toutes choses égales par ailleurs. Dans un autre cas (FFBC and Co), N(d2) = 0,7606 et la cible est une PD d'au plus 25 %.",
 cards:[
 {t:"sort",q:"Classe l'effet de chaque hausse sur la probabilité de défaut.",bins:["La PD augmente","La PD diminue"],it:[["Hausse de la maturité",0],["Hausse de la volatilité de l'actif",0],["Hausse du taux sans risque",1],["Hausse de la valeur de l'actif",1],["Hausse de la valeur de la dette",0]],w:"Maturité, volatilité et dette font monter la PD. Taux sans risque et valeur de l'actif la font baisser : en univers risque neutre, la dérive de l'actif est r."},
 {t:"num",q:"Quelle est la PD du cas FFBC, en % ?",a:23.94,tol:0.05,un:" %",w:"PD = 1 - N(d2) = 1 - 0,7606 = 0,2394, soit 23,94 %. La cible (au plus 25 %, soit N(d2) au moins 75 %) est respectée."},
 {t:"order",q:"Remets dans l'ordre la démonstration en 4 questions de la probabilité de défaut.",it:["Écrire dVa/Va = mu dt + sigma dz et appliquer Itô à ln(Va)","Montrer que ln(Va(T)) suit une loi normale","Écrire que le défaut a lieu si Va(T) est inférieure à F et se ramener à une loi N(0,1)","Poser mu = r en univers risque neutre et conclure PD = N(-d2)"],w:"Cette démonstration relie le thème 5 (Itô) au thème 10."},
 {t:"tf",q:"Le défaut est atteint quand la valeur de l'actif est supérieure au total des dettes.",a:false,w:"Faux : c'est l'inverse. Il y a défaut quand Va(T) est inférieure à la valeur faciale F de la dette."},
 {t:"tf",q:"Entre deux entreprises de même point de défaut, la plus risquée est forcément celle dont l'actif est le plus proche de ce point.",a:false,w:"Faux selon le corrigé : le critère de distance ne suffit pas, la volatilité compte aussi."}
 ]},
{id:"cds",t:"Évaluer un CDS : primes et protection",mods:[12,13],
 ctx:"Une banque achète une protection CDS d'un an sur une dette de nominal 100. La probabilité de défaut annuelle est de 10 % dans un modèle simplifié, le taux de recouvrement de 40 %. La prime f est versée en fin d'année seulement si l'entité n'a pas fait défaut, l'indemnité est versée en fin d'année en cas de défaut. Dans un autre cas, la PD annuelle est de 19 %.",
 cards:[
 {t:"num",q:"Quelle est la PD semestrielle quand la PD annuelle vaut 19 %, sous hypothèse de PD constante, en % ?",a:10,tol:0.05,un:" %",h:"PD semestrielle = 1 - racine(1 - PD annuelle).",w:"Survie annuelle = 0,81. Survie semestrielle = racine(0,81) = 0,9. PD semestrielle = 1 - 0,9 = 10 %."},
 {t:"num",q:"Quelle est la prime annuelle f qui égalise les deux jambes, en % du nominal ?",a:6.67,tol:0.02,un:" %",h:"Prime x probabilité de survie = indemnité attendue.",w:"Indemnité en cas de défaut : 100 x (1 - 40 %) = 60. Protection attendue : 0,10 x 60 = 6. Primes attendues : f x 0,90. f x 0,90 = 6, donc f = 6,67 %."},
 {t:"match",q:"Associe chaque type de CDS à sa définition.",p:[["Standard CDS","Un seul actif sous-jacent"],["Basket CDS","Plusieurs actifs, arrêt après un nombre fixé de défauts"],["Portfolio CDS","Montant de couverture négocié à l'origine"],["Digital CDS","Indemnité forfaitaire fixée à l'avance"]],w:"FTD (First to Default) et STD (Second to Default) sont les paniers les plus courants."},
 {t:"tf",q:"À la date de négociation d'un CDS, la valeur de la jambe prime est égale à celle de la jambe protection.",a:true,w:"Vrai : c'est l'évaluation d'un swap, de valeur nulle à la signature."},
 {t:"mcq",q:"Quel produit domine le marché des dérivés de crédit (chiffres OCC 2013) ?",o:["Les CDS, avec 96,9 % de l'encours notionnel","Les credit options, avec 60 % de l'encours notionnel","Les total return swaps, avec 45 % de l'encours notionnel","Les CDS, avec 51 % de l'encours notionnel seulement"],a:0,w:"Composition : CDS 96,9 %, credit options 1,4 %, autres 1,1 %, total return swaps 0,6 %."}
 ]},
{id:"basket",t:"Basket CDS : corrélation parfaite et corrélation nulle",mods:[14,15],
 ctx:"Un basket compte 5 actifs de 2 000 000 € chacun, de même probabilité de défaut annuelle p = 0,2, taux de recouvrement nul, maturité 1 an. La loi binomiale donne P(0) = 0,32768, P(1) = 0,4096, P(2) = 0,2048. Dans un autre cas, deux actifs X et Y ont pX = 0,2, pY = 0,1 et une corrélation rho = 0,3.",
 cards:[
 {t:"num",q:"Corrélation parfaite : quelle est la prime du FTD (First to Default) ?",a:400000,tol:1,un:" €",h:"Deux états seulement : tous défaillent ou aucun.",w:"Avec corrélation parfaite, la probabilité que tous fassent défaut est 0,2. Le FTD paie 2 000 000 € dans ce cas : prime = 0,2 x 2 000 000 = 400 000 €. Le STD a la même prime."},
 {t:"num",q:"Corrélation nulle : quelle est la prime du FTD ?",a:1344640,tol:1,un:" €",h:"Indemnité dès le premier défaut : 1 - P(0).",w:"P(au moins un défaut) = 1 - 0,32768 = 0,67232. Prime FTD = 0,67232 x 2 000 000 = 1 344 640 €."},
 {t:"num",q:"Corrélation nulle : quelle est la prime du STD (Second to Default) ?",a:525440,tol:1,un:" €",h:"Indemnité dès le deuxième défaut : 1 - P(0) - P(1).",w:"P(au moins 2 défauts) = 1 - 0,32768 - 0,4096 = 0,26272. Prime STD = 0,26272 x 2 000 000 = 525 440 €."},
 {t:"num",q:"Quelle est la probabilité que X et Y fassent défaut ensemble ?",a:0.056,tol:0.001,h:"P = rho x racine(pX (1 - pX) pY (1 - pY)) + pX pY.",w:"racine(0,2 x 0,8 x 0,1 x 0,9) = racine(0,0144) = 0,12. P = 0,3 x 0,12 + 0,02 = 0,056."},
 {t:"tf",q:"Plus la corrélation entre les défauts est forte, plus la prime du basket est forte.",a:false,w:"Faux selon le corrigé officiel du TD : un panier diversifié avec des défauts indépendants fait monter la probabilité d'au moins un défaut. La prime du FTD est plus élevée à corrélation nulle (1 344 640 €) qu'à corrélation parfaite (400 000 €)."}
 ]},
{id:"vf",t:"La batterie vrai ou faux du TD",mods:[11,14,16],
 ctx:"Le corrigé officiel du TD propose une série d'affirmations sur la vision optionnelle, Black et Scholes et les dérivés de crédit. Tu dois dire pour chacune si elle est vraie ou fausse, comme à l'examen.",
 cards:[
 {t:"sort",q:"Classe chaque affirmation.",bins:["Vrai","Faux"],it:[["En univers risque neutre, le taux d'actualisation est le taux sans risque",0],["Black et Scholes nécessite la possibilité de vendre à découvert",0],["Le créancier a la position achat d'un put et vente d'un ZC",1],["Le calcul du spread nécessite l'univers risque neutre",1],["Un standard CDS comprend un unique sous-jacent",0],["Un digital CDS peut intégrer plusieurs sous-jacents",1]],w:"Le créancier est vendeur d'un put et acheteur d'un ZC. Le spread ne nécessite pas l'univers risque neutre. Le digital CDS a une indemnité forfaitaire fixée à l'avance."},
 {t:"tf",q:"Dans un basket CDS, le contrat se termine après un seul défaut.",a:false,w:"Faux : le contrat s'arrête après un nombre fixé de défauts (FTD : le premier, STD : le deuxième)."},
 {t:"tf",q:"Dans un portfolio CDS, le montant de la couverture est négocié à l'origine.",a:true,w:"Vrai : on couvre un pourcentage de perte, et le nombre d'actifs n'est pas limité."},
 {t:"tf",q:"La valeur d'un CDS est la valeur actualisée des primes moins celle de la couverture.",a:true,w:"Vrai : à la signature, les deux jambes s'équilibrent et la valeur est nulle."},
 {t:"mcq",q:"Quelle est la chaîne logique du cours, dans l'ordre ?",o:["Spread, vision optionnelle, Black et Scholes, Merton, probabilité de défaut, dérivés de crédit","Spread, Merton, Black et Scholes, vision optionnelle, dérivés de crédit, probabilité de défaut","Vision optionnelle, spread, probabilité de défaut, Black et Scholes, Merton, dérivés de crédit","Spread, Black et Scholes, probabilité de défaut, vision optionnelle, dérivés de crédit, Merton"],a:0,w:"Spread (th.1), vision optionnelle (th.2-3), évaluation d'option (th.4-7), Merton (th.8-9), PD (th.10-11), dérivés de crédit (th.12 à 19)."}
 ]}
]
}
