import { DateISO, HasDatabase, HasUserID, Percentage } from "src/app/shared/types/common.type";
import { Pagination, PaginationBody } from "src/app/shared/types/pagination.type";
import { UserEventType } from "../../enums/user-event-type.enum";

// Base UserEvent

export interface UserEvent extends HasDatabase, HasUserID {
    id: number,
    userId: string,
    softwarePartAccessId: number,
    softwarePartCode: number,
    softwarePartName: string,
    permissionPartID: number,
    permissionPartName: string,
    success: boolean,
    eventDate: DateISO,
    userEventType: UserEventType,
    comment: string,
    operationCode: number
}

// UserEvent/GetUserEventList

export interface GetUserEventListBody extends PaginationBody {
    softwarePartCode: number,
    permissionPartId: number,
    fromEventDate: DateISO,
    toEventDate: DateISO,
}

export interface GetUserEventList extends Pagination {
    userEvents: UserEvent[]
}

// UserEvent/GetCompaniesUserEventList

export interface GetCompaniesUserEventListBody extends PaginationBody, HasUserID, HasDatabase {
    softwarePartCode?: number,
    permissionPartId?: number,
    fromEventDate?: DateISO,
    toEventDate?: DateISO,
}

export interface GetCompaniesUserEventList extends Pagination {
    userEvents: UserEvent[]
}



// Base Software Part

export interface SoftwarePart {
    code: number,
    parentCode: number,
    title: string,
    titleEn: string,
    hasReport: boolean
}

// UserEvent/GetSoftwareParts

export type GetSoftwarePartsBody = null;

export type GetSoftwareParts = SoftwarePart[];



// Base Permission Part 

export interface PermissionPart {
    id: number,
    title: string,
    titleEn: string
}

// UserEvent/GetPermissionParts

export type GetPermissionPartsBody = null;

export type GetPermissionParts = PermissionPart[];

