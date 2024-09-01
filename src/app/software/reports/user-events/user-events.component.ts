import { Component, OnInit } from '@angular/core';
import { GetCompaniesUserEventList, GetCompaniesUserEventListBody, PermissionPart, SoftwarePart, UserEvent } from '../../types/reports/user-events.type';
import { DateISO } from 'src/app/shared/types/common.type';
import { KeyDatePicker } from 'src/app/shared/components/date-picker/key-date';
import { forkJoin } from 'rxjs';
import { UserEventsService } from '../../services/reports/user-events.service';
import { Pagination, PaginationBody } from 'src/app/shared/types/pagination.type';
import { UserDetails } from 'src/app/shared/types/authentication.type';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';
import * as moment from 'jalali-moment';
import { UserEventType } from '../../enums/user-event-type.enum';
import { Clipboard } from '@angular/cdk/clipboard';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { IsType } from 'src/app/shared/helpers/isType.helper';
import { DialogService } from 'src/app/shared/services/utilities/dialog.service';
import { UserEventMoreDetailsComponent } from '../user-event-more-details/user-event-more-details.component';

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

  public get username(): string {
    const userDetails = this.authentication.userDetails as UserDetails;
    return userDetails.name + ' ' + userDetails.family;
  }

  public get UserEventTypeEnum(): typeof UserEventType {
    return UserEventType;
  }

  constructor(
    private userEventsService: UserEventsService,
    private clipboard: Clipboard,
    private utility: UtilityService,
    private authentication: AuthenticationService,
    private dialog: DialogService,
  ) { }

  ngOnInit(): void {
    forkJoin({
      getSoftwareParts: this.userEventsService.getSoftwareParts(null),
      getPermissionParts: this.userEventsService.getPermissionParts(null),
    }).subscribe(result => {
      this.softwareParts = result.getSoftwareParts.filter(part => part.parentCode !== 0);
      this.permissionParts = result.getPermissionParts;

      this.dataLoaded = true;
    })

    this.loadUserEventList();
  }

  private loadUserEventList(pagination: PaginationBody = { pageSize: 5, page: 1 }): void {
    this.userEventListLoading = true;

    const userDetails: UserDetails = this.authentication.userDetails as UserDetails;

    const userEventListBody: GetCompaniesUserEventListBody = {
      ...pagination,
      sortFieldName: 'eventDate_desc',
      softwarePartCode: this.activeSoftwarePart?.code,
      permissionPartId: this.activePermissionPart?.id,
      fromEventDate: this.eventFromDate,
      toEventDate: this.eventToDate,
      userId: userDetails.id
    }

    this.userEventsService.getCompaniesUserEventList(userEventListBody).subscribe(res => {
      this.userEventList = res.userEvents;
      this.tablePagination.totalCount = res.totalCount;
      this.tablePagination.pageSize = res.pageSize;
      this.tablePagination.currentPage = res.currentPage;
      this.tablePagination.totalPages = res.totalPages;
      this.tablePagination.hasNext = res.hasNext;
      this.tablePagination.hasPrev = res.hasPrev;

      this.userEventListLoading = false
    });
  }

  public onItemPerPageChanged(itemsPerPage: 5 | 10 | 25 | 40 | 60): void {
    this.loadUserEventList({ pageSize: itemsPerPage, page: 1, sortFieldName: this.sortFieldname });
  }

  public onPaginationChanged(pagetoGo: number): void {
    this.loadUserEventList({ pageSize: this.tablePagination.pageSize, page: pagetoGo, sortFieldName: this.sortFieldname });
  }

  public setActiveSoftwarePart(softwarePart: SoftwarePart): void {
    this.activeSoftwarePart = softwarePart;
    this.loadUserEventList();
  }

  public setActivePermissionPart(permissionPart: PermissionPart | undefined): void {
    this.activePermissionPart = permissionPart;
    this.loadUserEventList();
  }

  public setEventDateFrom(date: DateISO): void {
    this.eventFromDate = date;
    this.loadUserEventList();
  }

  public setEventDateTo(date: DateISO): void {
    this.eventToDate = date;
    this.loadUserEventList();
  }

  public hasDateBar(currentUserEvent: UserEvent, prevUserEvent: UserEvent | undefined) {
    if (!prevUserEvent) {
      return true;
    }

    const jCurrentUserEventDate: moment.Moment = moment(currentUserEvent.eventDate);
    const jPrevUserEventDate: moment.Moment = moment(prevUserEvent.eventDate);

    if (
      prevUserEvent.permissionPartType === currentUserEvent.permissionPartType
      && jCurrentUserEventDate.jDate() === jPrevUserEventDate.jDate()
      && jCurrentUserEventDate.jMonth() === jPrevUserEventDate.jMonth()
      && jCurrentUserEventDate.jYear() === jPrevUserEventDate.jYear()
    ) {
      return false;
    }

    return true;
  }

  public copyUserEventCode(operationCode: number, softwarePartName: string): void {
    this.clipboard.copy(operationCode.toString());
    this.utility.message(`کد ${softwarePartName} با موفقیت کپی شد`, 'بستن')
  }

  public onUserEventMoreDetails(userEvent: UserEvent): void {
    this.dialog.openDialog(UserEventMoreDetailsComponent, {
      width: '456px',
      data: {
        moreDetailsJson: userEvent.comment,
        softwarePartName: userEvent.softwarePartName
      }
    })
  }
}
