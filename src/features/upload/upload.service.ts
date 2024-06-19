import { HttpStatus, Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UpdateShopAvatarDto } from './dto/update-shop-avatar.dto';
import { UpdateReelDto } from './dto/update-reel.dto';
<<<<<<< HEAD
import { UpdateFeedDto } from './dto/update-feed.dto';
=======
import * as admin from 'firebase-admin';
import { error } from 'console';
>>>>>>> d9da921 (feat: upload firebase storage)

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

@Injectable()
export class UploadService {
  private storage: admin.storage.Storage;
  constructor(private readonly prismaService: PrismaService) {
    const tokenFirebase = require('./firebase.json');
    admin.initializeApp({
      credential: admin.credential.cert(tokenFirebase),
      storageBucket: 'e-commerce-dd627.appspot.com',
    });
    this.storage = admin.storage();
  }

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
        message: err.message,
      };
    }
  }

  async uploadFirebaseFile(file: Express.Multer.File) {
    try {
      const bucket = this.storage.bucket();
      const fileName = `${Date.now()}_${file.originalname}`;
      const destination = `e-commerce/${fileName}`;

      const fileUpload = bucket.file(destination);
      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
        public: true,
      });

      // public image
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;

      return publicUrl;
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
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
        message: err.message,
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
        message: err.message,
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
        message: err.message,
      };
    }
  }

  async updateReel(dto: UpdateReelDto) {
    try {
      await this.prismaService.reel.update({
        where: {
          id: dto.reelId,
        },
        data: {
          title: dto.title,
          description: dto.description,
          video: dto.newVideoUrl,
        },
      });

      // delete video on cloudinary
      await this.deleteFile(dto.idVideoOld);

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Update Reel successfully',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async updateFeed(dto: UpdateFeedDto) {
    try {
      await this.prismaService.feed.update({
        where: {
          id: dto.feedId,
        },
        data: {
          title: dto.title,
          content: dto.content,
          thumbnail: dto.newImageUrl,
        },
      });

      // delete video on cloudinary
      await this.deleteFile(dto.idImageOld);

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Update Feed successfully',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }
  async deleteFile(public_id: string) {
    await cloudinary.uploader.destroy(public_id);
  }

  async deleteFirebaseFile(public_id: string) {
    const bucket = this.storage.bucket();
    const file = bucket.file(public_id);
    await file.delete();
  }
}
