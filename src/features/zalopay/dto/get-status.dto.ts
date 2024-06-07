import { IsNotEmpty, IsString } from 'class-validator';

export class GetStatusOrderDto {
  @IsNotEmpty()
  @IsString()
  app_trans_id: string;
}
