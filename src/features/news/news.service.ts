import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateReelDto } from './dto/create-reel.dto';
import { STATUS, TYPE_COMMENT } from '@prisma/client';

@Injectable()
export class NewsService {
  constructor(private readonly prismaService: PrismaService) {}

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

  async getAllReel() {
    try {
      const reels = await this.prismaService.reel.findMany({
        orderBy: {
          createdAt: 'asc',
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

  async deleteReel(reelId: string) {
    try {
      const deleteComments = await this.prismaService.comment.deleteMany({
        where: {
          etag: reelId,
          typeComment: TYPE_COMMENT.REEL,
        },
      });

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
}
