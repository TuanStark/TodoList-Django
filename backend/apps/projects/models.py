"""
Project Model
"""

import uuid
from django.db import models
from django.conf import settings


class Project(models.Model):
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for this project"
    )
    
    name = models.CharField(
        max_length=200,
        help_text="Name of the project"
    )
    
    description = models.TextField(
        blank=True,
        default='',
        help_text="Detailed description of the project"
    )
    
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_projects',
        help_text="User who owns this project"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When this project was created"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="When this project was last modified"
    )
    
    class Meta:
        verbose_name = 'project'
        verbose_name_plural = 'projects'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def task_count(self):
        return self.tasks.count()
