import graphene

from apps.accounts.schema import Query as AccountsQuery, Mutation as AccountsMutation
from apps.projects.schema import Query as ProjectsQuery, Mutation as ProjectsMutation
from apps.tasks.schema import Query as TasksQuery, Mutation as TasksMutation


class Query(
    AccountsQuery,
    ProjectsQuery,
    TasksQuery,
    graphene.ObjectType
):
    pass


class Mutation(
    AccountsMutation,
    ProjectsMutation,
    TasksMutation,
    graphene.ObjectType
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
