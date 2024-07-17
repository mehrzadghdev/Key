import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonRoutingModule } from './person-routing.module';
import { ListPersonComponent } from './list-person/list-person.component';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CreatePersonComponent } from './create-person/create-person.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRippleModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UpdatePersonComponent } from './update-person/update-person.component';
import { A11yModule } from '@angular/cdk/a11y';
import { } from '@angular/cdk';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    ListPersonComponent,
    CreatePersonComponent,
    UpdatePersonComponent
  ],
  imports: [
    CommonModule,
    PersonRoutingModule,
    SharedModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatRippleModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule
  ]
})
export class PersonModule { }
