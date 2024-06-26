import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { PanelComponent } from './components/panel/panel.component';
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

export function playerFactory() { 
  return import('lottie-web'); 
}  

@NgModule({
  declarations: [
    PanelComponent,
    LoadingComponent,
    JdatePipe,
    TableLoadingComponent,
    RandomWidthDirective
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
    PanelComponent,
    LoadingComponent,
    JdatePipe,
    TableLoadingComponent,
    RandomWidthDirective
  ] 
})
export class SharedModule { }
