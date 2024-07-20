export type DateISO = string;

export type Percentage = number;

export interface SelectOption<T>  {
    display: string;
    value: T;
}[]

export interface Pagination {
    totalCount: number,
    pageSize: number,
    currentPage: number,
    totalPages: number,
    hasNext: boolean,
    hasPrev: boolean,
}

export interface PaginationBody {
    page?: number,
    pageSize?: number,
    searchTerm?: string,
    sortFieldName?: string
}

export interface HasDatabase {
    databaseId?: number;
}