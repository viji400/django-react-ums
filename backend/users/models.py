from django.db import models

class User(models.Model):
    """
    Represents a User in the system.
    """
    user_id = models.CharField(max_length=10, unique=True, primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    title = models.CharField(max_length=100)

    # This is the key field for the manager relationship.
    # A manager is also a User, so we link to 'self'.
    # 'null=True' means a user can have no manager (e.g., a CEO).
    # 'on_delete=models.SET_NULL' means if a manager is deleted,
    # their subordinates' 'manager' field will be set to Null, 
    # not deleted.
    manager = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='subordinates'
    )

    def __str__(self):
        return f"{self.name} ({self.user_id})"

    class Meta:
        ordering = ['name'] # Order users alphabetically by name