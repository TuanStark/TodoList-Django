import graphene
from graphene_django import DjangoObjectType

from .models import Project
from apps.accounts.schema import UserType


class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        fields = (
            'id',
            'name',
            'description',
            'owner',
            'created_at',
            'updated_at',
            'tasks',
        )
    
    task_count = graphene.Int()
    
    def resolve_task_count(self, info):

        return self.task_count



# QUERIES
class Query(graphene.ObjectType):
    all_projects = graphene.List(ProjectType)
    
    my_projects = graphene.List(ProjectType)
    
    project = graphene.Field(ProjectType, id=graphene.UUID(required=True))
    
    def resolve_all_projects(self, info):
        return Project.objects.all()
    
    def resolve_my_projects(self, info):
        user = info.context.user
        if user.is_authenticated:
            return Project.objects.filter(owner=user)
        return []
    
    def resolve_project(self, info, id):
        try:
            return Project.objects.get(id=id)
        except Project.DoesNotExist:
            return None



# MUTATIONS
class CreateProjectMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String()
    
    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, name, description=''):
        user = info.context.user
        
        if not user.is_authenticated:
            return CreateProjectMutation(
                project=None,
                success=False,
                message='Authentication required to create a project'
            )
        
        try:
            project = Project.objects.create(
                name=name,
                description=description,
                owner=user
            )
            
            return CreateProjectMutation(
                project=project,
                success=True,
                message='Project created successfully'
            )
        except Exception as e:
            return CreateProjectMutation(
                project=None,
                success=False,
                message=f'Error creating project: {str(e)}'
            )


class UpdateProjectMutation(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        name = graphene.String()
        description = graphene.String()
    
    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id, name=None, description=None):
        user = info.context.user
        
        if not user.is_authenticated:
            return UpdateProjectMutation(
                project=None,
                success=False,
                message='Authentication required'
            )
        
        try:
            project = Project.objects.get(id=id)
        except Project.DoesNotExist:
            return UpdateProjectMutation(
                project=None,
                success=False,
                message='Project not found'
            )
        
        if project.owner != user:
            return UpdateProjectMutation(
                project=None,
                success=False,
                message='You do not have permission to update this project'
            )
        
        if name is not None:
            project.name = name
        if description is not None:
            project.description = description
        
        project.save()
        
        return UpdateProjectMutation(
            project=project,
            success=True,
            message='Project updated successfully'
        )


class DeleteProjectMutation(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
    
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id):
        user = info.context.user
        
        if not user.is_authenticated:
            return DeleteProjectMutation(
                success=False,
                message='Authentication required'
            )
        
        try:
            project = Project.objects.get(id=id)
        except Project.DoesNotExist:
            return DeleteProjectMutation(
                success=False,
                message='Project not found'
            )
        
        if project.owner != user:
            return DeleteProjectMutation(
                success=False,
                message='You do not have permission to delete this project'
            )
        
        project_name = project.name
        project.delete()
        
        return DeleteProjectMutation(
            success=True,
            message=f'Project "{project_name}" deleted successfully'
        )


class Mutation(graphene.ObjectType):
    create_project = CreateProjectMutation.Field()
    update_project = UpdateProjectMutation.Field()
    delete_project = DeleteProjectMutation.Field()
