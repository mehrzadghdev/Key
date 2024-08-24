import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../services/definitions/company.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { UpdateCompanyBody } from '../../types/definitions/company.type';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { TaxSystem } from '../../types/tax-system/tax-system';
import { TaxSystemService } from '../../services/tax-system/tax-system.service';

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

  public updateCompanyStep: 'base' | 'keys' = 'base';
  public get stepsProgress(): 0 | 20 | 40 | 60 | 80 {
    switch (this.updateCompanyStep) {
      case 'base':
        return 40;
      case 'keys':
        return 80;
    }

    return 0
  }
  
  constructor(
    private dialgoRef: MatDialogRef<UpdateCompanyComponent>, 
    private companyService: CompanyService, 
    private fb: FormBuilder,
    private utility: UtilityService,
    private taxSystem: TaxSystemService,
    @Inject(MAT_DIALOG_DATA) private data: { databaseId: number }
  ) {
    this.updateCompanyForm = fb.group({
      companyName: ['', [Validators.required]], 
      companyNameEn: ['', [Validators.required, CustomValidators.englishOnly]],
      taxIdentity: ['', [Validators.required, CustomValidators.taxIdentity]],
      privateKey: ['', Validators.required],
      publicKey: ['', Validators.required], 
      economicCode: ['', [Validators.required, CustomValidators.economicOrNationalCode]],
      companyZipCode: ['', CustomValidators.zipCode],
      companyAddress: [''],
      certificateKey: [''],
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
        companyNameEn: res[0].companyNameEn,
        economicCode: res[0].economicCode,
        taxIdentity: res[0].taxIdentity,
        publicKey: res[0].publicKey,
        privateKey: res[0].privateKey,
        certificateKey: res[0].certificateKey,
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

  public onNextStep(): void {
    if (
      this.updateCompanyForm.get("companyName")?.invalid ||
      this.updateCompanyForm.get("companyNameEn")?.invalid ||
      this.updateCompanyForm.get("taxIdentity")?.invalid ||
      this.updateCompanyForm.get("economicCode")?.invalid ||
      this.updateCompanyForm.get("companyZipCode")?.invalid ||
      this.updateCompanyForm.get("companyAddress")?.invalid ||
      this.updateCompanyForm.get("companyTel")?.invalid ||
      this.updateCompanyForm.get("companyBranchNo")?.invalid ||
      this.updateCompanyForm.get("companyStatus")?.invalid ||
      this.updateCompanyForm.get("companyDesc")?.invalid
    ) {
      this.updateCompanyForm.get("companyName")?.markAsTouched();
      this.updateCompanyForm.get("companyNameEn")?.markAsTouched();
      this.updateCompanyForm.get("taxIdentity")?.markAsTouched();
      this.updateCompanyForm.get("economicCode")?.markAsTouched();
      this.updateCompanyForm.get("companyZipCode")?.markAsTouched();
      this.updateCompanyForm.get("companyAddress")?.markAsTouched();
      this.updateCompanyForm.get("companyTel")?.markAsTouched();
      this.updateCompanyForm.get("companyBranchNo")?.markAsTouched();
      this.updateCompanyForm.get("companyStatus")?.markAsTouched();
      this.updateCompanyForm.get("companyDesc")?.markAsTouched();
    }
    else {
      this.updateCompanyStep = 'keys'
    }
  }

  public onGeneratePublicAndPrivateKeys(): void {
    this.getCompanyLoading = true;
    const generateCompanyKeysBody: TaxSystem.GenerateKeysBody = {
      companyName: (this.updateCompanyForm.controls["companyName"].value) + "",
      companyNameEn: (this.updateCompanyForm.controls["companyNameEn"].value) + "",
      economicCode: (this.updateCompanyForm.controls["economicCode"].value) + "",
      companyType: "Non-Governmental"
    }

    this.taxSystem.generateCompanyKeys(generateCompanyKeysBody).subscribe(res => {
      this.getCompanyLoading = false;
      
      this.updateCompanyForm.get("privateKey")?.patchValue(res.privateKey);
      this.updateCompanyForm.get("publicKey")?.patchValue(res.publicKey);
      this.updateCompanyForm.get("certificateKey")?.patchValue(res.certificateKey);

      this.utility.message("کلید خصوصی و عمومی با موفقیت ایجاد شد", 'بستن');
    },
    error => {
      this.getCompanyLoading = false;
    })
  }

  public onUpdateCompany(): void {
    if (this.updateCompanyForm.valid) {
      this.updateCompanyLoading = true;
      const updateCompanyBody: UpdateCompanyBody = {
        databaseId: this.data.databaseId, 
        companyName: this.updateCompanyForm.controls['companyName'].value + '', 
        companyNameEn: this.updateCompanyForm.controls['companyNameEn'].value + '', 
        taxIdentity: this.updateCompanyForm.controls['taxIdentity'].value + '', 
        privateKey: this.updateCompanyForm.controls['privateKey'].value + '', 
        publicKey: this.updateCompanyForm.controls['publicKey'].value + '', 
        economicCode: this.updateCompanyForm.controls['economicCode'].value + '', 
        certificateKey: this.updateCompanyForm.controls['certificateKey'].value + '', 
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
