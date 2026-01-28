import uuid
from django.db import models
from django.conf import settings

from apps.projects.models import Project


class Task(models.Model):
    class Status(models.TextChoices):
        BACKLOG = 'BACKLOG', 'Backlog'
        TODO = 'TODO', 'To Do'
        DOING = 'DOING', 'Doing'
        DONE = 'DONE', 'Done'
    
    class Priority(models.TextChoices):
        LOW = 'LOW', 'Low'
        MEDIUM = 'MEDIUM', 'Medium'
        HIGH = 'HIGH', 'High'
        URGENT = 'URGENT', 'Urgent'
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for this task"
    )
    
    title = models.CharField(
        max_length=300,
        help_text="Title of the task"
    )
    
    description = models.TextField(
        blank=True,
        default='',
        help_text="Detailed description of the task"
    )
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.BACKLOG,
        help_text="Current status of the task"
    )
    
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM,
        help_text="Priority level of the task"
    )
    
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='tasks',
        help_text="Project this task belongs to"
    )
    
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='assigned_tasks',
        null=True,
        blank=True,
        help_text="User assigned to this task"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When this task was created"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="When this task was last modified"
    )
    
    class Meta:
        verbose_name = 'task'
        verbose_name_plural = 'tasks'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.status})"
