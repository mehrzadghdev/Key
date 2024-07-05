import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProductComponent } from './list-product/list-product.component';
import { UnitComponent } from './unit/unit.component';

const routes: Routes = [
  { path: '', component: ListProductComponent },
  { path: 'unit', component: UnitComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
