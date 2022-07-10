import {
  Controller, Delete, Param, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { SomeUserAccessGuard } from '../guards/some-user-access.guard';
import { UserAccessFields } from '../types/user-access/user-access-fields';
import { UserAccess } from '../user-access/user-access.decorator';
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
    alwaysPaginate: true,
    exclude: ['id'], // https://github.com/nestjsx/crud/issues/788
    sort: [
      {
        field: 'title',
        order: 'ASC',
      },
    ],
    join: { author: { eager: true } },
  },
  routes: {
    createOneBase: { interceptors: [new DocumentCreateInterceptor()] },
    updateOneBase: { interceptors: [new DocumentUpdateInterceptor()] },
  },
})
@Controller('document')
@ApiTags('document')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class DocumentController {
  constructor(public service: DocumentService, private firebaseService: FirebaseAdminService) { }

  @Delete('/:id')
  @UserAccess(UserAccessFields.CreateDocument)
  @UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, SomeUserAccessGuard)
  async deleteDocument(@Param('id') id) {
    await this.firebaseService.deleteFile(`/documents/${id}/`);
    await DocumentEntity.delete(id);
  }
}
