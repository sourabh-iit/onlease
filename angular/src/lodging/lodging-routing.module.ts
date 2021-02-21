import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditLodgingComponent } from './components/edit/edit.component';

const routes: Routes = [{
  path: 'edit/:lodgingId',
  component: EditLodgingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LodgingRoutingModule { }
