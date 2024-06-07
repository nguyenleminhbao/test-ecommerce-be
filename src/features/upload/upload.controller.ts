import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Public } from 'src/core/decorators/public.decorator';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { UpdateShopAvatarDto } from './dto/update-shop-avatar.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Public()
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file);
  }

  @Public()
  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  uploadVideo(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadVideo(file);
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
    } catch (err) {
      throw err;
    }
  }
}
