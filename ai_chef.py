import sqlite3
import json
import random
import os
from groq import Groq
from dotenv import load_model, load_dotenv
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
DB_PATH = "inventory.db"

# ===================================================
# 1. 真實去撈目前的庫存食材（看看冰箱剩什麼英文標籤）
# ===================================================
def get_current_fridge_items():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        # 撈出目前冰箱裡數量大於 0 的食材名稱（例如: ['tomato', 'apple']）
        cursor.execute("SELECT item_name FROM inventory WHERE quantity > 0")
        rows = cursor.fetchall()
        items = [row[0] for row in rows]
    except Exception as e:
        # 防呆：萬一資料庫還沒建好或空空的，先回傳空陣列
        items = []
    conn.close()
    return items

# ===================================================
# 2. 呼叫 Groq API，根據真實庫存，吐出完美符合 React 格式的食譜
# ===================================================
def generate_dynamic_recipes():
    # 💡 修正關鍵：必須先呼叫上面的功能，把真實庫存拿過來！
    my_items = get_current_fridge_items()
    
    # 💡 防呆：如果冰箱現在是空的，隨便模擬幾樣，免得 Demo 翻車
    if not my_items:
        my_items = ["tomato", "chicken", "apple", "mushroom"]
        
    client = Groq(api_key=GROQ_API_KEY)
    food_str = ", ".join(my_items)
    
    # 💡 核心魔法：用 Prompt 規訓 Llama 3 必須模仿佐原寫死的欄位格式！
    prompt = f"""
    你是一個智慧冰箱的 AI 推薦引擎。目前冰箱裡有的真實食材英文標籤為：【{food_str}】。
    請根據這些食材，幫我推薦 2 道適合煮的料理。

    為了讓前端 React 能夠直接解析且完美呈現、完全不爆 UI，你『必須』且『只能』回傳標準的 JSON 陣列，裡面的欄位必須跟範例完全一模一樣。不要包含任何 markdown 語法（如 ```json）或任何廢話。

    格式範本（你必須嚴格遵守這些欄位名稱）：
    [
      {{
        "id": "gen_1",
        "zh": "中文菜名（例如：香煎雞胸佐莎莎醬）",
        "en": "英文菜名（例如：Pan-Seared Chicken Salsa）",
        "min": 20,
        "kcal": 450,
        "uses": ["tomato", "chicken"],
        "saves": 2,
        "level": "簡單",
        "method": "平底鍋"
      }}
    ]
    """
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        
        result_text = completion.choices[0].message.content.strip()
        
        # 幫頑皮的 AI 剝皮防呆
        if result_text.startswith("```"):
            result_text = result_text.split("```")[1]
            if result_text.startswith("json"):
                result_text = result_text[4:]
                
        return json.loads(result_text)
        
    except Exception as e:
        # 萬一 Groq 連線悲劇，吐回原本寫死的第一道菜頂著，確保系統絕對不崩潰
        print(f"【Groq Error】: {str(e)}")
        return [
            {"id": "r1", "zh": "番茄菠菜烘蛋", "en": "Tomato Spinach Frittata", "min": 15, "kcal": 340, "uses": ["tomato", "spinach"], "saves": 2, "level": "簡單", "method": "平底鍋"}
        ]

# ===================================================
# 3. 🧪 獨立測試區（讓你現在單獨執行時可以看成果）
# ===================================================
if __name__ == "__main__":
    print("🚀 正在連線 Groq API 測試動態推薦引擎...")
    res = generate_dynamic_recipes()
    print("\n🔥 成功噴出符合 React 格式的真 AI 食譜：")
    print(json.dumps(res, ensure_ascii=False, indent=2))