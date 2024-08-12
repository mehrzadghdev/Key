import { Component } from '@angular/core';
import { Sort, SortDirection } from '@angular/material/sort';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { Pagination, PaginationBody } from 'src/app/shared/types/pagination.type';
import { CurrencyService } from '../../services/currency.service';
import { Currency, GetCurrencyListBody } from '../../types/currency.type';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent {
  public tailedTable: boolean = false;
  public tablePagination: Partial<Pagination> = {
    totalCount: 0,
    pageSize: 0,
    currentPage: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  };
  public tableSearchQuery: string = '';
  public tableSortField: string = '';
  public currencyList: Currency[] = [];
  public currencyListLoaded: boolean = false;
  public tableColumns: string[] = ["موجودیت", "نام ارز", "شناسه حروفی", "شناسه عددی", "عملیات"];
  public activeSort: string = 'پیش فرض';
  public mobileActiveSortMode: SortDirection = 'asc';

  constructor(
    private currencyService: CurrencyService,
    private utility: UtilityService
  ) { }

  ngOnInit(): void {
    if (window.innerWidth <= 768) {
      this.tailedTable = true;
    }

    this.loadCurrencyList();
  }

  public onTableSortChanged(sort: Sort): void {
    this.activeSort = sort.active;
    switch (sort.active) {
      case 'پیش فرض':
        this.tableSortField = 'پیش فرض';
      break;
      case "موجودیت":
        if (sort.direction === 'asc') this.tableSortField = 'entity';
        if (sort.direction === 'desc') this.tableSortField = 'entity_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
      case "نام ارز":
        if (sort.direction === 'asc') this.tableSortField = 'currencyName';
        if (sort.direction === 'desc') this.tableSortField = 'currencyName_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
      case "شناسه حروفی":
        if (sort.direction === 'asc') this.tableSortField = 'alphabeticCode';
        if (sort.direction === 'desc') this.tableSortField = 'alphabeticCode_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
      case "شناسه عددی":
        if (sort.direction === 'asc') this.tableSortField = 'numericCode';
        if (sort.direction === 'desc') this.tableSortField = 'numericCode_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
    }

    this.sortCurrencyList({ pageSize: this.tablePagination.pageSize, page: 1, sortFieldName: this.tableSortField });
  }

  public onItemPerPageChanged(itemsPerPage: 10 | 25 | 40 | 60): void {
    this.loadCurrencyList({ pageSize: itemsPerPage, page: 1, searchTerm: this.tableSearchQuery, sortFieldName: this.tableSortField });
  }

  public onPaginationChanged(pagetoGo: number): void { 
    this.loadCurrencyList({ pageSize: this.tablePagination.pageSize, page: pagetoGo, searchTerm: this.tableSearchQuery, sortFieldName: this.tableSortField });
  }
  
  public sortCurrencyList(pagination: PaginationBody = { pageSize: 10, page: 1 }): void {
    const currencyListBody: GetCurrencyListBody = {
      ...pagination
    }

    this.currencyService.getCurrencyList(currencyListBody).subscribe(res => {
      this.currencyList = res.result;
      this.tablePagination.totalCount = res.totalCount,
      this.tablePagination.pageSize = res.pageSize,
      this.tablePagination.currentPage = res.currentPage,
      this.tablePagination.totalPages = res.totalPages,
      this.tablePagination.hasNext = res.hasNext,
      this.tablePagination.hasPrev = res.hasPrev
      this.currencyListLoaded = true;
    })
  }

  public loadCurrencyList(pagination: PaginationBody = { pageSize: 10, page: 1 }): void {
    this.currencyListLoaded = false;

    const currencyListBody: GetCurrencyListBody = {
      ...pagination
    }

    this.currencyService.getCurrencyList(currencyListBody).subscribe(res => {
      this.currencyList = res.result;
      this.tablePagination.totalCount = res.totalCount,
      this.tablePagination.pageSize = res.pageSize,
      this.tablePagination.currentPage = res.currentPage,
      this.tablePagination.totalPages = res.totalPages,
      this.tablePagination.hasNext = res.hasNext,
      this.tablePagination.hasPrev = res.hasPrev
      this.currencyListLoaded = true;
    })
  }

  public onSearch(searchQuery: string) {
    this.tableSearchQuery = searchQuery
    this.loadCurrencyList({ pageSize: 10, page: 1, searchTerm: searchQuery, sortFieldName: this.tableSortField });
  }
}
