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
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { UserService } from './services/user.service';
import { GlobalErrorHandler } from './services/error-handler.service';
import {
  faBuilding,
  faChevronLeft,
  faChevronRight,
  faHeart,
  faLock,
  faMapMarkerAlt,
  faPencilAlt,
  faPlus,
  faRupeeSign,
  faSpinner,
  faTimesCircle,
  faTrash,
  faUpload,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import { ToasterService } from './services/toaster.service';
import { RegionsService } from './services/regions.service';
import { ConstantsService } from './services/constants.service';

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
    ToastrModule.forRoot(),
    FontAwesomeModule,
    FontAwesomeModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: GlobalErrorHandler, multi: true },
    UserService,
    ToasterService,
    RegionsService,
    ConstantsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faUserCircle);
    library.addIcons(faUpload);
    library.addIcons(faTrash);
    library.addIcons(faTimesCircle);
    library.addIcons(faPlus);
    library.addIcons(faPencilAlt);
    library.addIcons(faSpinner);
    library.addIcons(faChevronLeft);
    library.addIcons(faChevronRight);
    library.addIcons(faRupeeSign);
    library.addIcons(faMapMarkerAlt);
    library.addIcons(faHeart);
    library.addIcons(faBuilding);
    library.addIcons(faLock);
  }
}
