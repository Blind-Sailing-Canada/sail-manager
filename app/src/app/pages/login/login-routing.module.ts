import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { SubRoutes } from '../../routes/routes';
import { EmailPasswordComponent } from './email-password/register/email-password.component';
import { ResetPasswordComponent } from './email-password/reset-password/reset-password.component';
import { LoginPageComponent } from './login-page.component';

const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
  },
  {
    path: SubRoutes.EMAIL_AND_PASSWORD,
    component: EmailPasswordComponent,
  },
  {
    path: SubRoutes.RESET_PASSWORD,
    component: ResetPasswordComponent,
  },
  {
    path: ':token',
    component: LoginPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
