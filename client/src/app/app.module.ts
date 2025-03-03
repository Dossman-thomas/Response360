import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { CryptoService } from './services/crypto.service';
import { CryptoApiService } from './services/crypto-api.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [CryptoService, CryptoApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
