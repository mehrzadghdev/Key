import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list'
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from './services/dialog.service';
import { LoadingComponent } from './components/loading/loading.component';
import { LottieModule } from 'ngx-lottie';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { JdatePipe } from './pipes/jdate.pipe';
import { TableLoadingComponent } from './components/table-loading/table-loading.component';
import { RandomWidthDirective } from './directives/random-width.directive';
import { ButtonComponent } from './components/button/button.component';
import { PricePipe } from './pipes/price.pipe';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { AcceptDeleteComponent } from './components/accept-delete/accept-delete.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { FarsiNumberPipe } from './pipes/farsi-number.pipe';
import { SkeletonComponent } from './components/skeleton/skeleton.component';
import { PercentageInputDirective } from './directives/percentage-input.directive';
import { TiledTableDirective } from './directives/tiled-table.directive';

export function playerFactory() { 
  return import('lottie-web'); 
}  

@NgModule({
  declarations: [
    LoadingComponent,
    JdatePipe,
    TableLoadingComponent,
    RandomWidthDirective,
    ButtonComponent,
    PricePipe,
    AutoFocusDirective,
    AcceptDeleteComponent,
    DatePickerComponent,
    FarsiNumberPipe,
    SkeletonComponent,
    PercentageInputDirective,
    TiledTableDirective
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
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
    MatSnackBarModule,
    MatAutocompleteModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
    DialogService
  ],
  exports: [
    LoadingComponent,
    TableLoadingComponent,
    ButtonComponent,
    DatePickerComponent,
    SkeletonComponent,
    JdatePipe,
    PricePipe,
    FarsiNumberPipe,
    RandomWidthDirective,
    AutoFocusDirective,
    PercentageInputDirective,
    TiledTableDirective
  ] 
})
export class SharedModule { }
