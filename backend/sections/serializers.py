from rest_framework import serializers

from .models import Section

SAFE_PREFIXES = ("http://", "https://", "mailto:", "tel:", "#", "/")


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = [
            "id", "title", "slug", "section_type", "body",
            "items", "order", "is_visible", "updated_at",
        ]
        read_only_fields = ["slug", "order", "updated_at"]

    def validate_items(self, value):
        if not isinstance(value, list) or len(value) > 30:
            raise serializers.ValidationError("Items ek list honi chahiye (max 30).")

        clean = []
        for it in value:
            if not isinstance(it, dict):
                raise serializers.ValidationError("Har item ek object hona chahiye.")

            link = str(it.get("link", "")).strip()[:300]
            # javascript: jaise links block karne ke liye (XSS)
            if link and (
                not link.lower().startswith(SAFE_PREFIXES) or link.startswith("//")
            ):
                raise serializers.ValidationError(
                    "Link http(s)://, mailto:, tel: ya # se shuru hona chahiye."
                )

            tags = it.get("tags", [])
            if not isinstance(tags, list):
                raise serializers.ValidationError("Tags ek list honi chahiye.")

            clean.append(
                {
                    "title": str(it.get("title", "")).strip()[:120],
                    "text": str(it.get("text", "")).strip()[:600],
                    "link": link,
                    "tags": [str(t).strip()[:40] for t in tags if str(t).strip()][:15],
                }
            )
        return clean