from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'status', 'priority', 'assignee', 'created_at')
    list_filter = ('status', 'priority', 'project', 'created_at')
    search_fields = ('title', 'description', 'project__name', 'assignee__email')
    ordering = ('-created_at',)
    readonly_fields = ('id', 'created_at', 'updated_at')
    
    list_editable = ('status', 'priority')
    fieldsets = (
        (None, {'fields': ('id', 'title', 'description')}),
        ('Classification', {'fields': ('status', 'priority')}),
        ('Relationships', {'fields': ('project', 'assignee')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
