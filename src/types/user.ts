export type UserRole = "requester" | "runner" | "both";

export type Profile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  photoUrl: string | null;
  bio: string | null;
  role: UserRole;
  studentIdUrl: string | null;
  studentIdVerified: boolean;
  campus: string;
  rating: number;
  totalJobs: number;
  createdAt: string;
};
