import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Company } from '../../types/company.type';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { CreateCompanyComponent } from '../create-company/create-company.component';
import { CompanyService } from '../../services/company.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-select-company',
  templateUrl: './select-company.component.html',
  styleUrls: ['./select-company.component.scss']
})
export class SelectCompanyComponent implements OnInit {
  public companiesList: Company[] = [];
  public getCompaniesLoaded: boolean = false;
  public get currentCompany(): Company {
    return this.authentication.currentCompany as Company
  }
  
  constructor(
    private dialogRef: MatDialogRef<SelectCompanyComponent>,
    private authentication: AuthenticationService,
    private dialog: DialogService,
    private companyService: CompanyService,
    private utility: UtilityService,
    @Inject(MAT_DIALOG_DATA) public data: { companies: Company[], reSelect: boolean }
  ) { }

  ngOnInit(): void {
    if (this.data.reSelect && this.authentication.userDetails) {
      this.companyService.getUsersCompanyList({ packageNo: this.authentication.userDetails.packageNo }).subscribe(companies => {
        this.companiesList = companies;
        this.getCompaniesLoaded = true;
      })
    }
    else {
      this.companiesList = this.data.companies;
    }
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public onSelectCompany(company: Company): void {
    this.authentication.currentCompany = company;
    if (this.data.reSelect) {
      this.utility.message('شرکت با موفقیت تغییر یافت.', 'بستن');
    }
    else {
      this.utility.message('به نرم افزار واسط کلید خوش آمدید.', 'بستن');
    }
    this.dialogRef.close();
  }

  public onAddCompanyDialog(): void {
    this.dialog.openFullScreenDialog(CreateCompanyComponent, {
      data: {
        disableClose: this.data.reSelect ? false : true
      }
    }).afterClosed().subscribe(() => this.dialogRef.close());
  }
}
