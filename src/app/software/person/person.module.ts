import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonRoutingModule } from './person-routing.module';
import { ListPersonComponent } from './list-person/list-person.component';
import { SharedModule } from '../../shared/shared.module';
import { CreatePersonComponent } from './create-person/create-person.component';
import { UpdatePersonComponent } from './update-person/update-person.component';
import { NgxMaskDirective } from 'ngx-mask';
import { ImportPersonsComponent } from './import-persons/import-persons.component';


@NgModule({
  declarations: [
    ListPersonComponent,
    CreatePersonComponent,
    UpdatePersonComponent,
    ImportPersonsComponent
  ],
  imports: [
    CommonModule,
    PersonRoutingModule,
    SharedModule,
    NgxMaskDirective
  ]
})
export class PersonModule { }
