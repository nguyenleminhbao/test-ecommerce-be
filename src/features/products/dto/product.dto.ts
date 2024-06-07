import { Expose } from 'class-transformer';
import { BaseDto } from 'src/common/dto/base.dto';

export class ProductDto extends BaseDto {
  @Expose()
  id: string;
  @Expose()
  shopId: string;

  @Expose()
  shopName: string;
  @Expose()
  title: string;
  @Expose()
  body_html: string;
  @Expose()
  vendor: string;
  @Expose()
  product_type: string;
  @Expose()
  created_at: string;
  @Expose()
  tags: string;
  @Expose()
  status: string;
  @Expose()
  variants: VariantDto[];
  @Expose()
  options: OptionDto[];
  @Expose()
  images: ImageDto[];
}

export class VariantDto extends BaseDto {
  @Expose()
  id: number;
  @Expose()
  product_id: number;
  @Expose()
  title: string;
  @Expose()
  price: string;
  @Expose()
  sku: string;
  @Expose()
  position: number;
  @Expose()
  created_at: string;
  @Expose()
  option1: string;
  option2?: string;
  option3?: string;
  @Expose()
  image_id: string;

  @Expose()
  variant_image: string;
}

class OptionDto {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
}

export class ImageDto extends BaseDto {
  @Expose()
  id: number;
  @Expose()
  position: number;
  @Expose()
  product_id: number;
  @Expose()
  created_at: string;
  @Expose()
  src: string;
  @Expose()
  variant_ids: string[];
}
