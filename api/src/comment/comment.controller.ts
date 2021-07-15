import {
  Controller, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';

@Crud({
  model: { type: CommentEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    alwaysPaginate: true,
    join: {
      author: {
        eager: true,
        alias: 'comment_author',
      },
      replies: { eager: true },
      'replies.author': { eager: true },
    },
  },
})
@Controller('comment')
@ApiTags('comment')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class CommentController {
  constructor(public service: CommentService) { }
}
