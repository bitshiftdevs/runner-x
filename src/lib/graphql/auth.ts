import { gql } from "graphql-request";

/** GraphQL operation documents for the auth surface. */

export const SIGN_IN_WITH_GOOGLE = gql`
  mutation SignInWithGoogle($idToken: String!) {
    signInWithGoogle(idToken: $idToken) {
      accessToken
      refreshToken
      profile {
        ...ProfileFields
      }
    }
  }

  fragment ProfileFields on Profile {
    id
    email
    fullName
    avatarUrl
    isAdmin
    studentIdStatus
    defaultCampus
    phoneNumber
    rating
    banned
    createdAt
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      profile {
        id
        email
        fullName
        avatarUrl
        isAdmin
        studentIdStatus
        defaultCampus
        phoneNumber
        rating
        banned
        createdAt
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      fullName
      avatarUrl
      isAdmin
      studentIdStatus
      defaultCampus
      phoneNumber
      rating
      banned
      createdAt
    }
  }
`;

export type VerificationStatus = "pending" | "approved" | "rejected";

export type BackendProfile = {
  id: string;
  email: string | null;
  fullName: string;
  avatarUrl: string | null;
  isAdmin: boolean;
  studentIdStatus: VerificationStatus;
  defaultCampus: string | null;
  phoneNumber: string | null;
  rating: number;
  banned: boolean;
  createdAt: string;
};

export type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  profile: BackendProfile;
};

export type SignInWithGoogleData = { signInWithGoogle: AuthPayload };
export type RefreshTokenData = { refreshToken: AuthPayload };
export type MeQueryData = { me: BackendProfile | null };
