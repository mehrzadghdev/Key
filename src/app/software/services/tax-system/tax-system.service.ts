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
}
