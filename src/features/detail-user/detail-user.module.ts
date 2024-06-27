import { Module } from '@nestjs/common';
import { DetailUserService } from './detail-user.service';
import { DetailUserController } from './detail-user.controller';
import { SocketModule } from '../socket/socket.module';

@Module({
  providers: [DetailUserService],
  controllers: [DetailUserController],
  imports: [SocketModule],
})
export class DetailUserModule {}
