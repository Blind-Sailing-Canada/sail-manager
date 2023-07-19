import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { AdminGuard } from './auth/admin.guard';
import { AuthGuard } from './auth/auth.guard';
import { RootRoutes } from './routes/routes';

const routes: Routes = [
  {
    path: RootRoutes.LOGIN,
    loadChildren: () => import('./pages/login/login.module').then(mod => mod.LoginModule)
  },
  {
    path: RootRoutes.ERROR,
    loadChildren: () => import('./pages/error/error.module').then(mod => mod.ErrorModule)
  },
  {
    path: RootRoutes.ACCOUNT_REVIEW,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/account-review/account-review.module').then(mod => mod.AccountReviewModule)
  },
  {
    path: RootRoutes.SAIL_REQUESTS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/sail-request/sail-request.module').then(mod => mod.SailRequestModule)
  },
  {
    path: RootRoutes.DASHBOARD,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(mod => mod.DashboardModule)
  },
  {
    path: RootRoutes.MAINTENANCE,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/maintenance/maintenance.module').then(mod => mod.MaintenanceModule)
  },
  {
    path: RootRoutes.PROFILES,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/profile.module').then(mod => mod.ProfileModule),
  },
  {
    path: RootRoutes.PURCHASES,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/purchase/purchase.module').then(mod => mod.PurchaseModule),
  },
  {
    path: RootRoutes.BOATS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/boat/boat.module').then(mod => mod.BoatModule)
  },
  {
    path: RootRoutes.DOCUMENTS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/document/document.module').then(mod => mod.DocumentModule)
  },
  {
    path: RootRoutes.BOAT_CHECKLIST,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/boat-checklist/boat-checklist.module').then(mod => mod.BoatChecklistModule)
  },
  {
    path: RootRoutes.BOAT_INSTRUCTIONS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/boat-instructions/boat-instructions.module').then(mod => mod.BoatInstructionsModule)
  },
  {
    path: RootRoutes.SAILS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/sail/sail.module').then(mod => mod.SailModule)
  },
  {
    path: RootRoutes.SAIL_CHECKLISTS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/sail-checklist/sail-checklist.module').then(mod => mod.SailChecklistModule)
  },
  {
    path: RootRoutes.REQUIRED_ACTIONS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/required-actions/required-actions.module').then(mod => mod.RequiredActionsModule)
  },
  {
    path: RootRoutes.FEEDBACK,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/feedback/feedback.module').then(mod => mod.FeedbackModule)
  },
  {
    path: RootRoutes.ADMIN,
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () => import('./pages/admin/admin.module').then(mod => mod.AdminModule)
  },
  {
    path: RootRoutes.CHALLENGES,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/challenge/challenge.module').then(mod => mod.ChallengeModule)
  },
  {
    path: RootRoutes.CLINICS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/clinic/clinic.module').then(mod => mod.ClinicModule)
  },
  {
    path: RootRoutes.HELP,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/help/help.module').then(mod => mod.HelpModule)
  },
  {
    path: RootRoutes.MEDIA,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/media/media.module').then(mod => mod.MediaModule)
  },
  {
    path: RootRoutes.SOCIALS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/social/social.module').then(mod => mod.SocialModule)
  },
  {
    path: '',
    redirectTo: RootRoutes.DASHBOARD,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', scrollPositionRestoration: 'top' })
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
