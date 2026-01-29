import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
const httpLink = createHttpLink({
    uri: import.meta.env.VITE_API_URL || '/graphql/',
});
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('jira-mini-token');

    return {
        headers: {
            ...headers,
            authorization: token ? `JWT ${token}` : '',
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),

    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    allProjects: {
                        merge(existing = [], incoming) {
                            return incoming;
                        },
                    },
                },
            },
        },
    }),

    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
});

export default client;

export const setAuthToken = (token) => {
    localStorage.setItem('jira-mini-token', token);
};

export const getAuthToken = () => {
    return localStorage.getItem('jira-mini-token');
};

export const removeAuthToken = () => {
    localStorage.removeItem('jira-mini-token');
};
