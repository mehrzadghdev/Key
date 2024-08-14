import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/shared/services/api/request.service';
import { AddUnit, AddUnitBody, DeleteUnit, DeleteUnitBody, GetAllUnitList, GetAllUnitListBody, GetUnit, GetUnitBody, GetUnitList, GetUnitListBody, UpdateUnit, UpdateUnitBody } from '../../types/definitions/unit.type';
import { Observable } from 'rxjs';
import { GetNewProductCodeBody, GetNewProductCode } from '../../types/definitions/product.type';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor(private request: RequestService) { }

  public getAllUnitList(): Observable<GetAllUnitList> {
    return this.request.post<GetAllUnitList, GetAllUnitListBody>("Unit/GetAllUnitList", null);
  }

  public getUnitList(getUnitListBody: GetUnitListBody): Observable<GetUnitList> {
    return this.request.post<GetUnitList, GetUnitListBody>("Unit/GetUnitList", getUnitListBody);
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

  public getNewProductCode(getNewProductCodeBody: GetNewProductCodeBody): Observable<GetNewProductCode> {
    return this.request.post<GetNewProductCode, GetNewProductCodeBody>("Product/GetNewProductCode", getNewProductCodeBody);
  }
}
