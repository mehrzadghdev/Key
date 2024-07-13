// Person Base

import { Pagination, PaginationBody } from "src/app/shared/types/common.type";
import { PersonType } from "../enums/person-type.enum";

export interface Person {
    id: number,
    databaseId: number,
    code: number,
    personType: number,
    personName: string,
    nationalId: string,
    economicCode: string,
    tel: string,
    mobile: string,
    zipCode: string,
    address: string
}

// Person/GetPersonList

export interface GetPersonList extends Pagination {
    result: GetCompaniesPersonListItem[];
};

export interface GetPersonListBody extends PaginationBody {}

// Person/GetCompaniesPersonList

export interface GetCompaniesPersonList extends Pagination {
    result: GetCompaniesPersonListItem[];
}

export interface GetCompaniesPersonListItem {
    id: number,
    databaseId: number,
    code: number,
    personType: PersonType,
    personName: string,
    nationalId: string,
    economicCode: string,
    tel: string,
    mobile: string,
    zipCode: string,
    address: string,
    createdDate: string,
    modifiedDate: string
}

export interface GetCompaniesPersonListBody extends PaginationBody {
    databaseId: number
}

// Person/GetPerson

export type GetPerson = [Person];

export interface GetPersonBody {
    code: number
}

// Person/AddPerson

export interface AddPerson {
    id: number,
    databaseId: number,
    code: number,
    personType: number,
    personName: string,
    nationalId: string,
    economicCode: string,
    tel: string,
    mobile: string,
    zipCode: string,
    address: string,
    // TODO: Must remove that database thing
    database: any
}

export interface AddPersonBody {
    databaseId: number,
    code?: number,
    personType: number,
    personName: string,
    nationalId: string,
    economicCode: string,
    tel: string,
    mobile: string,
    zipCode: string,
    address: string
}

// Person/UpdatePerson

export type UpdatePerson = null;

export interface UpdatePersonBody {
    code: number,
    personType: number,
    personName: string,
    nationalId: string,
    economicCode: string,
    tel: string,
    mobile: string,
    zipCode: string,
    address: string
};

// Person/DeletePerson 

export type DeletePerson = null;

export interface DeletePersonBody {
    code: number
}
