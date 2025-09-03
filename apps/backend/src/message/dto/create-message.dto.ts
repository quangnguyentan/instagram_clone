export class CreateMessageDto {
  chatId: string;
  sender: string;
  content?: string;
  mediaUrl?: string;
}
