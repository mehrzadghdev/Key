import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListInvoiceComponent } from './list-invoice/list-invoice.component';
import { CurrencyComponent } from './currency/currency.component';

const routes: Routes = [
  { path: '', component: ListInvoiceComponent },
  { path: 'currency', component: CurrencyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
