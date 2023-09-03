from django.urls import path
from . import views

urlpatterns = [
    path('permissions/', views.GetRoles.as_view(), name='get-roles')
]
