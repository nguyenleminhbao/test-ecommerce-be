import { IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  body_html: string;
}
