# Peyrissac — site et administration (Next.js + Payload CMS)

Une seule application Next.js 16 sert tout, sur le port **3012** :

| URL | Contenu |
|---|---|
| `/`, `/archives`, `/listes`, `/culture-et-commerce`, `/interviews`, `/informations` | le site vitrine (ancien projet Vite, porté ici) |
| `/admin` | l'administration Payload CMS (interface en français) |
| `/api` | l'API REST de Payload, lue par le site |

- Payload CMS 3.91, React 19, éditeur Lexical, animations `motion`
- Base **PostgreSQL** (pas MongoDB)
- Code du site : `src/site/` (composants, pages, données de secours) et `src/app/(frontend)/` (routes, CSS)
- Code de l'administration : `src/collections`, `src/globals`, `src/app/(payload)`
- Collections : Familles, Interviews, Archives, Media, Users. Global : Informations
- Site non référencé : `noindex` dans les métadonnées et `robots.txt` en `Disallow: /`

## Prérequis sur le serveur

| Outil | Version | Remarque |
|---|---|---|
| Node.js | ≥ 20.18.1 (testé en 22) | |
| npm | celui de Node | le projet utilise `package-lock.json` et `.npmrc` (`legacy-peer-deps`), **pas pnpm** |
| PostgreSQL | 14+ | |
| nginx + certbot | | pour le HTTPS |
| RAM | ≥ 2 Go libres au build | le build utilise jusqu'à 8 Go de heap : ajouter du swap si le serveur est petit |

## Déploiement pas à pas

```bash
cd /root
git clone https://github.com/adrienCrove/peyrissac.git
cd peyrissac
```

### 1. Base de données PostgreSQL

```bash
sudo -u postgres psql <<'SQL'
CREATE USER peyrissac WITH PASSWORD 'CHOISIR_UN_MOT_DE_PASSE';
CREATE DATABASE peyrissac OWNER peyrissac;
SQL
```

Éviter les caractères `@ : / # ?` dans le mot de passe, sinon il faut l'encoder dans l'URL.

### 2. Variables d'environnement

```bash
cp .env.example .env
nano .env
```

Le `.env.example` est incomplet pour ce projet. Le `.env` doit contenir :

```
DATABASE_URL=postgres://peyrissac:MOT_DE_PASSE@127.0.0.1:5432/peyrissac
PAYLOAD_SECRET=<chaîne aléatoire : openssl rand -hex 32>
NEXT_PUBLIC_SERVER_URL=https://VOTRE-DOMAINE
PORT=3012
```

Points d'attention :
- `NEXT_PUBLIC_SERVER_URL` doit être l'URL publique **exacte** (https, sans slash final). Elle sert aux listes CORS/CSRF : une valeur fausse donne des erreurs de connexion à l'admin. Elle est lue **au build** : après modification, refaire le build.
- Si les données sont restaurées depuis l'ancien serveur (voir plus bas), garder le **même** `PAYLOAD_SECRET`, sinon les sessions et mots de passe ne seront pas valides.

### 3. Installation et build

```bash
npm ci
npm run build
```

`npm ci` (et non `npm install`) pour reproduire exactement les versions du lockfile.

### 4. Données : deux options

**A. Repartir de zéro** (nouveau site vide)

Le schéma est créé par les migrations Payload :

```bash
npm run payload migrate
```

Puis créer le premier administrateur en ouvrant `/admin` dans le navigateur, et au besoin importer le contenu d'origine du site :

```bash
npm run seed   # sans effet si des familles existent déjà
```

Le seed lit `src/site/data/*.js` et `public/images`.

**B. Restaurer le contenu existant** (recommandé pour retrouver le site à l'identique)

Le dossier [restore/](restore/) contient :
- `contenu.sql` : le contenu éditorial (familles, interviews, archives, informations, media). Il ne contient **ni comptes, ni mots de passe, ni sessions** : le dépôt est public.
- `media.tgz` : les images envoyées via l'admin.

Procédure, dans cet ordre :

```bash
cd /root/peyrissac
npm run payload migrate                       # crée le schéma (obligatoire avant le SQL)
set -a; . ./.env; set +a                      # charge DATABASE_URL
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f restore/contenu.sql
tar xzf restore/media.tgz                     # recrée le dossier media/
```

Puis ouvrir `/admin` et **créer le compte administrateur** s'il n'existe pas déjà (les comptes ne sont pas dans le dump).

Remarques :
- `contenu.sql` **remplace** tout le contenu existant ; les utilisateurs ne sont pas touchés. Il peut être rejoué sans risque.
- Lancer `migrate` avant, sinon `relation ... does not exist`.
- `media/` doit appartenir à l'utilisateur qui lance le service ; les noms de fichiers doivent rester identiques à ceux de la base.

### 5. Service systemd

`/etc/systemd/system/peyrissac.service` :

```ini
[Unit]
Description=Peyrissac - administration (Payload CMS)
After=network.target postgresql.service

[Service]
WorkingDirectory=/root/peyrissac
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Adapter `WorkingDirectory` si le dépôt n'est pas dans `/root`, et vérifier le chemin de npm avec `which npm`.

```bash
systemctl daemon-reload
systemctl enable --now peyrissac
systemctl status peyrissac
curl -I http://127.0.0.1:3012/admin     # doit répondre 200 ou 302
```

### 6. nginx

Tout le domaine est proxifié vers l'application. Bloc `server` minimal (remplacer le domaine) :

```nginx
server {
    server_name VOTRE-DOMAINE;
    include /root/peyrissac/nginx.conf;   # ou coller le contenu de nginx.conf ici
}
```

Puis le HTTPS et le rechargement :

```bash
certbot --nginx -d VOTRE-DOMAINE
nginx -t && systemctl reload nginx
```

`client_max_body_size 30m` est nécessaire pour l'envoi d'images volumineuses. Ne pas servir un ancien `dist/` statique devant l'application : il n'y en a plus.

### 7. Vérifications

```bash
curl -I https://VOTRE-DOMAINE/                       # 200
curl -s https://VOTRE-DOMAINE/api/familles | head -c 200   # du JSON
curl -I https://VOTRE-DOMAINE/admin                  # 200
```

## Mises à jour ultérieures

```bash
git pull
./deploy.sh        # npm ci + npm run build + systemctl restart peyrissac
```

Si le schéma a changé (nouvelles collections ou champs) : `npm run payload migrate:create` en local, commiter le fichier dans `src/migrations/`, puis `npm run payload migrate` sur le serveur avant le redémarrage.

## Erreurs fréquentes

| Symptôme | Cause / remède |
|---|---|
| `ECONNREFUSED 127.0.0.1:5432` ou `password authentication failed` | PostgreSQL arrêté ou `DATABASE_URL` erronée ; tester avec `psql "$DATABASE_URL"` |
| Build tué (`Killed`, code 137) | manque de mémoire : ajouter du swap |
| `ERESOLVE` à l'installation | utiliser `npm ci` et ne pas supprimer `.npmrc` |
| Connexion à `/admin` refusée / erreur CSRF | `NEXT_PUBLIC_SERVER_URL` ne correspond pas à l'URL réellement utilisée ; corriger puis **rebuild** |
| `/admin` ou `/api` renvoient une 404 nginx | nginx sert encore un ancien dossier statique au lieu de proxifier vers 3012 |
| 502 Bad Gateway | le service ne tourne pas : `journalctl -u peyrissac -n 50` |
| Images cassées | dossier `media/` non copié (ou mauvais propriétaire/droits) |
| `relation ... does not exist` | migrations non appliquées : `npm run payload migrate` (option A) |
| Page blanche sur `/admin` après mise à jour | oublier `npm run build` avant le redémarrage |

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | développement sur http://localhost:3000 (le port 3012 est réservé à `npm start`) |
| `npm run build` | build de production |
| `npm start` | serveur de production, port 3012 |
| `npm run seed` | import initial des contenus du site |
| `npm run payload migrate` | applique les migrations |
| `npm run generate:types` | régénère `src/payload-types.ts` |
