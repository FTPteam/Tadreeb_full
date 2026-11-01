# Deploying the backend to PythonAnywhere

Replace `USERNAME` everywhere below with your PythonAnywhere username. The site will be at `https://USERNAME.pythonanywhere.com`.

- **First time:** do steps 1–7 once (about 20 minutes).
- **Every later update:** merge into `main` on GitHub, then do [Updating](#updating) (one command).

## 1. Create the account

Sign up for a free "Beginner" account at [pythonanywhere.com](https://www.pythonanywhere.com/).

## 2. Get the code and install it

Open **Consoles → Bash** and run:

```bash
git clone https://github.com/wafaa-alhayek/Tadreeb_full.git
cd Tadreeb_full/backend
python3.13 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

The project needs Python 3.12 or newer. If `python3.13` isn't found, try `python3.12`. If neither exists, go to **Account → System image**, switch to the newest image, and try again.

## 3. Create the `.env` file

Generate a new secret key. Never reuse the one in `settings.py`, because it's public on GitHub:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Then create the file:

```bash
cp .env.example .env
nano .env
```

Fill it in like this, then save with `Ctrl+O`, `Enter`, `Ctrl+X`:

```
DJANGO_SECRET_KEY=<the key you just generated>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=USERNAME.pythonanywhere.com
DJANGO_CORS_ORIGINS=
```

Leave `DJANGO_CORS_ORIGINS` empty until the front-end is deployed (see [Connecting the front-end](#connecting-the-front-end)).

## 4. Set up the database and static files

```bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

`createsuperuser` makes the admin account for `/admin/`. The server's database is separate from everyone's local one: users and data you created locally are **not** copied.

## 5. Create the web app

Go to the **Web** tab and click **Add a new web app**:

1. Click **Next** past the domain screen.
2. Choose **Manual configuration**. Don't pick "Django", which would create a second, empty project.
3. Choose the same Python version you used for the venv, e.g. **Python 3.13**.

Then, on the web app's page, fill in:

| Section | Field | Value |
|---|---|---|
| Code | Source code | `/home/USERNAME/Tadreeb_full/backend` |
| Virtualenv | Path | `/home/USERNAME/Tadreeb_full/backend/venv` |
| Static files | URL `/static/` | Directory `/home/USERNAME/Tadreeb_full/backend/staticfiles` |
| Static files | URL `/media/` | Directory `/home/USERNAME/Tadreeb_full/backend/media` |
| Security | Force HTTPS | **Enabled** |

## 6. Point the WSGI file at the project

In the **Code** section, click the **WSGI configuration file** link. Delete everything in it and paste:

```python
import os
import sys

path = "/home/USERNAME/Tadreeb_full/backend"
if path not in sys.path:
    sys.path.insert(0, path)

os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings"

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

Click **Save**. The secret key is read from `.env`, so it doesn't go in this file.

## 7. Start it

Go back to the **Web** tab and click the green **Reload** button. Then open:

- `https://USERNAME.pythonanywhere.com/api/docs/` for the API docs (the bare address redirects here)
- `https://USERNAME.pythonanywhere.com/admin/` for the Django admin
- `https://USERNAME.pythonanywhere.com/api/health/`, which should show `{"status": "ok"}`

## Updating

After changes are merged into `main` on GitHub, open a Bash console and run:

```bash
bash ~/Tadreeb_full/backend/deploy/update.sh
```

It pulls `main`, installs new packages, runs migrations, collects static files, checks the settings, and reloads the site.

## Connecting the front-end

Once the React app is deployed (e.g. on Netlify), add its address on the server:

1. `nano ~/Tadreeb_full/backend/.env` and set, for example, `DJANGO_CORS_ORIGINS=https://tadreeb.netlify.app` (no trailing slash; separate several with commas).
2. Click **Reload** on the Web tab.

The front-end then calls `https://USERNAME.pythonanywhere.com/api/...`.

## If something goes wrong

- **Error page or "Something went wrong":** open the **error log** link on the Web tab. The last lines show the Python error.
- **`DJANGO_SECRET_KEY must be set`:** `.env` is missing or in the wrong folder. It must be at `~/Tadreeb_full/backend/.env`.
- **`DisallowedHost` / Bad Request (400):** `DJANGO_ALLOWED_HOSTS` in `.env` doesn't match the address exactly.
- **Admin or Swagger page has no styling:** run `python manage.py collectstatic --noinput` and check the `/static/` mapping in step 5.
- **Front-end gets a CORS error:** its exact address is missing from `DJANGO_CORS_ORIGINS`.
- **Site disabled after a month:** free web apps must be renewed. Click **Run until 1 month from today** on the Web tab.

## Backups and restore (NFR-08, NFR-09)

The database is one file (`db.sqlite3`), so a backup is a safe copy of it. Run from `backend` with the venv active:

```bash
python manage.py backup_db
```

It saves `backups/db-YYYY-MM-DD-HHMMSS.sqlite3` and deletes the oldest ones, so only the last 14 stay. The `backups` folder ignores itself in Git, so real data is never pushed.

### Every day, automatically

On the PythonAnywhere **Tasks** tab, add a daily task (for example at 02:00) with this command, replacing `USERNAME`:

```bash
cd /home/USERNAME/Tadreeb_full/backend && venv/bin/python manage.py backup_db
```

The backups live on the same server as the database. Every now and then, download the newest one from the **Files** tab and keep it somewhere else.

### Restoring

1. Pick the backup file in `backups/`.
2. Run:

```bash
python manage.py restore_db backups/db-YYYY-MM-DD-HHMMSS.sqlite3 --yes
```

The data that was there is saved first as `backups/before-restore-....sqlite3`. Without `--yes` the command refuses, so a typo can't erase data.

3. Click **Reload** on the Web tab.

Both commands work with SQLite only. If the project moves to PostgreSQL, use `pg_dump` and `pg_restore` instead.

### Restore test before the final demo (NFR-09)

Do this once, on a copy of the project, not on the live data:

1. `python manage.py backup_db`
2. Change something (for example add a student in `/admin/`).
3. `python manage.py restore_db <the backup file> --yes`
4. Check that the change is gone and the old data is back.

Date of the last restore test: ____