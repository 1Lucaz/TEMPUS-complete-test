#!/bin/sh
set -e

echo "──────────────────────────────────────────"
echo "  Rodando migrations (Alembic)..."
echo "──────────────────────────────────────────"
cd /app/back-end
alembic upgrade head

echo "──────────────────────────────────────────"
echo "  Iniciando nginx + uvicorn (supervisord)"
echo "──────────────────────────────────────────"
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/app.conf
