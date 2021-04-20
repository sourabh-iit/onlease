import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
    MatListModule
  ],
  providers: [
  ],
  exports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    ToMinutesAndSecondsPipe,
    LodgingCardComponent,
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
    ConfirmDialogComponent,
    MatExpansionModule,
    MatListModule
  ],
  entryComponents: [
    ConfirmDialogComponent,
    VirtualTourComponent
  ]
})
export class SharedModule { }
