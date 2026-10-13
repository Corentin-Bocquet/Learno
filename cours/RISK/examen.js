/*EXAMEN*/
{
cases:[
{id:"lignes",t:"Premier jour chez Nordbank : les trois lignes de défense",mods:[99,100],
 ctx:"Tu rejoins la direction des risques de Nordbank comme analyste. Le directeur commercial te demande d'approuver un gros financement à sa place, pour gagner du temps. Tu dois aussi expliquer ton rôle au nouvel auditeur.",
 cards:[
 {t:"sort",q:"À quelle ligne de défense appartient chaque acteur ?",bins:["1re ligne","2e ligne","3e ligne"],it:[["Le front office qui prend les positions",0],["Les Risques, indépendants du business",1],["L'audit interne, assurance indépendante au conseil",2],["Le réseau qui gère les clients au quotidien",0],["La Conformité",1]],w:"1re ligne : le business. 2e ligne : Risques et Conformité, indépendantes. 3e ligne : audit interne."},
 {t:"story",q:"Que réponds-tu au directeur commercial ?",sc:[{who:"Le directeur commercial",txt:"Valide mon financement vite, tu as le pouvoir de décider à ma place !"}],
  o:["Je donne un avis indépendant, la décision reste à la 1re ligne", "Je prends la décision à ta place, c'est mon rôle d'analyste risque", "Je décide seulement si le montant est inférieur à un million d'euros", "Je laisse l'audit interne décider pour moi, c'est sa mission centrale"],a:0,w:"L'analyste identifie, mesure, surveille et rapporte. Il ne porte pas le risque lui-même. Le mot clé du métier : indépendance."},
 {t:"match",q:"Associe chaque rôle à sa mission.",p:[["Analyste risque","Mesure et surveillance d'une famille de risque"],["Credit analyst","Solvabilité d'une contrepartie, notation"],["Quant risk","Développement de modèles"],["Model validation","Validation indépendante, séparée des développeurs"],["Compliance officer","Conformité, LCB-FT, sanctions"]],w:"Les rôles ne se confondent pas : le risk manager pilote le cadre et l'appétit au risque."},
 {t:"match",q:"Associe chaque type d'établissement à ses risques dominants.",p:[["Banque de détail","Crédit retail, opérationnel, fraude"],["BFI / CIB","Marché, contrepartie, CVA, crédit corporate"],["Banque privée","Crédit lombard, conformité, réputation"],["Fintech","Opérationnel, cyber, fraude, conformité"]],w:"La spécialisation est la règle : un analyste marché en BFI et un analyste crédit retail ne font pas le même métier."},
 {t:"tf",q:"La direction des risques est rattachée au CRO, membre du comité exécutif, en lien direct avec le comité des risques du conseil.",a:true,w:"Vrai : le CRO (Chief Risk Officer) pilote les familles crédit, marché et contrepartie, opérationnel, ALM et liquidité, modèles, et le transverse."}
 ]},
{id:"el",t:"Le prêt de 1 000 000 euros : perte attendue et inattendue",mods:[101],
 ctx:"Le comité de crédit de Nordbank examine un prêt de 1 000 000 EUR à une PME. La PD est de 0,5 %, la LGD de 40 %. Un membre du comité demande qui couvre quoi : provisions ou fonds propres.",
 cards:[
 {t:"num",q:"Calcule la perte attendue (EL) du prêt : PD 0,5 %, LGD 40 %, EAD 1 000 000 EUR.",a:2000,tol:1,un:" €",h:"EL = PD x LGD x EAD.",w:"1 000 000 x 0,005 x 0,40 = 2 000 EUR. EL = PD x LGD x EAD, la perte attendue qui se provisionne."},
 {t:"num",q:"Même prêt, mais la PD passe à 1 % et la LGD reste à 40 %. Quelle est la nouvelle EL ?",a:4000,tol:1,un:" €",w:"1 000 000 x 0,01 x 0,40 = 4 000 EUR. Doubler la PD double l'EL."},
 {t:"match",q:"Associe chaque paramètre à sa définition.",p:[["PD","Probabilité de défaut"],["LGD","Perte en cas de défaut, en % de l'exposition"],["EAD","Exposition au moment du défaut"],["EL","PD x LGD x EAD, la perte attendue"]],w:"La perte attendue se provisionne : PD x LGD x EAD. La perte inattendue se couvre par les fonds propres."},
 {t:"story",q:"Que réponds-tu au membre du comité ?",sc:[{who:"Le membre du comité",txt:"La perte inattendue, on la provisionne aussi, non ?"}],
  o:["Non : l'attendue se provisionne, l'inattendue se couvre par les fonds propres", "Oui : toutes les pertes se provisionnent, attendues ou non attendues", "Non : ni l'attendue ni l'inattendue ne se couvrent en pratique chez nous", "Oui : l'inattendue se provisionne et l'attendue se couvre par les fonds propres"],a:0,w:"C'est la distinction fondatrice de toute la réglementation prudentielle."},
 {t:"tf",q:"La LGD est un montant en euros, indépendant de l'exposition au moment du défaut.",a:false,w:"Faux : la LGD est la perte en cas de défaut, exprimée en pourcentage de l'exposition (EAD). EL = PD x LGD x EAD."}
 ]},
{id:"corporate",t:"Le dossier corporate de Dufour SA : levier, gearing, DSCR",mods:[101],
 ctx:"Dufour SA demande un financement. Dette nette : 300 M EUR. EBITDA : 100 M EUR. Fonds propres : 200 M EUR. Flux disponible : 90 M EUR, service de la dette : 100 M EUR. Un covenant est violé.",
 cards:[
 {t:"num",q:"Calcule le levier (dette nette / EBITDA) de Dufour SA.",a:3,tol:0.01,un:" x",w:"300 / 100 = 3,0x. Sain sous 3x : Dufour SA est juste sur la limite."},
 {t:"num",q:"Calcule le gearing (dette nette / fonds propres).",a:1.5,tol:0.01,un:" x",w:"300 / 200 = 1,5. Le gearing est recherché sous 1 : Dufour est au-dessus."},
 {t:"num",q:"Calcule le DSCR (flux disponible / service de la dette).",a:0.9,tol:0.01,un:" x",w:"90 / 100 = 0,9. Un DSCR sous 1 est un signal très faible : l'entreprise ne génère pas assez pour payer sa dette. Minimum courant : 1,25x."},
 {t:"story",q:"Quel avis donnes-tu au comité ?",sc:[{who:"Le comité",txt:"Levier à 3x, gearing à 1,5, DSCR à 0,9 et un covenant violé. Ton avis ?"}],
  o:["Défavorable ou conditionnel : DSCR sous 1 et covenant violé déclenchent une revue", "Favorable sans réserve : un levier de 3x est parfaitement sain pour la banque", "Favorable : un seul covenant violé n'a aucune importance en pratique ici", "Reporte l'avis à plus tard : seul le gearing compte pour décider du dossier"],a:0,w:"Le non-respect d'un seul covenant suffit à déclencher une revue de l'exposition."},
 {t:"tf",q:"Le ratio de couverture se calcule en divisant la dette nette par l'EBITDA.",a:false,w:"Faux : la dette nette divisée par l'EBITDA est le levier. La couverture, c'est l'EBITDA divisé par les charges d'intérêts."}
 ]},
{id:"rwa",t:"RWA, ratio CET1 et output floor",mods:[102,111],
 ctx:"Une exposition corporate : PD 0,5 %, LGD 35 %, EAD 90, maturité 2,5 ans. Modèle interne : pondération 9,6 %, soit RWA de 8,64. En standard à 100 %, RWA de 90. La banque a 12 de fonds propres CET1 pour 100 de RWA total.",
 cards:[
 {t:"num",q:"Calcule le ratio CET1 de la banque : 12 de CET1 pour 100 de RWA, en %.",a:12,tol:0.1,un:" %",w:"12 / 100 = 12 %. À fonds propres constants, plus le RWA est élevé, plus le ratio baisse."},
 {t:"num",q:"Output floor : le RWA modèle ne peut pas descendre sous 72,5 % du RWA standard (90). Quel est le plancher ?",a:65.25,tol:0.05,w:"0,725 x 90 = 65,25. Le RWA de 8,64 calculé en modèle interne est donc relevé à 65,25 pour cette exposition (au niveau agrégé)."},
 {t:"story",q:"Que réponds-tu au directeur financier qui trouve le modèle interne très avantageux ?",sc:[{who:"Le directeur financier",txt:"Mon modèle interne donne 8,64 au lieu de 90. Je pourrai distribuer plus de dividendes !"}],
  o:["Non : l'output floor limite l'avantage, le RWA ne peut descendre sous 72,5 % du standard", "Oui : le modèle interne est entièrement libre de tout plancher de capital", "Non : le modèle interne est interdit pour les banques européennes depuis Bâle III", "Oui : le plancher est de 50 %, très en dessous de la valeur donnée par le modèle"],a:0,w:"Montée en charge progressive jusqu'en 2033. C'est la disposition qui limite le plus l'avantage des modèles internes."},
 {t:"match",q:"Associe chaque approche à sa description.",p:[["Standard","Pondérations fixées par le régulateur, notations externes"],["IRB","Notations internes soumises à l'agrément du superviseur"],["Output floor","72,5 % du RWA standard"]],w:"La formule IRB repose sur une loi normale : ce qui est calculé est le risque inattendu."},
 {t:"tf",q:"Plus le RWA est élevé, à fonds propres constants, plus le ratio CET1 baisse.",a:true,w:"Vrai : c'est pour cela que la mesure du risque est un enjeu de capital."}
 ]},
{id:"ifrs9",t:"IFRS 9 : les trois stages et l'ECL",mods:[103],
 ctx:"Un prêt de 1 000 000 EUR, PD 12 mois de 0,5 %, LGD 40 %. L'emprunteur est dans un secteur en difficulté : le risque de crédit a augmenté significativement depuis l'octroi. Un collègue pense que l'ECL se calcule toujours sur 12 mois.",
 cards:[
 {t:"num",q:"Calcule l'ECL en Stage 1 (PD 12 mois 0,5 %, LGD 40 %, EAD 1 000 000 EUR).",a:2000,tol:1,un:" €",w:"1 000 000 x 0,005 x 0,40 = 2 000 EUR sur 12 mois."},
 {t:"sort",q:"Quel stage ?",bins:["Stage 1","Stage 2","Stage 3"],it:[["Performant, ECL à 12 mois",0],["Augmentation significative du risque (SICR), ECL à maturité",1],["Défaut avéré, intérêts sur valeur nette",2],["Prêt dont le risque n'a pas augmenté depuis l'origination",0]],w:"Stage 1 performant. Stage 2 SICR. Stage 3 déprécié."},
 {t:"story",q:"Que réponds-tu à ton collègue ?",sc:[{who:"Le collègue",txt:"L'ECL se calcule toujours sur 12 mois, quel que soit le stage."}],
  o:["Non : en Stage 2 et 3, l'ECL se calcule à maturité sur toute la courbe de PD", "Oui : sur 12 mois dans tous les cas, par simplification de la méthode", "Non : en Stage 1 aussi, on calcule toujours à maturité pour plus de prudence", "Oui : en Stage 3, on ne provisionne plus rien du tout puisque le défaut est avéré"],a:0,w:"C'est ce basculement qui fait exploser la provision."},
 {t:"multi",q:"Coche ce qui est vrai pour le forward looking d'IFRS 9.",o:["On pondère un scénario central, un adverse et un favorable","Les scénarios sont macroéconomiques et prospectifs","Ce n'est pas une projection unique","On provisionne les pertes attendues, pas seulement avérées","On n'utilise qu'un seul scénario adverse par prudence"],a:[0,1,2,3],w:"IFRS 9 impose de provisionner les pertes attendues."},
 {t:"tf",q:"Le passage du Stage 1 au Stage 2 se déclenche seulement quand le défaut est avéré.",a:false,w:"Faux : il se déclenche sur le SICR, une augmentation significative du risque de crédit depuis l'origination. Le défaut avéré, c'est le Stage 3. Le SICR fait passer d'une PD à 12 mois à une PD à maturité."}
 ]},
{id:"var",t:"VaR, Expected Shortfall et FRTB",mods:[104,105],
 ctx:"Portefeuille action de 1 000 000 EUR, volatilité quotidienne de 2 %. Un trader te montre une VaR 99 % très basse sur 500 jours : 497 jours de gain de 10 000, 3 jours de perte de 100 millions.",
 cards:[
 {t:"num",q:"Calcule la VaR paramétrique à 99 % sur 1 jour (quantile 2,33).",a:46600,tol:10,un:" €",h:"Valeur x volatilité x quantile.",w:"1 000 000 x 0,02 x 2,33 = 46 600 EUR. Dans 99 % des cas, la perte quotidienne ne dépassera pas environ 46 600 EUR."},
 {t:"num",q:"Même portefeuille, VaR à 95 % (quantile 1,645).",a:32900,tol:10,un:" €",w:"1 000 000 x 0,02 x 1,645 = 32 900 EUR. Le quantile 1,645 correspond à 95 %, le 2,33 à 99 %."},
 {t:"story",q:"Que dis-tu au trader sur sa VaR 99 % basse ?",sc:[{who:"Le trader",txt:"Ma VaR 99 % est un gain de 10 000. Le risque est nul, non ?"}],
  o:["Non : la VaR ignore la queue de distribution, l'ES la révèle", "Oui : la VaR est un risque maximal garanti, jamais dépassé en pratique", "Non : mais seule la volatilité compte vraiment pour juger un portefeuille", "Oui : trois jours sur 500, c'est négligeable pour n'importe quelle banque"],a:0,w:"La VaR dit à quel niveau se situe la perte au seuil, elle ne dit rien de ce qui se passe au-delà. L'ES moyenne les pertes au-delà de la VaR."},
 {t:"match",q:"Associe chaque méthode de VaR à son principe.",p:[["Historique","On rejoue les variations passées sur le portefeuille actuel"],["Paramétrique","Loi normale, volatilité et corrélations"],["Monte Carlo","On simule des milliers de scénarios"]],w:"Autres outils : les Greeks, les stress tests, le backtesting, l'attribution de P&L."},
 {t:"tf",q:"Le FRTB remplace la VaR par l'Expected Shortfall calibrée à 97,5 %, avec une application repoussée au 1er janvier 2027 dans l'UE.",a:true,w:"Vrai : avec des horizons de liquidité variables, une frontière claire trading book et banking book, et une approbation desk par desk."}
 ]},
{id:"contrepartie",t:"Contrepartie, CVA et wrong-way risk",mods:[106],
 ctx:"Nordbank a un swap avec un fonds. La valeur de marché du swap monte pendant que la qualité de crédit du fonds se dégrade. La banque a un ISDA Master Agreement et des appels de marge.",
 cards:[
 {t:"match",q:"Associe chaque ajustement à ce qu'il reflète.",p:[["CVA","Le risque de défaut de la contrepartie"],["DVA","Le risque de défaut propre de la banque"],["FVA","Le coût de financement de la position"]],w:"Trois ajustements de prix : CVA pour la contrepartie, DVA pour la banque elle-même, FVA pour le coût de financement de la position."},
 {t:"story",q:"Comment qualifies-tu la situation du fonds ?",sc:[{who:"Le trader",txt:"Notre exposition monte quand le crédit du fonds se dégrade. Comment on appelle ça ?"}],
  o:["Du wrong-way risk : le pire cas de figure","Du netting : une compensation avantageuse","De la variation margin : un appel de marge classique","Du right-way risk : la situation la plus favorable"],a:0,w:"Wrong-way risk : l'exposition augmente précisément quand la qualité de crédit de la contrepartie se dégrade."},
 {t:"sort",q:"Netting, collatéral ou wrong-way ?",bins:["Netting","Collatéral","Wrong-way risk"],it:[["Compensation des expositions via un ISDA Master Agreement",0],["Appels de marge, variation margin",1],["L'exposition augmente quand le crédit de la contrepartie se dégrade",2]],w:"Les trois notions à maîtriser : netting via l'ISDA, collatéral par appels de marge, et wrong-way risk, le pire cas de figure."},
 {t:"num",q:"Le SA-CCR est en vigueur depuis 2017. Il remplace l'ancien CEM. Depuis combien d'années (en 2026) ?",a:9,tol:0.1,un:" ans",w:"2026 - 2017 = 9 ans. Il reconnaît bien mieux le collatéral et le netting."},
 {t:"tf",q:"Le risque de contrepartie est constant et ne dépend pas de la valeur de marché du contrat.",a:false,w:"Faux : il est bilatéral et évolue avec la valeur de marché du contrat. C'est le risque que la contrepartie d'un dérivé fasse défaut avant le règlement."}
 ]},
{id:"liquidite",t:"LCR, NSFR et ratio de levier",mods:[107],
 ctx:"Nordbank a 120 de HQLA et 100 de sorties nettes de trésorerie à 30 jours. Son financement stable disponible est de 90 pour un financement stable requis de 100. Son Tier 1 est de 30 pour une exposition totale de 800.",
 cards:[
 {t:"num",q:"Calcule le LCR : HQLA 120, sorties nettes 100, en %.",a:120,tol:0.1,un:" %",w:"120 / 100 = 120 %, au-dessus de 100 %. Il s'agit de résister à un choc de liquidité de 30 jours."},
 {t:"num",q:"Calcule le NSFR : ASF 90, RSF 100, en %.",a:90,tol:0.1,un:" %",w:"90 / 100 = 90 %, en dessous de 100 % : la structure de financement n'est pas soutenable. Horizon d'un an."},
 {t:"num",q:"Calcule le ratio de levier : Tier 1 de 30 pour une exposition de 800, en %.",a:3.75,tol:0.01,un:" %",w:"30 / 800 = 3,75 %, au-dessus de 3 %. Limite non pondérée par le risque."},
 {t:"story",q:"Que conclus-tu de l'ensemble ?",sc:[{who:"Le directeur",txt:"LCR 120 %, NSFR 90 %, levier 3,75 %. On est bons, non ?"}],
  o:["Non : le NSFR est sous 100 %, la structure de financement n'est pas conforme", "Oui : un LCR élevé suffit à conclure que la liquidité est maîtrisée partout", "Non : le levier est trop bas, c'est le seul vrai problème du bilan actuel", "Oui : tous les ratios sont conformes aux exigences réglementaires en vigueur"],a:0,w:"LCR et NSFR doivent tous deux être supérieurs ou égaux à 100 %."},
 {t:"match",q:"Associe chaque outil à son rôle.",p:[["ILAAP","Le pendant liquidité de l'ICAAP"],["Gap de liquidité","Impasses par bande d'échéance"],["Survival horizon","Combien de jours la banque tient"],["CFP","Plan de financement d'urgence"]],w:"Outils d'analyse de la liquidité : ILAAP, gap par bande d'échéance, survival horizon et plan de financement d'urgence."}
 ]},
{id:"irrbb",t:"Risque de taux du banking book : EVE et NII",mods:[108],
 ctx:"Les taux montent de 200 points de base. L'ALCO de Nordbank doit décider de la couverture. Un analyste confond risque de marché et IRRBB.",
 cards:[
 {t:"sort",q:"EVE ou NII ?",bins:["EVE","NII"],it:[["Effet de long terme sur la valeur nette",0],["Effet de court terme sur la marge d'intérêt",1],["Vision patrimoniale, actualisation de tous les flux",0],["Vision résultat, sur 12 mois généralement",1]],w:"89 % des banques traitent la sensibilité du NII comme métrique primaire de pilotage (Risk.net), car c'est ce qui apparaît dans le compte de résultat de l'année."},
 {t:"story",q:"Que réponds-tu à l'analyste qui confond ?",sc:[{who:"L'analyste",txt:"L'IRRBB, c'est du risque de marché, non ?"}],
  o:["Non : il porte sur le banking book, crédits et dépôts, pas le trading", "Oui : c'est du risque de marché sur les positions du trading book", "Non : c'est un risque opérationnel de taux lié aux systèmes d'information", "Oui : mais seulement quand les taux montent de façon brutale et soudaine"],a:0,w:"Ce n'est pas du risque de marché : il porte sur le banking book."},
 {t:"match",q:"Associe chaque comité à son rôle.",p:[["ALCO","Pilote l'ALM, la liquidité et l'IRRBB"],["Comité de crédit","Décide des dossiers de crédit"],["NPC","Comité nouveaux produits"],["Comité modèles","Valide les modèles"]],w:"C'est à l'ALCO que se décident les couvertures et la structure de bilan. Le comité de crédit examine les dossiers de crédit."},
 {t:"num",q:"Une hausse de taux fait baisser le NII de 15 M sur 12 mois sur un NII de départ de 200 M. Quelle est la baisse en % ?",a:7.5,tol:0.1,un:" %",w:"15 / 200 = 7,5 %. C'est la sensibilité du NII à un choc de taux, la métrique primaire de pilotage de l'IRRBB."},
 {t:"tf",q:"Les chocs de taux réglementaires sont des scénarios standardisés imposés par le superviseur.",a:true,w:"Vrai : avec le gap de taux, ce sont les outils de l'IRRBB."}
 ]},
{id:"oprisk",t:"Risque opérationnel, DORA et validation de modèles",mods:[109,110],
 ctx:"Chez Nordbank, un KPI est dégradé, un KCI est défavorable et un KRI est en hausse sur le processus paiements. Par ailleurs, l'équipe de développement d'un modèle de scoring en random forest veut le valider elle-même.",
 cards:[
 {t:"story",q:"Que conclus-tu du triptyque KPI, KCI, KRI ?",sc:[{who:"Le responsable",txt:"Un KPI dégradé, un KCI défavorable, un KRI en hausse. Faut-il agir ?"}],
  o:["Signal d'alerte majeur : le croisement fait le diagnostic, on agit", "Un seul des trois suffit pour déclencher une action corrective immédiate", "Aucun signal : il faut attendre la clôture du prochain trimestre pour agir", "Seul le KRI compte vraiment, les deux autres indicateurs sont secondaires"],a:0,w:"Un seul des trois ne suffit jamais à conclure. C'est le croisement qui fait le diagnostic."},
 {t:"match",q:"Associe chaque outil du risque opérationnel.",p:[["RCSA","Auto-évaluation des risques et contrôles par les métiers"],["KRI","Indicateurs avancés de risque"],["Collecte des incidents","La base historique des pertes"],["Cartographie","Processus métier croisés avec la typologie de risques"]],w:"Depuis Bâle III, l'approche standardisée SMA remplace les modèles internes pour le capital opérationnel."},
 {t:"story",q:"Que réponds-tu aux développeurs qui veulent valider leur propre modèle ?",sc:[{who:"Les développeurs",txt:"On connaît le modèle mieux que personne, on le valide nous-mêmes."}],
  o:["Non : séparation organisationnelle réelle et effective challenge, c'est non négociable", "Oui : celui qui connaît le modèle est évidemment le mieux placé pour le valider", "Non : la validation se fait seulement par l'audit externe, jamais en interne", "Oui : à condition qu'ils signent un rapport écrit et le transmettent au comité"],a:0,w:"Le validateur doit critiquer, pas seulement vérifier des procédures."},
 {t:"multi",q:"Coche ce que comprend une validation indépendante.",o:["Revue de la solidité conceptuelle","Tests de données et de code","Outcomes analysis","Backtesting et benchmarking","Vérification de l'usage hors du périmètre prévu"],a:[0,1,2,3],w:"On vérifie l'usage dans le périmètre prévu, pas hors périmètre."},
 {t:"tf",q:"DORA est applicable depuis le 1er janvier 2027 et ne concerne que la cybersécurité interne.",a:false,w:"Faux : DORA (Digital Operational Resilience Act) est applicable depuis le 17 janvier 2025 et encadre surtout la gestion des prestataires TIC, notamment la concentration cloud."}
 ]},
{id:"bale",t:"De Bâle I à Bâle IV : dates et superviseurs",mods:[111],
 ctx:"Tu prépares une note pour le comité sur le calendrier réglementaire. Tu dois replacer Bâle I, II, III, IV, CRR3, CRD6, le FRTB et l'output floor, et nommer les superviseurs.",
 cards:[
 {t:"order",q:"Remets dans l'ordre chronologique.",it:["Bâle I, 1988","Bâle II, 2004","Bâle III, 2010","Bâle IV, 2017"],w:"Bâle I : ratio minimal. Bâle II : trois piliers, IRB. Bâle III : qualité des fonds propres, levier, liquidité. Bâle IV : output floor."},
 {t:"match",q:"Associe chaque date à son événement.",p:[["19 juin 2024","Paquet publié au JOUE"],["1er janvier 2025","CRR3 en application"],["10 janvier 2026","CRD6 à transposer"],["1er janvier 2027","FRTB dans l'UE (reporté)"],["2033","Fin de montée en charge de l'output floor"]],w:"Succursales de pays tiers : 11 janvier 2027."},
 {t:"match",q:"Associe chaque superviseur à son rôle.",p:[["BCE","Supervision directe des banques significatives via le MSU"],["EBA","Normes techniques, ITS, stress tests"],["ACPR","Superviseur national"],["CRU / SRB","Résolution"],["HCSF","Coussin contracyclique en France"]],w:"Cinq acteurs, cinq rôles : BCE, EBA, ACPR, CRU et HCSF. Le MSU est le mécanisme de supervision unique de la BCE."},
 {t:"num",q:"Combien d'années entre la publication du paquet (2024) et la fin de la montée en charge de l'output floor (2033) ?",a:9,tol:0.1,un:" ans",w:"2033 - 2024 = 9 ans. La montée en charge de l'output floor est progressive jusqu'en 2033."},
 {t:"story",q:"Que réponds-tu à un collègue qui croit que le FRTB est appliqué depuis 2025 ?",sc:[{who:"Le collègue",txt:"Le FRTB s'applique déjà dans l'UE depuis 2025, non ?"}],
  o:["Non : repoussé au 1er janvier 2027 dans l'UE", "Oui : depuis le 1er janvier 2025, avec l'entrée en application de CRR3", "Non : il a été abandonné définitivement par le comité de Bâle en 2024", "Oui : il s'applique dans l'UE depuis 2017, avec les premières mesures de Bâle IV"],a:0,w:"CRR3 s'applique depuis le 1er janvier 2025, mais le FRTB est reporté à 2027."}
 ]},
{id:"piliers",t:"Piliers, coussins, MDA : qu'a-t-on le droit de distribuer ?",mods:[112],
 ctx:"Nordbank est une banque systémique avec P2R de 1,2 % en CET1. Son coussin de conservation est de 2,5 %, son coussin contracyclique en France de 1,0 %, son coussin G-SII de 1,0 %. Son ratio CET1 est de 9,5 %.",
 cards:[
 {t:"num",q:"Calcule le CBR (conservation 2,5 % + contracyclique 1,0 % + G-SII 1,0 %), en %.",a:4.5,tol:0.01,un:" %",w:"2,5 + 1,0 + 1,0 = 4,5 %. Le CBR est empilé au-dessus du Pilier 1 et du P2R, en CET1."},
 {t:"num",q:"Calcule l'exigence totale en CET1 : minimum Pilier 1 (4,5 %) + P2R (1,2 %) + CBR (4,5 %), en %.",a:10.2,tol:0.01,un:" %",w:"4,5 + 1,2 + 4,5 = 10,2 % : minimum Pilier 1, plus P2R, plus CBR, tous en CET1. Un CET1 de 9,5 % est donc sous l'exigence."},
 {t:"story",q:"Que dis-tu au directeur financier sur les dividendes ?",sc:[{who:"Le directeur financier",txt:"Notre CET1 est de 9,5 %. Je distribue le dividende habituel ?"}],
  o:["Non : 9,5 % est sous 10,2 %, calcule le MDA, les distributions sont restreintes", "Oui : 9,5 % est supérieur au minimum du Pilier 1, donc distribue normalement", "Oui : le CBR n'a aucun effet sur les dividendes, seul le Pilier 1 compte ici", "Non : sauf si l'audit interne approuve la distribution par un avis écrit signé"],a:0,w:"Une banque qui ne respecte pas le CBR doit calculer le MDA et se voit restreinte sur dividendes, coupons AT1 et bonus."},
 {t:"match",q:"Associe chaque élément à sa nature.",p:[["P2R","Contraignant, fixé banque par banque via le SREP"],["P2G","Non contraignant, informé par le stress test, en CET1"],["TLAC","Pour les G-SII : 18 % des RWA et 6,75 % du levier"],["MREL","Fixé au cas par cas par le CRU"]],w:"P2G est au-dessus du trigger MDA et n'est donc pas MDA-relevant."},
 {t:"sort",q:"À quel pilier appartient chaque élément ?",bins:["Pilier 1","Pilier 2","Pilier 3"],it:[["Exigences minimales de fonds propres",0],["SREP, ICAAP, ILAAP",1],["Discipline de marché, publication",2],["Crédit, marché, opérationnel, CVA",0]],w:"Pilier 1 : exigences minimales. Pilier 2 : supervision (SREP, ICAAP, ILAAP). Pilier 3 : discipline de marché et publication."}
 ]},
{id:"reporting",t:"Reporting, BCBS 239 et risques climatiques",mods:[113,114],
 ctx:"Tu prépares le COREP du trimestre. La qualité des données pose problème. Par ailleurs, le comité te demande de classer les risques climatiques de l'établissement.",
 cards:[
 {t:"match",q:"Associe chaque reporting à son contenu.",p:[["COREP","Fonds propres et risques, trimestriel"],["FINREP","Données financières"],["AnaCredit","Données granulaires de crédit, prêt par prêt"],["BCBS 239","Principes d'agrégation des données de risque"]],w:"La qualité des données est le point de friction quotidien numéro un du métier."},
 {t:"sort",q:"Risque physique ou risque de transition ?",bins:["Physique","Transition"],it:[["Sécheresse, inondations",0],["Choc du prix du carbone",1],["Changement réglementaire",1],["Vagues de chaleur",0]],w:"Physique : impact direct sur les actifs. Transition : impact sur les modèles d'affaires des emprunteurs."},
 {t:"story",q:"Que réponds-tu au comité qui demande ce qu'est le data lineage ?",sc:[{who:"Le comité",txt:"C'est quoi le data lineage, concrètement ?"}],
  o:["La traçabilité de la donnée, de la source jusqu'au rapport", "La liste des fournisseurs de données externes utilisés par la direction", "Un indicateur de la fréquence des reportings envoyés au superviseur", "Un outil de calcul du ratio CET1 à partir des états financiers consolidés"],a:0,w:"BCBS 239 : sait-on produire rapidement et de façon fiable une vue agrégée des risques ?"},
 {t:"order",q:"Remets dans l'ordre le cycle du métier, du plus fréquent au moins fréquent.",it:["Quotidien : VaR, P&L, limites","Mensuel : tableaux de bord, KRI","Trimestriel : COREP / FINREP, comités","Annuel : ICAAP / ILAAP, stress tests, RAF"],w:"Le cycle du métier : quotidien (VaR, P&L, limites), mensuel (KRI), trimestriel (COREP / FINREP), annuel (ICAAP, stress tests, RAF)."},
 {t:"tf",q:"L'Europe intègre l'ESG au Pilier 3 avec le GAR (Green Asset Ratio).",a:true,w:"Vrai : avec la CSRD pour le reporting de durabilité, la SFDR pour la transparence des produits, et la taxonomie verte."}
 ]},
{id:"poste",t:"Ta carrière en risques : le quotidien, les certifications, l'entretien",mods:[115,116],
 ctx:"Tu prépares un entretien pour un poste d'analyste risque à Paris. On te demandera la VaR, l'ES, les stages IFRS 9, un cas pratique. Tu hésites entre le FRM et le CFA.",
 cards:[
 {t:"sort",q:"Journée type : matin, midi ou fin de journée ?",bins:["Matin","Midi","Fin de journée"],it:[["Contrôle des indicateurs de la veille",0],["Analyse de dossiers ou nouveaux produits",1],["Production de notes et dossiers de comité",2],["Traitement des alertes",0]],w:"Matin : contrôle. Midi : analyse. Fin de journée : notes et reportings."},
 {t:"match",q:"Associe chaque certification à son profil.",p:[["FRM (GARP)","La référence mondiale en risque, deux examens"],["PRM (PRMIA)","Alternative, exemptions pour détenteurs du CFA ou du FRM"],["CFA","Plus orienté investissement, complémentaire"],["CQF","Orienté quant"]],w:"Le FRM est le plus pertinent pour un poste en risque."},
 {t:"story",q:"Que réponds-tu à la question d'entretien sur la VaR ?",sc:[{who:"Le recruteur",txt:"Qu'est-ce que la VaR, quelles sont ses limites, et quelle différence avec l'Expected Shortfall ?"}],
  o:["Perte maximale à un seuil ; elle ignore la queue, l'ES moyenne au-delà", "Perte moyenne quotidienne d'un portefeuille, sans limite particulière à signaler", "Perte attendue égale à PD x LGD x EAD, calculée sur un prêt unique et isolé", "Une mesure de liquidité à 30 jours, désormais remplacée par le ratio LCR"],a:0,w:"Montre aussi des projets concrets : un modèle de scoring en Python, l'automatisation d'un reporting."},
 {t:"num",q:"Un salaire de confirmé est de 42 000 à 70 000 EUR. Le milieu de la fourchette ?",a:56000,tol:1,un:" €",w:"(42 000 + 70 000) / 2 = 56 000 EUR. Débutant : 32 000 à 45 000. Senior : 54 000 à 90 000. Île-de-France : environ 15 % au-dessus."},
 {t:"tf",q:"La compétence sous-estimée du métier est la rédaction : tous les livrables sont écrits, et un risque mal formulé n'est pas traité.",a:true,w:"Vrai : notes de crédit, dossiers de comité, tableaux de bord, RAF et RAS."}
 ]}
]
}
