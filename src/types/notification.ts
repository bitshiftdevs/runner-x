export type AppNotification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type: "job_update" | "message" | "rating" | "system";
};
