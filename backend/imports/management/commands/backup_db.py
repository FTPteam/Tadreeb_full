import sqlite3
from datetime import datetime
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

KEEP = 14  # NFR-08: keep the last 14 backups.
PATTERN = "db-????-??-??-??????.sqlite3"


def database_path(option):
    """The SQLite file to work on: --db, or the project's database."""
    if option:
        return Path(option)
    database = settings.DATABASES["default"]
    if database["ENGINE"] != "django.db.backends.sqlite3":
        raise CommandError("هذا الأمر يدعم SQLite فقط. مع PostgreSQL استخدم pg_dump.")
    return Path(database["NAME"])


def check_file(path):
    """Raise CommandError unless `path` is a healthy SQLite database."""
    try:
        connection = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
        try:
            result = connection.execute("PRAGMA integrity_check").fetchone()[0]
        finally:
            connection.close()
    except sqlite3.Error as error:
        raise CommandError(f"الملف {path} ليس قاعدة بيانات سليمة: {error}")
    if result != "ok":
        raise CommandError(f"فحص سلامة الملف {path} فشل: {result}")


class Command(BaseCommand):
    help = "NFR-08: take a backup of the database and keep only the last 14."

    def add_arguments(self, parser):
        parser.add_argument("--db", help="SQLite file to back up (default: the project's database).")
        parser.add_argument("--dir", help="Folder for the backups (default: backend/backups).")

    def handle(self, *args, **options):
        source = database_path(options["db"])
        if not source.exists():
            raise CommandError(f"قاعدة البيانات غير موجودة: {source}")
        folder = Path(options["dir"]) if options["dir"] else settings.BASE_DIR / "backups"
        folder.mkdir(parents=True, exist_ok=True)
        # Backups hold real data: keep the folder out of Git.
        (folder / ".gitignore").write_text("*\n")

        target = folder / f"db-{datetime.now():%Y-%m-%d-%H%M%S}.sqlite3"
        origin = sqlite3.connect(source)
        copy = sqlite3.connect(target)
        try:
            # SQLite's own backup is safe even while the site is running.
            origin.backup(copy)
        finally:
            copy.close()
            origin.close()
        try:
            check_file(target)
        except CommandError:
            target.unlink(missing_ok=True)
            raise

        for old in sorted(folder.glob(PATTERN))[:-KEEP]:
            old.unlink()
        self.stdout.write(self.style.SUCCESS(f"تم حفظ النسخة الاحتياطية: {target}"))