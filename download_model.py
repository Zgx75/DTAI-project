from huggingface_hub import hf_hub_download

repo_id = "ibrahimdaud/raw-food-recognition-models"

model_path = hf_hub_download(
    repo_id=repo_id,
    filename="resnet50_pytorch_model.bin"
)

print("模型已下載到：", model_path)