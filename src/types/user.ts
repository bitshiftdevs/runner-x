export type UserRole = "requester" | "runner" | "both" | "admin";

export type Profile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  photoUrl: string | null;
  bio: string | null;
  role: UserRole;
  isAdmin: boolean;
  studentIdUrl: string | null;
  studentIdVerified: boolean;
  campus: string;
  rating: number;
  totalJobs: number;
  createdAt: string;
};
