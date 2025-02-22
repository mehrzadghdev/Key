import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/shared/services/api/request.service';
import { AddPerson, AddPersonBody, AddPersons, AddPersonsBody, DeletePerson, DeletePersonBody, GetCompaniesPersonCodes, GetCompaniesPersonCodesBody, GetCompaniesPersonList, GetCompaniesPersonListBody, GetNewPersonCode, GetNewPersonCodeBody, GetPerson, GetPersonBody, GetPersonList, GetPersonListBody, UpdatePerson, UpdatePersonBody } from '../../types/definitions/person.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private request: RequestService) { }

  public getAllPersonList(getAllPersonListBody: GetPersonListBody): Observable<GetPersonList> {
    return this.request.post<GetPersonList, GetPersonListBody>("Person/GetPersonList", getAllPersonListBody);
  }

  public getCompaniesPersonList(getCompaniesPersonListBody: GetCompaniesPersonListBody): Observable<GetCompaniesPersonList> {
    return this.request.post<GetCompaniesPersonList, GetCompaniesPersonListBody>("Person/GetCompaniesPersonList", getCompaniesPersonListBody)
  }

  public getCompaniesPersonCodes(getCompaniesPersonCodesBody: GetCompaniesPersonCodesBody): Observable<GetCompaniesPersonCodes> {
    return this.request.post<GetCompaniesPersonCodes, GetCompaniesPersonCodesBody>("Person/GetCompaniesPersonCodes", getCompaniesPersonCodesBody)
  }

  public getPerson(getPersonBody: GetPersonBody): Observable<GetPerson> {
    return this.request.post<GetPerson, GetPersonBody>("Person/GetPerson", getPersonBody)
  }

  public addPerson(addPersonBody: AddPersonBody): Observable<AddPerson> {
    return this.request.post<AddPerson, AddPersonBody>("Person/AddPerson", addPersonBody)
  }

  public addPersons(addPersonsBody: AddPersonsBody): Observable<AddPersons> {
    return this.request.post<AddPersons, AddPersonsBody>("Person/AddPersons", addPersonsBody)
  }

  public updatePerson(updatePersonBody: UpdatePersonBody): Observable<UpdatePerson> {
    return this.request.post<UpdatePerson, UpdatePersonBody>("Person/UpdatePerson", updatePersonBody)
  }

  public deletePerson(deletePersonBody: DeletePersonBody): Observable<DeletePerson> {
    return this.request.post<DeletePerson, DeletePersonBody>("Person/DeletePerson", deletePersonBody)
  }

  public getNewPersonCode(getNewPersonCodeBody: GetNewPersonCodeBody): Observable<GetNewPersonCode> {
    return this.request.post<GetNewPersonCode, GetNewPersonCodeBody>("Person/GetNewPersonCode", getNewPersonCodeBody);
  }
}
