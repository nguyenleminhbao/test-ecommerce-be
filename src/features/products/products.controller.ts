import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Public } from 'src/core/decorators/public.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Public()
  async getAllProducts(@Query('page') page: string) {
    try {
      const response = await this.productsService.getAllProducts(+page);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Get('get-shop-product/:shopId')
  async getShopProduct(@Param('shopId') shopId: string) {
    try {
      const response = await this.productsService.getShopProduct(shopId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Get(':id')
  @Public()
  async getOne(@Param('id') id: string) {
    try {
      const response = await this.productsService.getOne(id);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    try {
      const response = await this.productsService.delete(id);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Post('webhook')
  async webhook() {
    try {
      this.productsService.webhook();
      console.log('run web hook');
    } catch (err) {
      throw err;
    }
  }
}
