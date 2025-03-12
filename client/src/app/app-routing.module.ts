import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestLoginComponent } from './pages/test-login/test-login.component'; // Adjust this path if needed

const routes: Routes = [
  { path: 'test-login', component: TestLoginComponent },
  // You can add more routes here
  { path: '', redirectTo: '/test-login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
