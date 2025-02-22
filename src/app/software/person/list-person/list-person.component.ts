import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';
import { GetCompaniesPersonListBody, GetCompaniesPersonListItem, GetPersonListBody, Person } from '../../types/definitions/person.type';
import { PersonType } from '../../enums/person-type.enum';
import { CreatePersonComponent } from '../create-person/create-person.component';
import { DialogService } from 'src/app/shared/services/utilities/dialog.service';
import { KeyModules } from 'src/app/shared/types/modules.type';
import { PersonService } from '../../services/definitions/person.service';
import { Company } from '../../types/definitions/company.type';
import { UpdatePersonComponent } from '../update-person/update-person.component';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { Pagination, PaginationBody } from 'src/app/shared/types/pagination.type';
import { SelectionModel } from '@angular/cdk/collections';
import { AlertDialogType } from 'src/app/shared/types/dialog.type';
import { ImportPersonsComponent } from '../import-persons/import-persons.component';

@Component({
  selector: 'app-list-product-person-company',
  templateUrl: './list-person.component.html',
  styleUrls: ['./list-person.component.scss']
})
export class ListPersonComponent implements OnInit {
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
  public personsList: GetCompaniesPersonListItem[] = [];
  public personListLoaded: boolean = false;
  public tableColumns: string[] = ["کد", "نوع", "نام", "کد ملی یا شماره اقتصادی", "تاریخ ساخت", "تلفن", "کد پستی", "عملیات"];
  public activeSort: string = 'پیش فرض';
  public mobileActiveSortMode: SortDirection = 'asc';

  public personTypes = [
    { display: 'حقیقی', value: PersonType.Genuine },
    { display: 'حقوقی', value: PersonType.Legal },
    { display: 'مشارکت مدنی', value: PersonType.CivilPartnership },
    { display: 'اتباع غیر ایرانی', value: PersonType.NonIranianNotionals },
    { display: 'مصرف کننده نهایی', value: PersonType.FinalConsumer },
  ]

  public get PersonTypeEnum(): typeof PersonType {
    return PersonType;
  }

  constructor(
    private authentication: AuthenticationService,
    private router: Router,
    private personSerivce: PersonService,
    private dialog: DialogService,
    private utility: UtilityService
  ) { }

  public personTypeTextByNumber(personType: PersonType): string {
    return this.personTypes.find(person => person.value === personType)?.display ?? "نامشخص";
  }

  ngOnInit(): void {
    if (window.innerWidth <= 768) {
      this.tailedTable = true;
    }

    this.loadPersonList();
  }

  public onTableSortChanged(sort: Sort): void {
    this.activeSort = sort.active;
    switch (sort.active) {
      case 'پیش فرض':
        this.tableSortField = 'پیش فرض';
      break;
      case "نوع":
        if (sort.direction === 'asc') this.tableSortField = 'personType';
        if (sort.direction === 'desc') this.tableSortField = 'personType_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
      case "نام":
        if (sort.direction === 'asc') this.tableSortField = 'personName';
        if (sort.direction === 'desc') this.tableSortField = 'personName_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
      case "کد ملی یا شماره اقتصادی":
        if (sort.direction === 'asc') this.tableSortField = 'nationalId';
        if (sort.direction === 'desc') this.tableSortField = 'nationalId_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
      case "تاریخ ساخت":
        if (sort.direction === 'asc') this.tableSortField = 'createdDate';
        if (sort.direction === 'desc') this.tableSortField = 'createdDate_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
      case "تلفن":
        if (sort.direction === 'asc') this.tableSortField = 'mobile';
        if (sort.direction === 'desc') this.tableSortField = 'mobile_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
      case "کد پستی":
        if (sort.direction === 'asc') this.tableSortField = 'zipCode';
        if (sort.direction === 'desc') this.tableSortField = 'zipCode_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
    }

    this.sortPersonList({ pageSize: this.tablePagination.pageSize, page: 1, sortFieldName: this.tableSortField });
  }

  public onItemPerPageChanged(itemsPerPage: 10 | 25 | 40 | 60): void {
    this.loadPersonList({ pageSize: itemsPerPage, page: 1, searchTerm: this.tableSearchQuery, sortFieldName: this.tableSortField });
  }

  public onPaginationChanged(pagetoGo: number): void { 
    this.loadPersonList({ pageSize: this.tablePagination.pageSize, page: pagetoGo, searchTerm: this.tableSearchQuery, sortFieldName: this.tableSortField });
  }
  
  public sortPersonList(pagination: PaginationBody = { pageSize: 10, page: 1 }): void {
    const personListBody: GetCompaniesPersonListBody = {
      ...pagination
    }

    this.personSerivce.getCompaniesPersonList(personListBody).subscribe(res => {
      this.personsList = res.result;
      this.tablePagination.totalCount = res.totalCount,
      this.tablePagination.pageSize = res.pageSize,
      this.tablePagination.currentPage = res.currentPage,
      this.tablePagination.totalPages = res.totalPages,
      this.tablePagination.hasNext = res.hasNext,
      this.tablePagination.hasPrev = res.hasPrev
      this.personListLoaded = true;
    })
  }

  public loadPersonList(pagination: PaginationBody = { pageSize: 10, page: 1 }): void {
    this.personListLoaded = false;

    const personListBody: GetCompaniesPersonListBody = {
      ...pagination
    }

    this.personSerivce.getCompaniesPersonList(personListBody).subscribe(res => {
      this.personsList = res.result;
      this.tablePagination.totalCount = res.totalCount,
      this.tablePagination.pageSize = res.pageSize,
      this.tablePagination.currentPage = res.currentPage,
      this.tablePagination.totalPages = res.totalPages,
      this.tablePagination.hasNext = res.hasNext,
      this.tablePagination.hasPrev = res.hasPrev
      this.personListLoaded = true;
    })
  }

  public onDeletePerson(personToDelete: Person): void {
    this.dialog.openAcceptDeleteDialog().afterClosed().subscribe(result => {
      if (result) {
        this.personSerivce.deletePerson({ code: personToDelete.code }).subscribe({
          next: () => {
            this.utility.message('طرف حساب با موفقیت حذف شد.', 'بستن');
            this.loadPersonList();
          },
          error: (err) => {
            if (err.status === 400) {
              const validationErrors: string[] = []

              for (const errItem of err.error) {
                for (const errItemError of errItem.errors) {
                  validationErrors.push(errItemError)
                }
              }

              this.dialog.openAlertDialog({ 
                alertType: AlertDialogType.Error,
                message: 'این طرف حساب در بخش ' + validationErrors.join(' و ') + ' ' + 'درحال استفاده است و حذف آن ممکن نیست، ابتدا موارد استفاده مرتبط را بررسی و مدیریت نمایید', 
                title: `امکان حذف طرف حساب "${personToDelete.personName}" وجود ندارد`, 
                hasCancel: false ,
                dialogName: 'خطا در حذف طرف حساب' 
              });
            }
          }
        })
      }
    })
  }

  public onAddPerson(): void {
    this.dialog.openFormDialog(CreatePersonComponent, {
      width: "456px"
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loadPersonList()
      }
    })
  }

  public onUpdatePerson(code: number) {
    this.dialog.openFormDialog(UpdatePersonComponent, {
      width: "456px",
      data: {
        code: code
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loadPersonList()
      }
    })
  }

  public onSearch(searchQuery: string) {
    this.tableSearchQuery = searchQuery
    this.loadPersonList({ pageSize: 10, page: 1, searchTerm: searchQuery, sortFieldName: this.tableSortField });
  }

  public onImportPersonsFromExcel(): void {
    this.dialog.openFormDialog(ImportPersonsComponent, {
      width: "100%",
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loadPersonList()
      }
    })
  }
}
