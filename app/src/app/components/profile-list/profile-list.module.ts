import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileListComponent } from './profile-list.component';
import { TableModule } from '../table/table.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ProfileListComponent,
  ],
  exports: [
    ProfileListComponent,
  ],
  imports: [
    CommonModule,
    PipesModule,
    TableModule,
  ]
})
export class ProfileListModule { }
