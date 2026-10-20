#!/usr/bin/env bash
# Construit l'application (site + administration) et redémarre le service.
set -euo pipefail
cd "$(dirname "$0")"
npm ci
npm run build
systemctl restart peyrissac
echo "Publié : site, /admin et /api (port 3012)"
