import { KeyModules } from "./modules.type";

export type SearchHistory = SearchHistoryItem[];

export interface SearchHistoryItem {
    value: string,
    module: KeyModules
}