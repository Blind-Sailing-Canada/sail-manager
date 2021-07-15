import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconTextComponent } from './icon-text.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

@NgModule({
  declarations: [
    IconTextComponent,
  ],
  exports: [
    IconTextComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
  ]
})
export class IconTextModule { }
