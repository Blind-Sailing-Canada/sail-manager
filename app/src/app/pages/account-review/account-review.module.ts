import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccountReviewRoutingModule } from './account-review-routing.module';
import { AccountReviewComponent } from './account-review.component';
import { BasePageModule } from '../base-page/base-page.module';

@NgModule({
  declarations: [AccountReviewComponent],
  imports: [
    AccountReviewRoutingModule,
    BasePageModule,
    CommonModule,
  ]
})
export class AccountReviewModule { }
