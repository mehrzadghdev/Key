import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonType } from '../../enums/person-type.enum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PersonService } from '../../services/person.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { Company } from '../../types/company.type';
import { AddPersonBody, UpdatePersonBody } from '../../types/person.type';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-update-person',
  templateUrl: './update-person.component.html',
  styleUrls: ['./update-person.component.scss']
})
export class UpdatePersonComponent implements OnInit {
  public getPersonLoading: boolean = true;
  public updatePersonForm: FormGroup;
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
    private dialgoRef: MatDialogRef<UpdatePersonComponent>, 
    private personService: PersonService, 
    private fb: FormBuilder, 
    private utility: UtilityService,
    private authentication: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) private data: { code: number }
  ) {
    this.updatePersonForm = fb.group({
      code: [null, [Validators.required, CustomValidators.code]], 
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

  ngOnInit(): void {
    this.updatePersonForm.get("code")?.disable();
    this.personService.getPerson({ code: this.data.code }).subscribe(res => {
      this.updatePersonForm.patchValue({
        code: this.data.code ?? '', 
        personType: res[0].personType ?? '',
        personName: res[0].personName ?? '',
        nationalId: res[0].nationalId ?? '',
        economicCode: res[0].economicCode ?? '',
        tel: res[0].tel && res[0].tel !== 'null' ? res[0].tel : null,
        mobile: res[0].mobile && res[0].mobile !== 'null' ? res[0].mobile : null,
        zipCode: res[0].zipCode && res[0].zipCode !== 'null' ? res[0].zipCode : null,
        address: res[0].address ?? ''
      })

      this.getPersonLoading = false;
    })
  }

  public updateValidityOfForm(personType: PersonType) {
    if (personType === PersonType.Genuine) {
      this.updatePersonForm.get("economicCode")?.patchValue(111111111111);
      this.updatePersonForm.get("nationalId")?.patchValue(null);
    }
    else {
      this.updatePersonForm.get("economicCode")?.patchValue(null);
      this.updatePersonForm.get("nationalId")?.patchValue(1111111111);
    }
  }

  public onUpdatePerson(): void {
    if (this.updatePersonForm.valid) {
      this.addPersonLoading = true;
      const currentCompany = this.authentication.currentCompany as Company;
      const addPersonBody: UpdatePersonBody = {
        code: this.data.code,
        personType: this.updatePersonForm.controls["personType"].value,
        personName: this.updatePersonForm.controls["personName"].value,
        nationalId: this.updatePersonForm.controls["nationalId"].value + "",
        economicCode: this.updatePersonForm.controls["economicCode"].value + "",
        tel: this.updatePersonForm.controls["tel"].value + "",
        mobile: this.updatePersonForm.controls["mobile"].value + "",
        zipCode: this.updatePersonForm.controls["zipCode"].value + "",
        address: this.updatePersonForm.controls["address"].value
      }

      this.personService.updatePerson(addPersonBody).subscribe(res => {
        this.addPersonLoading = false;
        this.utility.message("طرف حساب با موفقیت ویرایش شد.", 'بستن');
        this.closeDialog();
      })
    }
    else {
      this.validationLastCheck = true;
    }
  }

  public closeDialog(): void {
    this.dialgoRef.close();
  }
}
