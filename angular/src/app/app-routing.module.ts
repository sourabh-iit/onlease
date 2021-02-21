import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'user',
    loadChildren: () => import('../user/user.module').then(m => m.UserModule)
  },
  {
    path: 'lodgings',
    loadChildren: () => import('../lodging/lodging.module').then(m => m.LodgingModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
