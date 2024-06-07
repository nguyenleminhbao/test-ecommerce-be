import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateQuantityDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  variantId: number;
}
