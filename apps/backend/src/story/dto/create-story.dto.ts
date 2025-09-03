export class CreateStoryDto {
  user: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
}
