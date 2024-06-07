import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { User } from 'src/core/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { RoleGuard } from 'src/core/guards/role.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @User() user: IUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    try {
      const response = await this.orderService.createOrder(
        user,
        createOrderDto,
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Get()
  async getAllOrder(@User('id') userId: string) {
    try {
      const respone = await this.orderService.getAllOrder(userId);
      return respone;
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(RoleGuard)
  @Get('get-all-order')
  async getAllOrderSystem() {
    try {
      const response = await this.orderService.getAllOrderSystem();
      return response;
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(RoleGuard)
  @Get('get-one-order/:orderId')
  async getOneOrderSystem(@Param('orderId') orderId: string) {
    try {
      const response = await this.orderService.getOneOrderSystem(orderId);
      return response;
    } catch (err) {
      throw err;
    }
  }
}
