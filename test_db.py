from db import init_db, add_item, get_inventory

init_db()

add_item("tomato", 0.9541)

rows = get_inventory()

for row in rows:
    print(row)