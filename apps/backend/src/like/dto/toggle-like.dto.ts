export class ToggleLikeDto {
  targetType: 'post' | 'comment' | 'reel' | 'story';
  targetId: string;
  userId: string;
}
