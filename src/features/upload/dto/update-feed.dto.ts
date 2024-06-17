import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFeedDto {
  @IsNotEmpty()
  @IsString()
  feedId: string;

  @IsNotEmpty()
  @IsString()
  idImageOld: string;

  @IsNotEmpty()
  @IsString()
  newImageUrl: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
