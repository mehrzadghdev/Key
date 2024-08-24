import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddCompanyBody } from '../../types/definitions/company.type';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CompanyService } from '../../services/definitions/company.service';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { TaxSystemService } from '../../services/tax-system/tax-system.service';
import { TaxSystem } from '../../types/tax-system/tax-system';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss']
})
export class CreateCompanyComponent {
  public generateKeysLoading: boolean = false;

  public addCompanyForm: FormGroup;
  public addCompanyStep: 'welcome' | 'base' | 'information' | 'tax' | 'keys' = 'welcome';
  public addCompanyLoading: boolean = false;
  public get stepsProgress(): 0 | 20 | 40 | 60 | 80 {
    switch (this.addCompanyStep) {
      case 'base':
        return 20;
      case 'information':
        return 40;
      case 'tax':
        return 60;
      case 'keys':
        return 80;
    }

    return 0
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateCompanyComponent>,
    private companyService: CompanyService,
    private taxSystem: TaxSystemService,
    private authentication: AuthenticationService,
    private utility: UtilityService,
    @Inject(MAT_DIALOG_DATA) public data: { firstCompany?: boolean, disableClose?: boolean }
  ) {
    this.addCompanyForm = fb.group({
      companyName: ['', Validators.required],
      companyNameEn: ['', [Validators.required, CustomValidators.englishOnly]],
      taxIdentity: ['', [Validators.required, CustomValidators.taxIdentity]],
      economicCode: ['', [Validators.required, CustomValidators.economicOrNationalCode]],
      privateKey: ['', Validators.required],
      publicKey: ['', Validators.required],
      certificateKey: [''],
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

  public setStep(step: 'welcome' | 'base' | 'information' | 'tax' | 'keys') {
    if (step == 'information' && (this.addCompanyForm.get("companyName")?.invalid || this.addCompanyForm.get("companyDesc")?.invalid || this.addCompanyForm.get("companyNameEn")?.invalid)) {
      this.addCompanyForm.get("companyName")?.markAsTouched();
      this.addCompanyForm.get("companyNameEn")?.markAsTouched();
      this.addCompanyForm.get("companyDesc")?.markAsTouched();
    }
    else if (step == 'keys' && (this.addCompanyForm.get("taxIdentity")?.invalid || this.addCompanyForm.get("economicCode")?.invalid)) {
      this.addCompanyForm.get("taxIdentity")?.markAsTouched();
      this.addCompanyForm.get("economicCode")?.markAsTouched();  
    }
    else {
      this.addCompanyStep = step
    }
  }

  public onGeneratePublicAndPrivateKeys(): void {
    this.generateKeysLoading = true;
    const generateCompanyKeysBody: TaxSystem.GenerateKeysBody = {
      companyName: (this.addCompanyForm.controls["companyName"].value) + "",
      companyNameEn: (this.addCompanyForm.controls["companyNameEn"].value) + "",
      economicCode: (this.addCompanyForm.controls["economicCode"].value) + "",
      companyType: "Non-Governmental"
    }

    this.taxSystem.generateCompanyKeys(generateCompanyKeysBody).subscribe(res => {
      this.generateKeysLoading = false;
      
      this.addCompanyForm.get("privateKey")?.patchValue(res.privateKey);
      this.addCompanyForm.get("publicKey")?.patchValue(res.publicKey);
      this.addCompanyForm.get("certificateKey")?.patchValue(res.certificateKey);

      this.utility.message("کلید خصوصی و عمومی با موفقیت ایجاد شد", 'بستن');
    },
    error => {
      this.generateKeysLoading = false;
    })
  }

  public onAddCompany(): void {
    if (!this.addCompanyForm.invalid && this.authentication.userDetails) {
      this.addCompanyLoading = true;
      
      const addCompanyBody: AddCompanyBody = {
        packageNo: this.authentication.userDetails.packageNo,
        companyName: (this.addCompanyForm.controls["companyName"].value) + "",
        companyNameEn: (this.addCompanyForm.controls["companyNameEn"].value) + "",
        taxIdentity: (this.addCompanyForm.controls["taxIdentity"].value) + "",
        economicCode: (this.addCompanyForm.controls["economicCode"].value) + "",
        privateKey: (this.addCompanyForm.controls["privateKey"].value) + "",
        publicKey: (this.addCompanyForm.controls["publicKey"].value) + "",
        certificateKey: (this.addCompanyForm.controls["certificateKey"].value) + "",
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
