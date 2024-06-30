import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { ListCompanyComponent } from './list-company/list-company.component';
import { SharedModule } from '../../shared/shared.module';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { SelectCompanyComponent } from './select-company/select-company.component'
import { MatTooltipModule } from '@angular/material/tooltip';
import { UpdateCompanyComponent } from './update-company/update-company.component';

@NgModule({
  declarations: [
    ListCompanyComponent,
    CreateCompanyComponent,
    SelectCompanyComponent,
    UpdateCompanyComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    SharedModule,
    MatIconModule,
    MatRippleModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule
  ]
})
export class CompanyModule { }
