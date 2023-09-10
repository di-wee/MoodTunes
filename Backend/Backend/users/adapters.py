
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

# adapters are like 'hooks'. trying to override the default built-in adapter
# which is DefaultSocialAccountAdapter
# using this to circumvent bug where admin deleted a user, which deletes the link between
# social provider and app but didnt delete the object associated causing a valueerror
# this adapter is meant to forcefully create a user when that happens


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    # sociallogin is an instance of SocialLogin => an attempt to login/signup via social provider
    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        user.save()
        return user
