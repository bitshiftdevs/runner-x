import { gql } from "graphql-request";

export const JOIN_WAITLIST = gql`
  mutation JoinWaitlist($email: String!, $platform: WaitlistPlatform!) {
    joinWaitlist(email: $email, platform: $platform)
  }
`;

export type WaitlistPlatform = "web" | "ios" | "android";

export type JoinWaitlistData = { joinWaitlist: boolean };
