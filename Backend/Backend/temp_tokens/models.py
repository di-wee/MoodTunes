from django.db import models
import uuid
from django.contrib.auth.models import User


class UserTempToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    temp_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
