import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/shared/services/request.service';
import { AddPerson, AddPersonBody, DeletePerson, DeletePersonBody, GetCompaniesPersonList, GetCompaniesPersonListBody, GetPerson, GetPersonBody, GetPersonList, UpdatePerson, UpdatePersonBody } from '../types/person.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private request: RequestService) { }

  public getAllPersonList(): Observable<GetPersonList> {
    return this.request.post<GetPersonList, null>("Person/GetPersonList", null);
  }

  public getCompaniesPersonList(getCompaniesPersonListBody: GetCompaniesPersonListBody): Observable<GetCompaniesPersonList> {
    return this.request.post<GetCompaniesPersonList, GetCompaniesPersonListBody>("Person/GetCompaniesPersonList", getCompaniesPersonListBody)
  }

  public getPerson(getPersonBody: GetPersonBody): Observable<GetPerson> {
    return this.request.post<GetPerson, GetPersonBody>("Person/GetPerson", getPersonBody)
  }

  public addPerson(addPersonBody: AddPersonBody): Observable<AddPerson> {
    return this.request.post<AddPerson, AddPersonBody>("Person/AddPerson", addPersonBody)
  }

  public updatePerson(updatePersonBody: UpdatePersonBody): Observable<UpdatePerson> {
    return this.request.post<UpdatePerson, UpdatePersonBody>("Person/UpdatePerson", updatePersonBody)
  }

  public deletePerson(deletePersonBody: DeletePersonBody): Observable<DeletePerson> {
    return this.request.post<DeletePerson, DeletePersonBody>("Person/DeletePerson", deletePersonBody)
  }
}
