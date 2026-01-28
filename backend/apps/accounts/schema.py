import graphene
from graphene_django import DjangoObjectType
import graphql_jwt

from .models import User


# GRAPHQL TYPES


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'is_active',
            'date_joined',
        )
    
    full_name = graphene.String()
    
    def resolve_full_name(self, info):
        return self.get_full_name()


# QUERIES
class Query(graphene.ObjectType):
    me = graphene.Field(UserType)
    
    users = graphene.List(UserType)
    
    user = graphene.Field(UserType, id=graphene.UUID(required=True))
    
    def resolve_me(self, info):
        user = info.context.user
        if user.is_authenticated:
            return user
        return None
    
    def resolve_users(self, info):
        return User.objects.all()
    
    def resolve_user(self, info, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None

# MUTATIONS

class CreateUserMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        first_name = graphene.String()
        last_name = graphene.String()
    
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, email, password, first_name='', last_name=''):
        if User.objects.filter(email=email).exists():
            return CreateUserMutation(
                user=None,
                success=False,
                message='A user with this email already exists'
            )
        
        try:
            user = User.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            return CreateUserMutation(
                user=user,
                success=True,
                message='User created successfully'
            )
        except Exception as e:
            return CreateUserMutation(
                user=None,
                success=False,
                message=f'Error creating user: {str(e)}'
            )


class Mutation(graphene.ObjectType):
    create_user = CreateUserMutation.Field()
    
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
