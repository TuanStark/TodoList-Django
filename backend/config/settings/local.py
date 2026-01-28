from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'jira_mini',
        'USER': 'jira_admin',
        'PASSWORD': 'jira_secret_2024',
        'HOST': '127.0.0.1',
        'PORT': '5433',
    }
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True

GRAPHENE['GRAPHIQL'] = True
