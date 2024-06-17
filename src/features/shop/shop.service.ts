import { HttpStatus, Injectable } from '@nestjs/common';
import { ROLE, STATUS } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateRawShopDto } from './dto/create-raw-shop.dto';
import { RedisService } from 'src/redis/redis.service';
import { IShop } from 'src/common/interfaces/shop.interface';
import { getKeyShop } from 'src/utils/get-key-shop';
import { getRandomArray } from 'src/utils/random-array';

@Injectable()
export class ShopService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async getAllShop() {
    try {
      const shops = await this.prismaService.shop.findMany({
        where: {
          status: STATUS.ACTIVE,
        },
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      });

      if (!shops) {
        return {
          type: 'Error',
          code: HttpStatus.BAD_REQUEST,
          message: 'Get all shop failed',
        };
      }

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: shops.map((shop) => {
          return {
            id: shop.id,
            shopName: shop.shopName,
            shopAvatar: shop.shopAvatar,
            user: {
              name: shop.user.name,
              avatar: shop.user.avatar,
            },
          };
        }),
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async createRawShop(userId: string, dto: CreateRawShopDto) {
    try {
      const newRawShop = await this.prismaService.shopRaw.create({
        data: {
          ...dto,
          userId,
        },
      });

      if (!newRawShop) {
        return {
          type: 'Error',
          code: HttpStatus.BAD_REQUEST,
          message: 'Create shop raw failed',
        };
      }
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: newRawShop,
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async getRawShop() {
    try {
      const rawShops = await this.prismaService.shopRaw.findMany();

      if (!rawShops) {
        return {
          type: 'Error',
          code: HttpStatus.BAD_REQUEST,
          message: 'Get all raw shop failed',
        };
      }

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: rawShops,
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async createShop(shopRawId: string) {
    try {
      // check rawShop exists
      const rawShopExist = await this.prismaService.shopRaw.findFirst({
        where: {
          id: shopRawId,
        },
      });

      if (!rawShopExist) {
        return {
          type: 'Error',
          code: HttpStatus.BAD_REQUEST,
          message: 'Raw shop not exists',
        };
      }

      const baseUrl = `https://${rawShopExist.shopifyKeyApi}:${rawShopExist.shopifyTokenApi}@${rawShopExist.shopName}.myshopify.com/admin/api/${rawShopExist.hostVersion}`;

      // create new shop from raw shop
      const newShop = await this.prismaService.shop.create({
        data: {
          baseUrl: baseUrl,
          shopifyTokenApi: rawShopExist.shopifyTokenApi,
          shopifyKeyApi: rawShopExist.shopifyKeyApi,
          shopifySecretKeyApi: rawShopExist.shopifySecretKeyApi,
          urlStore: rawShopExist.urlStore,
          shopName: rawShopExist.shopName,
          hostVersion: rawShopExist.hostVersion,
          userId: rawShopExist.userId,
        },
      });

      if (newShop) {
        // cache shop in redies
        this.redisService.setValue(
          `shop:${newShop.id}`,
          JSON.stringify(newShop),
        );

        // change Role shop owner to admin shop
        await this.prismaService.user.update({
          where: {
            id: rawShopExist.userId,
          },
          data: {
            role: ROLE.ADMIN_SHOP,
          },
        });

        // delete shop raw
        await this.prismaService.shopRaw.delete({
          where: {
            id: shopRawId,
          },
        });

        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: newShop,
        };
      }

      return {
        type: 'Error',
        code: HttpStatus.BAD_REQUEST,
        message: 'Create shop failed',
      };
    } catch (err) {
      //throw err.message;
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async deleteShop(shopId: string) {
    try {
      // find shop
      const shop = JSON.parse(
        await this.redisService.getValue(`shop:${shopId}`),
      ) as IShop;

      // delete shop in cache
      this.redisService.deleteKey(`shop:${shopId}`);

      // delete shop in database
      await this.prismaService.shop.delete({
        where: {
          id: shopId,
        },
      });

      // change Role  admin shop to customer
      await this.prismaService.user.update({
        where: {
          id: shop.userId,
        },
        data: {
          role: ROLE.CUSTOMER,
        },
      });

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Delete shop successfully',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async getAllShopName() {
    try {
      // get all key of shop in redis
      const shopKeys = await this.redisService.getKeys('shop:*');

      const listShopName = await Promise.all(
        shopKeys.map(async (shopKey) => {
          const key = getKeyShop(shopKey);
          // find shop
          const shop = JSON.parse(
            await this.redisService.getValue(`shop:${key}`),
          ) as IShop;

          return {
            shopId: shop.id,
            shopName: shop.shopName,
          };
        }),
      );
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: listShopName,
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async getOneShop(shopId: string) {
    try {
      // const shop = JSON.parse(
      //   await this.redisService.getValue(`shop:${shopId}`),
      // ) as IShop;

      const shop = await this.prismaService.shop.findFirst({
        where: {
          id: shopId,
        },
        include: {
          reels: true,
        },
      });

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: {
          shopId: shop.id,
          shopName: shop.shopName,
          shopAvatar: shop.shopAvatar,
          shopBanners: shop.shopBanners,
          reels: shop.reels,
        },
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async getShopAdmin(userId: string) {
    try {
      const shop = await this.prismaService.shop.findFirst({
        where: {
          userId,
        },
      });

      if (shop) {
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: {
            shopId: shop.id,
            userId: userId,
            shopName: shop.shopName,
            shopAvatar: shop.shopAvatar,
            shopBanners: shop.shopBanners,
            isShopOwner: true,
          },
        };
      }
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: {
          isShopOwner: false,
        },
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async randomBanner() {
    try {
      const shops = await this.prismaService.shop.findMany({
        where: {
          status: STATUS.ACTIVE,
        },
      });

      const banners = shops.map((shop) => shop.shopBanners).flat();
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: getRandomArray(banners),
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async updateBannerMarketPlace(userId: string, banners: string[]) {
    try {
      await this.prismaService.martPlaceShop.update({
        where: {
          userId,
        },
        data: {
          banners,
        },
      });
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Marketplace update banner',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }
}
