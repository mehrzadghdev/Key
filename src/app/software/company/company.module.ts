import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { ListCompanyComponent } from './list-company/list-company.component';
import { SharedModule } from '../../shared/shared.module';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { SelectCompanyComponent } from './select-company/select-company.component'
import { UpdateCompanyComponent } from './update-company/update-company.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { GenerateKeysComponent } from './generate-keys/generate-keys.component';

@NgModule({
  declarations: [
    ListCompanyComponent,
    CreateCompanyComponent,
    SelectCompanyComponent,
    UpdateCompanyComponent,
    GenerateKeysComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    SharedModule,
    MatProgressBarModule
  ]
})
export class CompanyModule { }
