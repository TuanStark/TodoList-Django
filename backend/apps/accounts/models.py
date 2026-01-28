import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for this user"
    )
    
    email = models.EmailField(
        unique=True,
        max_length=255,
        help_text="User's email address (used for login)"
    )
    
    first_name = models.CharField(
        max_length=150,
        blank=True,
        help_text="User's first name"
    )
    
    last_name = models.CharField(
        max_length=150,
        blank=True,
        help_text="User's last name"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Designates whether this user account is active"
    )
    
    is_staff = models.BooleanField(
        default=False,
        help_text="Designates whether this user can access the admin site"
    )
    
    date_joined = models.DateTimeField(
        default=timezone.now,
        help_text="When this user account was created"
    )
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
        ordering = ['-date_joined']
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name if full_name else self.email
    
    def get_short_name(self):
        return self.first_name if self.first_name else self.email.split('@')[0]
