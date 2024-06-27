import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateShopAvatarDto {
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
