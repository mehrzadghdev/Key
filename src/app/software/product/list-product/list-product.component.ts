import { Component } from '@angular/core';
import { GetCompaniesProductListBody, Product } from '../../types/product.type';
import { ProductType } from '../../enums/product-type.enum';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { Company } from '../../types/company.type';
import { CreateProductComponent } from '../create-product/create-product.component';
import { Unit } from '../../types/unit.type';
import { UnitService } from '../../services/unit.service';
import { UpdateProductComponent } from '../update-product/update-product.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Pagination, PaginationBody } from 'src/app/shared/types/common.type';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent {
  public tablePagination: Partial<Pagination> = {
    totalCount: 0,
    pageSize: 0,
    currentPage: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  };
  public tableSearchQuery: string = '';

  public productList: Product[] = [];
  public unitList: Unit[] = [];
  public productListLoaded: boolean = false;
  public unitListLoaded: boolean = false;
  public tableColumns: string[] = ["نوع", "نام", "شناسه کالا", "واحد کالا", "قیمت", "کد کالا", "عملیات"];
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
  ) {}
    
  public productTypeTextByNumber(productType: ProductType): string {
    return this.productTypes.find(product => product.value === productType)?.display ?? "نامشخص";
  }

  ngOnInit(): void {
    this.loadProductList();
    this.loadUnitList();
  }

  public onItemPerPageChanged(itemsPerPage: 10 | 25 | 40 | 60): void {
    this.loadProductList({ pageSize: itemsPerPage, page: 1, searchTerm: this.tableSearchQuery });
  }

  public onPaginationChanged(pagetoGo: number): void {
    this.loadProductList({ pageSize: this.tablePagination.pageSize, page: pagetoGo, searchTerm: this.tableSearchQuery });
  }

  public loadUnitList(): void {
    this.unitListLoaded = false;

    this.unitService.getUnitList().subscribe(res => {
      this.unitList = res;
      this.unitListLoaded = true;
    })
  }

  public loadProductList(pagination: PaginationBody = { pageSize: 19, page: 1 }): void {
    this.productListLoaded = false;
  
    const currentCompany = this.authentication.currentCompany as Company;
    const productListBody: GetCompaniesProductListBody = {
      databaseId: currentCompany.databaseId,
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
      this.loadProductList()
    })
  }

  public onUpdateProduct(code: number) {
    this.dialog.openFormDialog(UpdateProductComponent, {
      width: "456px",
      data: {
        code: code
      }
    }).afterClosed().subscribe(res => {
      this.loadProductList()
    })
    return;
  }

  public onSearch(searchQuery: string) {
    this.tableSearchQuery = searchQuery
    this.loadProductList({ pageSize: 10, page: 1, searchTerm: searchQuery });
  }
}
