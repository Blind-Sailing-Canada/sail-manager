import { MaintenanceEditPageComponent } from './maintenance-edit-page/maintenance-edit-page.component';
import { MaintenanceListPageComponent } from './maintenance-list-page/maintenance-list-page.component';
import { MaintenanceResolvePageComponent } from './maintenance-resolve-page/maintenance-resolve-page.component';
import { MaintenanceViewPageComponent } from './maintenance-view-page/maintenance-view-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubRoutes } from '../../routes/routes';
import { ResolveMaintenanceRequestGuard } from '../../auth/resolve-maintenance-request.guard';
import { EditMaintenanceRequestGuard } from '../../auth/edit-maintenance-request.guard';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceListPageComponent,
    pathMatch: 'full'
  },
  {
    path: SubRoutes.CREATE_MAINTENANCE,
    component: MaintenanceEditPageComponent,
  },
  {
    path: `${SubRoutes.EDIT_MAINTENANCE}/:id`,
    canActivate: [EditMaintenanceRequestGuard],
    component: MaintenanceEditPageComponent,
  },
  {
    path: `${SubRoutes.VIEW_MAINTENANCE}/:id`,
    component: MaintenanceViewPageComponent,
  },
  {
    path: `${SubRoutes.RESOLVE_MAINTENANCE}/:id`,
    canActivate: [ResolveMaintenanceRequestGuard],
    component: MaintenanceResolvePageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
