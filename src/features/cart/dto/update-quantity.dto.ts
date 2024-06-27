import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateQuantityDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  variantId: number;
}
