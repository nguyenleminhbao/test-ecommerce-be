import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  accountNumber;

  @IsNotEmpty()
  @IsString()
  bank;
}
