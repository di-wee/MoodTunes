from django.db import models
import uuid
from users.models import CustomUser


class UserTempToken(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    temp_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
