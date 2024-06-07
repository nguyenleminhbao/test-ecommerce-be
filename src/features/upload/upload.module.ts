import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadProvider } from './upload.provider';
import { UploadController } from './upload.controller';

@Module({
  providers: [UploadService, UploadProvider],
  exports: [UploadService, UploadProvider],
  controllers: [UploadController],
})
export class UploadModule {}
