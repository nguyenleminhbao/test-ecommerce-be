import { HttpStatus, Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UpdateShopAvatarDto } from './dto/update-shop-avatar.dto';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

@Injectable()
export class UploadService {
  constructor(private readonly prismaService: PrismaService) {}

  async uploadFile(file: Express.Multer.File) {
    try {
      const imageBase64 = Buffer.from(file.buffer).toString('base64');
      const image = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${imageBase64}`,
        {
          folder: 'ecommerce',
          use_filename: true,
        },
      );
      return image;
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err,
      };
    }
  }

  async uploadVideo(file: Express.Multer.File) {
    try {
      const imageBase64 = Buffer.from(file.buffer).toString('base64');
      const video = await cloudinary.uploader.upload(
        `data:video/mp4;base64,${imageBase64}`,
        {
          folder: 'ecommerce',
          use_filename: true,
          resource_type: 'video',
        },
      );
      return video;
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err,
      };
    }
  }

  async updateBanner(dto: UpdateBannerDto) {
    try {
      const shop = await this.prismaService.shop.findFirst({
        where: {
          id: dto.shopId,
        },
      });

      const newShopBanners = shop.shopBanners.map((banner, id) =>
        id == dto.numOfBanner ? dto.newImageUrl : banner,
      );

      // update banner in database
      await this.prismaService.shop.update({
        where: {
          id: dto.shopId,
        },
        data: {
          shopBanners: newShopBanners,
        },
      });
      // delete image on cloudinary
      await this.deleteFile(dto.idImageOld);

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Update Banner successfully',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err,
      };
    }
  }

  async updateShopAvatar(dto: UpdateShopAvatarDto) {
    try {
      // update shop avatar  in database
      await this.prismaService.shop.update({
        where: {
          id: dto.shopId,
        },
        data: {
          shopAvatar: dto.newImageUrl,
        },
      });
      // delete image on cloudinary
      await this.deleteFile(dto.idImageOld);

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Update shop avatar successfully',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err,
      };
    }
  }
  async deleteFile(public_id: string) {
    await cloudinary.uploader.destroy(public_id);
  }
}
