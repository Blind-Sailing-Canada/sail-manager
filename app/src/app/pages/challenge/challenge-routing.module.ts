import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { CreateChallengeGuard } from '../../auth/create-challenge.guard';
import { EditChallengeGuard } from '../../auth/edit-challenge.guard';
import { SubRoutes } from '../../routes/routes';
import { ChallengeEditPageComponent } from './challenge-edit-page/challenge-edit-page.component';
import { ChallengeListPageComponent } from './challenge-list-page/challenge-list-page.component';
import { ChallengeViewPageComponent } from './challenge-view-page/challenge-view-page.component';

const routes: Routes = [
  {
    path: `${SubRoutes.VIEW_CHALLENGE}/:challenge_id`,
    component: ChallengeViewPageComponent,
  },
  {
    path: `${SubRoutes.EDIT_CHALLENGE}/:challenge_id`,
    canActivate: [EditChallengeGuard],
    component: ChallengeEditPageComponent,
  },
  {
    path: `${SubRoutes.CREATE_CHALLENGE}`,
    canActivate: [CreateChallengeGuard],
    component: ChallengeEditPageComponent,
  },
  {
    path: SubRoutes.LIST_CHALLENGES,
    component: ChallengeListPageComponent,
  },
  {
    path: '',
    redirectTo: SubRoutes.LIST_CHALLENGES,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChallengeRoutingModule { }
