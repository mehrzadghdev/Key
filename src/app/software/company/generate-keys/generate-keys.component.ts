import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../services/definitions/company.service';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { TaxSystemService } from '../../services/tax-system/tax-system.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { TaxSystem } from '../../types/tax-system/tax-system';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-generate-keys',
  templateUrl: './generate-keys.component.html',
  styleUrls: ['./generate-keys.component.scss']
})
export class GenerateKeysComponent {
  public generateKeysForm: FormGroup;
  public validationLastCheck: boolean = false;
  public generateKeysLoading: boolean = false;
  public csrGenerated: boolean = false;

  constructor(
    private dialgoRef: MatDialogRef<GenerateKeysComponent>,
    private companyService: CompanyService,
    private clipboard: Clipboard,
    private fb: FormBuilder,
    private utility: UtilityService,
    private taxSystem: TaxSystemService,
  ) {
    this.generateKeysForm = fb.group({
      companyName: ['', [Validators.required]],
      companyNameEn: ['', [Validators.required, CustomValidators.englishOnly]],
      economicCode: ['', [Validators.required, CustomValidators.economicCode]],
      csr: [''],
    })
  }

  ngOnInit(): void {
  }

  public onGenerateKeys(): void {
    if (this.generateKeysForm.valid) {
      this.generateKeysLoading = true;

      const generateKeysBody: TaxSystem.GenerateKeysBody = {
        companyName: this.generateKeysForm.get("companyName")?.value,
        companyNameEn: this.generateKeysForm.get("companyNameEn")?.value,
        economicCode: this.generateKeysForm.get("economicCode")?.value,
        companyType: 'Non-Governmental'
      }

      this.taxSystem.generateCompanyKeys(generateKeysBody).subscribe(
        res => {
          if (res.certificateKey) {
            this.csrGenerated = true;

            this.generateKeysForm.get("csr")?.patchValue(res.certificateKey);
          }
          else {
            this.utility.message("دریافت CSR با خطا مواجه شد", 'بستن');
          }

          this.generateKeysLoading = false;
        },
        error => {
          this.generateKeysLoading = false;
        }
      )
    }
    else {
      this.validationLastCheck = true;
    }
  }

  public copyCSR(): void {
    if (this.csrGenerated) {
      this.clipboard.copy(this.generateKeysForm.get("csr")?.value)
      this.utility.message("CSR با موفقیت کپی شد", 'بستن')
    }
    else {
      this.utility.message("کپی CSR با خطا مواجه شد", 'بستن')
    }
  }

  public closeDialog(value?: any): void {
    this.dialgoRef.close(value);
  }
}
