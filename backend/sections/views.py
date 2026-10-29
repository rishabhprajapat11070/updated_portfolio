from django.db import transaction
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import action
from rest_framework.permissions import SAFE_METHODS, BasePermission
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.viewsets import ModelViewSet

from .models import Section
from .serializers import SectionSerializer


def is_staff(user):
    return bool(user and user.is_authenticated and user.is_staff)


class IsStaffOrReadOnly(BasePermission):
    """Padhna sabke liye, likhna sirf staff (admin) ke liye."""

    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or is_staff(request.user)


class SectionViewSet(ModelViewSet):
    serializer_class = SectionSerializer
    permission_classes = [IsStaffOrReadOnly]

    def get_queryset(self):
        qs = Section.objects.all()
        # Visitors ko sirf visible sections; admin ko sab
        if not is_staff(self.request.user):
            qs = qs.filter(is_visible=True)
        return qs

    @action(detail=False, methods=["post"])
    def reorder(self, request):
        ids = request.data.get("ids")
        if not isinstance(ids, list) or not all(isinstance(i, int) for i in ids):
            return Response({"detail": "ids integers ki list honi chahiye."}, status=400)
        with transaction.atomic():
            for position, pk in enumerate(ids, start=1):
                Section.objects.filter(pk=pk).update(order=position)
        return Response({"ok": True})


class LoginView(ObtainAuthToken):
    # Brute-force se bachne ke liye rate limit (settings mein "login" rate set hai)
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"