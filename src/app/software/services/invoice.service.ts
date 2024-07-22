import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from 'src/app/shared/services/request.service';
import { GetInvoiceList, GetCompaniesInvoiceListBody, GetCompaniesInvoiceList, GetInvoiceBody, GetInvoice, AddInvoiceBody, AddInvoice, UpdateInvoiceBody, UpdateInvoice, DeleteInvoiceBody, DeleteInvoice, GetNewInvoiceCodeBody, GetNewInvoiceCode } from '../types/invoice.type';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private request: RequestService) { }

  public getAllInvoiceList(): Observable<GetInvoiceList> {
    return this.request.post<GetInvoiceList, null>("SaleInvoice/GetSaleInvoiceList", null);
  }

  public getCompaniesInvoiceList(getCompaniesInvoiceListBody: GetCompaniesInvoiceListBody): Observable<GetCompaniesInvoiceList> {
    return this.request.post<GetCompaniesInvoiceList, GetCompaniesInvoiceListBody>("SaleInvoice/GetCompaniesSaleInvoiceList", getCompaniesInvoiceListBody)
  }

  public getInvoice(getInvoiceBody: GetInvoiceBody): Observable<GetInvoice> {
    return this.request.post<GetInvoice, GetInvoiceBody>("SaleInvoice/GetSaleInvoice", getInvoiceBody)
  }

  public addInvoice(addInvoiceBody: AddInvoiceBody): Observable<AddInvoice> {
    return this.request.post<AddInvoice, AddInvoiceBody>("SaleInvoice/AddSaleInvoice", addInvoiceBody)
  }

  public updateInvoice(updateInvoiceBody: UpdateInvoiceBody): Observable<UpdateInvoice> {
    return this.request.post<UpdateInvoice, UpdateInvoiceBody>("SaleInvoice/UpdateSaleInvoice", updateInvoiceBody)
  }

  public deleteInvoice(deleteInvoiceBody: DeleteInvoiceBody): Observable<DeleteInvoice> {
    return this.request.post<DeleteInvoice, DeleteInvoiceBody>("SaleInvoice/DeleteSaleInvoice", deleteInvoiceBody)
  }

  public getNewInvoiceCode(getNewInvoiceCodeBody: GetNewInvoiceCodeBody): Observable<GetNewInvoiceCode> {
    return this.request.post<GetNewInvoiceCode, GetNewInvoiceCodeBody>("SaleInvoice/GetNewSaleInvoiceCode", getNewInvoiceCodeBody);
  }
}
