import graphene

from apps.accounts.schema import Query as AccountsQuery, Mutation as AccountsMutation
from apps.projects.schema import Query as ProjectsQuery, Mutation as ProjectsMutation


class Query(
    AccountsQuery,
    ProjectsQuery,
    graphene.ObjectType
):
    pass


class Mutation(
    AccountsMutation,
    ProjectsMutation,
    graphene.ObjectType
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
