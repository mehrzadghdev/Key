import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { SelectOption } from 'src/app/shared/types/common.type';
import { GetCompaniesInvoiceList, GetCompaniesInvoiceListBody, GetInvoiceListInvoiceItem } from '../../types/invoice.type';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { InvoicePatternType, InvoicePaymentMethod, InvoiceType } from '../../enums/invoice-type.enum';
import { Sort } from '@angular/material/sort';
import { CreateInvoiceComponent } from '../create-invoice/create-invoice.component';
import { UpdatePersonComponent } from '../../person/update-person/update-person.component';
import { Pagination, PaginationBody } from 'src/app/shared/types/pagination.type';

@Component({
  selector: 'app-list-invoice',
  templateUrl: './list-invoice.component.html',
  styleUrls: ['./list-invoice.component.scss']
})
export class ListInvoiceComponent implements OnInit {
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
  public checkInvoiceValidityLoading: boolean = false;

  public tableSelectionModel = new SelectionModel<GetInvoiceListInvoiceItem>(true, []);

  public invoiceList: GetInvoiceListInvoiceItem[] = [];
  public invoiceListLoaded: boolean = false;
  public tableColumns: string[] = ["انتخاب", "کد", "تاریخ فاکتور", "نوع", "طرف حساب", "الگو فروش", "روش پرداخت", "عملیات"];

  public invoiceTypeList: SelectOption<InvoiceType>[] = [
    { display: "اصلی", value: InvoiceType.Main },
    { display: "ابطالی", value: InvoiceType.Cancellation },
    { display: "اصلاحی", value: InvoiceType.Corrective }
  ]

  public invoicePaymentMethodList: SelectOption<InvoicePaymentMethod>[] = [
    { display: "نقدی", value: InvoicePaymentMethod.Cash },
    { display: "نسیه", value: InvoicePaymentMethod.Credit },
    { display: "نقد و نسیه", value: InvoicePaymentMethod.CashAndCredit }
  ]

  public invoicePatternTypeList: SelectOption<InvoicePatternType>[] = [
    { value: InvoicePatternType.Sale, display: "فروش" },
    { value: InvoicePatternType.CurrencySale, display: "فروش ارز" },
    { value: InvoicePatternType.GoldAndPlatinum, display: "طلا و جواهر و پلاتینیوم" },
    { value: InvoicePatternType.Contract, display: "قرارداد پیمان کاری" },
    { value: InvoicePatternType.UtilityBills, display: "قبوض خدماتی" },
    { value: InvoicePatternType.Export, display: "صادرات" },
  ]

  constructor(
    private authentication: AuthenticationService,
    private router: Router,
    private invoiceSerivce: InvoiceService,
    private dialog: DialogService,
    private utility: UtilityService
  ) { }

  public invoiceTypeTextByNumber(invoiceType: InvoiceType): string {
    return this.invoiceTypeList.find(invoice => invoice.value === invoiceType)?.display ?? "نامشخص";
  }

  public invoicePatternTypeTextByNumber(invoicePatternType: InvoicePatternType): string {
    return this.invoicePatternTypeList.find(invoice => invoice.value === invoicePatternType)?.display ?? "نامشخص";
  }

  public invoicePaymentMethodTextByNumber(invoiceType: InvoicePaymentMethod): string {
    return this.invoicePaymentMethodList.find(invoice => invoice.value === invoiceType)?.display ?? "نامشخص";
  }

  ngOnInit(): void {
    this.loadInvoiceList();
  }

  public isAllRowsSelected(): boolean {
    return this.tableSelectionModel.selected.length === this.invoiceList.length;
  }

  public selectAllRows(): void {
    if (this.isAllRowsSelected()) {
      this.tableSelectionModel.clear();
    }
    else {
      this.invoiceList.forEach(invoice => this.tableSelectionModel.select(invoice));
    }
  }

  public onTableSortChanged(sort: Sort): void {
    switch (sort.active) {
      case "کد":
        if (sort.direction === 'asc') this.tableSortField = 'invoiceCode';
        if (sort.direction === 'desc') this.tableSortField = 'invoiceCode_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
      case "تاریخ فاکتور":
        if (sort.direction === 'asc') this.tableSortField = 'invoiceDate';
        if (sort.direction === 'desc') this.tableSortField = 'invoiceDate_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
      case "نوع":
        if (sort.direction === 'asc') this.tableSortField = 'invoiceType';
        if (sort.direction === 'desc') this.tableSortField = 'invoiceType_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
      case "طرف حساب":
        if (sort.direction === 'asc') this.tableSortField = 'personName';
        if (sort.direction === 'desc') this.tableSortField = 'personName_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
      case "الگو فروش":
        if (sort.direction === 'asc') this.tableSortField = 'patternType';
        if (sort.direction === 'desc') this.tableSortField = 'patternType_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
      case "روش پرداخت":
        if (sort.direction === 'asc') this.tableSortField = 'paymentMethod';
        if (sort.direction === 'desc') this.tableSortField = 'paymentMethod_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
    }

    this.sortInvoiceList({ pageSize: this.tablePagination.pageSize, page: 1, sortFieldName: this.tableSortField });
  }

  public onItemPerPageChanged(itemsPerPage: 10 | 25 | 40 | 60): void {
    this.loadInvoiceList({ pageSize: itemsPerPage, page: 1, searchTerm: this.tableSearchQuery, sortFieldName: this.tableSortField });
  }

  public onPaginationChanged(pagetoGo: number): void { 
    this.loadInvoiceList({ pageSize: this.tablePagination.pageSize, page: pagetoGo, searchTerm: this.tableSearchQuery, sortFieldName: this.tableSortField });
  }
  
  public sortInvoiceList(pagination: PaginationBody = { pageSize: 10, page: 1 }): void {
    const invoiceListBody: GetCompaniesInvoiceListBody = {
      ...pagination
    }

    this.invoiceSerivce.getCompaniesInvoiceList(invoiceListBody).subscribe(res => {
      this.invoiceList = res.saleInvoices;
      this.tablePagination.totalCount = res.totalCount,
      this.tablePagination.pageSize = res.pageSize,
      this.tablePagination.currentPage = res.currentPage,
      this.tablePagination.totalPages = res.totalPages,
      this.tablePagination.hasNext = res.hasNext,
      this.tablePagination.hasPrev = res.hasPrev
      this.invoiceListLoaded = true;
    })
  }

  public loadInvoiceList(pagination: PaginationBody = { pageSize: 10, page: 1 }): void {
    this.invoiceListLoaded = false;

    const invoiceListBody: GetCompaniesInvoiceListBody = {
      ...pagination
    }

    this.invoiceSerivce.getCompaniesInvoiceList(invoiceListBody).subscribe(res => {
      this.invoiceList = res.saleInvoices;
      this.tablePagination.totalCount = res.totalCount,
      this.tablePagination.pageSize = res.pageSize,
      this.tablePagination.currentPage = res.currentPage,
      this.tablePagination.totalPages = res.totalPages,
      this.tablePagination.hasNext = res.hasNext,
      this.tablePagination.hasPrev = res.hasPrev
      this.invoiceListLoaded = true;
    })
  }

  public onDeleteInvoice(invoiceCodeToDelete: number, invoiceIdToDelete: number): void {
    this.dialog.openAcceptDeleteDialog().afterClosed().subscribe(result => {
      if (result) {
        this.invoiceSerivce.deleteInvoice({ invoiceCode: invoiceCodeToDelete, invoiceId: invoiceIdToDelete }).subscribe(res => {
          this.utility.message('فاکتور فروش با موفقیت حذف شد.', 'بستن');
          this.loadInvoiceList();
        })
      }
    })
  }

  public onAddInvoice(): void {
    this.dialog.openFullScreenDialog(CreateInvoiceComponent).afterClosed().subscribe(res => {
      this.loadInvoiceList();
    })
  }

  public onUpdateInvoice(invoiceCode: number) {
    // TODO
  }

  public onUpdateInvoicePerson(personCodeToEdit: number): void {
    this.dialog.openFormDialog(UpdatePersonComponent, {
      width: "456px",
      data: {
        code: personCodeToEdit
      }
    }).afterClosed().subscribe(res => {
      this.loadInvoiceList()
    })
  }

  public onSearch(searchQuery: string) {
    this.tableSearchQuery = searchQuery
    this.loadInvoiceList({ pageSize: 10, page: 1, searchTerm: searchQuery, sortFieldName: this.tableSortField });
  }

  public checkInvoiceValidity(invoiceCode: number): void {
    // TODO
    this.checkInvoiceValidityLoading = true;
    
    setTimeout(() => {
      this.loadInvoiceList();
      this.checkInvoiceValidityLoading = false;
    }, 3000);
  }
}
