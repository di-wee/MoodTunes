from django.urls import path
from . import views

urlpatterns = [
    path('', views.GetMoods.as_view(), name='get-moods'),

]
