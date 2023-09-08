from django.urls import path
from . import views

urlpatterns = [
    path('refresh_token/', views.RefreshSpotifyToken.as_view(), name='refresh-token'),
    path('get_token/', views.GetSpotifyToken.as_view(), name='get-token'),
    path('', views.GetUserDetails.as_view(), name='get-user-details'),


]
