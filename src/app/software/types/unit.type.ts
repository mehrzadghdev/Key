// Unit Base

export interface Unit {
    id: number,
    code: number,
    name: string
}


// Unit/GetUnitList

export type GetUnitList = Unit[];

// Unit/GetUnit

export type GetUnit = [Unit]

export interface GetUnitBody {
    code: number
}

// Unit/AddUnit

export interface AddUnit {
    id: number,
    code: number,
    products: any
}

export interface AddUnitBody {
    code: number,
    name: string
}

// Unit/UpdateUnit 

export type UpdateUnit = null;

export interface UpdateUnitBody {
    id: number,
    code: number,
    name: string
}

// Unit/UpdateUnit 

export type DeleteUnit = null;

export interface DeleteUnitBody {
    code: number
}