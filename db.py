import sqlite3
from datetime import datetime

DB_PATH = "inventory.db"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Check if old schema exists
    cursor.execute("PRAGMA table_info(inventory)")
    old_schema = cursor.fetchall()
    has_old_schema = any(col[1] == 'item_name' for col in old_schema) and not any(col[1] == 'id' for col in old_schema)

    if has_old_schema:
        # Migrate old schema to new one
        cursor.execute("""
        CREATE TABLE inventory_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_name TEXT NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            added_at TEXT NOT NULL,
            expiry_date TEXT,
            location TEXT
        )
        """)
        # Copy old data
        cursor.execute("""
        INSERT INTO inventory_new (item_name, quantity, added_at, expiry_date, location)
        SELECT item_name, quantity, last_added_at, expiry_date, location FROM inventory
        """)
        cursor.execute("DROP TABLE inventory")
        cursor.execute("ALTER TABLE inventory_new RENAME TO inventory")
    else:
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_name TEXT NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            added_at TEXT NOT NULL,
            expiry_date TEXT,
            location TEXT
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


def add_item(item_name, confidence, expiry_date=None, location=None, quantity=1):
    now = datetime.now().isoformat(timespec="seconds")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO inventory (item_name, quantity, added_at, expiry_date, location)
    VALUES (?, ?, ?, ?, ?)
    """, (item_name, quantity, now, expiry_date, location))

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
    SELECT id, item_name, quantity, added_at, expiry_date, location
    FROM inventory
    ORDER BY expiry_date ASC NULLS LAST, added_at DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    return rows