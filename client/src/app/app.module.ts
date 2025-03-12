// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

// Services
import { CryptoService } from './services/crypto.service';
import { CryptoApiService } from './services/crypto-api.service';

// Components
import { AppComponent } from './app.component';
// import { LoginComponent } from './pages/login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    // LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ToastrModule.forRoot()
  ],
  providers: [CryptoService, CryptoApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
