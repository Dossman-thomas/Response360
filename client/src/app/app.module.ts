// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Services
import { CryptoService } from './services/crypto.service';
import { CryptoApiService } from './services/crypto-api.service';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ManageOrganizationsComponent } from './pages/manage-organizations/manage-organizations.component';
import { OrganizationDetailsComponent } from './pages/organization-details/organization-details.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, DashboardComponent, ManageOrganizationsComponent, OrganizationDetailsComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 1500, // 1.5 seconds
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    CryptoService,
    CryptoApiService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
