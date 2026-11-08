#!/bin/bash
# Starts the backend on the Taqat hosting (used by the Procfile and nixpacks.toml).
# Apply migrations, collect admin/Swagger CSS, then run the web server on $PORT.
set -e
cd "$(dirname "$0")"
# Nixpacks installs the packages in /opt/venv.
if [ -d /opt/venv/bin ]; then
    export PATH="/opt/venv/bin:$PATH"
fi
python manage.py migrate --noinput
python manage.py collectstatic --noinput
exec gunicorn config.wsgi --bind "0.0.0.0:${PORT:-8000}" --workers 2 --timeout 120 --access-logfile - --error-logfile -
