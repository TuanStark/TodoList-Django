import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      firstName
      lastName
      fullName
      isActive
      dateJoined
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      firstName
      lastName
      fullName
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser(
    $email: String!
    $password: String!
    $firstName: String
    $lastName: String
  ) {
    createUser(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
    ) {
      user {
        id
        email
        firstName
        lastName
      }
      success
      message
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      token
      payload
      refreshExpiresIn
    }
  }
`;

export const VERIFY_TOKEN = gql`
  mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      token
      payload
      refreshExpiresIn
    }
  }
`;

export const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    allProjects {
      id
      name
      description
      taskCount
      createdAt
      updatedAt
      owner {
        id
        email
        fullName
      }
    }
  }
`;


export const GET_MY_PROJECTS = gql`
  query GetMyProjects {
    myProjects {
      id
      name
      description
      taskCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: UUID!) {
    project(id: $id) {
      id
      name
      description
      taskCount
      createdAt
      updatedAt
      owner {
        id
        email
        fullName
      }
      tasks {
        id
        title
        status
        priority
        assignee {
          id
          email
          fullName
        }
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($name: String!, $description: String) {
    createProject(name: $name, description: $description) {
      project {
        id
        name
        description
        createdAt
      }
      success
      message
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: UUID!, $name: String, $description: String) {
    updateProject(id: $id, name: $name, description: $description) {
      project {
        id
        name
        description
        updatedAt
      }
      success
      message
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: UUID!) {
    deleteProject(id: $id) {
      success
      message
    }
  }
`;