export type NotificationPayload = {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
};

export abstract class NotificationService {
  abstract send(payload: NotificationPayload): Promise<boolean>;
  abstract sendBulk(payloads: NotificationPayload[]): Promise<boolean>;
}
