// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

// Services
import { CryptoService } from './services/crypto.service';
import { CryptoApiService } from './services/crypto-api.service';

// Components
import { AppComponent } from './app.component';
import { TestLoginComponent } from './pages/test-login/test-login.component';
import { LoginComponent } from './pages/login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    TestLoginComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot()
  ],
  providers: [CryptoService, CryptoApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
