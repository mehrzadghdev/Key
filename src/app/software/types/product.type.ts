// Product Base

import { HasDatabase, Pagination, PaginationBody } from "src/app/shared/types/common.type";

export interface Product extends HasDatabase {
    id: number,
    code: number,
    productCode: string,
    productType: number,
    name: string,
    price: number,
    taxPercent: number,
    unitCode: number,
    otherLegalFunds: string,
    otherLegalFundsPercent: number,
    otherTax: string,
    otherTaxPercent: number
}

// Product/GetProductList

export interface GetProductList extends Pagination {
    result: Product[];
};

export interface GetProductListBody extends PaginationBody {}

// Product/GetCompaniesProductList

export interface GetCompaniesProductList extends Pagination {
    result: Product[];
} 

export interface GetCompaniesProductListBody extends PaginationBody, HasDatabase { }

// Product/GetProduct

export type GetProduct = [Product];

export interface GetProductBody extends HasDatabase {
    code: number
}

// Product/AddProduct

export interface AddProduct extends HasDatabase {
    id: number,
    code: number,
    productCode: string,
    productType: number,
    name: string,
    price: number,
    taxPercent: number,
    unitCode: number,
    otherLegalFunds: string,
    otherLegalFundsPercent: number,
    otherTax: string,
    otherTaxPercent: number,
    // TODO: Database property must remove
    database: any,
    unitCodeNavigation: {
      id: number,
      code: number,
      name: string,
      products: string[]
    }
}

export interface AddProductBody extends HasDatabase {
    code: number,
    productCode: string,
    productType: number,
    name: string,
    price: number,
    taxPercent: number,
    unitCode: number,
    otherLegalFunds: string,
    otherLegalFundsPercent: number,
    otherTax: string,
    otherTaxPercent: number
}

// Product/UpdateProduct

export type UpdateProduct = null;

export interface UpdateProductBody {
    code: number,
    productCode: string,
    productType: number,
    name: string,
    price: number,
    taxPercent: number,
    unitCode: number,
    otherLegalFunds: string,
    otherLegalFundsPercent: number,
    otherTax: string,
    otherTaxPercent: number
};

// Product/DeleteProduct 

export type DeleteProduct = null;

export interface DeleteProductBody extends HasDatabase {
    code: number
}
