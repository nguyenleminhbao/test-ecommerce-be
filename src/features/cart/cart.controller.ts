import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { User } from 'src/core/decorators/user.decorator';

import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('get-cart')
  async getCart(@User('id') userId: string) {
    try {
      const response = await this.cartService.getCart(userId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('add-to-cart')
  async addToCart(
    @User('id') userId: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    try {
      const response = await this.cartService.addToCart(userId, addToCartDto);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('update-quantity')
  async updateQuantity(
    @User('id') userId: string,
    @Body() updateQuantityDto: UpdateQuantityDto,
  ) {
    try {
      const response = await this.cartService.updateQuantity(
        userId,
        updateQuantityDto,
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('delete-cart-item')
  async deleteCartItem(
    @User('id') userId: string,
    @Body() { variantId }: { variantId: number },
  ) {
    try {
      const response = await this.cartService.deleteCartItem(userId, variantId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('delete-all')
  async deleteAll(@User('id') userId: string) {
    try {
      const response = await this.cartService.deleteAll(userId);
      return response;
    } catch (err) {
      throw err;
    }
  }
}
