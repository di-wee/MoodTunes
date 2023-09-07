from django.urls import path, include
from . import views

urlpatterns = [
    path('extract_token/', views.ExtractCode.as_view(), name='extract-token'),
    path('get_jwt/', views.GetJwtToken.as_view(), name='get-jwt'),
]
