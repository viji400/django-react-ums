from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'user_id', 'title', 'email', 'manager')
    search_fields = ('name', 'email', 'user_id')
    list_filter = ('title',)

    # This helps with selecting a manager from a large list
    raw_id_fields = ('manager',)