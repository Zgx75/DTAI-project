from datasets import load_dataset

dataset = load_dataset("ibrahimdaud/raw-food-recognition")

print(dataset)
print(dataset["train"].features)

for column_name, feature in dataset["train"].features.items():
    print("欄位名稱：", column_name)
    print("欄位內容：", feature)
    print()