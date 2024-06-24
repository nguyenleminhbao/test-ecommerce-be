import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/core/decorators/public.decorator';
import { SearchService } from './elasticsearch.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Public()
  @Get()
  async test() {
    return await this.searchService.test();
  }
}
