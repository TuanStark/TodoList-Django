# Mini Jira Clone

A Fresher-level portfolio project demonstrating a full-stack application with Django, GraphQL, and React.

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Python 3.12+, Django 5.x |
| **API** | GraphQL (graphene-django) |
| **Authentication** | JWT (django-graphql-jwt) |
| **Database** | PostgreSQL (Dockerized) |
| **Frontend** | React.js (Vite) + Apollo Client |

## 📁 Project Structure

```
jira-mini/
├── backend/                    # Django backend
│   ├── apps/
│   │   ├── accounts/          # User management
│   │   ├── projects/          # Project CRUD
│   │   └── tasks/             # Task management
│   ├── config/
│   │   ├── settings/          # Split settings
│   │   ├── schema.py          # Central GraphQL schema
│   │   └── urls.py
│   └── requirements.txt
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── graphql/           # GraphQL queries
│   │   └── lib/               # Apollo client
│   └── package.json
├── docker-compose.yml          # PostgreSQL + pgAdmin
└── README.md
```

## 🏃 Quick Start

### 1. Start the Database

```bash
# Start PostgreSQL and pgAdmin
docker-compose up -d
```

- **PostgreSQL**: `localhost:5432`
- **pgAdmin**: `http://localhost:5050` (admin@jiramini.local / admin123)

### 2. Set Up the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser (optional)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

- **GraphQL Playground**: `http://localhost:8000/graphql/`
- **Django Admin**: `http://localhost:8000/admin/`

### 3. Set Up the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

- **Frontend**: `http://localhost:5173`

## 📡 GraphQL API

### Queries

```graphql
# Get current user
query { me { id email fullName } }

# Get all projects
query { allProjects { id name taskCount } }

# Get tasks by project
query { tasksByProject(projectId: "uuid") { id title status } }
```

### Mutations

```graphql
# Register user
mutation {
  createUser(email: "user@example.com", password: "password123") {
    success message
  }
}

# Login
mutation {
  tokenAuth(email: "user@example.com", password: "password123") {
    token
  }
}

# Create project (requires auth)
mutation {
  createProject(name: "My Project", description: "Description") {
    project { id name }
    success
  }
}

# Create task
mutation {
  createTask(
    projectId: "project-uuid"
    title: "My Task"
    status: TODO
    priority: HIGH
  ) {
    task { id title }
    success
  }
}
```

## 🔐 Authentication

Use JWT tokens for authenticated requests:

1. Get token via `tokenAuth` mutation
2. Add header: `Authorization: JWT <token>`

## 📊 Database Schema

```
User (Custom - Email as username)
├── id (UUID)
├── email (unique)
├── first_name, last_name
└── is_active, is_staff, date_joined

Project
├── id (UUID)
├── name, description
├── owner (FK → User)
└── created_at, updated_at

Task
├── id (UUID)
├── title, description
├── status (BACKLOG, TODO, DOING, DONE)
├── priority (LOW, MEDIUM, HIGH, URGENT)
├── project (FK → Project)
├── assignee (FK → User, optional)
└── created_at, updated_at
```

## 👨‍💻 Development

### Environment Configuration

The Django settings are split into:
- `base.py` - Common settings
- `local.py` - Development (DEBUG=True)
- `production.py` - Production (DEBUG=False)

### Database Credentials (Development)

```
Host: localhost
Port: 5432
Database: jira_mini
User: jira_admin
Password: jira_secret_2024
```
