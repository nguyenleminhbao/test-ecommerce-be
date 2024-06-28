import { Body, Controller, Get, Post } from '@nestjs/common';
import { LivestreamService } from './livestream.service';
import { Public } from 'src/core/decorators/public.decorator';
import { StreamCallbackDto } from './dto/streamCallback.dto';

@Controller('livestream')
export class LivestreamController {
  constructor(private readonly livestreamService: LivestreamService) {}

  @Public()
  @Post('start-stream')
  async startStreamCallback(@Body() body: StreamCallbackDto) {
    try {
      const response = await this.livestreamService.startStreamCallback(body);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Post('end-stream')
  async endStreamCallback(@Body() body: StreamCallbackDto) {
    try {
      const response = await this.livestreamService.endStreamCallback(body);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Get('')
  async getAllStream() {
    try {
      const response = await this.livestreamService.getAllStream();
      return response;
    } catch (err) {
      throw err;
    }
  }
}
