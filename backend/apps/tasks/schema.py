import graphene
from graphene_django import DjangoObjectType

from .models import Task
from apps.projects.models import Project
from apps.accounts.schema import UserType


class TaskStatusEnum(graphene.Enum):
    BACKLOG = 'BACKLOG'
    TODO = 'TODO'
    DOING = 'DOING'
    DONE = 'DONE'


class TaskPriorityEnum(graphene.Enum):
    LOW = 'LOW'
    MEDIUM = 'MEDIUM'
    HIGH = 'HIGH'
    URGENT = 'URGENT'



class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = (
            'id',
            'title',
            'description',
            'status',
            'priority',
            'project',
            'assignee',
            'created_at',
            'updated_at',
        )
    
    status = graphene.String()
    priority = graphene.String()

    def resolve_status(self, info):
        return str(self.status)

    def resolve_priority(self, info):
        return str(self.priority)

#query 
class Query(graphene.ObjectType):
    all_tasks = graphene.List(TaskType)
    
    tasks_by_project = graphene.List(
        TaskType,
        project_id=graphene.UUID(required=True)
    )
    
    tasks_by_status = graphene.List(
        TaskType,
        status=graphene.Argument(TaskStatusEnum, required=True)
    )
    
    task = graphene.Field(TaskType, id=graphene.UUID(required=True))
    
    my_tasks = graphene.List(TaskType)
    
    def resolve_all_tasks(self, info):
        return Task.objects.select_related('project', 'assignee').all()
    
    def resolve_tasks_by_project(self, info, project_id):
        return Task.objects.filter(project_id=project_id).select_related('assignee')
    
    def resolve_tasks_by_status(self, info, status):
        return Task.objects.filter(status=status).select_related('project', 'assignee')
    
    def resolve_task(self, info, id):
        try:
            return Task.objects.select_related('project', 'assignee').get(id=id)
        except Task.DoesNotExist:
            return None
    
    def resolve_my_tasks(self, info):
        user = info.context.user
        if user.is_authenticated:
            return Task.objects.filter(assignee=user).select_related('project')
        return []

#mutations
class CreateTaskMutation(graphene.Mutation):
    class Arguments:
        project_id = graphene.UUID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        status = graphene.Argument(TaskStatusEnum)
        priority = graphene.Argument(TaskPriorityEnum)
        assignee_id = graphene.UUID()
    
    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, project_id, title, description='', 
               status=None, priority=None, assignee_id=None):
        user = info.context.user
        
        if not user.is_authenticated:
            return CreateTaskMutation(
                task=None,
                success=False,
                message='Authentication required to create a task'
            )
        
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return CreateTaskMutation(
                task=None,
                success=False,
                message='Project not found'
            )
        
        try:
            from apps.accounts.models import User
            
            assignee = None
            if assignee_id:
                try:
                    assignee = User.objects.get(id=assignee_id)
                except User.DoesNotExist:
                    pass
            
            status_val = status.value if hasattr(status, 'value') else status
            if not status_val: status_val = Task.Status.BACKLOG

            priority_val = priority.value if hasattr(priority, 'value') else priority
            if not priority_val: priority_val = Task.Priority.MEDIUM

            task = Task.objects.create(
                project=project,
                title=title,
                description=description,
                status=status_val,
                priority=priority_val,
                assignee=assignee
            )
            
            return CreateTaskMutation(
                task=task,
                success=True,
                message='Task created successfully'
            )
        except Exception as e:
            return CreateTaskMutation(
                task=None,
                success=False,
                message=f'Error creating task: {str(e)}'
            )


class UpdateTaskMutation(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.Argument(TaskStatusEnum)
        priority = graphene.Argument(TaskPriorityEnum)
        assignee_id = graphene.UUID()
    
    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id, title=None, description=None, 
               status=None, priority=None, assignee_id=None):
        user = info.context.user
        
        if not user.is_authenticated:
            return UpdateTaskMutation(
                task=None,
                success=False,
                message='Authentication required'
            )
        
        try:
            task = Task.objects.get(id=id)
        except Task.DoesNotExist:
            return UpdateTaskMutation(
                task=None,
                success=False,
                message='Task not found'
            )
        
        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if status is not None:
            task.status = status.value if hasattr(status, 'value') else status
        if priority is not None:
            task.priority = priority.value if hasattr(priority, 'value') else priority
        if assignee_id is not None:
            from apps.accounts.models import User
            try:
                task.assignee = User.objects.get(id=assignee_id)
            except User.DoesNotExist:
                task.assignee = None
        
        task.save()
        
        return UpdateTaskMutation(
            task=task,
            success=True,
            message='Task updated successfully'
        )


class DeleteTaskMutation(graphene.Mutation): 
    class Arguments:
        id = graphene.UUID(required=True)
    
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id):
        user = info.context.user
        
        if not user.is_authenticated:
            return DeleteTaskMutation(
                success=False,
                message='Authentication required'
            )
        
        try:
            task = Task.objects.get(id=id)
        except Task.DoesNotExist:
            return DeleteTaskMutation(
                success=False,
                message='Task not found'
            )
        
        task_title = task.title
        task.delete()
        
        return DeleteTaskMutation(
            success=True,
            message=f'Task "{task_title}" deleted successfully'
        )


class Mutation(graphene.ObjectType):
    create_task = CreateTaskMutation.Field()
    update_task = UpdateTaskMutation.Field()
    delete_task = DeleteTaskMutation.Field()
