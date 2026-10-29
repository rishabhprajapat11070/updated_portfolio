from django.urls import path

from backend.views import users

app_name = "api"

urlpatterns = [
    path("users/", users, name="users"),
]
