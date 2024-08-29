import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { NgxMaskDirective } from 'ngx-mask';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { UserEventsComponent } from './user-events/user-events.component';


@NgModule({
  declarations: [
    UserEventsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    NgxMaskDirective,
    ClipboardModule
  ]
})
export class ReportsModule { }
