import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { SubRoutes } from '../../routes/routes';
import { PurchaseListPageComponent } from './purchase-list-page/purchase-list-page.component';
import { PurchaseOutstandingPageComponent } from './purchase-outstanding-page/purchase-outstanding-page.component';
import { PurchaseViewPageComponent } from './purchase-view-page/purchase-view-page.component';

const routes: Routes = [
  {
    path: `${SubRoutes.VIEW_PURCHASE}/:id`,
    pathMatch: 'full',
    component: PurchaseViewPageComponent,
  },
  {
    path: `${SubRoutes.LIST_PURCHASES}`,
    component: PurchaseListPageComponent,
  },
  {
    path: `${SubRoutes.OUTSTANDING_PURCHASES}/:profile_id`,
    component: PurchaseOutstandingPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
