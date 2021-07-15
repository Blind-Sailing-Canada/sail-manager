import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ErrorRoutingModule } from './error-routing.module';

@NgModule({
  declarations: [
    ErrorPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ErrorRoutingModule,
  ]
})
export class ErrorModule { }
