// Product Base

export interface Product {
    id: number,
    databaseId: number,
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

export type GetProductList = Product[];

// Product/GetCompaniesProductList

export type GetCompaniesProductList = Product[];

export interface GetCompaniesProductListBody {
    databaseId: number
}

// Product/GetProduct

export type GetProduct = [Product];

export interface GetProductBody {
    code: number
}

// Product/AddProduct

export interface AddProduct {
    id: number,
    databaseId: number,
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

export interface AddProductBody {
    databaseId: number,
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

export interface DeleteProductBody {
    code: number
}
