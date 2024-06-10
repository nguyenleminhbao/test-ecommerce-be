import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCart(userId: string) {
    try {
      const cartExist = await this.prismaService.cart.findFirst({
        where: {
          userId,
        },
        include: {
          cartItems: true,
        },
      });

      if (cartExist) {
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: cartExist,
        };
      }

      const newCart = await this.prismaService.cart.create({
        data: {
          userId,
        },
        include: {
          cartItems: true,
        },
      });
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: newCart,
      };
    } catch (err) {
      return {
        type: 'Success',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    try {
      const cartExist = await this.prismaService.cart.findFirst({
        where: {
          userId,
        },
        include: {
          cartItems: true,
        },
      });

      // check variant exist in cart ?
      const findCartItem = cartExist.cartItems.find(
        (cartItem) => cartItem.variantId == dto.variantId,
      );

      if (findCartItem) {
        await this.prismaService.cartItem.update({
          where: {
            id: findCartItem.id,
          },
          data: {
            quantity: findCartItem.quantity + dto.quantity,
          },
        });
      }
      // cartItem not in cart
      else {
        await this.prismaService.cartItem.create({
          data: {
            cartId: cartExist.id,
            ...dto,
          },
        });
      }

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Add to cart successfully',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async updateQuantity(userId: string, dto: UpdateQuantityDto) {
    try {
      const cartExist = await this.prismaService.cart.findFirst({
        where: {
          userId,
        },
        include: {
          cartItems: true,
        },
      });

      const cartItem = await this.prismaService.cartItem.findFirst({
        where: {
          variantId: dto.variantId,
          cartId: cartExist.id,
        },
      });
      await this.prismaService.cartItem.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity: dto.quantity,
        },
      });

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Update quantity successfully',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async deleteCartItem(userId: string, variantId: number) {
    try {
      const cartExist = await this.prismaService.cart.findFirst({
        where: {
          userId,
        },
        include: {
          cartItems: true,
        },
      });

      const cartItemDelete = await this.prismaService.cartItem.findFirst({
        where: {
          variantId,
          cartId: cartExist.id,
        },
      });
      await this.prismaService.cartItem.delete({
        where: {
          id: cartItemDelete.id,
        },
      });
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Delete cart item successfully',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async deleteAll(userId: string) {
    try {
      const cartExist = await this.prismaService.cart.findFirst({
        where: {
          userId,
        },
        include: {
          cartItems: true,
        },
      });

      Promise.all(
        cartExist.cartItems.map(async (cartItem) => {
          await this.prismaService.cartItem.delete({
            where: {
              id: cartItem.id,
            },
          });
        }),
      );

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Delete all successfully',
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
