import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { createClerkClient } from '@clerk/clerk-sdk-node';
import { RedisService } from 'src/redis/redis.service';
import { TYPE_LOGIN } from '@prisma/client';
import { IUser } from 'src/common/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async checkLogin(dto: LoginDto) {
    try {
      const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      const user = await clerkClient.users?.getUser(dto?.userId);

      const userData = {
        name: user?.firstName ?? '',
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        email: user?.emailAddresses[0]?.emailAddress,
        avatar: user?.imageUrl,
        type:
          user.externalAccounts[0]?.provider == 'oauth_github'
            ? TYPE_LOGIN.GITHUB
            : TYPE_LOGIN.GOOGLE,
      };

      const existUser = await this.prismaService.user.findFirst({
        where: {
          email: userData?.email,
        },
      });
      if (!existUser) {
        const newUser = await this.prismaService.user.create({
          data: userData,
        });
        return newUser;
      }
      return existUser;
    } catch (err) {
      throw {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err,
      };
    }
  }

  async login(dto: LoginDto) {
    try {
      const payload = await this.checkLogin(dto);
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: {
          accessToken: await this.generateAccessToken(payload),
          refreshToken: await this.generateRefreshToken(payload),
        },
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err,
      };
    }
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const checkToken = await this.redisService.getValue(
        `RefreshToken-${payload?.id?.toString()}`,
      );
      if (checkToken != token) {
        return {
          type: 'Error',
          code: HttpStatus.UNAUTHORIZED,
          message: 'Invalid token',
        };
      }
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: {
          accessToken: await this.generateAccessToken(payload),
          refreshToken: await this.generateRefreshToken(payload),
        },
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err,
      };
    }
  }

  async logout(user_id: string) {
    try {
      this.redisService.deleteTokenKey(`RefreshToken-${user_id}`);
      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: 'Logout successfully!!!',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err,
      };
    }
  }

  async generateAccessToken(payload: any) {
    delete payload?.iat;
    delete payload?.exp;
    return await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: `${process.env.JWT_ACCESS_SECRET}`,
    });
  }
  async generateRefreshToken(payload: any) {
    delete payload?.iat;
    delete payload?.exp;
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '3d',
      secret: `${process.env.JWT_REFRESH_SECRET}`,
    });
    await this.redisService.setValue(
      `RefreshToken-${payload?.id?.toString()}`,
      refreshToken,
      3 * 24 * 60 * 60,
    );

    return refreshToken;
  }

  async getMe(userId: string) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          addresses: true,
        },
      });

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: {
          id: user.id,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phone,
          addresses: user.addresses,
          avatar: user.avatar,
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
}
