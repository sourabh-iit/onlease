import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LodgingDetailsComponent } from './components/details/details.component';

import { EditLodgingComponent } from './components/edit/edit.component';
import { HomeComponent } from './components/home/home.component';
import { LodgingResolver } from './services/lodging-resolver.service';

const routes: Routes = [
  {
    path: 'edit/:lodgingId',
    component: EditLodgingComponent
  }, {
    path: 'details/:lodgingId',
    component: LodgingDetailsComponent,
    resolve: {
      lodging: LodgingResolver
    }
  }, {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LodgingRoutingModule { }
