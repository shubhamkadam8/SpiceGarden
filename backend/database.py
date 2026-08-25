import sqlite3
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent

DATABASE_FILE = BASE_DIR / "bookings.db"


def get_connection():

    connection = sqlite3.connect(
        DATABASE_FILE
    )

    connection.row_factory = sqlite3.Row

    return connection


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

    # Check old database
    columns = connection.execute(
        "PRAGMA table_info(bookings)"
    ).fetchall()

    column_names = [
        column["name"]
        for column in columns
    ]

    # Add status if old database doesn't have it
    if "status" not in column_names:

        connection.execute(
            """
            ALTER TABLE bookings
            ADD COLUMN status TEXT
            DEFAULT 'pending'
            """
        )

    connection.commit()

    connection.close()