// Currency Base

import { HasDatabase } from "src/app/shared/types/common.type";
import { Pagination, PaginationBody } from "src/app/shared/types/pagination.type";

export interface Currency {
    id: number,
    entity: string,
    currencyName: string,
    alphabeticCode: string,
    numericCode: string,
    minorUnit: string
}

// Currency/GetAllCurrencyList

export interface GetAllCurrencyListBody extends PaginationBody {}

export interface GetAllCurrencyList extends Pagination {
    result: Currency[]; 
}

// Currency/GetCurrencyList

export interface GetCurrencyListBody extends PaginationBody, HasDatabase {}

export interface GetCurrencyList extends Pagination {
    result: Currency[]; 
}