import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { SUB_ROUTES } from '../../routes/routes';
import { FeedbackListPageComponent } from './feedback-list-page/feedback-list-page.component';
import { FeedbackSubmitPageComponent } from './feedback-submit-page/feedback-submit-page.component';
import { FeedbackViewPageComponent } from './feedback-view-page/feedback-view-page.component';

const routes: Routes = [
  {
    path: '',
    component: FeedbackListPageComponent,
  },
  {
    path: `${SUB_ROUTES.LIST_FEEDBACK}`,
    component: FeedbackListPageComponent,
  },
  {
    path: `${SUB_ROUTES.LIST_FEEDBACK}/:sail_id`,
    component: FeedbackListPageComponent,
  },
  {
    path: `${SUB_ROUTES.VIEW_FEEDBACK}/:feedbackId`,
    component: FeedbackViewPageComponent,
  },
  {
    path: `${SUB_ROUTES.SUBMIT_FEEDBACK}/:sail_id`,
    component: FeedbackSubmitPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule { }
