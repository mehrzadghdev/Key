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
import { DialogService } from './services/utilities/dialog.service';
import { LoadingComponent } from './components/loading/loading.component';
import { LottieModule } from 'ngx-lottie';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
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
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChartComponent } from './components/chart/chart.component';
import { AlertComponent } from './components/alert/alert.component';
import { HideTabsDirective } from './directives/hide-tabs.directive';

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
    TiledTableDirective,
    ChartComponent,
    AlertComponent,
    HideTabsDirective
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatRippleModule,
    MatMenuModule,
    FormsModule,
    MatBadgeModule,
    MatTabsModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatRippleModule,
    ReactiveFormsModule,
    MatSortModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatRadioModule,
    DragDropModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
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
    ChartComponent,
    DatePickerComponent,
    SkeletonComponent,
    JdatePipe,
    PricePipe,
    FarsiNumberPipe,
    RandomWidthDirective,
    AutoFocusDirective,
    PercentageInputDirective,
    TiledTableDirective,
    MatIconModule,
    MatRippleModule,
    MatMenuModule,
    MatTableModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    HideTabsDirective,
    DragDropModule,
  ] 
})
export class SharedModule { }
