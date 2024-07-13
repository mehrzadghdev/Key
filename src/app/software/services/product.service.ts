import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from 'src/app/shared/services/request.service';
import { AddProduct, AddProductBody, DeleteProduct, DeleteProductBody, GetCompaniesProductList, GetCompaniesProductListBody, GetProduct, GetProductBody, GetProductList, GetProductListBody, UpdateProduct, UpdateProductBody } from '../types/product.type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private request: RequestService) { }

  public getAllProductList(getAllProductListBody: GetProductListBody): Observable<GetProductList> {
    return this.request.post<GetProductList, GetProductListBody>("Product/GetProductList", getAllProductListBody);
  }

  public getCompaniesProductList(getCompaniesProductListBody: GetCompaniesProductListBody): Observable<GetCompaniesProductList> {
    return this.request.post<GetCompaniesProductList, GetCompaniesProductListBody>("Product/GetCompaniesProductList", getCompaniesProductListBody)
  }

  public getProduct(getProductBody: GetProductBody): Observable<GetProduct> {
    return this.request.post<GetProduct, GetProductBody>("Product/GetProduct", getProductBody)
  }

  public addProduct(addProductBody: AddProductBody): Observable<AddProduct> {
    return this.request.post<AddProduct, AddProductBody>("Product/AddProduct", addProductBody)
  }

  public updateProduct(updateProductBody: UpdateProductBody): Observable<UpdateProduct> {
    return this.request.post<UpdateProduct, UpdateProductBody>("Product/UpdateProduct", updateProductBody)
  }

  public deleteProduct(deleteProductBody: DeleteProductBody): Observable<DeleteProduct> {
    return this.request.post<DeleteProduct, DeleteProductBody>("Product/DeleteProduct", deleteProductBody)
  }
}
