import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateReelDto } from './dto/create-reel.dto';
import { Public } from 'src/core/decorators/public.decorator';
import { CreateFeedDto } from './dto/create-feed.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('reel')
  async createReel(@Body() createReelDto: CreateReelDto) {
    try {
      const response = await this.newsService.createReel(createReelDto);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('feed')
  async createFeed(@Body() createFeedDto: CreateFeedDto) {
    try {
      const response = await this.newsService.createFeed(createFeedDto);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Get('reel')
  async getAllReel() {
    try {
      const response = await this.newsService.getAllReel();
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Get('feed')
  async getAllFeed() {
    try {
      const response = await this.newsService.getAllFeed();
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Get('reel/elasticsearch')
  async updatReelIndex() {
    try {
      const response = await this.newsService.updateReelIndex();
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Get('feed/elasticsearch')
  async updatFeedIndex() {
    try {
      const response = await this.newsService.updateFeedIndex();
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Get('reel/:reelId')
  async getReelById(@Param('reelId') reelId: string) {
    try {
      const response = await this.newsService.getReelById(reelId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Get('feed/:feedId')
  async getFeedById(@Param('feedId') feedId: string) {
    try {
      const response = await this.newsService.getFeedById(feedId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Get('reel/shop/:shopId')
  async getReelByShop(@Param('shopId') shopId: string) {
    try {
      const response = await this.newsService.getReelByShop(shopId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Get('feed/shop/:shopId')
  async getFeedByShop(@Param('shopId') shopId: string) {
    try {
      const response = await this.newsService.getFeedByShop(shopId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Post('reel/increase-view')
  async increateViewReel(@Body() { reelId }: { reelId: string }) {
    try {
      const response = await this.newsService.increateViewReel(reelId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Post('feel/increase-view')
  async increateViewFeed(@Body() { feedId }: { feedId: string }) {
    try {
      const response = await this.newsService.increateViewFeed(feedId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Delete('reel/:reelId')
  async deleteReel(@Param('reelId') reelId: string) {
    try {
      const response = await this.newsService.deleteReel(reelId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Delete('feed/:feedId')
  async deleteFeed(@Param('feedId') feedId: string) {
    try {
      const response = await this.newsService.deleteFeed(feedId);
      return response;
    } catch (err) {
      throw err;
    }
  }
}
