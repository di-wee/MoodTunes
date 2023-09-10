
from .models import UserTempToken

from django.dispatch import receiver
from allauth.socialaccount.signals import social_account_updated


# to receive the signals when a social account is updated (logged in) to create the temp token
# to exchange for jwt token

@receiver(social_account_updated)
def generate_temp_token(sender, request, sociallogin, **kwargs):
    user = sociallogin.user
    temp_token, created = UserTempToken.objects.get_or_create(user=user)

