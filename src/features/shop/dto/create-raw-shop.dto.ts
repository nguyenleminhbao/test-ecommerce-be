import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateRawShopDto {
  @IsNotEmpty()
  @IsString()
  shopifyTokenApi: string;

  @IsNotEmpty()
  @IsString()
  shopifyKeyApi: string;

  @IsNotEmpty()
  @IsString()
  shopifySecretKeyApi: string;

  @IsNotEmpty()
  @IsString()
  urlStore: string;

  @IsNotEmpty()
  @IsString()
  shopName: string;

  @IsOptional()
  @IsString()
  hostVersion;
}
