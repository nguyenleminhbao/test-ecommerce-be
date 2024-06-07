import { Controller, Get } from '@nestjs/common';
import { Public } from './core/decorators/public.decorator';

@Controller()
export class AppController {
  @Get()
  @Public()
  async getEcommerce() {
    return 'I love you, more , more ,...';
  }
}
