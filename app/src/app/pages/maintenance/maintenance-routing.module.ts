import { MaintenanceEditPageComponent } from './maintenance-edit-page/maintenance-edit-page.component';
import { MaintenanceListPageComponent } from './maintenance-list-page/maintenance-list-page.component';
import { MaintenanceResolvePageComponent } from './maintenance-resolve-page/maintenance-resolve-page.component';
import { MaintenanceViewPageComponent } from './maintenance-view-page/maintenance-view-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SUB_ROUTES } from '../../routes/routes';
import { ResolveMaintenanceRequestGuard } from '../../auth/resolve-maintenance-request.guard';
import { EditMaintenanceRequestGuard } from '../../auth/edit-maintenance-request.guard';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceListPageComponent,
  },
  {
    path: SUB_ROUTES.CREATE_MAINTENANCE,
    component: MaintenanceEditPageComponent,
  },
  {
    path: `${SUB_ROUTES.EDIT_MAINTENANCE}/:id`,
    canActivate: [EditMaintenanceRequestGuard],
    component: MaintenanceEditPageComponent,
  },
  {
    path: `${SUB_ROUTES.VIEW_MAINTENANCE}/:id`,
    component: MaintenanceViewPageComponent,
  },
  {
    path: `${SUB_ROUTES.RESOLVE_MAINTENANCE}/:id`,
    canActivate: [ResolveMaintenanceRequestGuard],
    component: MaintenanceResolvePageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
