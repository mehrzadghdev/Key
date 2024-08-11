import { Component, OnInit } from '@angular/core';
import { AddUnitBody, Unit, UpdateUnitBody } from '../../types/unit.type';
import { UnitService } from '../../services/unit.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { DialogService } from 'src/app/shared/services/utilities/dialog.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { Pagination, PaginationBody } from 'src/app/shared/types/pagination.type';
import { Sort } from '@angular/material/sort';
import { GetCompaniesPersonListBody, GetPersonListBody } from '../../types/person.type';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {
  public tailedTable: boolean = false;
  public date: string = new Date().toISOString();

  public tablePagination: Partial<Pagination> = {
    totalCount: 0,
    pageSize: 0,
    currentPage: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  };
  public tableSearchQuery: string = '';

  public unitListLoaded: boolean = false;
  public tableSortField: string = '';
  public unitList: Unit[] = [];
  public tableColumns: string[] = ['ایدی واحد', 'نام واحد', 'کد واحد', 'عملیات'];
  public addUnitForm: FormGroup;
  public validationLastCheck: boolean = false;
  public addUnitLoading: boolean = false;
  public updateMode: boolean = false
  public updateUnitLoading: boolean = false;

  constructor(private unitService: UnitService, private fb: FormBuilder, private utility: UtilityService, private dialog: DialogService) {
    this.addUnitForm = fb.group({
      code: [null, [Validators.required, CustomValidators.code]],
      name: ['', Validators.required],
      id: null
    })
  }

  ngOnInit(): void {
    if (window.innerWidth <= 768) {
      this.tailedTable = true;
    }

    this.loadUnitList()
  }

  public onTableSortChanged(sort: Sort): void {
    switch (sort.active) {
      case 'ایدی واحد':
        if (sort.direction === 'asc') this.tableSortField = 'id';
        if (sort.direction === 'desc') this.tableSortField = 'id_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
      case 'نام واحد':
        if (sort.direction === 'asc') this.tableSortField = 'name';
        if (sort.direction === 'desc') this.tableSortField = 'name_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
      case 'کد واحد':
        if (sort.direction === 'asc') this.tableSortField = 'code';
        if (sort.direction === 'desc') this.tableSortField = 'code_desc';
        if (sort.direction === '') this.tableSortField = '';
      break;
    }

    this.sortUnitList({ pageSize: this.tablePagination.pageSize, page: 1, sortFieldName: this.tableSortField });
  }

  public sortUnitList(pagination: PaginationBody = { pageSize: 10, page: 1 }): void {
    const unitListBody: GetPersonListBody = {
      ...pagination
    }

    this.unitService.getUnitList(unitListBody).subscribe(res => {
      this.unitList = res.result;
      this.tablePagination.totalCount = res.totalCount,
      this.tablePagination.pageSize = res.pageSize,
      this.tablePagination.currentPage = res.currentPage,
      this.tablePagination.totalPages = res.totalPages,
      this.tablePagination.hasNext = res.hasNext,
      this.tablePagination.hasPrev = res.hasPrev
      this.unitListLoaded = true;
    })
  }

  public loadUnitList(pagination: PaginationBody = { pageSize: 10, page: 1 }): void {
    this.unitListLoaded = false;

    const unitListBody: GetPersonListBody = {
      ...pagination
    }

    this.unitService.getUnitList(unitListBody).subscribe(res => {
      this.unitList = res.result;
      this.tablePagination.totalCount = res.totalCount,
      this.tablePagination.pageSize = res.pageSize,
      this.tablePagination.currentPage = res.currentPage,
      this.tablePagination.totalPages = res.totalPages,
      this.tablePagination.hasNext = res.hasNext,
      this.tablePagination.hasPrev = res.hasPrev
      this.unitListLoaded = true;
    })
  }

  public onItemPerPageChanged(itemsPerPage: 10 | 25 | 40 | 60): void {
    this.loadUnitList({ pageSize: itemsPerPage, page: 1, searchTerm: this.tableSearchQuery, sortFieldName: this.tableSortField });
  }

  public onPaginationChanged(pagetoGo: number): void {
    this.loadUnitList({ pageSize: this.tablePagination.pageSize, page: pagetoGo, searchTerm: this.tableSearchQuery, sortFieldName: this.tableSortField });
  }

  public onDeleteUnit(unitCodeToDelete: number): void {
    this.dialog.openAcceptDeleteDialog().afterClosed().subscribe(result => {
      if (result) {
        this.unitService.deleteUnit({ code: unitCodeToDelete }).subscribe(res => {
          this.utility.message('واحد با موفقیت حذف شد.', 'بستن');
          this.loadUnitList();
        })
      }
    })
  }

  public onAddUnit(): void {
    if (this.addUnitForm.valid) {
      this.addUnitLoading = true;
      const addUnitBody: AddUnitBody = {
        code: this.addUnitForm.controls["code"].value,
        name: this.addUnitForm.controls["name"].value,
      }

      this.unitService.addUnit(addUnitBody).subscribe(res => {
        this.addUnitLoading = false;
        this.validationLastCheck = false;
        this.utility.message('واحد با موفقیت ایجاد شد.', 'بستن');
        this.loadUnitList();
      },
        err => {
          this.addUnitLoading = false
        })
    }
    else {
      this.validationLastCheck = true;
    }
  }

  public onUpdateUnit(): void {
    if (this.addUnitForm.valid) {
      this.updateUnitLoading = true;
      const updateUnitBody: UpdateUnitBody = {
        code: this.addUnitForm.controls["code"].value,
        name: this.addUnitForm.controls["name"].value
      }

      this.unitService.updateUnit(updateUnitBody).subscribe(res => {
        this.updateUnitLoading = false;
        this.validationLastCheck = false;
        this.utility.message('واحد با موفقیت ویرایش شد.', 'بستن');
        this.loadUnitList();
        this.onCancelUpdateMode();
      })
    }
    else {
      this.validationLastCheck = true;
    }
  }

  public onUpdateMode(unit: Unit): void {
    this.updateMode = true;

    this.addUnitForm.patchValue({
      code: unit.code,
      name: unit.name,
      id: unit.id
    })

    this.addUnitForm.get("code")?.disable();
  }

  public onCancelUpdateMode(): void {
    this.updateMode = false;

    this.addUnitForm.patchValue({
      code: null,
      name: '',
      id: null
    })

    this.addUnitForm.get("code")?.markAsUntouched();
    this.addUnitForm.get("name")?.markAsUntouched();
    this.addUnitForm.get("id")?.markAsUntouched();
    this.addUnitForm.get("code")?.enable();
  }

  public onSearch(searchQuery: string) {
    this.tableSearchQuery = searchQuery
    this.loadUnitList({ pageSize: 10, page: 1, searchTerm: searchQuery, sortFieldName: this.tableSortField });
  }
}
