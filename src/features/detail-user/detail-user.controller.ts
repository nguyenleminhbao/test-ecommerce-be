import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DetailUserService } from './detail-user.service';
import { User } from 'src/core/decorators/user.decorator';
import { CreateAddressDto } from './dto/create-address.dto';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('detail-user')
export class DetailUserController {
  constructor(private readonly detailUserService: DetailUserService) {}

  @Get('address')
  async getAllAddress(@User('id') userId: string) {
    try {
      const response = await this.detailUserService.getAllAddress(userId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('address')
  async createAddress(
    @User('id') userId: string,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    try {
      const response = await this.detailUserService.createAddress(
        userId,
        createAddressDto,
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Delete('address/:addressId')
  async deleteAddress(@Param('addressId') addressId: string) {
    try {
      const response = await this.detailUserService.deleteAddress(addressId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Get('account')
  async getAllAccount(@User('id') userId: string) {
    try {
      const response = await this.detailUserService.getAllAccount(userId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('account')
  async createAccount(
    @User('id') userId: string,
    @Body() createAccountDto: CreateAccountDto,
  ) {
    try {
      const response = await this.detailUserService.createAccount(
        userId,
        createAccountDto,
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Delete('account/:accountId')
  async deleteAccount(@Param('accountId') accountId: string) {
    try {
      const response = await this.detailUserService.deleteAccount(accountId);
      return response;
    } catch (err) {
      throw err;
    }
  }
}
