import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/shared/services/utilities/dialog.service';
import { CreateCompanyComponent } from '../create-company/create-company.component';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';
import { Company, GetCompanyList, GetUsersCompanyListBody } from '../../types/company.type';
import { AnimationOptions } from 'ngx-lottie';
import { SelectCompanyComponent } from '../select-company/select-company.component';
import { UserDetails } from 'src/app/shared/types/authentication.type';
import { KeyModules } from 'src/app/shared/types/modules.type';
import { CompanyService } from '../../services/company.service';
import { UpdateCompanyComponent } from '../update-company/update-company.component';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { SortDirection } from '@angular/material/sort';

@Component({
  selector: 'app-list-product-person-company',
  templateUrl: './list-company.component.html',
  styleUrls: ['./list-company.component.scss']
})
export class ListCompanyComponent implements OnInit {
  public tailedTable: boolean = false;
  public companiesList: Company[] = [];
  public companiesListLoaded: boolean = false;
  public tableColumns: string[] = ["شماره بسته", "نام شرکت", "کد شعبه", "تلفن", "وضعیت", "توضیحات شرکت", "عملیات"];

  constructor(
    private dialog: DialogService, 
    private companyService: CompanyService, 
    private authentication: AuthenticationService,
    private utility: UtilityService
  ) {}

  ngOnInit(): void {
    if (window.innerWidth <= 768) {
      this.tailedTable = true;
    }

    this.loadCompanyList();
  }
  public loadCompanyList(): void {
    this.companiesListLoaded = false;
  
    const currentUserPackageNo: GetUsersCompanyListBody = {
      packageNo: (this.authentication.userDetails as UserDetails).packageNo
    } as const;

    this.companyService.getUsersCompanyList(currentUserPackageNo).subscribe(res => {
      this.companiesList = res;
      this.companiesListLoaded = true;
    })
  }

  public onReSelectCompany(): void {
    this.dialog.openFullScreenDialog(SelectCompanyComponent, {
      data: {
        reSelect: true
      }
    })
  }

  public onDeleteCompany(idToDelete: number): void {
    this.dialog.openAcceptDeleteDialog().afterClosed().subscribe(result => {
      if (result) {
        this.companyService.deleteCompany({ databaseId: idToDelete }).subscribe(res => {
          this.utility.message('شرکت با موفقیت حذف شد.', 'بستن');
          this.loadCompanyList();
        })
      }
    })
  }

  public onAddCompany(): void {
    this.dialog.openFullScreenDialog(CreateCompanyComponent, {
      data: {
        firstCompany: false, 
        disableClose: false
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loadCompanyList()
      }
    })
  }

  public onUpdateCompany(databaseId: number) {
    this.dialog.openFormDialog(UpdateCompanyComponent, {
      width: "456px",
      data: {
        databaseId: databaseId
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loadCompanyList()
      }
    })
  }

  public onSearch(searchQuery: string) {
    if (searchQuery && this.companiesListLoaded) {
      const filteredData = this.companiesList.filter(company => {
        for (const [key, value] of Object.entries(company)) {
          if (typeof value === 'string' && value.includes(searchQuery)) {
            return true
          }
          if (typeof value === 'number'&& value.toString().includes(searchQuery)) {
            return true
          }
        }
  
        return;
      })
  
      this.companiesList = filteredData;
    }
    else {
      this.loadCompanyList();
    }
  }
}
