import { Pagination, PaginationBody } from "src/app/shared/types/pagination.type";

export namespace TaxSystem {

    // Base StaffID

    export interface StaffID {
        id: number,
        stuffId: string,
        descript: string,
        vatRate: number,
        editDateFa: string,
        typeStuffid: string
    }

    // TaxSystem/GetStaffID

    export interface GetStaffIDBody extends PaginationBody { };

    export interface GetStaffID extends Pagination {
        systemstaffs: StaffID[]
    };


    // Base ServiceID

    export interface ServiceID {
        id: number,
        stuffId: string,
        descript: string,
        vatRate: number,
        editDateFa: string,
        typeStuffid: string
    }

    // TaxSystem/GetServiceID

    export interface GetServiceIDBody extends PaginationBody { };

    export interface GetServiceID extends Pagination {
        systemservices: ServiceID[]
    };

    // TaxSystem/GenerateKeys

    export interface GenerateKeysBody {
        companyName: string,
        companyNameEn: string,
        economicCode: string,
        companyType: string
    }

    export interface GenerateKeys {
        privateKey: string,
        publicKey: string,
        certificateKey: string
    }
}