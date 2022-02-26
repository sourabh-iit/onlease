import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { TransactionComponent } from './components/transaction/transaction.component';
import { TransactionService } from './services/transaction.service';
import { TransactionsRoutingModule } from './transactions-routing.module';

@NgModule({
  declarations: [
    TransactionComponent
  ],
  imports: [
    TransactionsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule
  ],
  providers: [
    TransactionService
  ]
})
export class TransactionsModule { }
