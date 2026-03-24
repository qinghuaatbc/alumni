import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUrl,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  author: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  isbn?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  cover?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  totalCopies?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  publishYear?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  publisher?: string;

  @IsOptional()
  @IsString()
  readUrl?: string;

  @IsOptional()
  @IsString()
  downloadUrl?: string;
}
