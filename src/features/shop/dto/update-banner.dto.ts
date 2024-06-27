import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateBannerDto {
  @IsNotEmpty()
  @IsNumber()
  numOfBanner: number; // 0 , 1, 2

  @IsNotEmpty()
  @IsString()
  idImageOld: string;

  @IsNotEmpty()
  @IsString()
  newImageUrl: string;

  @IsNotEmpty()
  @IsString()
  shopId: string;
}
