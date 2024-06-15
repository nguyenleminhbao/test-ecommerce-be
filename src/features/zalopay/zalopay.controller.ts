import { Body, Controller, Get, Post } from '@nestjs/common';
import { ZaloPayService } from './zalopay.service';
import { GetStatusOrderDto } from './dto/get-status.dto';
import { CallbackDto } from './dto/callback.dto';
import { Public } from 'src/core/decorators/public.decorator';
import { User } from 'src/core/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { BeforeOrderDto } from './dto/before-order.dto';

@Controller('zalopay')
export class ZaloPayController {
  constructor(private readonly zaloPayService: ZaloPayService) {}

  @Post('create-qr')
  async createBeforeOrderQR(
    @User() user: IUser,
    @Body() beforeOrderDto: BeforeOrderDto,
  ) {
    try {
      const response = await this.zaloPayService.createBeforeOrderQR(
        user,
        beforeOrderDto,
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('create-atm')
  async createBeforeOrderATM(
    @User() user: IUser,
    @Body() beforeOrderDto: BeforeOrderDto,
  ) {
    try {
      const response = await this.zaloPayService.createBeforeOrderATM(
        user,
        beforeOrderDto,
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('get-status')
  async getStatusOrder(@Body() getStatusOrderDto: GetStatusOrderDto) {
    try {
      const response = await this.zaloPayService.getStatusOrder(
        getStatusOrderDto?.app_trans_id,
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('callback-payment')
  @Public()
  async callbackPayment(@Body() callbackDto: CallbackDto) {
    try {
      const response = await this.zaloPayService.callbackPayment(callbackDto);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Get('get-banks')
  @Public()
  async getBanks() {
    try {
      const response = await this.zaloPayService.getBanks();
      return response;
    } catch (err) {
      throw err;
    }
  }
}
