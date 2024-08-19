import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/shared/services/api/request.service';
import { Observable } from 'rxjs/internal/Observable';
import { TaxSystem } from '../../types/tax-system/tax-system';

@Injectable({
  providedIn: 'root'
})
export class TaxSystemService {

  constructor(private request: RequestService) { }
  
  public getStaffID(getStaffID: TaxSystem.GetStaffIDBody): Observable<TaxSystem.GetStaffID> {
    return this.request.post<TaxSystem.GetStaffID, TaxSystem.GetStaffIDBody>("TaxSystem/GetStaffID", getStaffID)
  }
  
  public getServiceID(getServiceID: TaxSystem.GetServiceIDBody): Observable<TaxSystem.GetServiceID> {
    return this.request.post<TaxSystem.GetServiceID, TaxSystem.GetServiceIDBody>("TaxSystem/GetServiceID", getServiceID)
  }

  public generateCompanyKeys(generateKeysBody: TaxSystem.GenerateKeysBody): Observable<TaxSystem.GenerateKeys> {
    return this.request.post<TaxSystem.GenerateKeys, TaxSystem.GenerateKeysBody>("TaxSystem/GenerateKeys", generateKeysBody);
  }
}
