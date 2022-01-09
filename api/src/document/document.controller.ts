import {
  Controller, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { DocumentCreateInterceptor } from './document-create.interceptor';
import { DocumentUpdateInterceptor } from './document-update.interceptor';
import { DocumentEntity } from './document.entity';
import { DocumentService } from './document.service';

@Crud({
  model: { type: DocumentEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    alwaysPaginate: false,
    join: { author: {
      eager: true,
      alias: 'document_author',
    } },
  },
  routes: {
    createOneBase: { interceptors: [new DocumentCreateInterceptor() ] },
    updateOneBase: { interceptors: [new DocumentUpdateInterceptor()] },
  },
})
@Controller('document')
@ApiTags('document')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class DocumentController {
  constructor(public service: DocumentService) { }
}
