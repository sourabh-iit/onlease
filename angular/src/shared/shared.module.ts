import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToMinutesAndSecondsPipe } from './pipes';

@NgModule({
  declarations: [
    ToMinutesAndSecondsPipe
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [
  ],
  exports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    ToMinutesAndSecondsPipe
  ]
})
export class SharedModule { }
