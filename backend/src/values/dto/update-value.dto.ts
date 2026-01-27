import { IsString, IsOptional } from 'class-validator';

export class UpdateValueDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
