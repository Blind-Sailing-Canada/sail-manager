import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { BasePageModule } from '../base-page/base-page.module';
import { EmailPasswordComponent } from './email-password/register/email-password.component';
import { ResetPasswordComponent } from './email-password/reset-password/reset-password.component';
import { LoginPageComponent } from './login-page.component';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  declarations: [
    EmailPasswordComponent,
    LoginPageComponent,
    ResetPasswordComponent,
  ],
  imports: [
    AngularMaterialModule,
    BasePageModule,
    CommonModule,
    FormsModule,
    LoginRoutingModule,
    ReactiveFormsModule,
  ]
})
export class LoginModule { }
