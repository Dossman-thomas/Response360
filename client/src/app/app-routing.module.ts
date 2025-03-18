import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestLoginComponent } from './pages/test-login/test-login.component'; 
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  { path: '/super-admin-login', component: LoginComponent },
  // You can add more routes here
  { path: '', redirectTo: '/super-admin-login', pathMatch: 'full' },
  { path: '/dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
