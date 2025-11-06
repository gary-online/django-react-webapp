from datetime import timedelta
from django.utils import timezone
from django.db.models.functions import TruncDate
from django.db.models import Count
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Event
from .serializers import EventSerializer
from api.models import Note


class EventListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EventSerializer

    def get_queryset(self):
        return Event.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def notes_daily_metrics(request):
    """Return counts of Notes created per day for the last 14 days for the current user.

    This demonstrates the analytics pipeline using existing data without requiring
    new domain models yet.
    """
    user = request.user
    today = timezone.now().date()
    start_date = today - timedelta(days=13)  # inclusive range of 14 days

    qs = (
        Note.objects.filter(author=user, created_at__date__gte=start_date, created_at__date__lte=today)
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(count=Count("id"))
        .order_by("day")
    )

    # Normalize to ensure every day is present
    counts_by_day = {row["day"].isoformat(): row["count"] for row in qs}
    series = []
    for i in range(14):
        d = (start_date + timedelta(days=i)).isoformat()
        series.append({"date": d, "count": counts_by_day.get(d, 0)})

    return Response({
        "start_date": start_date.isoformat(),
        "end_date": today.isoformat(),
        "series": series,
    })
