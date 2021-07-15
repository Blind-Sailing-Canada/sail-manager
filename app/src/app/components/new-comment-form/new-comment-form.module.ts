import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { NewCommentFormComponent } from './new-comment-form.component';

@NgModule({
  declarations: [
    NewCommentFormComponent,
  ],
  exports: [
    NewCommentFormComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class NewCommentFormModule { }
