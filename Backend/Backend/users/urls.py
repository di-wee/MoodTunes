from django.urls import path
from . import views

urlpatterns = [

    path('', views.GetUserDetails.as_view(), name='get-user-details'),


]
