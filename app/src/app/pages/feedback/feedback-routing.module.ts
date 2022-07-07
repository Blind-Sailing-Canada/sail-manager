import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { SubRoutes } from '../../routes/routes';
import { FeedbackListPageComponent } from './feedback-list-page/feedback-list-page.component';
import { FeedbackSubmitPageComponent } from './feedback-submit-page/feedback-submit-page.component';
import { FeedbackViewPageComponent } from './feedback-view-page/feedback-view-page.component';

const routes: Routes = [
  {
    path: '',
    component: FeedbackListPageComponent,
    pathMatch: 'full'
  },
  {
    path: `${SubRoutes.LIST_FEEDBACK}`,
    component: FeedbackListPageComponent,
  },
  {
    path: `${SubRoutes.LIST_FEEDBACK}/:sail_id`,
    component: FeedbackListPageComponent,
  },
  {
    path: `${SubRoutes.VIEW_FEEDBACK}/:feedback_id`,
    component: FeedbackViewPageComponent,
  },
  {
    path: `${SubRoutes.SUBMIT_FEEDBACK}/:sail_id`,
    component: FeedbackSubmitPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule { }
