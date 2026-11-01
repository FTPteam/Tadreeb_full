import shutil
import sqlite3
from datetime import datetime
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from .backup_db import check_file, database_path


class Command(BaseCommand):
    help = "NFR-09: restore the database from a backup (the current one is saved first)."

    def add_arguments(self, parser):
        parser.add_argument("backup", help="Path of the backup file, e.g. backups/db-2026-10-30-020000.sqlite3")
        parser.add_argument("--yes", action="store_true", help="Confirm that the current data will be replaced.")
        parser.add_argument("--db", help="SQLite file to restore into (default: the project's database).")

    def handle(self, *args, **options):
        backup = Path(options["backup"])
        if not backup.exists():
            raise CommandError(f"ملف النسخة الاحتياطية غير موجود: {backup}")
        check_file(backup)
        if not options["yes"]:
            raise CommandError("الاسترجاع بيستبدل البيانات الحالية. أعد الأمر مع --yes للتأكيد.")

        destination = database_path(options["db"])
        if destination.exists():
            # Keep the current data too, in case the restore was a mistake.
            safety = backup.parent / f"before-restore-{datetime.now():%Y-%m-%d-%H%M%S}.sqlite3"
            shutil.copy2(destination, safety)
            self.stdout.write(f"نسخة من البيانات الحالية قبل الاسترجاع: {safety}")

        origin = sqlite3.connect(f"file:{backup}?mode=ro", uri=True)
        target = sqlite3.connect(destination)
        try:
            origin.backup(target)
        finally:
            target.close()
            origin.close()
        self.stdout.write(self.style.SUCCESS(f"تم الاسترجاع من: {backup}"))