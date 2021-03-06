import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {IvyCarouselModule} from 'angular-responsive-carousel';


import { SharedModule } from '../shared/shared.module';
import { LodgingRoutingModule } from './lodging-routing.module';

import { EditLodgingComponent } from './components/edit/edit.component';
import { LodgingService } from './services/lodging.service';
import { LodgingImageComponent } from './components/image/image.component';
import { GlobalErrorHandler } from 'src/app/services/error-handler.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { LodgingDetailsComponent } from './components/details/details.component';
import { LodgingResolver } from './services/lodging-resolver.service';
import { AgreementChoiceComponent } from './components/agreements-choice/agreements-choice.component';
import { AddressChoiceComponent } from './components/address-choice/address-choice.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@NgModule({
  declarations: [
    EditLodgingComponent,
    LodgingImageComponent,
    HomeComponent,
    LodgingDetailsComponent,
    AgreementChoiceComponent,
    AddressChoiceComponent
  ],
  imports: [
    ReactiveFormsModule,
    SharedModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatBadgeModule,
    MatRadioModule,
    FontAwesomeModule,
    MatDialogModule,
    MatCardModule,
    MatTooltipModule,
    LodgingRoutingModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatProgressSpinnerModule,
    IvyCarouselModule,
    MatProgressBarModule,
    MatCheckboxModule
  ],
  providers: [
    LodgingService,
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    { provide: HTTP_INTERCEPTORS, useClass: GlobalErrorHandler, multi: true },
    LodgingResolver
  ],
  entryComponents: [
    LodgingImageComponent,
    AgreementChoiceComponent,
    AddressChoiceComponent
  ]
})
export class LodgingModule { }
