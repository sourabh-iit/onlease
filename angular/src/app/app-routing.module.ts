import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'user',
    loadChildren: () => import('../user/user.module').then(m => m.UserModule)
  }, {
    path: 'transactions',
    loadChildren: () => import('../transactions/transactions.module').then(m => m.TransactionsModule)
  }, {
    path: 'lodgings',
    loadChildren: () => import('../lodging/lodging.module').then(m => m.LodgingModule)
  }, {
    path: 'admin',
    loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule)
  }, {
    path: '',
    redirectTo: 'lodgings',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
