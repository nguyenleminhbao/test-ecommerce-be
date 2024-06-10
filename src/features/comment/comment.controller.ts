import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { User } from 'src/core/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { CreateCommentDto } from './dto/createComment.dto';
import { Public } from 'src/core/decorators/public.decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createComment(
    @User() user: IUser,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    try {
      const response = await this.commentService.createComment(
        user,
        createCommentDto,
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Get(':etag')
  async getCommentByEtag(@Param('etag') etag: string) {
    try {
      const response = await this.commentService.getCommentByEtag(etag);
      return response;
    } catch (err) {
      throw err;
    }
  }
}
