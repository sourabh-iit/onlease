import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { MapService } from './services/map.service';

@NgModule({
  declarations: [
  ],
  imports: [
    ReactiveFormsModule,
    SharedModule,
    AdminRoutingModule
  ],
  providers: [
    MapService
  ]
})
export class AdminModule { }
