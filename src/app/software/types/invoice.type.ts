// Invoice Base

import { DateISO } from "src/app/shared/types/common.type";
import { InvoicePatternType, InvoicePaymentMethod, InvoiceType } from "../enums/invoice-type.enum";

export interface Invoice {
    // TODO
}

// Invoice/GetInvoiceList

export type GetInvoiceList = Invoice[];

// Invoice/GetCompaniesInvoiceList

export type GetCompaniesInvoiceList = GetCompaniesInvoiceListItem[];

export interface GetCompaniesInvoiceListItem {
    // TODO
}

export interface GetCompaniesInvoiceListBody {
    databaseId: number
    // TODO
}

// Invoice/GetInvoice

export type GetInvoice = [Invoice];

export interface GetInvoiceBody {
    // TODO
}

// Invoice/AddInvoice

export interface AddInvoice {
    invoiceId: number,
    databaseId: number,
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
    saleInvoiceItems: InvoiceProductItem[]
}

export interface AddInvoiceBody {
    databaseId: number,
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
    saleInvoiceItems: InvoiceProductItem[]
}

export interface InvoiceProductItem {
    id?: number,
    databaseId: number,
    productCode: number,
    productName: string,
    amount: number,
    price: number,
    discount: number,
    taxPercent: number,
    tax: number,
    invoice?: string,
}

// Invoice/UpdateInvoice

export type UpdateInvoice = null;

export interface UpdateInvoiceBody {

};

// Invoice/DeleteInvoice 

export type DeleteInvoice = null;

export interface DeleteInvoiceBody {
    // TODO
}
