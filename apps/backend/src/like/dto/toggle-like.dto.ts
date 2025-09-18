import { IsEnum, IsMongoId, IsString } from 'class-validator';

export class ToggleLikeDto {
  @IsEnum(['post', 'comment', 'reel', 'story'])
  targetType: 'post' | 'comment' | 'reel' | 'story';

  @IsMongoId()
  targetId: string;

  @IsString()
  userId: string;
}
