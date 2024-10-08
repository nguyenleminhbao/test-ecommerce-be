import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IShopCart } from 'src/common/interfaces/cart.interface';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsNotEmpty()
  @IsArray()
  shopCart: IShopCart[];

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
