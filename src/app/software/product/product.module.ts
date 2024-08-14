import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ListProductComponent } from './list-product/list-product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { SharedModule } from '../../shared/shared.module';
import { UnitComponent } from './unit/unit.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { UpdateProductComponent } from './update-product/update-product.component';
import { MatTableModule } from '@angular/material/table';
import { ProductIdSearchComponent } from './product-id-search/product-id-search.component';
import {ClipboardModule} from '@angular/cdk/clipboard';


@NgModule({
  declarations: [
    ListProductComponent,
    CreateProductComponent,
    UnitComponent,
    UpdateProductComponent,
    ProductIdSearchComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    NgxMaskDirective,
    MatTableModule,
    ClipboardModule
  ],
  providers: [
    provideNgxMask(),
  ]
})
export class ProductModule { }
