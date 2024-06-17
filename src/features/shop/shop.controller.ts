import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateRawShopDto } from './dto/create-raw-shop.dto';
import { Admin } from 'src/core/decorators/admin.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { User } from 'src/core/decorators/user.decorator';
import { CreateShopDto } from './dto/create-shop.dto';
import { Public } from 'src/core/decorators/public.decorator';
import { RoleGuard } from 'src/core/guards/role.guard';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @UseGuards(RoleGuard)
  @Get()
  async getAllShop() {
    try {
      const response = await this.shopService.getAllShop();
      return response;
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(RoleGuard)
  @Post('update-banner-marketplace')
  async updateBannerMarketPlace(
    @User('userId') userId: string,
    @Body() { banners }: { banners: string[] },
  ) {
    try {
      const response = await this.shopService.updateBannerMarketPlace(
        userId,
        banners,
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Get('get-shop-name')
  async getAllShopName() {
    try {
      const response = await this.shopService.getAllShopName();
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Get('get-raw-shop')
  async getRawShop(@Admin() admin: IUser) {
    try {
      const response = await this.shopService.getRawShop();
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('ask-permission')
  async createRawShop(
    @User('id') userId: string,
    @Body() createRawShopDto: CreateRawShopDto,
  ) {
    try {
      const response = await this.shopService.createRawShop(
        userId,
        createRawShopDto,
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('create-shop')
  async createShop(
    @Admin() admin: IUser,
    @Body() createShopDto: CreateShopDto,
  ) {
    try {
      const response = await this.shopService.createShop(
        createShopDto.shopRawId,
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Get('get-shop/:shopId')
  async getOneShop(@Param('shopId') shopId: string) {
    try {
      const response = await this.shopService.getOneShop(shopId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Get('get-shop-admin')
  async getShopAdmin(@User('id') userId: string) {
    try {
      const response = await this.shopService.getShopAdmin(userId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Get('random-banner')
  async randomBanner() {
    try {
      const response = await this.shopService.randomBanner();
      return response;
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(RoleGuard)
  @Delete(':shopId')
  async deleteShop(@Param('shopId') shopId: string) {
    try {
      const response = await this.shopService.deleteShop(shopId);
      return response;
    } catch (err) {
      throw err;
    }
  }
}
