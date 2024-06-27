import { Module } from '@nestjs/common';
import { LivestreamController } from './livestream.controller';
import { LivestreamService } from './livestream.service';
import { SocketModule } from '../socket/socket.module';

@Module({
  controllers: [LivestreamController],
  providers: [LivestreamService],
  imports: [SocketModule],
})
export class LivestreamModule {}
