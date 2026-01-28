import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
from .models import User

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "email", "username")

class Register(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        email = graphene.String(required=True)
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, email, username, password):
        user = User.objects.create_user(
            email=email,
            username=username,
            password=password
        )
        return Register(user=user)

class Query(graphene.ObjectType):
    me = graphene.Field(UserType)

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Not authenticated")
        return user

class Mutation(graphene.ObjectType):
    register = Register.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
