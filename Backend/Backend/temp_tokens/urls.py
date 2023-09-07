from django.urls import path
from . import views

urlpatterns = [
    path('get_jwt/', views.ExchangeTempTokenForJWT.as_view(), name='get-jwt'),
    path('get_temp_code/', views.GetTempTokenByIdentifier.as_view(), name='get-temp-code'),
]
