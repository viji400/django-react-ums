from django.urls import path
from .views import UserListView

urlpatterns = [
    # This makes your API available at /api/users/
    path('users/', UserListView.as_view(), name='user-list'),
]