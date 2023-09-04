from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.CreatePlaylist.as_view(), name='create-playlist'),
    path('get/', views.GetAllPlaylist.as_view(), name='get-all-playlists'),
    path('get/<int:playlist_id>/', views.GetAllPlaylist.as_view(), name='get-playlist')
]
