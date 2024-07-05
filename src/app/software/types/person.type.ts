// Person Base

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

export type GetPersonList = Person[];

// Person/GetCompaniesPersonList

export type GetCompaniesPersonList = GetCompaniesPersonListItem[];

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

export interface GetCompaniesPersonListBody {
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
