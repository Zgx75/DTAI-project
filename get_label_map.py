from datasets import load_dataset
import json

dataset = load_dataset("ibrahimdaud/raw-food-recognition")

label_map = {}

for item in dataset["train"]:
    label_id = item["label_id"]
    label = item["label"]

    label_map[label_id] = label

# 依照 label_id 排序
label_map = dict(sorted(label_map.items()))

print("類別數量：", len(label_map))

for label_id, label in label_map.items():
    print(label_id, "=>", label)

# 存成 json，之後 predict.py 可以直接讀
with open("label_map.json", "w", encoding="utf-8") as f:
    json.dump(label_map, f, ensure_ascii=False, indent=2)

print("已儲存 label_map.json")