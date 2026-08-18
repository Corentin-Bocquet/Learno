# Learno

Jeu de revision facon Duolingo, en un seul fichier HTML, avec progression synchronisee sur un serveur.

**En ligne :** https://corentin-bocquet.github.io/Learno/

## Contenu

9 cours, 132 unites, 1529 exercices.

| Cours | Sujet |
|---|---|
| MRC | Risque de credit |
| Banque | Economie bancaire |
| Style | Style masculin |
| Humour | Raconter et faire rire |
| Poker | No Limit Hold'em, debutant a expert |
| Dames | Jeu de dames international |
| YouTube | De 0 a 100 000 abonnes |
| Risque | Analyste risque en banque |
| Nietzsche | Penser avec un marteau |

## Synchronisation

La progression vit d'abord dans le localStorage du navigateur. Avec un compte, elle est
aussi poussee sur Supabase (Postgres), ce qui permet de reprendre sur n'importe quel appareil.

- Authentification : email et mot de passe (Supabase Auth)
- Stockage : table `learno_state`, une ligne par utilisateur, colonne `data` en JSONB
- Isolation : Row Level Security, chaque utilisateur ne peut lire et ecrire que sa propre ligne
- Hors ligne : si le serveur est injoignable, l'application fonctionne normalement en local

La cle publique `anon` presente dans le HTML est faite pour etre exposee cote navigateur.
Aucune cle secrete ni `service_role` n'est presente dans ce depot.

## Sauvegarde locale

Export et import d'un fichier `.json` depuis le profil, en complement du serveur.
