import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReelDto {
  @IsString()
  @IsNotEmpty()
  video: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  shopId: string;
}
