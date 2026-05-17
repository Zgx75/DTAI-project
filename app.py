import streamlit as st
from PIL import Image

from predict_combined import load_all_models, predict_combined
from db import init_db, add_item, get_inventory


st.title("冰箱食材庫存自動管理 Demo")

init_db()


@st.cache_resource
def get_models():
    return load_all_models()

raw_food_model, meat_classifier = get_models()

uploaded_file = st.file_uploader(
    "上傳食材照片",
    type=["jpg", "jpeg", "png"]
)

if uploaded_file is not None:
    image = Image.open(uploaded_file).convert("RGB")
    st.image(image, caption="上傳的食材照片", width=300)

    temp_path = "temp_upload.jpg"
    image.save(temp_path)

    result = predict_combined(temp_path, raw_food_model, meat_classifier)

    st.write("預測結果：", result["class_name"])

    if "class_index" in result:
        st.write("類別編號：", result["class_index"])

    st.write("信心分數：", round(result["confidence"], 4))

    if "source" in result:
        st.write("使用模型：", result["source"])

    if st.button("確認加入庫存"):
        add_item(result["class_name"], result["confidence"])
        st.success(f"已加入庫存：{result['class_name']}")


st.subheader("目前庫存")

rows = get_inventory()

if rows:
    st.table(
        [
            {
                "食材": item_name,
                "數量": quantity,
                "最後加入時間": last_added_at
            }
            for item_name, quantity, last_added_at in rows
        ]
    )
else:
    st.write("目前沒有庫存資料")