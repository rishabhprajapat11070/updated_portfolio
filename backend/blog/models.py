from django.db import models
from django.utils.text import slugify


class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    excerpt = models.CharField(max_length=300)
    content = models.TextField(help_text="Markdown: # heading, ## subheading, - list")
    cover = models.URLField(blank=True, help_text="Cover image ka URL (optional)")
    tags = models.JSONField(default=list, blank=True, help_text='Example: ["Python", "FastAPI"]')
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]  # latest post pehle

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Slug khali ho to title se auto bana do (duplicate ho to -1, -2 lagao)
        if not self.slug:
            base = slugify(self.title) or "post"
            slug, n = base, 1
            while Post.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)