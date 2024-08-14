import { Component } from '@angular/core';
import { GetCompaniesProductListBody, Product } from '../../types/definitions/product.type';
import { ProductType } from '../../enums/product-type.enum';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';
import { Router } from '@angular/router';
import { ProductService } from '../../services/definitions/product.service';
import { DialogService } from 'src/app/shared/services/utilities/dialog.service';
import { Company } from '../../types/definitions/company.type';
import { CreateProductComponent } from '../create-product/create-product.component';
import { Unit } from '../../types/definitions/unit.type';
import { UnitService } from '../../services/definitions/unit.service';
import { UpdateProductComponent } from '../update-product/update-product.component';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { Pagination, PaginationBody } from 'src/app/shared/types/pagination.type';
import { Sort, SortDirection } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ProductIdSearchComponent } from '../product-id-search/product-id-search.component';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent {
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
  public productList: Product[] = [];
  public unitList: Unit[] = [];
  public productListLoaded: boolean = false;
  public unitListLoaded: boolean = false;
  public tableColumns: string[] = ["نوع", "نام", "شناسه کالا", "واحد کالا", "قیمت", "کد کالا", "عملیات"];
  public activeSort: string = 'پیش فرض';
  public mobileActiveSortMode: SortDirection = 'asc';

  public productTypes = [
    { display: 'کالا', value: ProductType.Product },
    { display: 'خدمات', value: ProductType.Service },
  ]

  constructor(
    private authentication: AuthenticationService,
    private router: Router,
    private productSerivce: ProductService,
    private unitService: UnitService,
    private dialog: DialogService,
    private utility: UtilityService
  ) { }

  public productTypeTextByNumber(productType: ProductType): string {
    return this.productTypes.find(product => product.value === productType)?.display ?? "نامشخص";
  }

  ngOnInit(): void {
    if (window.innerWidth <= 768) {
      this.tailedTable = true;
    }

    this.loadProductList();
    this.loadUnitList();
  }

  public onTableSortChanged(sort: Sort): void {
    this.activeSort = sort.active;
    switch (sort.active) {
      case 'پیش فرض':
        this.tableSortField = 'پیش فرض';
        break;
      case "نوع":
        if (sort.direction === 'asc') this.tableSortField = 'productType';
        if (sort.direction === 'desc') this.tableSortField = 'productType_desc';
        if (sort.direction === '') this.tableSortField = '';
        break;
      case "نام":
        if (sort.direction === 'asc') this.tableSortField = 'name';
        if (sort.direction === 'desc') this.tableSortField = 'name_desc';
        if (sort.direction === '') this.tableSortField = '';
        break;
      case "شناسه کالا":
        if (sort.direction === 'asc') this.tableSortField = 'productCode';
        if (sort.direction === 'desc') this.tableSortField = 'productCode_desc';
        if (sort.direction === '') this.tableSortField = '';
        break;
      case "واحد کالا":
        if (sort.direction === 'asc') this.tableSortField = 'unitCode';
        if (sort.direction === 'desc') this.tableSortField = 'unitCode_desc';
        if (sort.direction === '') this.tableSortField = '';
        break;
      case "قیمت":
        if (sort.direction === 'asc') this.tableSortField = 'price';
        if (sort.direction === 'desc') this.tableSortField = 'price_desc';
        if (sort.direction === '') this.tableSortField = '';
        break;
      case "کد کالا":
        if (sort.direction === 'asc') this.tableSortField = 'code';
        if (sort.direction === 'desc') this.tableSortField = 'code_desc';
        if (sort.direction === '') this.tableSortField = '';
        break;
    }

    this.sortProductList({ pageSize: this.tablePagination.pageSize, page: 1, sortFieldName: this.tableSortField });
  }

  public onItemPerPageChanged(itemsPerPage: 10 | 25 | 40 | 60): void {
    this.loadProductList({ pageSize: itemsPerPage, page: 1, searchTerm: this.tableSearchQuery, sortFieldName: this.tableSortField });
  }

  public onPaginationChanged(pagetoGo: number): void {
    this.loadProductList({ pageSize: this.tablePagination.pageSize, page: pagetoGo, searchTerm: this.tableSearchQuery, sortFieldName: this.tableSortField });
  }

  public loadUnitList(): void {
    this.unitListLoaded = false;

    this.unitService.getUnitList({ pageSize: 9999 }).subscribe(res => {
      this.unitList = res.result;
      this.unitListLoaded = true;
    })
  }

  public sortProductList(pagination: PaginationBody = { pageSize: 10, page: 1 }): void {
    const productListBody: GetCompaniesProductListBody = {
      ...pagination
    }

    this.productSerivce.getCompaniesProductList(productListBody).subscribe(res => {
      this.productList = res.result;
      this.tablePagination.totalCount = res.totalCount,
        this.tablePagination.pageSize = res.pageSize,
        this.tablePagination.currentPage = res.currentPage,
        this.tablePagination.totalPages = res.totalPages,
        this.tablePagination.hasNext = res.hasNext,
        this.tablePagination.hasPrev = res.hasPrev
      this.productListLoaded = true;
    })
  }

  public loadProductList(pagination: PaginationBody = { pageSize: 10, page: 1 }): void {
    this.productListLoaded = false;

    const productListBody: GetCompaniesProductListBody = {
      ...pagination
    }

    this.productSerivce.getCompaniesProductList(productListBody).subscribe(res => {
      this.productList = res.result;
      this.tablePagination.totalCount = res.totalCount,
        this.tablePagination.pageSize = res.pageSize,
        this.tablePagination.currentPage = res.currentPage,
        this.tablePagination.totalPages = res.totalPages,
        this.tablePagination.hasNext = res.hasNext,
        this.tablePagination.hasPrev = res.hasPrev
      this.productListLoaded = true;
    })
  }

  public onDeleteProduct(productCodeToDelete: number): void {
    this.dialog.openAcceptDeleteDialog().afterClosed().subscribe(result => {
      if (result) {
        this.productSerivce.deleteProduct({ code: productCodeToDelete }).subscribe(res => {
          this.utility.message('کالا یا خدمات با موفقیت حذف شد.', 'بستن');
          this.loadProductList();
        })
      }
    })
  }

  public findUnitName(unitCode: number): string {
    return this.unitList.find(unit => unit.code === unitCode)?.name ?? 'نامشخص';
  }

  public onAddProduct(): void {
    this.dialog.openFormDialog(CreateProductComponent, {
      width: "456px"
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loadProductList()
      }
    })
  }

  public onUpdateProduct(code: number) {
    this.dialog.openFormDialog(UpdateProductComponent, {
      width: "456px",
      data: {
        code: code
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loadProductList()
      }
    })
    return;
  }

  public onSearch(searchQuery: string) {
    this.tableSearchQuery = searchQuery
    this.loadProductList({ pageSize: 10, page: 1, searchTerm: searchQuery, sortFieldName: this.tableSortField });
  }


  public onSearchProductId(): void {
    this.dialog.openFormDialog(ProductIdSearchComponent, {
      width: '556px',
      data: {
        independent: true
      }
    })
  }
}
