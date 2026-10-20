#!/usr/bin/env bash
# Construit le site et le publie dans /var/www/peyrissac (servi par nginx).
set -euo pipefail
cd "$(dirname "$0")"
npm run build
mkdir -p /var/www/peyrissac
rsync -a --delete dist/ /var/www/peyrissac/
chown -R www-data:www-data /var/www/peyrissac
echo "Publié : https://peyrissac.adriennde.com"
