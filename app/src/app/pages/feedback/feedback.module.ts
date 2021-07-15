import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { TableModule } from '../../components/table/table.module';
import { PipesModule } from '../../pipes/pipes.module';
import { FeedbackListPageComponent } from './feedback-list-page/feedback-list-page.component';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackSubmitPageComponent } from './feedback-submit-page/feedback-submit-page.component';
import { FeedbackViewPageComponent } from './feedback-view-page/feedback-view-page.component';

@NgModule({
  declarations: [
    FeedbackListPageComponent,
    FeedbackSubmitPageComponent,
    FeedbackViewPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FeedbackRoutingModule,
    FormsModule,
    PipesModule,
    ReactiveFormsModule,
    TableModule,
  ]
})
export class FeedbackModule { }
