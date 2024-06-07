import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsNumber()
  variantId: number;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  shopId: string;

  @IsNotEmpty()
  @IsString()
  shopName: string;
}
