import { Component, OnInit } from '@angular/core';
import { PermissionPart, SoftwarePart } from '../../types/reports/user-events.type';
import { DateISO } from 'src/app/shared/types/common.type';
import { KeyDatePicker } from 'src/app/shared/components/date-picker/key-date';
import { forkJoin } from 'rxjs';
import { UserEventsService } from '../../services/reports/user-events.service';

@Component({
  selector: 'app-user-events',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.scss']
})
export class UserEventsComponent implements OnInit {
  public dataLoaded: boolean = false;

  public softwareParts: SoftwarePart[] = [];
  public activeSoftwarePart?: SoftwarePart;
  
  public permissionParts: PermissionPart[] = [];
  public activePermissionPart?: PermissionPart;

  public eventFromDate?: DateISO;
  public eventToDate?: DateISO;

  constructor(private userEventsService: UserEventsService) {}

  ngOnInit(): void {
    forkJoin({
      getSoftwareParts: this.userEventsService.getSoftwareParts(null),
      getPermissionParts: this.userEventsService.getPermissionParts(null),
    }).subscribe(result => {
      this.softwareParts = result.getSoftwareParts;
      this.permissionParts = result.getPermissionParts;

      this.dataLoaded = true;
    })
  }
}
