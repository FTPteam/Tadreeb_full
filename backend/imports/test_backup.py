import sqlite3
import tempfile
from io import StringIO
from pathlib import Path

from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import SimpleTestCase

from .management.commands.backup_db import KEEP


def rows(path):
    connection = sqlite3.connect(path)
    try:
        return [row[0] for row in connection.execute("SELECT name FROM students ORDER BY id")]
    finally:
        connection.close()


class BackupTests(SimpleTestCase):
    def setUp(self):
        self.folder = Path(tempfile.mkdtemp())
        self.db = self.folder / "live.sqlite3"
        connection = sqlite3.connect(self.db)
        connection.execute("CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT)")
        connection.execute("INSERT INTO students (name) VALUES ('سارة')")
        connection.commit()
        connection.close()
        self.backups = self.folder / "backups"

    def backup(self):
        call_command("backup_db", db=str(self.db), dir=str(self.backups), stdout=StringIO())

    def restore(self, path, **options):
        call_command("restore_db", str(path), db=str(self.db), stdout=StringIO(), **options)

    # --- NFR-08: backup ---

    def test_backup_holds_the_current_data(self):
        self.backup()
        (copy,) = self.backups.glob("db-*.sqlite3")
        self.assertEqual(rows(copy), ["سارة"])

    def test_only_the_last_14_backups_are_kept(self):
        self.backups.mkdir()
        for day in range(1, 17):
            (self.backups / f"db-2026-01-{day:02d}-020000.sqlite3").write_bytes(b"old")
        self.backup()
        kept = sorted(path.name for path in self.backups.glob("db-*.sqlite3"))
        self.assertEqual(len(kept), KEEP)
        self.assertNotIn("db-2026-01-01-020000.sqlite3", kept)

    def test_missing_database_is_reported(self):
        self.db.unlink()
        with self.assertRaises(CommandError):
            self.backup()

    # --- NFR-09: restore ---

    def test_restore_brings_back_the_backed_up_data(self):
        self.backup()
        (copy,) = self.backups.glob("db-*.sqlite3")
        connection = sqlite3.connect(self.db)
        connection.execute("DELETE FROM students")
        connection.execute("INSERT INTO students (name) VALUES ('بيانات خاطئة')")
        connection.commit()
        connection.close()

        self.restore(copy, yes=True)

        self.assertEqual(rows(self.db), ["سارة"])
        (saved,) = self.backups.glob("before-restore-*.sqlite3")
        self.assertEqual(rows(saved), ["بيانات خاطئة"])

    def test_restore_needs_confirmation(self):
        self.backup()
        (copy,) = self.backups.glob("db-*.sqlite3")
        connection = sqlite3.connect(self.db)
        connection.execute("DELETE FROM students")
        connection.commit()
        connection.close()
        with self.assertRaises(CommandError):
            self.restore(copy)
        self.assertEqual(rows(self.db), [])

    def test_restore_rejects_a_file_that_is_not_a_database(self):
        broken = self.folder / "broken.sqlite3"
        broken.write_bytes(b"this is not a database")
        with self.assertRaises(CommandError):
            self.restore(broken, yes=True)
        self.assertEqual(rows(self.db), ["سارة"])