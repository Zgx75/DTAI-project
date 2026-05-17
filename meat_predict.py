from transformers import pipeline


MEAT_LABELS = [
    "raw chicken meat",
    "raw pork meat",
    "raw beef meat",
    "raw fish",
    "not meat"
]


def load_meat_classifier():
    classifier = pipeline(
        task="zero-shot-image-classification",
        model="openai/clip-vit-large-patch14"
    )
    return classifier


def predict_meat(image_path, classifier):
    results = classifier(
        image_path,
        candidate_labels=MEAT_LABELS
    )

    top_result = results[0]

    label = top_result["label"]
    score = float(top_result["score"])

    label_map = {
        "raw chicken meat": "chicken",
        "raw pork meat": "pork",
        "raw beef meat": "beef",
        "raw fish": "fish",
        "not meat": "not_meat"
    }

    return {
        "class_name": label_map[label],
        "raw_label": label,
        "confidence": score,
        "all_results": results
    }


if __name__ == "__main__":
    classifier = load_meat_classifier()

    result = predict_meat("test_images/meat.jpg", classifier)

    print("肉類預測結果：", result["class_name"])
    print("原始標籤：", result["raw_label"])
    print("信心分數：", round(result["confidence"], 4))

    print("\n全部結果：")
    for item in result["all_results"]:
        print(item["label"], round(item["score"], 4))