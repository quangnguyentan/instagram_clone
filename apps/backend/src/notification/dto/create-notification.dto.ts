export class CreateNotificationDto {
  user: string; // recipient
  type: 'like' | 'comment' | 'follow' | 'mention';
  fromUser: string;
  post?: string;
}
