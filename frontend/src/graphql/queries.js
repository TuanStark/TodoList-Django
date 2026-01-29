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
