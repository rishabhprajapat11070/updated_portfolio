import uuid
from PIL import Image
from django.core.files.storage import default_storage
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

EXT = {"JPEG": "jpg", "PNG": "png", "WEBP": "webp", "GIF": "gif"}
MAX_SIZE = 5 * 1024 * 1024  # 5 MB


class ImageUploadView(APIView):
    permission_classes = [IsAdminUser]   # sirf logged-in admin
    parser_classes = [MultiPartParser]

    def post(self, request):
        f = request.FILES.get("file")
        if not f:
            return Response({"detail": "File nahi mili."}, status=400)
        if f.size > MAX_SIZE:
            return Response({"detail": "Image 5MB se chhoti honi chahiye."}, status=400)
        try:
            img = Image.open(f)
            fmt = img.format
            img.verify()          # asli image hai ya nahi
        except Exception:
            return Response({"detail": "Ye valid image nahi hai."}, status=400)
        if fmt not in EXT:
            return Response({"detail": "Sirf JPG, PNG, WEBP ya GIF."}, status=400)
        f.seek(0)
        name = default_storage.save(f"uploads/{uuid.uuid4().hex}.{EXT[fmt]}", f)
        url = request.build_absolute_uri(default_storage.url(name))
        return Response({"url": url}, status=201)