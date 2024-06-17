import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedDto {
  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  shopId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
