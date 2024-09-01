import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { NgxMaskDirective } from 'ngx-mask';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { UserEventsComponent } from './user-events/user-events.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserEventMoreDetailsComponent } from './user-event-more-details/user-event-more-details.component';


@NgModule({
  declarations: [
    UserEventsComponent,
    UserEventMoreDetailsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    NgxMaskDirective,
    ClipboardModule,
    SharedModule
  ]
})
export class ReportsModule { }
