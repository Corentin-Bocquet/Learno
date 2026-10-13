/*EXAMEN*/
{
docs:[
{t:"Barème des droits (ligne directe)",h:`<p>On cherche la ligne où tombe la part nette taxable <b>P</b>, puis on applique sa formule.</p>
<table><tr><th>P (après abattement)</th><th>Droits</th></tr>
<tr><td>Jusqu'à 8 072 €</td><td>P x 5 %</td></tr>
<tr><td>De 8 072 à 12 109 €</td><td>P x 10 % - 404 €</td></tr>
<tr><td>De 12 109 à 15 932 €</td><td>P x 15 % - 1 009 €</td></tr>
<tr><td>De 15 932 à 552 324 €</td><td>P x 20 % - 1 806 €</td></tr>
<tr><td>De 552 324 à 902 838 €</td><td>P x 30 % - 57 038 €</td></tr>
<tr><td>De 902 838 à 1 805 677 €</td><td>P x 40 % - 147 322 €</td></tr>
<tr><td>Au-delà de 1 805 677 €</td><td>P x 45 % - 237 606 €</td></tr></table>`},
{t:"Abattements et taux hors ligne directe",h:`<table><tr><th>Lien</th><th>Abattement</th><th>Taux</th></tr>
<tr><td>Enfant, parent</td><td>100 000 €</td><td>Barème ligne directe</td></tr>
<tr><td>Petit-enfant (donation)</td><td>31 865 €</td><td>Barème ligne directe</td></tr>
<tr><td>Frère, sœur</td><td>15 932 €</td><td>35 % jusqu'à 24 430 €, puis P x 45 % - 2 443 €</td></tr>
<tr><td>Neveu, nièce</td><td>7 967 €</td><td>55 %</td></tr>
<tr><td>Concubin, ami</td><td>1 594 €</td><td>60 %</td></tr>
<tr><td>Conjoint, partenaire de PACS</td><td>Succession : exonéré. Donation : 80 724 €</td><td>Barème ligne directe</td></tr></table>
<p>Les abattements se rechargent tous les 15 ans. Le don familial d'argent ajoute 31 865 € (donateur de moins de 80 ans, bénéficiaire majeur).</p>`},
{t:"Usufruit et nue-propriété (article 669 du CGI)",h:`<p>On lit la ligne avec l'âge de l'<b>usufruitier</b>.</p>
<table><tr><th>Âge de l'usufruitier</th><th>Usufruit</th><th>Nue-propriété</th></tr>
<tr><td>Moins de 21 ans</td><td>90 %</td><td>10 %</td></tr>
<tr><td>Moins de 31 ans</td><td>80 %</td><td>20 %</td></tr>
<tr><td>Moins de 41 ans</td><td>70 %</td><td>30 %</td></tr>
<tr><td>Moins de 51 ans</td><td>60 %</td><td>40 %</td></tr>
<tr><td>Moins de 61 ans</td><td>50 %</td><td>50 %</td></tr>
<tr><td>Moins de 71 ans</td><td>40 %</td><td>60 %</td></tr>
<tr><td>Moins de 81 ans</td><td>30 %</td><td>70 %</td></tr>
<tr><td>Moins de 91 ans</td><td>20 %</td><td>80 %</td></tr>
<tr><td>91 ans et plus</td><td>10 %</td><td>90 %</td></tr></table>
<p>Donation temporaire d'usufruit : 23 % de la valeur par période de 10 ans, sans fraction.</p>`},
{t:"Assurance-vie et décès",h:`<table><tr><th></th><th>Primes avant 70 ans (990 I)</th><th>Primes après 70 ans (757 B)</th></tr>
<tr><td>Base</td><td>Capital transmis, gains compris</td><td>Primes seulement, gains exonérés</td></tr>
<tr><td>Abattement</td><td>152 500 € par bénéficiaire</td><td>30 500 € pour tous les bénéficiaires</td></tr>
<tr><td>Taxation</td><td>20 % jusqu'à 700 000 €, puis 31,25 %</td><td>Barème des successions selon le lien</td></tr></table>
<p>Le conjoint et le partenaire de PACS sont exonérés. Les 30 500 € se répartissent au prorata des primes entre les bénéficiaires taxables.</p>`},
{t:"Dutreil, holding et cession",h:`<ul><li>Pacte Dutreil : abattement de <b>75 %</b> sur la valeur des titres. Engagement collectif de 2 ans (34 % des droits de vote, 17 % des droits financiers), engagement individuel de 6 ans, direction pendant l'engagement et 3 ans après.</li>
<li>Réduction de <b>50 %</b> des droits en cas de donation de pleine propriété par un donateur de moins de 70 ans.</li>
<li>Chronologie : Dutreil, démembrement, partage, abattement, barème, réduction.</li>
<li>Régime mère-fille : quote-part de 5 % taxée à 25 %, soit 1,25 %. Intégration fiscale : 0,25 %.</li>
<li>Flat tax : 31,4 % (12,8 % d'impôt et 18,6 % de prélèvements sociaux).</li>
<li>Droits d'enregistrement : actions 0,1 %, parts de SARL 3 % après 23 000 €, fonds de commerce 0 %, 3 % puis 5 %.</li></ul>`}
],
cases:[
{id:"bertrand",t:"Le dossier Bertrand : qui hérite de quoi",mods:[133,134,135,328],
 ctx:"M. Bertrand meurt à 70 ans. Il était marié sous la communauté légale avec Françoise, 66 ans. Ils ont trois enfants communs : Paul, Zoé et Hugo. Biens communs : une maison de 560 000 € et des placements de 240 000 €. M. Bertrand possédait aussi un terrain de 120 000 € reçu de ses parents. Aucun testament, aucune donation.",
 cards:[
 {t:"num",q:"Quelle est la valeur de la succession de M. Bertrand ?",a:520000,tol:1,un:" €",h:"Régime d'abord : coupe les biens communs en deux.",w:"On liquide le régime avant tout : Françoise reprend sa moitié des biens communs (800 000 / 2 = 400 000 €). La succession = 400 000 € + 120 000 € de bien propre = 520 000 €. Moyen mnémotechnique : moitié d'abord, ordre ensuite."},
 {t:"story",q:"Que réponds-tu à Françoise sur ses droits ?",sc:[{who:"Françoise Bertrand",txt:"Je voudrais rester dans la maison jusqu'à la fin. Qu'est-ce que la loi me donne, avec les trois enfants ?"}],
  o:["Vous choisissez : un quart en pleine propriété ou toute la succession en usufruit","Vous recevez la moitié de la succession en pleine propriété, sans choix à faire ni calcul","Vous n'avez aucun droit sur la succession : les trois enfants héritent seuls de leur père marié","Vous recevez uniquement un quart en usufruit, sans autre option possible pour vous"],a:0,
  w:"Enfants tous communs : le conjoint a le choix entre 1/4 en pleine propriété et 100 % en usufruit. Avec un enfant non commun, il n'aurait eu que le quart."},
 {t:"num",q:"Françoise choisit le quart en pleine propriété. Quelle somme reçoit chaque enfant ?",a:130000,tol:1,un:" €",h:"3/4 restent aux enfants, à partager en trois.",w:"Le quart de 520 000 € = 130 000 € pour Françoise. Il reste 390 000 € pour trois enfants, soit 130 000 € chacun."},
 {t:"num",q:"Françoise est finalement usufruitière de toute la succession. Quelle est la valeur de la nue-propriété reçue par chaque enfant ?",a:104000,tol:1,un:" €",h:"Lis le tableau avec l'âge de l'usufruitière, 66 ans.",w:"À 66 ans, l'usufruit vaut 40 % et la nue-propriété 60 % : 520 000 x 60 % = 312 000 €, soit 104 000 € par enfant. L'âge à lire est celui de l'usufruitière, pas celui du défunt."},
 {t:"order",q:"Remets dans l'ordre la méthode du conseiller sur un dossier de succession.",it:["Régime matrimonial","Testament et donations","Héritiers","Valeur de ce que chacun reçoit","Droits à payer"],w:"Régime, Testament, Héritiers, Valeur, Droits : « Regarde Toujours Haut, Vise Droit »."}
 ]},
{id:"delmas",t:"La famille Delmas : le quart qui change de famille",mods:[134,135,328],
 ctx:"M. Delmas, 61 ans, est remarié à Isabelle sous la séparation de biens. Il a une fille d'un premier mariage, Camille, et un fils avec Isabelle, Maxime. À son décès, son patrimoine personnel vaut 900 000 €. Aucun testament. Isabelle possède 300 000 € en propre.",
 cards:[
 {t:"mcq",q:"Que peut recevoir Isabelle dans la succession de M. Delmas ?",o:["Un quart en pleine propriété seulement","Un quart en pleine propriété ou tout en usufruit, à son choix","La moitié de la succession en pleine propriété","Tout le patrimoine en usufruit, sans limite de durée"],a:0,w:"Dès qu'un enfant n'est pas commun aux deux époux, le conjoint perd l'option de l'usufruit : il n'a que le quart en pleine propriété."},
 {t:"num",q:"Quelle somme reçoit Isabelle, en pleine propriété ?",a:225000,tol:1,un:" €",w:"900 000 / 4 = 225 000 €. Ce quart entre dans le patrimoine propre d'Isabelle."},
 {t:"story",q:"Que réponds-tu à Camille ?",sc:[{who:"Camille Delmas",txt:"Le quart d'Isabelle, un jour, ira bien à son fils Maxime et à lui seul ?"}],
  o:["Oui, ce quart rejoint le patrimoine d'Isabelle et suivra sa propre succession","Non, le quart revient pour moitié à vous, car il vient de votre propre père","Non, il retourne automatiquement aux deux enfants de M. Delmas à parts égales","Oui, mais seulement si Isabelle rédige un testament en faveur de son fils Maxime"],a:0,w:"Le quart reçu devient un bien d'Isabelle. À son décès, il passe à ses propres héritiers : ici Maxime. C'est le quart qui change de famille."},
 {t:"num",q:"Après le décès d'Isabelle (sans testament, Maxime est son seul héritier), combien Maxime aura-t-il reçu en tout depuis les deux décès ?",a:862500,tol:1,un:" €",h:"Sa part chez son père, plus tout le patrimoine d'Isabelle.",w:"Succession du père : (900 000 - 225 000) / 2 = 337 500 € pour chaque enfant. Patrimoine d'Isabelle : 300 000 + 225 000 = 525 000 €, tout pour Maxime. Total Maxime = 862 500 €, Camille = 337 500 €."},
 {t:"tf",q:"Isabelle peut choisir l'usufruit de la totalité de la succession, comme pour un couple d'enfants communs.",a:false,w:"Faux : avec un enfant d'une première union, seule l'option du quart en pleine propriété existe."}
 ]},
{id:"aubry",t:"La succession Aubry : la représentation et les droits",mods:[133,135,329],
 ctx:"M. Aubry, veuf, meurt à 82 ans. Succession nette : 900 000 €. Il laisse un fils, Marc, et deux petits-enfants, Lola et Tom, enfants de sa fille Nora décédée l'an dernier. Aucune donation antérieure.",
 cards:[
 {t:"mcq",q:"Comment se répartit la succession entre Marc, Lola et Tom ?",o:["450 000 € pour Marc, et 450 000 € à partager entre Lola et Tom","300 000 € pour chacun des trois, par tête","600 000 € pour Marc, 150 000 € pour Lola et pour Tom","Tout pour Marc : les petits-enfants n'héritent jamais d'un grand-père"],a:0,w:"Nora est prédécédée : ses enfants prennent sa place par représentation et se partagent sa souche. Deux souches, donc deux moitiés."},
 {t:"num",q:"Quels droits Lola doit-elle payer ?",a:33194,tol:1,un:" €",h:"Elle partage l'abattement de 100 000 € de sa mère avec Tom.",w:"Part nette : 225 000 €. Abattement : 100 000 / 2 = 50 000 €. P = 175 000 €. Ligne à 20 % : 175 000 x 20 % - 1 806 = 33 194 €."},
 {t:"num",q:"Quels droits Marc doit-il payer ?",a:68194,tol:1,un:" €",w:"Part nette : 450 000 €. Abattement 100 000 €. P = 350 000 €. 350 000 x 20 % - 1 806 = 68 194 €."},
 {t:"tf",q:"Venant par représentation de leur mère, Lola et Tom ont chacun un abattement de 100 000 €.",a:false,w:"Faux : ils se partagent les 100 000 € de leur mère, soit 50 000 € chacun."}
 ]},
{id:"ferrand",t:"Mme Ferrand : neveu, concubin et assurance-vie",mods:[136,141,329,330],
 ctx:"Mme Ferrand, 64 ans, célibataire et sans enfant, vit avec Étienne, son concubin. Elle a une nièce, Anaïs. Elle veut leur laisser 140 000 € à Étienne et 50 000 € à Anaïs. Ses parents sont décédés. Aucune donation antérieure.",
 cards:[
 {t:"match",q:"Associe chaque bénéficiaire à son abattement en succession.",p:[["Enfant","100 000 €"],["Frère ou sœur","15 932 €"],["Neveu ou nièce","7 967 €"],["Concubin","1 594 €"]],w:"100 000, 15 932, 7 967, 1 594 : plus le lien est lointain, plus l'abattement fond et plus le taux grimpe."},
 {t:"num",q:"Si Étienne reçoit les 140 000 € par testament, quels droits paie-t-il ?",a:83044,tol:1,un:" €",h:"Concubin : abattement de 1 594 €, puis 60 %.",w:"140 000 - 1 594 = 138 406 €. 138 406 x 60 % = 83 043,6 €, soit 83 044 €. Presque 60 % de la somme part au fisc."},
 {t:"num",q:"Anaïs reçoit 50 000 € par legs. Quels droits paie-t-elle ?",a:23118,tol:1,un:" €",h:"Nièce : abattement de 7 967 €, puis 55 %.",w:"50 000 - 7 967 = 42 033 €. 42 033 x 55 % = 23 118,15 €, soit 23 118 €."},
 {t:"story",q:"Que conseilles-tu à Mme Ferrand pour Étienne ?",sc:[{who:"Mme Ferrand",txt:"Je ne veux pas qu'Étienne perde plus de la moitié de ce que je lui laisse. Il existe une solution ?"}],
  o:["Une assurance-vie alimentée avant 70 ans, avec Étienne comme bénéficiaire","Un testament plus détaillé, avec des conditions d'attribution précises","Un PACS signé la veille du décès, dans le cabinet du notaire","Une donation de la maison avec réserve d'usufruit sur dix ans"],a:0,w:"L'assurance-vie transmet 152 500 € par bénéficiaire sans droits quand les primes sont versées avant 70 ans. Ici : 140 000 € < 152 500 €, donc 0 € de droits."},
 {t:"tf",q:"Des primes versées avant 70 ans permettent de transmettre 140 000 € à Étienne sans aucun droit.",a:true,w:"Vrai : le 990 I exonère jusqu'à 152 500 € par bénéficiaire. Après 70 ans, ce serait le 757 B, avec 30 500 € d'abattement pour tous."}
 ]},
{id:"rolland",t:"Le contrat Rolland : avant et après 70 ans",mods:[141,330],
 ctx:"M. Rolland décède à 74 ans. Son contrat d'assurance-vie a été souscrit en 2008. Primes versées avant ses 70 ans : 180 000 €, capital correspondant 230 000 € (gains compris). Primes versées après ses 70 ans : 90 000 €, avec 15 000 € de gains. Bénéficiaires à parts égales : sa fille Hélène et son neveu Victor.",
 cards:[
 {t:"sort",q:"Classe chaque élément dans le bon régime.",bins:["990 I (avant 70 ans)","757 B (après 70 ans)"],it:[["Primes versées à 66 ans",0],["Primes versées à 71 ans",1],["Abattement de 152 500 € par bénéficiaire",0],["Abattement de 30 500 € pour tous",1],["Taxation à 20 % puis 31,25 %",0],["Taxation au barème des successions",1]],w:"Avant 70, le capital et 152 500 € chacun. Après 70, les primes et 30 500 € pour tous."},
 {t:"mcq",q:"Quelle somme de chaque bénéficiaire est taxable au titre du 990 I ?",o:["0 €, car 115 000 € est inférieur à 152 500 €","78 500 €, soit 115 000 € moins 36 500 €","115 000 €, sans aucun abattement","37 500 €, soit la moitié des primes après 70 ans"],a:0,w:"Capital 230 000 € à parts égales : 115 000 € chacun, sous le plafond de 152 500 € par bénéficiaire. Aucun droit."},
 {t:"num",q:"Quel abattement du 757 B revient à Victor ?",a:15250,tol:1,un:" €",h:"Hélène et Victor sont tous deux taxables.",w:"30 500 € à répartir au prorata des primes. Chacun a 45 000 € de primes sur 90 000 € : 30 500 x 45 000 / 90 000 = 15 250 €."},
 {t:"num",q:"Quels droits Victor paie-t-il au titre du 757 B ?",a:11981,tol:1,un:" €",h:"Primes de Victor moins son abattement 757 B, puis abattement et taux du neveu.",w:"Primes de Victor : 45 000 - 15 250 = 29 750 €. Neveu : 29 750 - 7 967 = 21 783 €, taxé à 55 % = 11 980,65 €, soit 11 981 €. Les gains de 15 000 € sont exonérés."},
 {t:"tf",q:"Les 15 000 € de gains réalisés sur les primes versées après 70 ans sont taxés au 757 B.",a:false,w:"Faux : le 757 B ne taxe que les primes. Les gains sont exonérés."}
 ]},
{id:"roux",t:"Les Roux : donner la nue-propriété, maintenant ou plus tard",mods:[137,138,331],
 ctx:"M. et Mme Roux, 61 et 59 ans, mariés sous la communauté, possèdent un appartement commun de 600 000 € qui fait leur résidence principale. Ils ont deux enfants. Ils veulent leur donner la nue-propriété de l'appartement et garder l'usufruit. Tous les abattements de 100 000 € par parent et par enfant sont intacts.",
 cards:[
 {t:"num",q:"Quelle est la valeur de la nue-propriété donnée par M. Roux, 61 ans, sur sa moitié ?",a:180000,tol:1,un:" €",h:"Sa moitié vaut 300 000 €. Lis la ligne de ses 61 ans.",w:"61 ans : ligne « moins de 71 ans », usufruit 40 % et nue-propriété 60 %. 300 000 x 60 % = 180 000 €, soit 90 000 € par enfant."},
 {t:"num",q:"Quelle est la valeur de la nue-propriété donnée par Mme Roux, 59 ans, sur sa moitié ?",a:150000,tol:1,un:" €",w:"59 ans : ligne « moins de 61 ans », nue-propriété 50 %. 300 000 x 50 % = 150 000 €, soit 75 000 € par enfant."},
 {t:"tf",q:"Les deux donations peuvent se faire sans aucun droit à payer.",a:true,w:"Vrai : chaque enfant reçoit 90 000 € de son père et 75 000 € de sa mère, soit moins de 100 000 € par parent. Les droits sont nuls."},
 {t:"num",q:"M. Roux attend d'avoir 72 ans pour donner sa moitié de la même façon. Quels droits paie chaque enfant sur la part reçue de lui ?",a:250,tol:1,un:" €",h:"À 72 ans, la nue-propriété vaut 70 %. Regarde la première ligne du barème.",w:"300 000 x 70 % = 210 000 €, soit 105 000 € par enfant. P = 105 000 - 100 000 = 5 000 €. Première tranche : 5 000 x 5 % = 250 €. Attendre fait grimper la valeur donnée."},
 {t:"story",q:"Que répondre à leur fils ?",sc:[{who:"Thomas Roux",txt:"Et quand vous mourrez, il faudra encore payer des droits pour récupérer la pleine propriété ?"}],
  o:["Non, l'usufruit s'éteint et vous retrouvez la pleine propriété sans droits","Oui, la pleine propriété est de nouveau taxée à 60 % au décès du dernier parent","Oui, mais seulement si l'appartement a pris beaucoup de valeur depuis la donation","Non, mais il faudra racheter l'usufruit à la succession de vos deux parents"],a:0,w:"Au décès de l'usufruitier, l'usufruit s'éteint et le nu-propriétaire devient plein propriétaire sans droits supplémentaires. C'est tout l'intérêt de donner la nue-propriété."}
 ]},
{id:"kerval",t:"Mme Kerval : l'usufruit temporaire",mods:[139,331],
 ctx:"Mme Kerval, 67 ans, est assujettie à l'IFI. Elle possède une résidence secondaire de 700 000 € en Bretagne. Elle envisage de donner l'usufruit de la maison pour 10 ans à son fils Louis, majeur, qui en a besoin pour se loger. Son abattement de 100 000 € est intact.",
 cards:[
 {t:"num",q:"Quelle est la valeur fiscale de l'usufruit temporaire donné pour 10 ans ?",a:161000,tol:1,un:" €",h:"23 % par période de 10 ans.",w:"700 000 x 23 % = 161 000 €. Cette valeur ne dépend ni de l'âge de Mme Kerval, ni de celui de Louis."},
 {t:"num",q:"Quels droits de donation Louis paie-t-il ?",a:10394,tol:1,un:" €",w:"P = 161 000 - 100 000 = 61 000 €. Ligne à 20 % : 61 000 x 20 % - 1 806 = 10 394 €."},
 {t:"multi",q:"Quels sont les avantages de cette donation temporaire d'usufruit pour Mme Kerval ?",o:["Elle ne se sépare pas du bien, car elle garde la nue-propriété","Pendant 10 ans, le bien sort de son patrimoine taxable à l'IFI","Les droits de donation sont limités à 23 % de la valeur","Louis devient propriétaire définitif de la maison au terme","La valeur fiscale diminue avec l'âge de la donatrice"],a:[0,1,2],w:"Elle garde l'arbre, prête les fruits : la propriété revient pleine à son terme, l'IFI baisse, la base taxable reste faible. La valeur de 23 % ne dépend pas de l'âge."},
 {t:"tf",q:"Une donation temporaire d'usufruit de 5 ans est valorisée à 11,5 % de la valeur du bien.",a:false,w:"Faux : on ne coupe pas les périodes en fractions. 5 ans comptent pour une période entière de 10 ans, soit 23 %."}
 ]},
{id:"chevalier",t:"Les Chevalier : rapport, hors part et donation-partage",mods:[138,143,331],
 ctx:"Mme Chevalier a deux enfants, Hugo et Léa. Il y a dix ans, elle a donné à Hugo un appartement qui valait 120 000 €, et à Léa 120 000 € en argent. Elle n'a rien prévu de plus. À son décès, l'appartement vaut 200 000 € et il reste 380 000 € dans la succession.",
 cards:[
 {t:"num",q:"Les deux donations sont des donations simples, rapportables. Quelle somme Léa reçoit-elle dans la succession ?",a:230000,tol:1,un:" €",h:"Masse de partage = succession + valeur des biens à rapporter (valeur au jour du partage).",w:"Masse = 380 000 + 200 000 (appartement à sa valeur actuelle) + 120 000 (argent) = 700 000 €, soit 350 000 € chacun. Léa a déjà reçu 120 000 € : elle prend 230 000 €. Hugo prend 150 000 €."},
 {t:"num",q:"Si les deux donations avaient été faites dans une donation-partage, quelle somme chaque enfant prendrait-il dans la succession ?",a:190000,tol:1,un:" €",h:"Les valeurs sont figées à 120 000 € chacune.",w:"Masse = 380 000 + 120 000 + 120 000 = 620 000 €, soit 310 000 € chacun. Chacun a reçu 120 000 € : il prend 190 000 €. Hugo garde le bénéfice de la plus-value de son appartement."},
 {t:"story",q:"Que réponds-tu à Léa ?",sc:[{who:"Léa Chevalier",txt:"Maman m'a donné 120 000 € il y a dix ans, mais l'appartement de Hugo vaut aujourd'hui bien plus. Comment fait-on l'égalité ?"}],
  o:["En donation simple, on rapporte les biens à leur valeur d'aujourd'hui pour rétablir l'égalité","On ne rapporte rien du tout : une donation est définitive et n'est jamais comptée au décès","On rapporte la valeur d'origine de 120 000 € pour les deux enfants, par principe","Hugo doit vendre l'appartement avant le partage pour en fixer définitivement la valeur"],a:0,w:"Une donation simple est rapportée à sa valeur au jour du partage. Une donation-partage, elle, fige les valeurs au jour de l'acte."},
 {t:"mcq",q:"Que signifie une donation « hors part » ?",o:["Elle s'impute sur la quotité disponible et avantage vraiment le bénéficiaire","Elle est rapportée au décès et rétablit l'égalité entre les enfants","Elle est réservée aux petits-enfants et échappe à toute règle de réserve","Elle ne peut jamais dépasser la valeur d'un présent d'usage"],a:0,w:"Avance de part : on rapporte au décès pour égaliser. Hors part : on impute sur la quotité disponible, le bénéficiaire garde l'avantage."},
 {t:"fill",q:"Une donation-partage fige les valeurs au jour de la ___.",o:["donation","succession","vente","déclaration"],a:0,w:"Donation-partage : valeurs figées au jour de l'acte. Donation simple : valeur au jour du partage."}
 ]},
{id:"perrin",t:"Perrin Logistique : le pacte Dutreil chiffré",mods:[148,332],
 ctx:"Mme Perrin, 63 ans, a fondé la SAS Perrin Logistique à Nantes (45 salariés), valorisée 3 200 000 €. Elle en détient 75 %. Elle veut donner toutes ses parts en pleine propriété à ses deux enfants, à parts égales : Alice, directrice générale de la société depuis quatre ans, et Bastien, cadre dans une autre entreprise. Les abattements de 100 000 € sont intacts. Barème et tableaux fournis.",
 cards:[
 {t:"mcq",q:"Quelle valeur Mme Perrin transmet-elle au total ?",o:["2 400 000 €","3 200 000 €","1 600 000 €","800 000 €"],a:0,w:"On transmet ce qu'on détient : 3 200 000 x 75 % = 2 400 000 €, soit 1 200 000 € par enfant."},
 {t:"num",q:"Sans pacte Dutreil, quels droits chaque enfant paie-t-il ?",a:292678,tol:1,un:" €",h:"Pas d'abattement de 75 %, pas de réduction de 50 %.",w:"1 200 000 - 100 000 = 1 100 000 €. Ligne à 40 % : 1 100 000 x 40 % - 147 322 = 292 678 €."},
 {t:"num",q:"Avec le pacte Dutreil, quels droits chaque enfant paie-t-il, réduction de 50 % comprise ?",a:19097,tol:1,un:" €",h:"Dutreil sur la valeur, puis abattement, barème, et enfin la réduction sur les droits.",w:"1 200 000 x 25 % = 300 000 €. P = 300 000 - 100 000 = 200 000 €. 200 000 x 20 % - 1 806 = 38 194 €. Mme Perrin a moins de 70 ans et donne en pleine propriété : réduction de 50 %, soit 19 097 €."},
 {t:"multi",q:"Quelles conditions le pacte Dutreil exige-t-il ?",o:["Une entreprise opérationnelle, pas une société qui gère de l'immobilier","Un engagement collectif de 2 ans sur 34 % des droits de vote","Un engagement individuel de 6 ans après l'engagement collectif","Une direction exercée pendant l'engagement et 3 ans après","Un capital détenu à 100 % par la seule famille du dirigeant"],a:[0,1,2,3],w:"Quatre piliers : activité opérationnelle, engagement collectif (2 ans, 34 % des droits de vote et 17 % des droits financiers), engagement individuel (6 ans), direction. Aucune obligation de détenir 100 % du capital."},
 {t:"tf",q:"La réduction de 50 % s'applique à la base taxable, avant le barème.",a:false,w:"Faux : le 75 % porte sur la valeur, le 50 % porte sur les droits. La chronologie : Dutreil, démembrement, partage, abattement, barème, réduction."}
 ]},
{id:"lemaitre",t:"Lemaître Menuiserie : pleine propriété ou nue-propriété",mods:[148,332,333],
 ctx:"M. Lemaître, 68 ans, détient 100 % de la SARL Lemaître Menuiserie, valorisée 1 800 000 €. Ses deux enfants, Théo (qui dirige déjà l'atelier) et Eva (infirmière), recevront chacun la moitié. Un pacte Dutreil est signé. Il hésite entre la donation de pleine propriété (A) et la donation de la nue-propriété avec réserve d'usufruit (B). Abattements de 100 000 € intacts.",
 cards:[
 {t:"num",q:"Option A (pleine propriété, avec réduction de 50 %) : quels droits paie chaque enfant ?",a:11597,tol:1,un:" €",h:"Valeur par enfant : 900 000 €. Dutreil, abattement, barème, réduction.",w:"900 000 x 25 % = 225 000 €. P = 125 000 €. 125 000 x 20 % - 1 806 = 23 194 €. M. Lemaître a 68 ans et donne en pleine propriété : réduction de 50 %, soit 11 597 €."},
 {t:"num",q:"Option B (nue-propriété, usufruit conservé) : quels droits paie chaque enfant ?",a:5194,tol:1,un:" €",h:"Dutreil d'abord, puis le démembrement à 68 ans.",w:"900 000 x 25 % = 225 000 €. À 68 ans, la nue-propriété vaut 60 % : 135 000 €. P = 35 000 €. 35 000 x 20 % - 1 806 = 5 194 €. Pas de réduction de 50 % : la donation ne porte pas sur la pleine propriété."},
 {t:"mcq",q:"Pourquoi la réduction de 50 % ne joue-t-elle pas dans l'option B ?",o:["La donation ne porte pas sur la pleine propriété","M. Lemaître a plus de 70 ans dans cette option","Le pacte Dutreil exclut le démembrement par principe","La réduction ne vaut que pour les ventes de parts"],a:0,w:"La réduction de 50 % suppose une donation de pleine propriété par un donateur de moins de 70 ans. Ici, le démembrement l'exclut."},
 {t:"tf",q:"Si M. Lemaître attend d'avoir 71 ans pour donner en pleine propriété, la réduction de 50 % disparaît.",a:true,w:"Vrai : à partir de 70 ans, plus de réduction. Il lui reste deux ans pour agir."},
 {t:"order",q:"Remets dans l'ordre la chronologie du calcul.",it:["Dutreil : 25 % de la valeur","Démembrement éventuel","Partage entre les enfants","Abattement de 100 000 € par enfant","Barème, puis réduction de 50 %"],w:"« Des Dames Pressées Achètent Beaucoup de Roses » : Dutreil, Démembrement, Partage, Abattement, Barème, Réduction. La chronologie est fondamentale."}
 ]},
{id:"giraud",t:"Giraud Services : la donation-partage avec soulte",mods:[145,333,334],
 ctx:"Mme Giraud, 66 ans, détient 100 % de la SAS Giraud Services, valorisée 2 550 000 €. Elle a trois enfants : Clément dirige l'entreprise, Diane et Éloi travaillent ailleurs. Elle n'a pas d'autre patrimoine. Elle veut une donation-partage : Clément reçoit tous les titres et verse une soulte à ses frère et sœur. Le pacte Dutreil est signé. Abattements intacts.",
 cards:[
 {t:"num",q:"Quelle soulte Clément doit-il verser à Diane, et la même à Éloi ?",a:850000,tol:1,un:" €",w:"Chacun doit avoir 2 550 000 / 3 = 850 000 €. Clément verse donc 850 000 € à Diane et 850 000 € à Éloi."},
 {t:"num",q:"Quels droits paie chaque enfant, réduction de 50 % comprise ?",a:10347,tol:1,un:" €",h:"Fiscalement, chaque enfant est réputé recevoir 850 000 € de titres.",w:"850 000 x 25 % = 212 500 €. P = 112 500 €. 112 500 x 20 % - 1 806 = 20 694 €. Mme Giraud a moins de 70 ans, pleine propriété : réduction de 50 %, soit 10 347 €."},
 {t:"tf",q:"Dans la donation-partage avec soulte, le pacte Dutreil profite aux trois enfants, pas seulement à Clément.",a:true,w:"Vrai : fiscalement, chaque enfant est réputé recevoir 850 000 € de titres. Le Dutreil profite aux trois."},
 {t:"mcq",q:"Pourquoi préférer la donation-partage à une donation simple ?",o:["Elle fige les valeurs et évite un rapport si l'entreprise prend de la valeur","Elle supprime la réserve héréditaire des deux enfants non repreneurs","Elle permet de donner l'entreprise à un seul enfant sans soulte","Elle double l'abattement de 100 000 € de chaque enfant"],a:0,w:"Donation-partage : valeurs figées au jour de l'acte, pas de mauvaise surprise au décès. La réserve des autres enfants est respectée grâce à la soulte."},
 {t:"order",q:"Remets dans l'ordre le montage qui finance la soulte (Family Buy-Out).",it:["Clément apporte ses titres à une holding à l'IS qu'il contrôle","La holding emprunte la somme des soultes","Le prêt paie les soultes de Diane et d'Éloi","Les dividendes de la société remontent à la holding","La holding rembourse la banque avec ces dividendes"],w:"Le Family Buy-Out : apport, emprunt, soultes, dividendes mère-fille, remboursement. Les dividendes remontent exonérés à 95 %."}
 ]},
{id:"lopez",t:"Le rachat de PlastiConcept : holding et cession",mods:[146,147,334],
 ctx:"Mme Lopez, 38 ans, veut racheter PlastiConcept, PME de 20 salariés dont le résultat net est de 300 000 € par an. Le vendeur demande 4 fois le résultat. Mme Lopez peut apporter 240 000 €. Son banquier parle d'une holding SAS qui achèterait 100 % des actions. Barème et tableaux fournis.",
 cards:[
 {t:"mcq",q:"Quelle part du prix l'apport de Mme Lopez représente-t-il ?",o:["20 %","24 %","30 %","80 %"],a:0,w:"Prix = 300 000 x 4 = 1 200 000 €. Apport 240 000 / 1 200 000 = 20 %. La holding emprunte les 960 000 € restants."},
 {t:"num",q:"Un an plus tard, PlastiConcept verse 100 000 € de dividendes à la holding (régime mère-fille). Quel impôt la holding paie-t-elle ?",a:1250,tol:1,un:" €",h:"Quote-part de 5 % taxée à l'IS de 25 %.",w:"Quote-part : 100 000 x 5 % = 5 000 €. IS à 25 % : 1 250 €, soit 1,25 % des dividendes. Les 98 750 € restants servent à rembourser la banque."},
 {t:"num",q:"Si Mme Lopez avait acheté en direct et reçu elle-même ces 100 000 € de dividendes, quelle flat tax paierait-elle ?",a:31400,tol:1,un:" €",h:"Flat tax de 31,4 %.",w:"100 000 x 31,4 % = 31 400 €. En direct, on paie l'impôt sur un argent qui ne sert qu'à rembourser le banquier. La holding évite ce frottement."},
 {t:"tf",q:"Le banquier prête à la holding, qui rembourse avec les dividendes de la société rachetée.",a:true,w:"Vrai : la banque prête à la holding, pas à la personne. Le repreneur montre son engagement par son apport."},
 {t:"num",q:"La holding achète 100 % des actions de la SAS. Quels droits d'enregistrement paie-t-elle ?",a:1200,tol:1,un:" €",h:"Actions : un taux unique.",w:"Actions de SAS ou de SA : 0,1 %. 1 200 000 x 0,1 % = 1 200 €. Pour des parts de SARL, ce serait 3 % après un abattement de 23 000 €."}
 ]},
{id:"morin",t:"Le dossier Morin : régime, ordre, outils et droits",mods:[133,134,328,329,332,334],
 ctx:"M. Morin, 72 ans, marié sous la communauté à Anne, 70 ans, dirige la SAS Morin Froid (valeur 2 000 000 €, bien propre créé avant le mariage). Ils ont deux enfants communs, Julie et Benoît. Autres biens communs : 600 000 €. M. Morin veut préparer la suite. Il hésite à donner sa société avec un pacte Dutreil mais craint pour son âge.",
 cards:[
 {t:"mcq",q:"Quelle est la nature de la SAS dans le patrimoine du couple ?",o:["Un bien propre de M. Morin, créé avant le mariage","Un bien commun, comme tout ce qui est acquis pendant le mariage","Un bien indivis à parts égales entre les deux époux","Un bien propre d'Anne, qui l'a gérée avec lui"],a:0,w:"Régime d'abord : une entreprise créée avant le mariage reste un bien propre, même en communauté."},
 {t:"num",q:"Si M. Morin décédait demain sans testament, quelle serait la valeur de sa succession ?",a:2300000,tol:1,un:" €",h:"Sa société, plus sa moitié des biens communs.",w:"Bien propre : 2 000 000 €. Moitié des biens communs : 600 000 / 2 = 300 000 €. Succession = 2 300 000 €."},
 {t:"story",q:"Que lui réponds-tu sur son âge ?",sc:[{who:"M. Morin",txt:"J'ai 72 ans. Le pacte Dutreil, c'est encore pour moi, ou je suis trop vieux ?"}],
  o:["Le pacte reste possible, mais la réduction de 50 % est perdue après 70 ans","Le pacte est interdit au-delà de 70 ans, il faut passer par une holding","Le pacte garde la réduction de 50 % tant que la direction est transmise","Le pacte vaut seulement si vous donnez la nue-propriété avant 75 ans"],a:0,w:"Le Dutreil (75 % d'abattement) n'a pas de limite d'âge. La réduction de 50 % des droits disparaît à 70 ans."},
 {t:"num",q:"M. Morin donne la nue-propriété de toute sa société (2 000 000 €) à ses deux enfants à parts égales, avec Dutreil. Quels droits paie chaque enfant ?",a:13194,tol:1,un:" €",h:"Nue-propriété à 72 ans : 70 %. Dutreil d'abord.",w:"2 000 000 x 25 % = 500 000 €. Nue-propriété à 72 ans : 70 % = 350 000 €, soit 175 000 € par enfant. P = 75 000 €. 75 000 x 20 % - 1 806 = 13 194 €. Pas de réduction de 50 % : le donateur a plus de 70 ans et ne donne pas la pleine propriété."},
 {t:"multi",q:"Quels sont les trois outils qui réduisent la facture fiscale dans ce dossier ?",o:["Le pacte Dutreil sur les titres","Le démembrement avec réserve d'usufruit","Les abattements de 100 000 € par enfant","Une assurance-vie alimentée à 72 ans","Une donation-partage avec soulte"],a:[0,1,2],w:"Dutreil (75 % sur la valeur), démembrement (on ne donne que 70 %) et abattements de 100 000 €. L'assurance-vie à 72 ans relève du 757 B, peu avantageux ici."}
 ]}
]
}
