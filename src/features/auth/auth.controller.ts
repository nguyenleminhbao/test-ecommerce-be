import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/core/decorators/public.decorator';
import { User } from 'src/core/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { ROLE } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const response = await this.authService.login(loginDto);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Get('get-me')
  async getMe(@User('id') userId: string) {
    try {
      const response = await this.authService.getMe(userId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() { refreshToken }: { refreshToken: string }) {
    try {
      const response = await this.authService.refreshToken(refreshToken);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Delete('logout')
  async logout(@User('id') user_id: string) {
    try {
      const response = await this.authService.logout(user_id);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Get('check-admin')
  async checkAdmin(@User() user: IUser) {
    try {
      if (user.role == ROLE.ADMIN_MARKET_PLACE)
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: true,
        };
      else {
        return {
          type: 'Error',
          code: HttpStatus.FORBIDDEN,
          message: false,
        };
      }
    } catch (err) {
      throw err;
    }
  }
}
