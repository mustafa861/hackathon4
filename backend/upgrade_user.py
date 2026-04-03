import sqlite3
conn = sqlite3.connect("course_companion.db")
conn.execute("UPDATE users SET tier='pro' WHERE user_id='test_user_1'")
conn.commit()
result = conn.execute("SELECT user_id, tier FROM users WHERE user_id='test_user_1'").fetchone()
print(f"User: {result[0]}, Tier: {result[1]}")
conn.close()
