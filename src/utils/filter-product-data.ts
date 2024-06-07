import { IProduct } from 'src/common/interfaces/product.interface';
import {
  ImageDto,
  ProductDto,
  VariantDto,
} from 'src/features/products/dto/product.dto';

export const filterDataProduct = (products: IProduct[]) => {
  const listProduct = products.map((product) => {
    return {
      ...product,
      variants: product.variants.map((variant) =>
        VariantDto.plainToClass(variant),
      ),
      images: product.images.map((image) => ImageDto.plainToClass(image)),
    };
  });

  return ProductDto.plainToClass(listProduct);
};
