import torch.nn as nn
from torchvision import models


def create_resnet50(num_classes=90, pretrained=False):
    model = models.resnet50(weights=None)

    in_features = model.fc.in_features
    model.fc = nn.Linear(in_features, num_classes)

    return model