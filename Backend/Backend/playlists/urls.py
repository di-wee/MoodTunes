from django.urls import path
from . import views

urlpatterns = [
    path('create_playlist/', views.CreatePlaylist.as_view(), name='create-playlist'),
    path('get/', views.GetAllPlaylist.as_view(), name='get-all-playlists'),
    path('get/<int:playlist_id>/', views.GetPlaylist.as_view(), name='get-playlist'),
    path('<int:playlist_id>/add_song/', views.AddSongToPlaylist.as_view(), name='add-song-to-playlist'),
    path('delete/<int:playlist_id>/', views.DeletePlaylist.as_view(), name='delete-playlist'),
    path('<int:playlist_id>/get_songs/', views.GetSongsFromPlaylist.as_view(), name='get-songs-from-playlist'),
    path('<int:playlist_id>/delete_song/', views.DeleteSongFromPlaylist.as_view(), name='delete-song-from-playlist'),
    path('<int:playlist_id>/update/', views.EditPlaylistName.as_view(), name='edit-playlist-name')
]
