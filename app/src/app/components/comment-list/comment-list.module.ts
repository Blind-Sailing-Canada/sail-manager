import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { PipesModule } from '../../pipes/pipes.module';
import { ProfileBulletModule } from '../profile-bullet/profile-bullet.module';
import { CommentListComponent } from './comment-list.component';

@NgModule({
  declarations: [
    CommentListComponent,
  ],
  exports: [
    CommentListComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ProfileBulletModule,
    PipesModule,
    FormsModule,
  ]
})
export class CommentListModule { }
