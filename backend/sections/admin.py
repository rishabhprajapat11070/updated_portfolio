from django.contrib import admin
from .models import Section

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ("title", "section_type", "order", "is_visible", "updated_at")
    list_editable = ("order", "is_visible")
    list_filter = ("section_type", "is_visible")
    search_fields = ("title",)