import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoftwareRoutingModule } from './software-routing.module';
import { SoftwareComponent } from './software.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule, playerFactory } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { LottieModule } from 'ngx-lottie';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    SoftwareComponent,
  ],
  imports: [
    CommonModule,
    SoftwareRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    SharedModule,
    CommonModule,
    MatIconModule,
    MatRippleModule,
    MatMenuModule,
    FormsModule,
    MatBadgeModule,
    MatDialogModule,
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
    LottieModule.forRoot({ player: playerFactory })
  ],
})
export class SoftwareModule { }
