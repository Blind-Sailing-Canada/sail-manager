import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { CreateDocumentGuard } from '../../auth/create-document.guard';
import { EditDocumentGuard } from '../../auth/edit-document.guard';
import { SubRoutes } from '../../routes/routes';
import { DocumentEditPageComponent } from './document-edit-page/document-edit-page.component';
import { DocumentListPageComponent } from './document-list-page/document-list-page.component';
import { DocumentViewPageComponent } from './document-view-page/document-view-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: SubRoutes.LIST_DOCUMENTS,
  },
  {
    path: `${SubRoutes.VIEW_DOCUMENT}/:document_id`,
    component: DocumentViewPageComponent,
  },
  {
    path: `${SubRoutes.EDIT_DOCUMENT}/:document_id`,
    canActivate: [EditDocumentGuard],
    component: DocumentEditPageComponent,
  },
  {
    path: `${SubRoutes.CREATE_DOCUMENT}`,
    canActivate: [CreateDocumentGuard],
    component: DocumentEditPageComponent,
  },
  {
    path: `${SubRoutes.LIST_DOCUMENTS}`,
    component: DocumentListPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentRoutingModule { }
