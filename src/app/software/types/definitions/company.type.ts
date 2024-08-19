// Company Base

import { HasApiError } from "src/app/shared/types/common.type";

export interface Company {
    id: number,
    packageNo: number, //////////
    databaseId: number,
    companyName: string, /////////////
    companyNameEn: string,
    companyIdentity: number, //
    taxIdentity: string,  //
    privateKey: string, //
    publicKey: string,
    economicCode: string,
    companyZipCode: string,
    companyAddress: string,
    companyTel: string,
    companyBranchNo: string, ////////
    companyStatus: boolean,
    companyDesc: string,
    userId: string
}

// Company/GetCompanyList

export type GetCompanyList = Company[];

// Company/GetUsersCompanyList

export type GetUsersCompanyList = Company[];

export interface GetUsersCompanyListBody {
    packageNo: number
}

// Company/GetCompany

export type GetCompany = [Company];

export interface GetCompanyBody {
    databaseId: number
}

// Company/AddCompany

export interface AddCompany {
    id: number,
    packageNo: number,
    databaseId: number,
    companyName: string,
    companyNameEn: string,
    companyIdentity: number,
    taxIdentity: string,
    privateKey: string,
    publicKey: string,
    economicCode: string
    companyZipCode: string,
    companyAddress: string,
    companyTel: string,
    companyBranchNo: string,
    companyStatus: true,
    companyDesc: string,
    userId: string,
    // TODO: Replace the any with the actual type
    products: any 
    people: any
    saleInvoices: any
}

export interface AddCompanyBody {
    packageNo: number,
    companyName: string,
    taxIdentity: string,
    privateKey: string,
    companyZipCode: string,
    companyNameEn: string,
    companyAddress: string,
    companyTel: string,
    publicKey: string,
    economicCode: string
    companyBranchNo: string,
    companyStatus: boolean,
    companyDesc: string
}

// Company/UpdateCompany

export type UpdateCompany = null;

export interface UpdateCompanyBody {
    databaseId: number, 
    companyName: string, 
    companyNameEn: string,
    taxIdentity: string, 
    privateKey: string, 
    publicKey: string,
    economicCode: string
    companyZipCode: string, 
    companyAddress: string, 
    companyTel: string, 
    companyBranchNo: string, 
    companyStatus: boolean, 
    companyDesc: string 
};

// Company/DeleteCompany 

export type DeleteCompany = null | HasApiError;

export interface DeleteCompanyBody {
    databaseId: number,
}

// Company/GenerateKeys

export interface GenerateCompanyKeysBody {
    companyName: string,
    companyNameEn: string,
    economicCode: string,
    companyType: string
}

export interface GenerateCompanyKeys {
    privateKey: string,
    publicKey: string,
    certificateKey: string
}