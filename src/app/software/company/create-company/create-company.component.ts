import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddCompanyBody } from '../../types/company.type';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CompanyService } from '../../services/company.service';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss']
})
export class CreateCompanyComponent {
  public addCompanyForm: FormGroup;
  public addCompanyStep: 'welcome' | 'base' | 'information' | 'tax' = 'welcome';
  public addCompanyLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateCompanyComponent>,
    private companyService: CompanyService,
    private authentication: AuthenticationService,
    private utility: UtilityService,
    @Inject(MAT_DIALOG_DATA) public data: { firstCompany?: boolean, disableClose?: boolean }
  ) {
    this.addCompanyForm = fb.group({
      companyName: ['', Validators.required],
      taxIdentity: ['', [Validators.required, CustomValidators.taxIdentity]],
      privateKey: ['', Validators.required],
      companyZipCode: ['', CustomValidators.zipCode],
      companyAddress: [''],
      companyTel: ['', CustomValidators.phoneNumber],
      companyBranchNo: ['', CustomValidators.branchNo],
      companyStatus: [data.firstCompany ? true : false, Validators.required],
      companyDesc: ['', Validators.required]
    })
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public setStep(step: 'welcome' | 'base' | 'information' | 'tax') {
    if (step == 'information' && (this.addCompanyForm.get("companyName")?.invalid || this.addCompanyForm.get("companyDesc")?.invalid)) {
      this.addCompanyForm.get("companyName")?.markAsTouched();
      this.addCompanyForm.get("companyDesc")?.markAsTouched();
    }
    else {
      this.addCompanyStep = step
    }
  }

  public onAddCompany(): void {
    if (!this.addCompanyForm.invalid && this.authentication.userDetails) {
      this.addCompanyLoading = true;
      
      const addCompanyBody: AddCompanyBody = {
        packageNo: this.authentication.userDetails.packageNo,
        companyName: (this.addCompanyForm.controls["companyName"].value) + "",
        taxIdentity: (this.addCompanyForm.controls["taxIdentity"].value) + "",
        privateKey: (this.addCompanyForm.controls["privateKey"].value) + "",
        companyZipCode: (this.addCompanyForm.controls["companyZipCode"].value) + "",
        companyAddress: (this.addCompanyForm.controls["companyAddress"].value) + "",
        companyTel: (this.addCompanyForm.controls["companyTel"].value) + "",
        companyBranchNo: (this.addCompanyForm.controls["companyBranchNo"].value) + "",
        companyStatus: (this.addCompanyForm.controls["companyStatus"].value),
        companyDesc: (this.addCompanyForm.controls["companyDesc"].value) + ""
      }
      
      this.companyService.addCompany(addCompanyBody).subscribe(res => {
        this.authentication.currentCompany = res;
        this.addCompanyLoading = false;
        this.utility.message('شرکت با موفقیت ایجاد شد.', 'بستن');
        this.dialogRef.close(res.databaseId);
      })
    }
    else if (!this.authentication.userDetails) {
      this.utility.message('احراز هویت با خطا مواجه شد', 'متوجه شدم');
      this.authentication.logout();
    }
    else {
      this.addCompanyForm.markAllAsTouched();
    }
  }
}
