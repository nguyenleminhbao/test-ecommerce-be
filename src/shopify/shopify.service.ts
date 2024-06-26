import { HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { SHOPIFY_OBJECT } from 'src/common/enum/shopify-object.enum';
import { IShop } from 'src/common/interfaces/shop.interface';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ShopifyService {
  constructor(private readonly redisService: RedisService) {}

  async getShop(shopId: string) {
    const shopJson = await this.redisService.getValue(`shop:${shopId}`);
    return JSON.parse(shopJson) as IShop;
  }

  async getAllData(shopId: string, endObject: SHOPIFY_OBJECT) {
    try {
      const shop = await this.getShop(shopId);

      const { data, status } = await axios.get(
        `${shop.baseUrl}/${endObject}.json`,
      );
      if (data) return data;
      return null;
    } catch (err) {
      return {
        code: HttpStatus.BAD_GATEWAY,
        type: 'Error',
        message: err.message,
      };
    }
  }

  async getDetail(shopId: string, endObject: SHOPIFY_OBJECT, id: string) {
    try {
      const shop = await this.getShop(shopId);
      const { data, status } = await axios.get(
        `${shop.baseUrl}/${endObject}.json/${id}.json`,
      );
      if (data) return data;
      return null;
    } catch (err) {
      return {
        code: HttpStatus.BAD_GATEWAY,
        type: 'Error',
        message: err.message,
      };
    }
  }

  async createData<T>(shopId: string, endObject: SHOPIFY_OBJECT, newData: T) {
    try {
      const shop = await this.getShop(shopId);
      const { data, status } = await axios.post(
        `${shop.baseUrl}/${endObject}.json`,
        newData,
      );
      if (data) return data;
      return null;
    } catch (err) {
      return {
        code: HttpStatus.BAD_GATEWAY,
        type: 'Error',
        message: err.message,
      };
    }
  }

  async updateData<T>(
    shopId: string,
    endObject: SHOPIFY_OBJECT,
    id: string,
    updateData: T,
  ) {
    try {
      const shop = await this.getShop(shopId);
      const { data, status } = await axios.patch(
        `${shop.baseUrl}/${endObject}.json/${id}.json`,
        updateData,
      );
      if (data) return data;
      return null;
    } catch (err) {
      return {
        code: HttpStatus.BAD_GATEWAY,
        type: 'Error',
        message: err.message,
      };
    }
  }

  async deleteData(shopId: string, endObject: SHOPIFY_OBJECT, id: string) {
    try {
      const shop = await this.getShop(shopId);
      const { data, status } = await axios.delete(
        `${shop.baseUrl}/${endObject}/${id}.json`,
      );

      if (data) return data;
      return null;
    } catch (err) {
      return {
        code: HttpStatus.BAD_GATEWAY,
        type: 'Error',
        message: err.message,
      };
    }
  }

  async otherAction(shopId: string) {
    const shop = await this.getShop(shopId);
    return axios.create({
      baseURL: shop.baseUrl,
    });
  }
}
