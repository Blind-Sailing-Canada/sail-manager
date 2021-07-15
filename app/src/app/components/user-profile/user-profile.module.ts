import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { PipesModule } from '../../pipes/pipes.module';
import { IconTextModule } from '../icon-text/icon-text.module';
import { TableModule } from '../table/table.module';
import { UserProfileComponent } from './user-profile.component';

@NgModule({
  declarations: [
    UserProfileComponent,
  ],
  exports: [
    UserProfileComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    IconTextModule,
    PipesModule,
    TableModule,
  ]
})
export class UserProfileModule { }
