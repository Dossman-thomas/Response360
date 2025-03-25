import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

import { LayoutComponent } from './pages/layout/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ManageOrganizationsComponent } from './pages/manage-organizations/manage-organizations.component';
import { OrganizationDetailsComponent } from './pages/organization-details/organization-details.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/super-admin-login', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-organizations',
        component: ManageOrganizationsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'organization-details',
        component: OrganizationDetailsComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  { path: 'super-admin-login', component: LoginComponent },
  { path: '**', redirectTo: '/super-admin-login' }, // Redirect to the login page if the URL is invalid
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
