// dto/create-post.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  user: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
