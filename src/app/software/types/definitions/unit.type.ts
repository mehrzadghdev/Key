// Unit Base

import { GetNewCode, GetNewCodeBody, HasDatabase } from "src/app/shared/types/common.type";
import { Pagination, PaginationBody } from "src/app/shared/types/pagination.type";


export interface Unit extends HasDatabase {
    id: number,
    code: number,
    name: string,
}

// Unit/GetAllUnitList

export type GetAllUnitList = Unit[];

export type GetAllUnitListBody = null;

// Unit/GetUnitList

export interface GetUnitListItem extends HasDatabase, Unit {};

export interface GetUnitList extends Pagination {
    result: GetUnitListItem[];
};

export interface GetUnitListBody extends HasDatabase, PaginationBody {};

// Unit/GetUnit

export type GetUnit = [Unit]

export interface GetUnitBody extends HasDatabase {
    code: number
}

// Unit/AddUnit

export interface AddUnit extends HasDatabase {
    id: number,
    code: number,
    products: any
}

export interface AddUnitBody extends HasDatabase {
    code: number,
    name: string
}

// Unit/UpdateUnit 

export type UpdateUnit = null;

export interface UpdateUnitBody extends HasDatabase {
    code: number,
    name: string
}

// Unit/UpdateUnit 

export type DeleteUnit = null;

export interface DeleteUnitBody extends HasDatabase {
    code: number
}

// Unit/GetNewUnitCode 

export type GetNewUnitCodeBody = GetNewCodeBody;
export type GetNewUnitCode = GetNewCode;