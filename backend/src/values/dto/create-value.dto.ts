import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateValueDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
