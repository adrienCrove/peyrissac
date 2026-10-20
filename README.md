# Peyrissac — site vitrine

Site statique construit avec Vite + React + Motion, d'après les maquettes `PAG_P_Maquettes WEB`.

- Développement : `npm run dev`
- Vérification : `npm run lint` puis `npm run build`
- Publication : `./deploy.sh` (build + copie dans `/var/www/peyrissac`, servi par nginx sur https://peyrissac.adriennde.com)

Le site n'est pas référencé (robots.txt, meta noindex, en-tête X-Robots-Tag).

Pages : accueil (carte puis bandeau), archives, listes, culture et commerce, interviews (tableau et fiche), informations.
Les formulaires (liste, newsletter) ouvrent un e-mail préparé vers info.ci@peyrissac.com : il n'y a pas de serveur.
