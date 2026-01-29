from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'task_count', 'created_at', 'updated_at')
    list_filter = ('created_at', 'owner')
    search_fields = ('name', 'description', 'owner__email')
    ordering = ('-created_at',)
    readonly_fields = ('id', 'created_at', 'updated_at', 'task_count')

    fieldsets = (
        (None, {'fields': ('id', 'name', 'description')}),
        ('Ownership', {'fields': ('owner',)}),
        ('Statistics', {'fields': ('task_count',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    def task_count(self, obj):
        return obj.task_count
    task_count.short_description = 'Tasks'
