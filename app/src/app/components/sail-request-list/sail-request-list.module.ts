import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { PipesModule } from '../../pipes/pipes.module';
import { ProfileBulletModule } from '../profile-bullet/profile-bullet.module';
import { TableModule } from '../table/table.module';
import { SailRequestListComponent } from './sail-request-list.component';

@NgModule({
  declarations: [
    SailRequestListComponent,
  ],
  exports: [
    SailRequestListComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    PipesModule,
    ProfileBulletModule,
    TableModule,
  ]
})
export class SailRequestListModule { }
