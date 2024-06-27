import { PrismaService } from 'src/database/prisma.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { SocketGateWay } from '../socket/socket.gateway';
import { StreamCallbackDto } from './dto/streamCallback.dto';

@Injectable()
export class DetailUserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly socketService: SocketGateWay,
  ) {}

  async getAllAddress(userId: string) {
    try {
      const addresses = await this.prismaService.address.findMany({
        where: {
          userId,
        },
      });
      return {
        code: HttpStatus.OK,
        type: 'Success',
        message: addresses,
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err,
      };
    }
  }

  async createAddress(userId: string, dto: CreateAddressDto) {
    try {
      const newAddress = await this.prismaService.address.create({
        data: {
          userId,
          ...dto,
        },
      });

      if (!newAddress) {
        return {
          type: 'Error',
          code: HttpStatus.BAD_REQUEST,
          message: 'Create address failed',
        };
      }
      return {
        code: HttpStatus.OK,
        type: 'Success',
        message: newAddress,
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err,
      };
    }
  }

  async deleteAddress(addressId: string) {
    try {
      const deleteAddress = await this.prismaService.address.delete({
        where: {
          id: addressId,
        },
      });
      if (!deleteAddress) {
        return {
          type: 'Error',
          code: HttpStatus.BAD_REQUEST,
          message: 'Delete address failed',
        };
      }
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Delete address successfully',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err,
      };
    }
  }

  async getAllAccount(userId: string) {
    try {
      const accounts = await this.prismaService.paymentAccount.findMany({
        where: {
          userId,
        },
      });
      return {
        code: HttpStatus.OK,
        type: 'Success',
        message: accounts,
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err,
      };
    }
  }

  async createAccount(userId: string, dto: CreateAccountDto) {
    try {
      const newAccount = await this.prismaService.paymentAccount.create({
        data: {
          userId,
          ...dto,
        },
      });

      if (!newAccount) {
        return {
          type: 'Error',
          code: HttpStatus.BAD_REQUEST,
          message: 'Create account payment failed',
        };
      }
      return {
        code: HttpStatus.OK,
        type: 'Success',
        message: newAccount,
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err,
      };
    }
  }

  async deleteAccount(accountId: string) {
    try {
      const deleteAccount = await this.prismaService.paymentAccount.delete({
        where: {
          id: accountId,
        },
      });
      if (!deleteAccount) {
        return {
          type: 'Error',
          code: HttpStatus.BAD_REQUEST,
          message: 'Delete account failed',
        };
      }
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Delete account successfully',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err,
      };
    }
  }

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
