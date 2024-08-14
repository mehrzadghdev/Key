import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { TaxSystem } from '../../types/tax-system/tax-system';
import { Pagination, PaginationBody } from 'src/app/shared/types/pagination.type';
import { TaxSystemService } from '../../services/tax-system/tax-system.service';
import { debounceTime } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { ProductType } from '../../enums/product-type.enum';

@Component({
  selector: 'app-product-id-search',
  templateUrl: './product-id-search.component.html',
  styleUrls: ['./product-id-search.component.scss']
})
export class ProductIdSearchComponent implements OnInit {
  public tablePagination: Partial<Pagination> = {
    totalCount: 0,
    pageSize: 0,
    currentPage: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  };
  public get dialogTitle(): 'خدمات' | 'کالا' | 'کالا و خدمات' {
    if (this.data.independent) {
      if (this.currentIndependentSearchMode === ProductType.Product) return 'کالا';
      if (this.currentIndependentSearchMode === ProductType.Service) return 'خدمات';
    }

    if (this.data.isService) {
      return 'خدمات';
    }

    return 'کالا';
  }
  public productIdSearchForm: FormGroup;
  public validationLastCheck: boolean = false;
  public staffIdSearchLoading: boolean = false;
  public staffIdList: (TaxSystem.StaffID | TaxSystem.ServiceID)[] = [];
  public tableColumns: string[] = ['شناسه کالا', 'توضیحات کالا', 'انتخاب'];
  public get loadingTableColumns(): string[] {
    if (this.data.independent) {
      return [
        `شناسه ${this.currentIndependentSearchMode === ProductType.Product ? 'کالا' : 'خدمات'}`, 
        `توضیحات ${this.currentIndependentSearchMode === ProductType.Product ? 'کالا' : 'خدمات'}`, 
        'کپی'
      ]
    }

    return [`شناسه ${this.dialogTitle}`, `توضیحات ${this.dialogTitle}`, 'انتخاب']
  } 
  private _currentIndependentSearchMode: ProductType = ProductType.Product;
  public get currentIndependentSearchMode(): ProductType {
    return this._currentIndependentSearchMode;
  }
  public set currentIndependentSearchMode(value: ProductType) {
    if (value !== this._currentIndependentSearchMode) {
      this._currentIndependentSearchMode = value;
      this.searchForStaffId();
    }
  }

  public get ProductTypeEnum(): typeof ProductType {
    return ProductType;
  }

  constructor(
    private dialgoRef: MatDialogRef<ProductIdSearchComponent>,
    private fb: FormBuilder,
    private utility: UtilityService,
    private clipboard: Clipboard,
    private taxSystem: TaxSystemService,
    @Inject(MAT_DIALOG_DATA) public data: { productName: string, isService: boolean, independent: boolean }
  ) {
    this.productIdSearchForm = fb.group({
      searchQuery: ['']
    })
  }

  ngOnInit(): void {
    if (this.data.productName) {
      this.productIdSearchForm.get("searchQuery")?.patchValue(this.data.productName);
      this.searchForStaffId();
    }

    // this.productIdSearchForm.get("searchQuery")?.valueChanges.subscribe(res => {
    //   this.staffIdSearchLoading = true;
    // })

    this.productIdSearchForm.get("searchQuery")?.valueChanges.pipe(
      debounceTime(200)
    )
      .subscribe(res => {
        this.searchForStaffId();
      })
  }

  public onItemPerPageChanged(itemsPerPage: 5 | 10 | 25 | 40 | 60): void {
    this.searchForStaffId({ pageSize: itemsPerPage, page: 1 });
  }

  public onPaginationChanged(pagetoGo: number): void {
    this.searchForStaffId({ pageSize: this.tablePagination.pageSize, page: pagetoGo });
  }

  public searchForStaffId(pagination: PaginationBody = { pageSize: 5, page: 1 }): void {
    this.staffIdSearchLoading = true;
    if (this.data.independent) {
      if (this.currentIndependentSearchMode === ProductType.Service) {
        const getServiceIdBody: TaxSystem.GetServiceIDBody = {
          ...pagination,
          searchTerm: this.productIdSearchForm.get("searchQuery")?.value ?? ''
        }

        this.taxSystem.getServiceID(getServiceIdBody).subscribe(res => {
          this.staffIdList = res.systemservices;
          this.tablePagination.totalCount = res.totalCount,
            this.tablePagination.pageSize = res.pageSize,
            this.tablePagination.currentPage = res.currentPage,
            this.tablePagination.totalPages = res.totalPages,
            this.tablePagination.hasNext = res.hasNext,
            this.tablePagination.hasPrev = res.hasPrev
          this.staffIdSearchLoading = false;
        })
      }
      else {
        const getStaffIdBody: TaxSystem.GetStaffIDBody = {
          ...pagination,
          searchTerm: this.productIdSearchForm.get("searchQuery")?.value ?? ''
        }

        this.taxSystem.getStaffID(getStaffIdBody).subscribe(res => {
          this.staffIdList = res.systemstaffs;
          this.tablePagination.totalCount = res.totalCount,
            this.tablePagination.pageSize = res.pageSize,
            this.tablePagination.currentPage = res.currentPage,
            this.tablePagination.totalPages = res.totalPages,
            this.tablePagination.hasNext = res.hasNext,
            this.tablePagination.hasPrev = res.hasPrev
          this.staffIdSearchLoading = false;
        })
      }
    }
    else {
      if (this.data.isService) {
        const getServiceIdBody: TaxSystem.GetServiceIDBody = {
          ...pagination,
          searchTerm: this.productIdSearchForm.get("searchQuery")?.value ?? ''
        }

        this.taxSystem.getServiceID(getServiceIdBody).subscribe(res => {
          this.staffIdList = res.systemservices;
          this.tablePagination.totalCount = res.totalCount,
            this.tablePagination.pageSize = res.pageSize,
            this.tablePagination.currentPage = res.currentPage,
            this.tablePagination.totalPages = res.totalPages,
            this.tablePagination.hasNext = res.hasNext,
            this.tablePagination.hasPrev = res.hasPrev
          this.staffIdSearchLoading = false;
        })
      }
      else {
        const getStaffIdBody: TaxSystem.GetStaffIDBody = {
          ...pagination,
          searchTerm: this.productIdSearchForm.get("searchQuery")?.value ?? ''
        }

        this.taxSystem.getStaffID(getStaffIdBody).subscribe(res => {
          this.staffIdList = res.systemstaffs;
          this.tablePagination.totalCount = res.totalCount,
            this.tablePagination.pageSize = res.pageSize,
            this.tablePagination.currentPage = res.currentPage,
            this.tablePagination.totalPages = res.totalPages,
            this.tablePagination.hasNext = res.hasNext,
            this.tablePagination.hasPrev = res.hasPrev
          this.staffIdSearchLoading = false;
        })
      }
    }
  }

  public selectStaffId(staffId: string): void {
    this.closeDialog(staffId);
  }

  public copyStaffId(staffId: string): void {
    this.clipboard.copy(staffId)
    this.utility.message("شناسه با موفقیت کپی شد", 'بستن')
  }

  public closeDialog(value?: any): void {
    this.dialgoRef.close(value);
  }
}
