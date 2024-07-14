export type DateISO = string;

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