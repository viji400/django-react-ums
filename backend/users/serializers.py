from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    """
    # We want to show the manager's name, not just their ID.
    # 'source' points to the 'name' field on the 'manager' object.
    # 'read_only=True' means we don't need to provide it when creating/updating.
    manager_name = serializers.CharField(source='manager.name', read_only=True, default=None)

    class Meta:
        model = User
        # List all fields you want to expose in your API
        fields = [
            'user_id', 
            'name', 
            'email', 
            'title', 
            'manager',  # This will be the manager's user_id (the PK)
            'manager_name' # This is the new field we added
        ]
        # Use user_id as the lookup field instead of the default 'id'
        lookup_field = 'user_id'