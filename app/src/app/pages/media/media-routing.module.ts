import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { MediaDialogModule } from '../../components/media-dialog/media-dialog.module';
import { MediaEditPageComponent } from './media-edit-page/media-edit-page.component';
import { MediaListPageComponent } from './media-list-page/media-list-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MediaListPageComponent,
  },
  {
    path: 'list',
    component: MediaListPageComponent,
  },
  {
    path: 'edit/:id',
    component: MediaEditPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, MediaDialogModule]
})
export class MediaRoutingModule { }
