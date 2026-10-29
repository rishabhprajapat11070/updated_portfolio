from rest_framework import viewsets
from .models import Post
from .permission import IsStaffOrReadOnly
from .serializers import PostSerializer


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsStaffOrReadOnly]

    def get_queryset(self):
        qs = Post.objects.all()
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return qs                      # admin ko drafts bhi dikhen
        return qs.filter(is_published=True)  # public ko sirf published
