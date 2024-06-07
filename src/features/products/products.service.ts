import { IProduct } from './../../common/interfaces/product.interface';
import { getKeyShop } from './../../utils/get-key-shop';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ShopifyService } from 'src/shopify/shopify.service';
import { SHOPIFY_OBJECT } from 'src/common/enum/shopify-object.enum';
import { RedisService } from 'src/redis/redis.service';
import { filterDataProduct } from 'src/utils/filter-product-data';
import { IShop } from 'src/common/interfaces/shop.interface';

@Injectable()
export class ProductsService {
  private products: IProduct[];

  constructor(
    private readonly shopifyService: ShopifyService,
    private readonly redisService: RedisService,
  ) {
    // check database cache products exist

    // error constructor run one time
    const checkProductInCache = async () => {
      const products = await this.redisService.getValueDatabase('products');
      if (products) this.products = JSON.parse(products);
      else {
        // set cache product again
        this.products = await this.updateProductCache();
      }
    };
    checkProductInCache();
  }

  async updateProductCache() {
    // get all key of shop in redis
    const shopKeys = await this.redisService.getKeys('shop:*');

    let listProduct = [];
    await Promise.all(
      shopKeys.map(async (shopKey) => {
        const key = getKeyShop(shopKey);
        const subProducts: {
          products: IProduct[];
        } = await this.shopifyService.getAllData(key, SHOPIFY_OBJECT.PRODUCT);

        // get shop information
        const shop = JSON.parse(
          await this.redisService.getValue(`shop:${key}`),
        ) as IShop;

        // add shopId into every product
        const newSubProducts = subProducts?.products?.map((product) => {
          return {
            ...product,
            shopId: key,
            shopName: shop.shopName,
            variants: product.variants.map((variant) => {
              const image = product.images.find(
                (image) => image.id == variant.image_id,
              );
              return {
                ...variant,
                variant_image: image?.src ?? '',
              };
            }),
          };
        });

        listProduct.push(newSubProducts);
      }),
    );

    this.redisService.setValueDatabase(
      'products',
      JSON.stringify(filterDataProduct(listProduct.flat())),
      2 * 24 * 60 * 60,
    );

    return filterDataProduct(listProduct.flat() as IProduct[]);
  }

  async getAllProducts() {
    try {
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: this.products,
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async getOne(id: string) {
    try {
      const product = this.products.find((product) => product?.id == id);
      if (product)
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: product,
        };
      else {
        return {
          type: 'Error',
          code: HttpStatus.BAD_REQUEST,
          message: 'Product not exists',
        };
      }
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: 'Get one product failed',
      };
    }
  }

  async delete(id: string) {
    try {
      const product = this.products.find((product) => product?.id == id);

      await this.shopifyService.deleteData(
        product?.shopId,
        SHOPIFY_OBJECT.PRODUCT,
        id,
      );
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Delete product successfully',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async webhook() {
    try {
      this.products = await this.updateProductCache();
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async getShopProduct(shopId: string) {
    try {
      const products = this.products.filter(
        (product) => product?.shopId == shopId,
      );

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: products,
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }
}
