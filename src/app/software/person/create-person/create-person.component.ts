import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonType } from '../../enums/person-type.enum';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';
import { AddPersonBody } from '../../types/definitions/person.type';
import { PersonService } from '../../services/definitions/person.service';
import { Company } from '../../types/definitions/company.type';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';

@Component({
  selector: 'app-create-person',
  templateUrl: './create-person.component.html',
  styleUrls: ['./create-person.component.scss']
})
export class CreatePersonComponent implements OnInit {
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

  public get nationalTitle(): string {
    if (this.addPersonForm.get("personType")?.value === PersonType.NonIranianNotionals) {
      return 'اتباع'
    }

    return 'ملی'
  }
  
  public get PersonTypeEnum(): typeof PersonType {
    return PersonType;
  }

  constructor(
    private dialgoRef: MatDialogRef<CreatePersonComponent>, 
    private personService: PersonService, 
    private fb: FormBuilder, 
    private authentication: AuthenticationService,
    private utility: UtilityService
  ) {
    this.addPersonForm = fb.group({
      code: [null, [Validators.required, CustomValidators.code]], 
      personType: [1, [Validators.required]],
      personName: ["", [Validators.required]],
      nationalId: [null, [Validators.required, CustomValidators.nationalId]],
      economicCode: [111111111111, [Validators.required, CustomValidators.economicCode]],
      tel: [null, CustomValidators.homePhoneNumber],
      mobile: [null, CustomValidators.phoneNumber],
      zipCode: [null, CustomValidators.zipCode],
      address: [null]
    })
  }

  ngOnInit(): void {
    this.personService.getNewPersonCode({}).subscribe(res => {
      this.addPersonForm.get('code')?.patchValue(res.newCode);
    })
  }

  public updateValidityOfForm(personType: PersonType) {
    if (personType === PersonType.FinalConsumer) {
      this.addPersonForm.get("economicCode")?.clearValidators();
      this.addPersonForm.get("nationalId")?.clearValidators();
      this.addPersonForm.get("economicCode")?.updateValueAndValidity();
      this.addPersonForm.get("nationalId")?.updateValueAndValidity();
    }
    if (personType === PersonType.Genuine || personType === PersonType.NonIranianNotionals) {
      this.addPersonForm.get("economicCode")?.setValidators([Validators.required, CustomValidators.economicCode]);
      this.addPersonForm.get("nationalId")?.setValidators([Validators.required, CustomValidators.nationalId]);
      this.addPersonForm.get("economicCode")?.updateValueAndValidity();
      this.addPersonForm.get("nationalId")?.updateValueAndValidity();
      this.addPersonForm.get("economicCode")?.patchValue(111111111111);
      this.addPersonForm.get("nationalId")?.patchValue(null);
    }
    else {
      this.addPersonForm.get("economicCode")?.setValidators([Validators.required, CustomValidators.economicCode]);
      this.addPersonForm.get("nationalId")?.setValidators([Validators.required, CustomValidators.nationalId]);
      this.addPersonForm.get("economicCode")?.updateValueAndValidity();
      this.addPersonForm.get("nationalId")?.updateValueAndValidity();
      this.addPersonForm.get("economicCode")?.patchValue(null);
      this.addPersonForm.get("nationalId")?.patchValue(1111111111);
    }
  }

  public onAddPerson(): void {
    console.log(this.addPersonForm);

    if (this.addPersonForm.valid) {
      this.addPersonLoading = true;
      const addPersonBody: AddPersonBody = {
        code: this.addPersonForm.controls["code"].value,
        personType: this.addPersonForm.controls["personType"].value,
        personName: this.addPersonForm.controls["personName"].value,
        nationalId: this.addPersonForm.controls["nationalId"].value ? this.addPersonForm.controls["nationalId"].value + "" : '',
        economicCode: this.addPersonForm.controls["economicCode"].value ? this.addPersonForm.controls["economicCode"].value + "" : '',
        tel: this.addPersonForm.controls["tel"].value  ? this.addPersonForm.controls["tel"].value  + "" : '',
        mobile: this.addPersonForm.controls["mobile"].value ? this.addPersonForm.controls["mobile"].value  + "" : '',
        zipCode: this.addPersonForm.controls["zipCode"].value ? this.addPersonForm.controls["zipCode"].value  + "" : '',
        address: this.addPersonForm.controls["address"].value
      }

      this.personService.addPerson(addPersonBody).subscribe(res => {
        this.addPersonLoading = false;
        this.utility.message("طرف حساب با موفقیت ایجاد شد.", 'بستن');
        this.closeDialog(addPersonBody);
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
