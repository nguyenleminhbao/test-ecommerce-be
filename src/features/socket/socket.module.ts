import { Module } from '@nestjs/common';
import { SocketGateWay } from './socket.gateway';

@Module({
  providers: [SocketGateWay],
  exports: [SocketGateWay],
})
export class SocketModule {}
