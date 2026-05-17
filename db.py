import sqlite3
from datetime import datetime

DB_PATH = "inventory.db"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS inventory (
        item_name TEXT PRIMARY KEY,
        quantity INTEGER NOT NULL DEFAULT 0,
        last_added_at TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS inventory_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        action TEXT NOT NULL,
        confidence REAL,
        created_at TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()


def add_item(item_name, confidence):
    now = datetime.now().isoformat(timespec="seconds")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO inventory (item_name, quantity, last_added_at)
    VALUES (?, 1, ?)
    ON CONFLICT(item_name)
    DO UPDATE SET
        quantity = quantity + 1,
        last_added_at = excluded.last_added_at
    """, (item_name, now))

    cursor.execute("""
    INSERT INTO inventory_logs (item_name, action, confidence, created_at)
    VALUES (?, 'add', ?, ?)
    """, (item_name, confidence, now))

    conn.commit()
    conn.close()


def get_inventory():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    SELECT item_name, quantity, last_added_at
    FROM inventory
    ORDER BY item_name
    """)

    rows = cursor.fetchall()
    conn.close()

    return rows