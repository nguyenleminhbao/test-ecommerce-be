import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/core/decorators/public.decorator';
import { SearchService } from './elasticsearch.service';
import { ElasticsearchIndex } from 'src/common/enum/elasticsearch-index.enum';
import { title } from 'process';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Public()
  @Get()
  async test() {
    return await this.searchService.test();
  }

  @Public()
  @Post()
  async search(
    @Body()
    {
      typeIndex,
      titleSearch,
    }: {
      typeIndex: ElasticsearchIndex;
      titleSearch: string;
    },
  ) {
    try {
      const reponse = await this.searchService.search(typeIndex, titleSearch);
      return reponse;
    } catch (err) {
      throw err;
    }
  }
}
