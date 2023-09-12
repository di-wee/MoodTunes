from django.urls import path
from . import views

urlpatterns = [
    path('play/', views.PlayTrack.as_view(), name='play'),
    path('play_playlist/',views.PlaySongFromPlaylist.as_view(), name='play-songs-from-playlist'),
    path('pause/', views.Pause.as_view(), name='pause'),
    path('previous_track/', views.Previous.as_view(), name='previous-track'),
    path('next_track/', views.Next.as_view(), name='next-track'),
    path('spotify_token/', views.GetSpotifyToken.as_view(), name='get-spotify-token'),
]
