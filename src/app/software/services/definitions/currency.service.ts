import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetAllCurrencyList, GetAllCurrencyListBody, GetCurrencyList, GetCurrencyListBody } from '../../types/definitions/currency.type';
import { RequestService } from 'src/app/shared/services/api/request.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  
  constructor(private request: RequestService) { }

  public getAllCurrencyList(getAllCurrencyListBody: GetAllCurrencyListBody): Observable<GetAllCurrencyList> {
    return this.request.post<GetAllCurrencyList, GetAllCurrencyListBody>("Currency/GetCurrencyList", getAllCurrencyListBody);
  }

  public getCurrencyList(getCurrencyListBody: GetCurrencyListBody): Observable<GetCurrencyList> {
    return this.request.post<GetCurrencyList, GetCurrencyListBody>("Currency/GetCurrencyList", getCurrencyListBody)
  }
}
