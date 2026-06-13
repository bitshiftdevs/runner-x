export type Message = {
  id: string;
  jobId: string;
  senderId: string;
  content: string;
  imageUrl: string | null;
  isSystem: boolean;
  createdAt: string;
};
