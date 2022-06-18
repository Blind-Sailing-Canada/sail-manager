import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaRoutingModule { }
