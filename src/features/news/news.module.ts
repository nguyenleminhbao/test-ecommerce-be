import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { UploadModule } from '../upload/upload.module';
import { SearchModule } from '../elasticsearch/elasticsearch.module';

@Module({
  imports: [UploadModule, SearchModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
