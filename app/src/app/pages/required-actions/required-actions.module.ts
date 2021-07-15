import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequiredActionsRoutingModule } from './required-actions-routing.module';
import { RequiredActionPageComponent } from './required-action-page/required-action-page.component';

@NgModule({
  declarations: [RequiredActionPageComponent],
  imports: [
    CommonModule,
    RequiredActionsRoutingModule
  ]
})
export class RequiredActionsModule { }
