from django.db import models
from django.db.models import Max
from django.utils.text import slugify


class Section(models.Model):
    TYPES = [
        ("text", "Text block"),
        ("cards", "Cards"),
        ("tags", "Tag groups"),
        ("links", "Links"),
    ]

    title = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    section_type = models.CharField(max_length=10, choices=TYPES, default="text")
    body = models.TextField(blank=True)  # text type ke liye
    items = models.JSONField(default=list, blank=True)  # cards / tags / links ke liye
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title) or "section"
            slug, n = base, 2
            while Section.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        if self.pk is None and self.order == 0:
            self.order = (Section.objects.aggregate(m=Max("order"))["m"] or 0) + 1
        super().save(*args, **kwargs)