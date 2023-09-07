from django.apps import AppConfig


class TempTokensConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'temp_tokens'

    def ready(self):
        import temp_tokens.signals
