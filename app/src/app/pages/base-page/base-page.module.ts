import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePageComponent } from './base-page.component';
import { BoatDialogModule } from '../../components/boat-dialog/boat-dialog.module';
import { ProfileDialogModule } from '../../components/profile-dialog/profile-dialog.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    BasePageComponent,
  ],
  exports: [
    BasePageComponent,
  ],
  imports: [
    BoatDialogModule,
    CommonModule,
    PipesModule,
    ProfileDialogModule,
  ]
})
export class BasePageModule { }
