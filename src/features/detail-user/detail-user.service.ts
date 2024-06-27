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
}
