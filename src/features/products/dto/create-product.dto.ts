import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body_html: string;

  @IsOptional()
  @IsString()
  handle: string;

  @IsNotEmpty()
  @IsArray()
  images: [
    {
      id?: string;
      product_id?: string;
      src: string;
    },
  ];

  @IsNotEmpty()
  @IsArray()
  options: [
    {
      id?: string;
      product_id?: string;
      name: string;
      values: string[];
    },
  ];

  @IsString()
  @IsOptional()
  product_type: string;

  @IsOptional()
  @IsString()
  tags: string;

  @IsOptional()
  @IsString()
  vendor: string;

  @IsOptional()
  @IsArray()
  variants: [
    {
      compare_at_price?: number;
      price: number;
      title?: string;
    },
  ];
}
