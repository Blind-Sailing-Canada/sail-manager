import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { AccountReviewComponent } from './account-review.component';

const routes: Routes = [
  {
    path: '',
    component: AccountReviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountReviewRoutingModule { }
