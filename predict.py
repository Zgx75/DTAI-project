import torch
import json
from PIL import Image
from torchvision import transforms
from huggingface_hub import hf_hub_download

from models.resnet50 import create_resnet50


REPO_ID = "ibrahimdaud/raw-food-recognition-models"
MODEL_FILE = "resnet50_pytorch_model.bin"

with open("label_map.json", "r", encoding="utf-8") as f:
    LABEL_MAP = json.load(f)
    
CLASS_NAMES = {
    int(label_id): label
    for label_id, label in LABEL_MAP.items()
}


def load_model():
    model_path = hf_hub_download(
        repo_id=REPO_ID,
        filename=MODEL_FILE
    )

    checkpoint = torch.load(model_path, map_location="cpu")

    model = create_resnet50(num_classes=90, pretrained=False)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()

    return model


def predict_image(image_path, model):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])

    image = Image.open(image_path).convert("RGB")
    image_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        logits = model(image_tensor)
        probs = torch.softmax(logits, dim=1)

        confidence, pred_idx = torch.max(probs, dim=1)

    pred_idx = pred_idx.item()
    confidence = confidence.item()

    return {
        "class_index": pred_idx,
        "class_name": CLASS_NAMES[pred_idx],
        "confidence": confidence
    }


if __name__ == "__main__":
    model = load_model()

    result = predict_image("test_images/tomato.jpg", model)

    print("預測結果：", result["class_name"])
    print("類別編號：", result["class_index"])
    print("信心分數：", round(result["confidence"], 4))