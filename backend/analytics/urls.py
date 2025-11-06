from django.urls import path
from .views import EventListCreateView, notes_daily_metrics


urlpatterns = [
    path("events/", EventListCreateView.as_view(), name="analytics-events"),
    path("notes/daily/", notes_daily_metrics, name="analytics-notes-daily"),
]
