import { IsNumber, IsString } from 'class-validator';

export class CallbackDto {
  @IsString()
  mac: string;

  @IsNumber()
  type: number; // 1: Order - 2: Agreement

  @IsString()
  data: string;
}
