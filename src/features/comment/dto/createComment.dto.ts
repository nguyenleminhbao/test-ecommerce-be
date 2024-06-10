import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  numOfStar: number;

  @IsOptional()
  optionProduct: string;

  @IsOptional()
  imageUrls: string[];

  @IsNotEmpty()
  // typeComment: TYPE_COMMENT;
  typeComment: string;

  @IsNotEmpty()
  etag: string | number; // id of reel, feed, product
}
