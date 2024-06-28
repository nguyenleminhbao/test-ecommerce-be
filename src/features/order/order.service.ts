import { HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from 'src/common/interfaces/user.interface';
import { PrismaService } from 'src/database/prisma.service';
import { calcAmount } from 'src/utils/calc-amount';
import { CreateOrderDto } from './dto/create-order.dto';
import { STATUS_ORDER } from '@prisma/client';
import { IShopCart } from 'src/common/interfaces/cart.interface';
import { ShopifyService } from 'src/shopify/shopify.service';
import { SHOPIFY_OBJECT } from 'src/common/enum/shopify-object.enum';

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly shopifyService: ShopifyService,
  ) {}

  async checkoutOrder(userId: string, shopCart: IShopCart[], amount: number) {
    try {
      const cartExist = await this.prismaService.cart.findFirst({
        where: {
          userId,
        },
      });

      const newShopCart = await Promise.all(
        shopCart.map(async (ele) => {
          return {
            shopId: ele.shopId,
            cartItems: await Promise.all(
              ele.variantIds.map(async (variantId) => {
                return await this.prismaService.cartItem.findFirst({
                  where: {
                    cartId: cartExist.id,
                    variantId,
                  },
                });
              }),
            ),
          };
        }),
      );

      const realAmount = calcAmount(
        newShopCart.map((ele) => ele.cartItems).flat(),
      );

      if (amount == realAmount)
        return {
          newShopCart,
          amount,
        };
      else return null;
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async createOrder(user: IUser, dto: CreateOrderDto) {
    try {
      // checkout order
      const checkOrder = await this.checkoutOrder(
        user.id,
        dto.shopCart,
        dto.amount,
      );

      if (!checkOrder) {
        return {
          type: 'Error',
          code: HttpStatus.BAD_REQUEST,
          message: 'Amount not match',
        };
      }

      // create order in database
      const newOrder = await this.prismaService.order.create({
        data: {
          userId: user.id,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phoneNumber: dto.phoneNumber,
          avatarUser: user.avatar,
          email: user.email,
          address: dto.address,
          paymentMethod: dto.paymentMethod,
          cartItems: JSON.stringify(
            checkOrder.newShopCart.map((shopCart) => shopCart.cartItems).flat(),
          ),
          amount: dto.amount,
          status: STATUS_ORDER.UNFULFILLED,
        },
      });

      // create order for every shopify
      checkOrder.newShopCart.map(async (shopCartItem) => {
        await this.shopifyService.createData(
          shopCartItem.shopId,
          SHOPIFY_OBJECT.ORDER,
          {
            order: {
              line_items: shopCartItem.cartItems.map((ele) => {
                return {
                  variant_id: ele.variantId,
                  quantity: ele.quantity,
                };
              }),
              //shipping_address: dto.address,
              email: user?.email,
            },
          },
        );
      });

      // delete cartItem after creating order
      Promise.all(
        checkOrder.newShopCart.map(async (shopCartItem) => {
          Promise.all(
            shopCartItem.cartItems.map(async (cartItem) => {
              await this.prismaService.cartItem.delete({
                where: {
                  id: cartItem.id,
                },
              });
            }),
          );
        }),
      );

      if (newOrder)
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: newOrder,
        };

      return {
        type: 'Error',
        code: HttpStatus.BAD_REQUEST,
        message: 'Create order failed',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async getAllOrder(userId: string) {
    try {
      const orders = await this.prismaService.order.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (orders) {
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: orders,
        };
      }

      return {
        type: 'Error',
        code: HttpStatus.BAD_REQUEST,
        message: 'Get all order failed',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async getAllOrderSystem() {
    try {
      const orders = await this.prismaService.order.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      if (orders) {
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: orders,
        };
      }

      return {
        type: 'Error',
        code: HttpStatus.BAD_REQUEST,
        message: 'Get all order failed',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async getOneOrderSystem(orderId: string) {
    try {
      const order = await this.prismaService.order.findFirst({
        where: {
          id: orderId,
        },
      });

      if (order) {
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: order,
        };
      }

      return {
        type: 'Error',
        code: HttpStatus.BAD_REQUEST,
        message: 'Get order detail failed',
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
