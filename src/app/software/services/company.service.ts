import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from 'src/app/shared/services/api/request.service';
import { AddCompany, AddCompanyBody, DeleteCompany, DeleteCompanyBody, GetCompany, GetCompanyBody, GetCompanyList, GetUsersCompanyList, GetUsersCompanyListBody, UpdateCompany, UpdateCompanyBody } from '../types/company.type';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private request: RequestService, private http: HttpClient) { }

  public getAllCompanyList(): Observable<GetCompanyList> {
    return this.request.post<GetCompanyList, null>("Company/GetCompanyList", null);
  }

  public getUsersCompanyList(getUsersCompanyListBody: GetUsersCompanyListBody): Observable<GetUsersCompanyList> {
    return this.request.post<GetUsersCompanyList, GetUsersCompanyListBody>("Company/GetUsersCompanyList", getUsersCompanyListBody)
  }

  public getCompany(getCompanyBody: GetCompanyBody): Observable<GetCompany> {
    return this.request.post<GetCompany, GetCompanyBody>("Company/GetCompany", getCompanyBody)
  }

  public addCompany(addCompanyBody: AddCompanyBody): Observable<AddCompany> {
    return this.request.post<AddCompany, AddCompanyBody>("Company/AddCompany", addCompanyBody)
  }

  public updateCompany(updateCompanyBody: UpdateCompanyBody): Observable<UpdateCompany> {
    return this.request.post<UpdateCompany, UpdateCompanyBody>("Company/UpdateCompany", updateCompanyBody)
  }

  public deleteCompany(deleteCompanyBody: DeleteCompanyBody): Observable<DeleteCompany> {
    return this.request.post<DeleteCompany, DeleteCompanyBody>("Company/DeleteCompany", deleteCompanyBody)
  }
}
