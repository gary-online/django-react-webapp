from django.db import models
from django.contrib.auth.models import User


class Event(models.Model):
    """Generic analytics event.

    Stores user-scoped events to power dashboards and experimentation.
    """

    name = models.CharField(max_length=100)
    properties = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="events")

    class Meta:
        indexes = [
            models.Index(fields=["user", "created_at"]),
            models.Index(fields=["name", "created_at"]),
        ]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} @ {self.created_at.isoformat()}"
