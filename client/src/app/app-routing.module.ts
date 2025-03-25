import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';


import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ManageOrganizationsComponent } from './pages/manage-organizations/manage-organizations.component';
import { OrganizationDetailsComponent } from './pages/organization-details/organization-details.component';


const routes: Routes = [
  { path: 'super-admin-login', component: LoginComponent },
  // You can add more routes here
  { path: '', redirectTo: '/super-admin-login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'manage-organizations', component: ManageOrganizationsComponent, canActivate: [AuthGuard] },
  { path: 'organization-details', component: OrganizationDetailsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
