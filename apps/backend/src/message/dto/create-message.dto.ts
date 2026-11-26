import { IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsMongoId()
  chatId: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  content?: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;
}
