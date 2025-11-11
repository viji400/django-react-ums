from rest_framework import generics
from .models import User
from .serializers import UserSerializer

class UserListView(generics.ListAPIView):
    """
    API view to retrieve a list of all users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer