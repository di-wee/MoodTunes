from django.urls import path
from . import views

urlpatterns = [
    path('create_playlist/', views.CreatePlaylist.as_view(), name='create-playlist'),
    path('get/', views.GetAllPlaylist.as_view(), name='get-all-playlists'),
    path('get/<int:playlist_id>/', views.GetPlaylist.as_view(), name='get-playlist'),
    path('<int:playlist_id>/add_song/', views.AddSongToPlaylist.as_view(), name='add-song-to-playlist'),
    path('delete/<int:playlist_id>/', views.DeletePlaylist.as_view(), name='delete-playlist')
]
