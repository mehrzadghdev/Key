import { Component, OnInit } from '@angular/core';
import { GetCompaniesUserEventList, GetCompaniesUserEventListBody, PermissionPart, SoftwarePart, UserEvent } from '../../types/reports/user-events.type';
import { DateISO } from 'src/app/shared/types/common.type';
import { KeyDatePicker } from 'src/app/shared/components/date-picker/key-date';
import { forkJoin } from 'rxjs';
import { UserEventsService } from '../../services/reports/user-events.service';
import { Pagination, PaginationBody } from 'src/app/shared/types/pagination.type';
import { UserDetails } from 'src/app/shared/types/authentication.type';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';

@Component({
  selector: 'app-user-events',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.scss']
})
export class UserEventsComponent implements OnInit {
  public dataLoaded: boolean = false;

  public userEventListLoading: boolean = true;
  public userEventList: UserEvent[] = [];

  public tablePagination: Partial<Pagination> = {
    totalCount: 0,
    pageSize: 0,
    currentPage: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  };
  public sortFieldname?: string;

  public softwareParts: SoftwarePart[] = [];
  public activeSoftwarePart?: SoftwarePart;

  public permissionParts: PermissionPart[] = [];
  public activePermissionPart?: PermissionPart;

  public eventFromDate?: DateISO;
  public eventToDate?: DateISO;

  constructor(
    private userEventsService: UserEventsService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    forkJoin({
      getSoftwareParts: this.userEventsService.getSoftwareParts(null),
      getPermissionParts: this.userEventsService.getPermissionParts(null),
    }).subscribe(result => {
      this.softwareParts = result.getSoftwareParts;
      this.permissionParts = result.getPermissionParts;

      this.dataLoaded = true;
    })

    this.loadUserEventList();
  }

  private loadUserEventList(pagination: PaginationBody = { pageSize: 10, page: 1 }): void {
    this.userEventListLoading = true;

    const userDetails: UserDetails = this.authenticationService.userDetails as UserDetails;

    const userEventListBody: GetCompaniesUserEventListBody = {
      ...pagination,
      softwarePartCode: this.activeSoftwarePart?.code,
      permissionPartId: this.activeSoftwarePart?.code,
      fromEventDate: this.eventFromDate,
      toEventDate: this.eventToDate,
      userId: userDetails.id
    }

    this.userEventsService.getCompaniesUserEventList(userEventListBody);
  }

  public onItemPerPageChanged(itemsPerPage: 10 | 25 | 40 | 60): void {
    this.loadUserEventList({ pageSize: itemsPerPage, page: 1, sortFieldName: this.sortFieldname });
  }

  public onPaginationChanged(pagetoGo: number): void { 
    this.loadUserEventList({ pageSize: this.tablePagination.pageSize, page: pagetoGo, sortFieldName: this.sortFieldname });
  }
}
