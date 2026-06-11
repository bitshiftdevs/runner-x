import type { Profile } from "@/types";

export type AuthResult = {
  success: boolean;
  message: string;
  userId?: string;
};

export abstract class AuthService {
  abstract sendOtp(phone: string): Promise<AuthResult>;
  abstract verifyOtp(phone: string, code: string): Promise<AuthResult>;
  abstract signOut(): Promise<void>;
  abstract getCurrentUser(): Promise<Profile | null>;
  abstract updateProfile(
    userId: string,
    data: Partial<Profile>,
  ): Promise<Profile>;
}
