from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import LoginView, SectionViewSet

router = DefaultRouter()
router.register("sections", SectionViewSet, basename="section")

urlpatterns = [
    path("auth/login/", LoginView.as_view()),
    path("", include(router.urls)),
]