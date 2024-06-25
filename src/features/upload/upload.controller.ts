import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Public } from 'src/core/decorators/public.decorator';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { UpdateShopAvatarDto } from './dto/update-shop-avatar.dto';
import { UpdateReelDto } from './dto/update-reel.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Public()
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFirebaseFile(file);
    //return this.uploadService.uploadFile(file);
  }

  @Public()
  @Post('firebase/image')
  @UseInterceptors(FileInterceptor('file'))
  uploadFirebaseImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFirebaseFile(file);
  }

  @Public()
  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  uploadVideo(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFirebaseFile(file);
    //return this.uploadService.uploadVideo(file);
  }

  @Post('update-banner')
  async updateBanner(@Body() updateBannerDto: UpdateBannerDto) {
    try {
      const response = await this.uploadService.updateBanner(updateBannerDto);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('update-shop-avatar')
  async updateShopAvatar(@Body() updateShopAvatar: UpdateShopAvatarDto) {
    try {
      const response =
        await this.uploadService.updateShopAvatar(updateShopAvatar);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('update-reel')
  async updateReel(@Body() updateReelDto: UpdateReelDto) {
    try {
      const response = await this.uploadService.updateReel(updateReelDto);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('update-feed')
  async updateFeed(@Body() updateFeedDto: UpdateFeedDto) {
    try {
      const response = await this.uploadService.updateFeed(updateFeedDto);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('delete-file-v2')
  async deleteFirebaseFile(@Body('publicId') publicId: string) {
    try {
      console.log(publicId);
      const response = await this.uploadService.deleteFirebaseFile(publicId);
      return response;
    } catch (err) {
      throw err;
    }
  }
}
