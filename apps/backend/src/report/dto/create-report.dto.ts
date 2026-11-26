import { IsIn, IsMongoId, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateReportDto {
  @IsIn(['user', 'post', 'reel', 'story', 'comment'])
  targetType: 'user' | 'post' | 'reel' | 'story' | 'comment';

  @IsMongoId()
  targetId: string;

  @IsString()
  @MinLength(5)
  @MaxLength(1000)
  reason: string;
}
