export type DateISO = string;

export type Percentage = number;

export interface SelectOption<T>  {
    display: string;
    value: T;
}[]

export interface HasDatabase {
    databaseId?: number;
}

export interface GetNewCodeBody extends HasDatabase {};

export interface GetNewCode {
    newCode: number;
}