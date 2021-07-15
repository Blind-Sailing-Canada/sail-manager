import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { CreateChallengeGuard } from '../../auth/create-challenge.guard';
import { EditChallengeGuard } from '../../auth/edit-challenge.guard';
import { SUB_ROUTES } from '../../routes/routes';
import { ChallengeEditPageComponent } from './challenge-edit-page/challenge-edit-page.component';
import { ChallengeListPageComponent } from './challenge-list-page/challenge-list-page.component';
import { ChallengeViewPageComponent } from './challenge-view-page/challenge-view-page.component';

const routes: Routes = [
  {
    path: `${SUB_ROUTES.VIEW_CHALLENGE}/:challengeId`,
    component: ChallengeViewPageComponent,
  },
  {
    path: `${SUB_ROUTES.EDIT_CHALLENGE}/:challengeId`,
    canActivate: [EditChallengeGuard],
    component: ChallengeEditPageComponent,
  },
  {
    path: `${SUB_ROUTES.CREATE_CHALLENGE}`,
    canActivate: [CreateChallengeGuard],
    component: ChallengeEditPageComponent,
  },
  {
    path: SUB_ROUTES.LIST_CHALLENGES,
    component: ChallengeListPageComponent,
  },
  {
    path: '',
    redirectTo: SUB_ROUTES.LIST_CHALLENGES,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChallengeRoutingModule { }
