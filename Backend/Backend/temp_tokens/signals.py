# signals.py
from .models import UserTempToken
from allauth.socialaccount.signals import pre_social_login
from django.dispatch import receiver


@receiver(pre_social_login)
def generate_temp_token(sender, request, sociallogin, **kwargs):
    user = sociallogin.user
    temp_token, created = UserTempToken.objects.get_or_create(user=user)

