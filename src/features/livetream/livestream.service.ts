import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { SocketGateWay } from '../socket/socket.gateway';
import { StreamCallbackDto } from './dto/streamCallback.dto';

@Injectable()
export class LivestreamService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly socketService: SocketGateWay,
  ) {}

  async startStreamCallback(body: StreamCallbackDto) {
    try {
      const livestream = await this.prismaService.livestream.create({
        data: {
          roomId: body.room_id,
          userId: body.user_id,
          shopName: body.room_id,
          isHost: await this.checkUserIdExist(body.user_id),
        },
      });
      if (livestream) {
        // create socket emit new livestream
        this.socketService.server.emit(
          'new-livestream',
          await this.getAllStream(),
        );
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: 'Livestream successfully',
        };
      }
      return {
        type: 'Error',
        code: HttpStatus.BAD_REQUEST,
        message: 'Livestream failed',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async endStreamCallback(body: StreamCallbackDto) {
    try {
      const sessionStreamDelete = await this.prismaService.livestream.findFirst(
        {
          where: {
            userId: body.user_id,
          },
        },
      );
      const streamDelete = await this.prismaService.livestream.delete({
        where: {
          id: sessionStreamDelete.id,
        },
      });

      if (streamDelete) {
        this.socketService.server.emit(
          'delete-livestream',
          await this.getAllStream(),
        );
      }
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async getAllStream() {
    try {
      const listLivestream = await this.prismaService.livestream.findMany({
        where: {
          isHost: true,
        },
      });
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: listLivestream.map((ele) => {
          return {
            roomId: ele.roomId,
            userId: ele.userId,
            shopName: ele.shopName,
          };
        }),
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async checkUserIdExist(userId: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });
    return user ? true : false;
  }
}
