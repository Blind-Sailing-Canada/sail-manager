import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { CreateClinicGuard } from '../../auth/create-clinic.guard';
import { EditClinicGuard } from '../../auth/edit-clinic.guard';
import { SubRoutes } from '../../routes/routes';
import { ClinicEditPageComponent } from './clinic-edit-page/clinic-edit-page.component';
import { ClinicListPageComponent } from './clinic-list-page/clinic-list-page.component';
import { ClinicViewPageComponent } from './clinic-view-page/clinic-view-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: SubRoutes.LIST_CLINICS,
  },
  {
    path: `${SubRoutes.VIEW_CLINIC}/:clinic_id`,
    component: ClinicViewPageComponent,
  },
  {
    path: `${SubRoutes.EDIT_CLINIC}/:clinic_id`,
    canActivate: [EditClinicGuard],
    component: ClinicEditPageComponent,
  },
  {
    path: `${SubRoutes.CREATE_CLINIC}`,
    canActivate: [CreateClinicGuard],
    component: ClinicEditPageComponent,
  },
  {
    path: `${SubRoutes.LIST_CLINICS}`,
    component: ClinicListPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicRoutingModule { }
