// dto/create-post.dto.ts
import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export class CreatePostDto {
  @IsString()
  user: string;

  @IsOptional()
  @IsString()
  caption?: string;
}
