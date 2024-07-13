import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SoftwareComponent } from './software.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'company',
    pathMatch: 'full'
  },
  { 
    path: '',
    component: SoftwareComponent,
    children: [
      {
        path: "company",
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule),
        data: { animation: 'One' }
      },
      {
        path: "person",
        loadChildren: () => import('./person/person.module').then(m => m.PersonModule),
        data: { animation: 'Two' }
      },
      {
        path: "product",
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
        data: { animation: 'Three' }
      },
      {
        path: "invoice",
        loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule),
        data: { animation: 'Four' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SoftwareRoutingModule { }
