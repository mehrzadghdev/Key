import { DateISO, HasDatabase, Pagination, PaginationBody, Percentage } from "src/app/shared/types/common.type";
import { InvoicePatternType, InvoicePaymentMethod, InvoiceType } from "../enums/invoice-type.enum";

// Invoice Base

export interface Invoice extends HasDatabase {
    invoiceId: number,
    invoiceCode: number,
    invoiceDate: DateISO,
    invoiceTime: string,
    invoiceType: InvoiceType,
    referenceInvoiceCode: number,
    personCode: number,
    personName: string,
    patternType: InvoicePatternType,
    vendorContractRegisterId: string,
    paymentMethod: InvoicePaymentMethod,
    creditAmount: number,
    payerNationalId: string,
    payCardNumber: string,
    payReferenceNumber: string,
    createdDate: DateISO,
    modifiedDate: DateISO,
    saleInvoiceItems: InvoiceProductItem[]
}

export interface InvoiceProductItem extends HasDatabase {
    id: number,
    invoiceId: number,
    productCode: number,
    productName: string,
    amount: number,
    price: number,
    discount: Percentage,
    taxPercent: Percentage,
    tax: number
}

// Invoice/GetSaleInvoiceList

export interface GetInvoiceListBody extends PaginationBody {};

export interface GetInvoiceList extends Pagination {
    saleInvoices: GetInvoiceListInvoiceItem[];
}

export interface GetInvoiceListInvoiceItem extends HasDatabase {
    invoiceId: number,
    invoiceCode: number,
    invoiceDate: DateISO,
    invoiceTime: string,
    invoiceType: InvoiceType,
    referenceInvoiceCode: number,
    personCode: number,
    personName: string,
    patternType: InvoicePatternType,
    vendorContractRegisterId: string,
    paymentMethod: number,
    creditAmount: number,
    payerNationalId: string,
    payCardNumber: string,
    payReferenceNumber: string,
    createdDate: DateISO,
    modifiedDate: DateISO
}

// Invoice/GetCompaniesSaleInvoiceList

export interface GetCompaniesInvoiceListBody extends HasDatabase, PaginationBody {}

export interface GetCompaniesInvoiceList extends Pagination {
    saleInvoices: GetInvoiceListInvoiceItem[];
}

// Invoice/GetSaleInvoice

export type GetInvoice = [Invoice];

export interface GetInvoiceBody extends HasDatabase {
    invoiceCode: number
}

// Invoice/AddSaleInvoice

export interface AddInvoice extends HasDatabase {
    invoiceId: number,
    invoiceCode: number,
    invoiceDate: DateISO,
    invoiceTime: string,
    invoiceType: InvoiceType,
    referenceInvoiceCode: number,
    personCode: number,
    patternType: InvoicePatternType,
    vendorContractRegisterId: string,
    paymentMethod: InvoicePaymentMethod,
    creditAmount: number,
    payerNationalId: string,
    payCardNumber: string,
    payReferenceNumber: string,
    createdDate: DateISO,
    modifiedDate: DateISO,
    database: null,
    saleInvoiceItems: AddInvoiceProductItem[]
}

export interface AddInvoiceBody extends HasDatabase {
    invoiceCode: number,
    invoiceDate: DateISO,
    invoiceTime: string,
    invoiceType: InvoiceType,
    referenceInvoiceCode: number,
    personCode: number,
    patternType: InvoicePatternType,
    vendorContractRegisterId: string,
    paymentMethod: InvoicePaymentMethod,
    creditAmount: number,
    payerNationalId: string,
    payCardNumber: string,
    payReferenceNumber: string,
    saleInvoiceItems: AddInvoiceProductItem[]
}

export interface AddInvoiceProductItem extends HasDatabase {
    id?: number,
    productCode: number,
    productName: string,
    amount: number,
    price: number,
    discount: Percentage,
    taxPercent: Percentage,
    tax: number,
    invoice?: string,
}

// Invoice/UpdateSaleInvoice

export type UpdateInvoice = null;

export interface UpdateInvoiceBody {
    invoiceCode: number,
    invoiceDate: DateISO,
    invoiceTime: string,
    invoiceType: InvoiceType,
    referenceInvoiceCode: number,
    personCode: number,
    patternType: InvoicePatternType,
    vendorContractRegisterId: string,
    paymentMethod: InvoicePaymentMethod,
    creditAmount: number,
    payerNationalId: string,
    payCardNumber: string,
    payReferenceNumber: string,
    saleInvoiceItems: [
      {
        productCode: 0,
        productName: string,
        amount: 0,
        price: 0,
        discount: 0,
        taxPercent: 0,
        tax: 0
      }
    ]
};

export interface UpdateInvoiceProductItem {
    productCode: number,
    productName: string,
    amount: number,
    price: number,
    discount: Percentage,
    taxPercent: Percentage,
    tax: number
}

// Invoice/DeleteSaleInvoice 

export type DeleteInvoice = null;

export interface DeleteInvoiceBody extends HasDatabase {
    invoiceId: number,
    invoiceCode: number
}
