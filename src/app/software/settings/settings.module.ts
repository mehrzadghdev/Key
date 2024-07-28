import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  declarations: [
    UserSettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatRippleModule
  ]
})
export class SettingsModule { }
