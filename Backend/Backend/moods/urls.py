from django.urls import path
from . import views

urlpatterns = [
    path('', views.GetMoods.as_view(), name='get-moods'),
    path('submoods/<int:mood_id>/', views.GetSubMoods.as_view(), name='get-submoods-from-moods')
]
