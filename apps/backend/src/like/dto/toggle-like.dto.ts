import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';

export class ToggleLikeDto {
  @IsEnum(['post', 'comment', 'reel', 'story'])
  targetType: 'post' | 'comment' | 'reel' | 'story';

  @IsMongoId()
  targetId: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
