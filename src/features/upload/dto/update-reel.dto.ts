import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateReelDto {
  @IsNotEmpty()
  @IsString()
  reelId: string;

  @IsNotEmpty()
  @IsString()
  idVideoOld: string;

  @IsNotEmpty()
  @IsString()
  newVideoUrl: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
