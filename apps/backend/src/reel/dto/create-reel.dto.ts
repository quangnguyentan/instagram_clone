import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReelDto {
  @IsOptional()
  @IsString()
  @MaxLength(2200)
  caption?: string;
}
