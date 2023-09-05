from django.urls import path
from . import views

urlpatterns = [
    path('play/', views.Play.as_view(), name='play'),
    path('pause/', views.Pause.as_view(), name='pause'),
    path('previous_track/', views.Previous.as_view(), name='previous-track'),
    path('next_track/', views.Next.as_view(), name='next-track'),
]
