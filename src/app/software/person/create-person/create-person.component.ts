import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonType } from '../../enums/person-type.enum';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { AddPersonBody } from '../../types/person.type';
import { PersonService } from '../../services/person.service';
import { Company } from '../../types/company.type';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-create-person',
  templateUrl: './create-person.component.html',
  styleUrls: ['./create-person.component.scss']
})
export class CreatePersonComponent {
  public addPersonForm: FormGroup;
  public validationLastCheck: boolean = false;
  public addPersonLoading: boolean = false;
  public personTypes = [
    { display: 'حقیقی', value: PersonType.Genuine },
    { display: 'حقوقی', value: PersonType.Legal },
    { display: 'مشارکت مدنی', value: PersonType.CivilPartnership },
    { display: 'اتباع غیر ایرانی', value: PersonType.NonIranianNotionals },
    { display: 'مصرف کننده نهایی', value: PersonType.FinalConsumer },
  ]
  
  constructor(
    private dialgoRef: MatDialogRef<CreatePersonComponent>, 
    private personService: PersonService, 
    private fb: FormBuilder, 
    private authentication: AuthenticationService,
    private utility: UtilityService
  ) {
    this.addPersonForm = fb.group({
      code: [null, [Validators.required]], 
      personType: [0, [Validators.required]],
      personName: ["", [Validators.required]],
      nationalId: [null, [Validators.required, CustomValidators.nationalId]],
      economicCode: [111111111111, [Validators.required, CustomValidators.economicCode]],
      tel: [null, CustomValidators.phoneNumber],
      mobile: [null, CustomValidators.phoneNumber],
      zipCode: [null, CustomValidators.zipCode],
      address: [null]
    })
  }

  public updateValidityOfForm(personType: PersonType) {
    if (personType === PersonType.Genuine) {
      this.addPersonForm.get("economicCode")?.patchValue(111111111111);
      this.addPersonForm.get("nationalId")?.patchValue(null);
    }
    else {
      this.addPersonForm.get("economicCode")?.patchValue(null);
      this.addPersonForm.get("nationalId")?.patchValue(1111111111);
    }
  }

  public onAddPerson(): void {
    if (this.addPersonForm.valid) {
      this.addPersonLoading = true;
      const currentCompany = this.authentication.currentCompany as Company;
      const addPersonBody: AddPersonBody = {
        databaseId: currentCompany.databaseId,
        code: this.addPersonForm.controls["code"].value,
        personType: this.addPersonForm.controls["personType"].value,
        personName: this.addPersonForm.controls["personName"].value,
        nationalId: this.addPersonForm.controls["nationalId"].value + "",
        economicCode: this.addPersonForm.controls["economicCode"].value + "",
        tel: this.addPersonForm.controls["tel"].value + "",
        mobile: this.addPersonForm.controls["mobile"].value + "",
        zipCode: this.addPersonForm.controls["zipCode"].value + "",
        address: this.addPersonForm.controls["address"].value
      }

      this.personService.addPerson(addPersonBody).subscribe(res => {
        this.addPersonLoading = false;
        this.utility.message("طرف حساب با موفقیت ایجاد شد.", 'بستن');
        this.closeDialog(addPersonBody.code);
      },
      err => {
        this.addPersonLoading = false
      })
    }
    else {
      this.validationLastCheck = true;
    }
  }

  public closeDialog(value?: any): void {
    this.dialgoRef.close(value ?? null);
  }
}
