import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMaskDirective } from 'ngx-mask';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddInvoiceProductComponent } from './add-invoice-product/add-invoice-product.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ListInvoiceComponent } from './list-invoice/list-invoice.component';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UpdateInvoiceComponent } from './update-invoice/update-invoice.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { CurrencyListComponent } from './currency-list/currency-list.component';


@NgModule({
  declarations: [
    CreateInvoiceComponent,
    AddInvoiceProductComponent,
    ListInvoiceComponent,
    UpdateInvoiceComponent,
    CurrencyListComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    SharedModule,
    NgxMaskDirective
  ]
})
export class InvoiceModule { }
