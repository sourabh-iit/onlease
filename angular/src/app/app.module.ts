import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ToastrModule } from 'ngx-toastr';

import { UserService } from './services/user.service';
import { GlobalErrorHandler } from './services/error-handler.service';
import { ToasterService } from './services/toaster.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    ToastrModule.forRoot()
  ],
  providers: [
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: GlobalErrorHandler, multi: true },
    ToasterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
