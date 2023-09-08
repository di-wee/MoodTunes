from django.urls import path
from . import views

urlpatterns = [
    path('', views.GetMoods.as_view(), name='get-moods'),
    path('get_songs/', views.GetSongsFromMood.as_view(), name='get-songs-from-mood')

]
