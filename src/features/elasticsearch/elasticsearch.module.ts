import { Module } from '@nestjs/common';
import { SearchController } from './elasticsearch.controller';
import { SearchService } from './elasticsearch.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
