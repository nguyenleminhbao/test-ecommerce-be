import { Module } from '@nestjs/common';
import { DetailUserService } from './detail-user.service';
import { DetailUserController } from './detail-user.controller';

@Module({
  providers: [DetailUserService],
  controllers: [DetailUserController],
})
export class DetailUserModule {}
