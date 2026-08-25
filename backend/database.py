import sqlite3
from pathlib import Path


# =====================================================
# DATABASE PATH
# =====================================================

BASE_DIR = Path(__file__).resolve().parent

DATABASE_FILE = BASE_DIR / "bookings.db"


# =====================================================
# DATABASE CONNECTION
# =====================================================

def get_connection():
    connection = sqlite3.connect(
        DATABASE_FILE
    )

    connection.row_factory = sqlite3.Row

    return connection


# =====================================================
# CREATE TABLE
# =====================================================

def create_table():

    connection = get_connection()

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS bookings (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            phone TEXT NOT NULL,

            date TEXT NOT NULL,

            time TEXT NOT NULL,

            guests INTEGER NOT NULL,

            status TEXT NOT NULL DEFAULT 'pending'

        )
        """
    )

    connection.commit()

    connection.close()