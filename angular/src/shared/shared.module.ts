import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ToMinutesAndSecondsPipe } from './pipes';
import { LodgingCardComponent } from './components/lodging-card/lodging-card.component';


import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import {MatRadioModule} from '@angular/material/radio';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    ToMinutesAndSecondsPipe,
    LodgingCardComponent,
    ConfirmDialogComponent
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
    MatTooltipModule
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
    ConfirmDialogComponent
  ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class SharedModule { }
