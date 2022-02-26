import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { VirtualTourComponent } from './components/virutal-tour/virtual-tour.component';
import { ToMinutesAndSecondsPipe } from './pipes';
import { LodgingCardComponent } from './components/lodging-card/lodging-card.component';

@NgModule({
  declarations: [
    ToMinutesAndSecondsPipe,
    LodgingCardComponent,
    ConfirmDialogComponent,
    VirtualTourComponent
  ],
  imports: [
    RouterModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatBadgeModule,
    MatRadioModule,
    FontAwesomeModule,
    MatDialogModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatExpansionModule,
    MatListModule,
    MatAutocompleteModule,
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
    DatePipe,
    TitleCasePipe
  ],
  exports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    ToMinutesAndSecondsPipe,
    LodgingCardComponent,
    ConfirmDialogComponent,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatBadgeModule,
    MatRadioModule,
    FontAwesomeModule,
    MatDialogModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatExpansionModule,
    MatListModule,
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
  entryComponents: [
    ConfirmDialogComponent,
    VirtualTourComponent
  ]
})
export class SharedModule { }
