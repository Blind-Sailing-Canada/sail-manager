import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

@NgModule({
  declarations: [
    FooterComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
  ],
  exports: [
    FooterComponent,
  ]
})
export class FooterModule { }
