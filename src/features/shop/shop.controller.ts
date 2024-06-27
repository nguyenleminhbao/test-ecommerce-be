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
import { User } from 'src/core/decorators/user.decorator';
import { CreateShopDto } from './dto/create-shop.dto';
import { Public } from 'src/core/decorators/public.decorator';
import { RoleGuard } from 'src/core/guards/role.guard';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { UpdateShopAvatarDto } from './dto/update-shop-avatar.dto';

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
  async updateBannerMarketPlace(@Body() { banners }: { banners: string[] }) {
    try {
      const response = await this.shopService.updateBannerMarketPlace(banners);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('update-banner')
  async updateBanner(@Body() updateBannerDto: UpdateBannerDto) {
    try {
      const response = await this.shopService.updateBanner(updateBannerDto);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('update-shop-avatar')
  async updateShopAvatar(@Body() updateShopAvatar: UpdateShopAvatarDto) {
    try {
      const response =
        await this.shopService.updateShopAvatar(updateShopAvatar);
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

  @UseGuards(RoleGuard)
  @Get('get-raw-shop')
  async getRawShop() {
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

  @UseGuards(RoleGuard)
  @Post('create-shop')
  async createShop(@Body() createShopDto: CreateShopDto) {
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
  @Get('get-banners')
  async getBanners() {
    try {
      const response = await this.shopService.getBanners();
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Get('get-banner-promotion')
  async getBannerPromotion() {
    try {
      const response = await this.shopService.getBannerPromotion();
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
