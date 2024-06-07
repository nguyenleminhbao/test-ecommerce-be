import { HttpStatus, Injectable } from '@nestjs/common';
import { ROLE } from '@prisma/client';
import { SHOPIFY_OBJECT } from 'src/common/enum/shopify-object.enum';
import { PrismaService } from 'src/database/prisma.service';
import { ShopifyService } from 'src/shopify/shopify.service';

@Injectable()
export class CustomerService {
  constructor(
    private readonly shopifyService: ShopifyService,
    private readonly prismaService: PrismaService,
  ) {}

  async getAllCustomerByShop(shopId: string) {
    try {
      const customerShop = await this.shopifyService.getAllData(
        shopId,
        SHOPIFY_OBJECT.CUSTOMER,
      );
    } catch (err) {
      return {
        type: 'Success',
        code: HttpStatus.BAD_GATEWAY,
        messgae: err.message,
      };
    }
  }

  async getAllCustomer() {
    try {
      const customers = await this.prismaService.user.findMany({
        where: {
          role: ROLE.CUSTOMER || ROLE.ADMIN_SHOP,
        },
      });
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: customers,
      };
    } catch (err) {
      return {
        type: 'Success',
        code: HttpStatus.BAD_GATEWAY,
        messgae: err.message,
      };
    }
  }
}
