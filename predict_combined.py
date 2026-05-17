from predict import load_model, predict_image
from meat_predict import load_meat_classifier, predict_meat


MEAT_CONFIDENCE_THRESHOLD = 0.45


def load_all_models():
    raw_food_model = load_model()
    meat_classifier = load_meat_classifier()

    return raw_food_model, meat_classifier


def predict_combined(image_path, raw_food_model, meat_classifier):
    meat_result = predict_meat(image_path, meat_classifier)

    if (
        meat_result["class_name"] != "not_meat"
        and meat_result["confidence"] >= MEAT_CONFIDENCE_THRESHOLD
    ):
        return {
            "class_name": meat_result["class_name"],
            "confidence": meat_result["confidence"],
            "source": "meat_clip_model"
        }

    raw_result = predict_image(image_path, raw_food_model)

    return {
        "class_name": raw_result["class_name"],
        "confidence": raw_result["confidence"],
        "source": "raw_food_model"
    }


if __name__ == "__main__":
    raw_food_model, meat_classifier = load_all_models()

    result = predict_combined(
        "test_images/meat.jpg",
        raw_food_model,
        meat_classifier
    )

    print("最終預測結果：", result["class_name"])
    print("信心分數：", round(result["confidence"], 4))
    print("使用模型：", result["source"])