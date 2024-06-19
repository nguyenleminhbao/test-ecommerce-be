import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateReelDto } from './dto/create-reel.dto';
import { STATUS, TYPE_COMMENT } from '@prisma/client';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UploadService } from '../upload/upload.service';
import { getPublicIdFromUrl } from 'src/utils/get-publicId-from-url';

@Injectable()
export class NewsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async createReel(dto: CreateReelDto) {
    try {
      const newReel = await this.prismaService.reel.create({
        data: dto,
      });

      if (newReel) {
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: 'Create reel successfully',
        };
      }

      return {
        type: 'Error',
        code: HttpStatus.BAD_REQUEST,
        message: 'Create reel failed',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async createFeed(dto: CreateFeedDto) {
    try {
      const newFeed = await this.prismaService.feed.create({
        data: dto,
      });

      if (newFeed) {
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: 'Create feed successfully',
        };
      }

      return {
        type: 'Error',
        code: HttpStatus.BAD_REQUEST,
        message: 'Create feed failed',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async getAllReel() {
    try {
      const reels = await this.prismaService.reel.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          status: STATUS.ACTIVE,
        },
      });
      if (reels) {
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: reels,
        };
      }

      return {
        type: 'Error',
        code: HttpStatus.BAD_REQUEST,
        message: 'Get all reel failed',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async getAllFeed() {
    try {
      const feeds = await this.prismaService.feed.findMany({
        orderBy: {
          createdAt: 'asc',
        },
        where: {
          status: STATUS.ACTIVE,
        },
      });
      if (feeds) {
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: feeds,
        };
      }

      return {
        type: 'Error',
        code: HttpStatus.BAD_REQUEST,
        message: 'Get all feed failed',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async getReelByShop(shopId: string) {
    try {
      const reels = await this.prismaService.reel.findMany({
        where: {
          shopId,
          status: STATUS.ACTIVE,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
      if (reels) {
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: reels,
        };
      }

      return {
        type: 'Error',
        code: HttpStatus.BAD_REQUEST,
        message: 'Get reel failed',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async getFeedByShop(shopId: string) {
    try {
      const feeds = await this.prismaService.feed.findMany({
        where: {
          shopId,
          status: STATUS.ACTIVE,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
      if (feeds) {
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: feeds,
        };
      }

      return {
        type: 'Error',
        code: HttpStatus.BAD_REQUEST,
        message: 'Get feed failed',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async increateViewReel(reelId: string) {
    try {
      await this.prismaService.reel.update({
        where: {
          id: reelId,
        },
        data: {
          view: {
            increment: 1,
          },
        },
      });

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Increase reel view',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async increateViewFeed(feedId: string) {
    try {
      await this.prismaService.feed.update({
        where: {
          id: feedId,
        },
        data: {
          view: {
            increment: 1,
          },
        },
      });

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Increase feed view',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async getReelById(reelId: string) {
    try {
      const reel = await this.prismaService.reel.findFirst({
        where: {
          id: reelId,
          status: STATUS.ACTIVE,
        },
        include: {
          shop: {
            select: {
              id: true,
              shopName: true,
              shopAvatar: true,
            },
          },
        },
      });

      const comments = await this.prismaService.comment.findMany({
        where: {
          etag: reelId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      });
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: {
          ...reel,
          comments,
        },
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async getFeedById(feedId: string) {
    try {
      const feed = await this.prismaService.feed.findFirst({
        where: {
          id: feedId,
          status: STATUS.ACTIVE,
        },
        include: {
          shop: {
            select: {
              id: true,
              shopName: true,
              shopAvatar: true,
            },
          },
        },
      });

      const comments = await this.prismaService.comment.findMany({
        where: {
          etag: feedId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      });
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: {
          ...feed,
          comments,
        },
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async deleteReel(reelId: string) {
    try {
      const deleteComments = await this.prismaService.comment.deleteMany({
        where: {
          etag: reelId,
          typeComment: TYPE_COMMENT.REEL,
        },
      });

      const reel = await this.prismaService.reel.findFirst({
        where: {
          id: reelId,
        },
      });

      await this.uploadService.deleteFirebaseFile(
        getPublicIdFromUrl(reel.video),
      );

      const deleteReel = await this.prismaService.reel.delete({
        where: {
          id: reelId,
        },
      });

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Delete reel successfully',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }

  async deleteFeed(feedId: string) {
    try {
      const deleteComments = await this.prismaService.comment.deleteMany({
        where: {
          etag: feedId,
          typeComment: TYPE_COMMENT.FEED,
        },
      });

      const feed = await this.prismaService.feed.findFirst({
        where: {
          id: feedId,
        },
      });

      await this.uploadService.deleteFirebaseFile(
        getPublicIdFromUrl(feed.thumbnail),
      );

      const deleteFeed = await this.prismaService.feed.delete({
        where: {
          id: feedId,
        },
      });

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Delete feed successfully',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }
}
