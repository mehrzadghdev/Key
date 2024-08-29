import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/shared/services/api/request.service';
import { GetCompaniesUserEventList, GetCompaniesUserEventListBody, GetPermissionParts, GetPermissionPartsBody, GetSoftwareParts, GetSoftwarePartsBody, GetUserEventList, GetUserEventListBody } from '../../types/reports/user-events.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserEventsService {

  constructor(private request: RequestService) { }

  public getAllUserEventList(getAllUserEventListBody: GetUserEventListBody): Observable<GetUserEventList> {
    return this.request.post<GetUserEventList, GetUserEventListBody>("UserEvent/GetUserEventList", getAllUserEventListBody);
  }

  public getCompaniesUserEventList(getCompaniesUserEventListBody: GetCompaniesUserEventListBody): Observable<GetCompaniesUserEventList> {
    return this.request.post<GetCompaniesUserEventList, GetCompaniesUserEventListBody>("UserEvent/GetCompaniesUserEventList", getCompaniesUserEventListBody)
  }

  public getSoftwareParts(getSoftwarePartsBody: GetSoftwarePartsBody): Observable<GetSoftwareParts> {
    return this.request.post<GetSoftwareParts, GetSoftwarePartsBody>("UserEvent/GetSoftwareParts", getSoftwarePartsBody)
  }

  public getPermissionParts(getPermissionPartsBody: GetPermissionPartsBody): Observable<GetPermissionParts> {
    return this.request.post<GetPermissionParts, GetPermissionPartsBody>("UserEvent/GetPermissionParts", getPermissionPartsBody)
  }
}
