from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, NoteSerializer
from .models import Note


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([AllowAny])
def root_view(request):
    """Root endpoint providing basic project information"""
    return Response({
        "message": "Welcome to Django React WebApp API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "admin": "/admin/",
            "api_root": "/api/",
            "user_registration": "/api/user/register/",
            "token_obtain": "/api/token/",
            "token_refresh": "/api/token/refresh/",
            "notes": "/api/notes/",
        }
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root_view(request):
    """API root endpoint listing all available API endpoints"""
    return Response({
        "message": "Django React WebApp API v1.0.0",
        "authentication": {
            "register": "/api/user/register/",
            "login": "/api/token/",
            "refresh_token": "/api/token/refresh/",
        },
        "endpoints": {
            "notes_list_create": "/api/notes/",
            "notes_delete": "/api/notes/delete/{id}/",
        },
        "documentation": {
            "admin_panel": "/admin/",
            "api_auth": "/api-auth/",
        },
        "methods": {
            "GET /api/notes/": "List user's notes (requires authentication)",
            "POST /api/notes/": "Create new note (requires authentication)",
            "DELETE /api/notes/delete/{id}/": "Delete specific note (requires authentication)",
            "POST /api/user/register/": "Register new user",
            "POST /api/token/": "Obtain JWT token pair",
            "POST /api/token/refresh/": "Refresh access token",
        }
    })