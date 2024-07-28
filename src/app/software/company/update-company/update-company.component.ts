import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../services/company.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { UpdateCompanyBody } from '../../types/company.type';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-update-company',
  templateUrl: './update-company.component.html',
  styleUrls: ['./update-company.component.scss']
})
export class UpdateCompanyComponent implements OnInit {
  public updateCompanyForm: FormGroup;
  public validationLastCheck: boolean = false;
  public updateCompanyLoading: boolean = false;
  public getCompanyLoading: boolean = true;
  
  constructor(
    private dialgoRef: MatDialogRef<UpdateCompanyComponent>, 
    private companyService: CompanyService, 
    private fb: FormBuilder,
    private utility: UtilityService,
    @Inject(MAT_DIALOG_DATA) private data: { databaseId: number }
  ) {
    this.updateCompanyForm = fb.group({
      companyName: ['', [Validators.required]], 
      taxIdentity: ['', [Validators.required, CustomValidators.taxIdentity]],
      privateKey: ['', Validators.required],
      companyZipCode: ['', CustomValidators.zipCode],
      companyAddress: [''],
      companyTel: ['', CustomValidators.phoneNumber],
      companyBranchNo: ['', CustomValidators.branchNo],
      companyStatus: [false, Validators.required],
      companyDesc: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.companyService.getCompany({ databaseId: this.data.databaseId }).subscribe(res => {
      this.updateCompanyForm.patchValue({
        companyName: res[0].companyName ?? '', 
        taxIdentity: res[0].taxIdentity,
        privateKey: res[0].privateKey,
        companyZipCode: res[0].companyZipCode,
        companyAddress: res[0].companyAddress,
        companyTel: res[0].companyTel,
        companyBranchNo: res[0].companyBranchNo,
        companyStatus: res[0].companyStatus,
        companyDesc: res[0].companyDesc
      })

      this.getCompanyLoading = false;
    })
  }

  public onUpdateCompany(): void {
    if (this.updateCompanyForm.valid) {
      this.updateCompanyLoading = true;
      const updateCompanyBody: UpdateCompanyBody = {
        databaseId: this.data.databaseId, 
        companyName: this.updateCompanyForm.controls['companyName'].value + '', 
        taxIdentity: this.updateCompanyForm.controls['taxIdentity'].value + '', 
        privateKey: this.updateCompanyForm.controls['privateKey'].value + '', 
        companyZipCode: this.updateCompanyForm.controls['companyZipCode'].value + '', 
        companyAddress: this.updateCompanyForm.controls['companyAddress'].value + '', 
        companyTel: this.updateCompanyForm.controls['companyTel'].value + '', 
        companyBranchNo: this.updateCompanyForm.controls['companyBranchNo'].value + '', 
        companyStatus: this.updateCompanyForm.controls['companyStatus'].value, 
        companyDesc: this.updateCompanyForm.controls['companyDesc'].value + '' 
      }

      this.companyService.updateCompany(updateCompanyBody).subscribe(res => {
        this.updateCompanyLoading = false;
        this.utility.message('شرکت با موفقیت ویرایش شد.', 'بستن');
        this.closeDialog(updateCompanyBody.databaseId);
      })
    }
    else {
      this.validationLastCheck = true;
    }
  }

  public closeDialog(value?: any): void {
    this.dialgoRef.close(value);
  }
}
