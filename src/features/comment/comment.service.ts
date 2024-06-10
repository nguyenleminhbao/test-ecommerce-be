import { HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from 'src/common/interfaces/user.interface';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCommentDto } from './dto/createComment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async createComment(user: IUser, dto: CreateCommentDto) {
    try {
      const comment = await this.prismaService.comment.create({
        data: {
          userId: user.id,
          content: dto.content,
          numOfStar: dto.numOfStar,
          optionProduct: dto.optionProduct,
          imageUrls: dto.imageUrls,
          typeComment: dto.typeComment,
          etag: dto.etag.toString(),
        },
      });

      if (comment) {
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: 'Create comment successfully',
        };
      }
      return {
        type: 'Error',
        code: HttpStatus.BAD_REQUEST,
        message: 'Create comment failed',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        messgae: err.messgae,
      };
    }
  }

  async getCommentByEtag(etag: string) {
    try {
      const comments = await this.prismaService.comment.findMany({
        where: {
          etag: etag.toString(),
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

      if (comments) {
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: comments,
        };
      }
      return {
        type: 'Error',
        code: HttpStatus.BAD_REQUEST,
        message: 'Get comment failed',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        messgae: err.messgae,
      };
    }
  }
}
