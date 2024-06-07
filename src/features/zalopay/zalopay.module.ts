import { Module } from '@nestjs/common';
import { ZaloPayController } from './zalopay.controller';
import { ZaloPayService } from './zalopay.service';
import { OrderModule } from '../order/order.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [OrderModule, SocketModule],
  controllers: [ZaloPayController],
  providers: [ZaloPayService],
})
export class ZaloPayModule {}
