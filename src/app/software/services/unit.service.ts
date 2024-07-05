import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/shared/services/request.service';
import { AddUnit, AddUnitBody, DeleteUnit, DeleteUnitBody, GetUnit, GetUnitBody, GetUnitList, UpdateUnit, UpdateUnitBody } from '../types/unit.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor(private request: RequestService) { }

  public getUnitList(): Observable<GetUnitList> {
    return this.request.post<GetUnitList, null>("Unit/GetUnitList", null);
  }

  public getUnit(getUnitBody: GetUnitBody): Observable<GetUnit> {
    return this.request.post<GetUnit, GetUnitBody>("Unit/GetUnit", getUnitBody)
  }

  public addUnit(addUnitBody: AddUnitBody): Observable<AddUnit> {
    return this.request.post<AddUnit, AddUnitBody>("Unit/AddUnit", addUnitBody)
  }

  public updateUnit(updateUnitBody: UpdateUnitBody): Observable<UpdateUnit> {
    return this.request.post<UpdateUnit, UpdateUnitBody>("Unit/UpdateUnit", updateUnitBody)
  }

  public deleteUnit(deleteUnitBody: DeleteUnitBody): Observable<DeleteUnit> {
    return this.request.post<DeleteUnit, DeleteUnitBody>("Unit/DeleteUnit", deleteUnitBody)
  }
}
