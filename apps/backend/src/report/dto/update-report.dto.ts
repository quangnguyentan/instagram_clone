import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateReportDto {
  @IsIn(['reviewed', 'dismissed'])
  status: 'reviewed' | 'dismissed';

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminNote?: string;
}
