import { Injectable } from '@angular/core';
import { SearchHistory, SearchHistoryItem } from '../types/history.type';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor() { }

  private setHistory(searchHistory: SearchHistory): void {
    localStorage.setItem("search-history", JSON.stringify(searchHistory));
  }

  public getHistory(): SearchHistory {
    const searchHistory = localStorage.getItem("search-history");
    
    if (searchHistory !== null) {
      return JSON.parse(searchHistory);
    }
    
    return [];
  }
  
  public addToHistory(searchHistoryItem: SearchHistoryItem): void {
    const newHistory: SearchHistory = this.getHistory();

    if (searchHistoryItem.value && !newHistory.find(historyItem => historyItem.value.trim() === searchHistoryItem.value.trim())) {
      if (newHistory.length >= 6) newHistory.pop();
      
      newHistory.unshift(searchHistoryItem);
    }

    this.setHistory(newHistory);
  }

  public removeFromHistory(searchHistoryItem: SearchHistoryItem): void {
    let newHistory: SearchHistory = this.getHistory();

    newHistory = newHistory.filter(historyItem => historyItem.value !== searchHistoryItem.value);

    this.setHistory(newHistory);
  }
}
