from django.urls import path
from . import views

urlpatterns = [
    path('admin/search/', views.SpotifySongSearch.as_view(), name='spotify_search'),
]
