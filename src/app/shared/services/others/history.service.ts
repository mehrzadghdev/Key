import { Injectable } from '@angular/core';
import { SearchHistory, SearchHistoryItem } from '../../types/history.type';
import { Crypto } from '../../helpers/crypto.helper';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor() { }

  private setHistory(searchHistory: SearchHistory): void {
    localStorage.setItem(Crypto.encrypt("search-history"), Crypto.encrypt(JSON.stringify(searchHistory)));
  }

  public getHistory(): SearchHistory {
    const searchHistory = Crypto.decrypt(localStorage.getItem(Crypto.encrypt("search-history")) ?? '');
    
    if (searchHistory !== null && searchHistory !== '') {
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
