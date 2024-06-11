import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateReelDto } from './dto/create-reel.dto';
import { Public } from 'src/core/decorators/public.decorator';

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
  @Post('reel/increase-view')
  async increateViewReel(@Body() { reelId }: { reelId: string }) {
    try {
      const response = await this.newsService.increateViewReel(reelId);
      return response;
    } catch (err) {
      throw err;
    }
  }
}
