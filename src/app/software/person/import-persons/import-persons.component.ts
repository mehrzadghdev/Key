import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AddPersonsBody, Person } from '../../types/definitions/person.type';
import * as XLSX from 'xlsx';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { PersonType } from '../../enums/person-type.enum';
import { DialogService } from 'src/app/shared/services/utilities/dialog.service';
import { AlertDialogType } from 'src/app/shared/types/dialog.type';
import { PersonService } from '../../services/definitions/person.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { invalid } from 'jalali-moment';

@Component({
  selector: 'app-import-persons',
  templateUrl: './import-persons.component.html',
  styleUrls: ['./import-persons.component.scss']
})
export class ImportPersonsComponent implements OnInit {
  public importPersonsLoading: boolean = false;
  // public personsList: Person[] = [];
  public serverPersonCodes: number[] = [];
  public readExcelLoading: boolean = false;
  public addPersonsLoading: boolean = false;
  public excelReaded: boolean = false;
  public tableColumns: string[] = ["کد طرف حساب", "نوع", "نام", "کد ملی", "شماره اقتصادی", "تلفن", "تلفن ثابت", "کد پستی", "آدرس"];
  public importPersonsForm: FormGroup = this.fb.group({
    persons: this.fb.array([])
  });
  get personsFromArray(): FormArray<FormGroup> {
    return <FormArray<FormGroup>>this.importPersonsForm.get("persons");
  }
  get allPersonCodes(): readonly number[] {
    const allImportedPersonCodes: number[] = this.personsFromArray.controls.map(group => group.get("code")?.value);

    return [...this.serverPersonCodes, ...allImportedPersonCodes]
  }

  public personTypes = [
    { display: 'حقیقی', value: PersonType.Genuine },
    { display: 'حقوقی', value: PersonType.Legal },
    { display: 'مشارکت مدنی', value: PersonType.CivilPartnership },
    { display: 'اتباع غیر ایرانی', value: PersonType.NonIranianNotionals },
    { display: 'مصرف کننده نهایی', value: PersonType.FinalConsumer },
  ]

  public get PersonTypeEnum(): typeof PersonType {
    return PersonType;
  }

  constructor(
    private dialogRef: MatDialogRef<ImportPersonsComponent>,
    private fb: FormBuilder,
    private dialog: DialogService,
    private personService: PersonService,
    private utility: UtilityService,
  ) { }

  ngOnInit(): void {
    this.getCompaniesPersonCodes();
  }

  private getCompaniesPersonCodes(): void {
    this.personService.getCompaniesPersonCodes({}).subscribe(result => {
      const personCodesNumberList: number[] = result.map(personCodeObject => personCodeObject.code);

      for (const personCode of personCodesNumberList) {
        this.serverPersonCodes.push(personCode);
      }
    })
  }

  private initPersonsFormArraySubscriptions(): void {
    this.personsFromArray.controls.forEach(group => {
      if ((this.allPersonCodes.includes(group.get("code")?.value)) && (this.allPersonCodes.filter(code => code === group.get("code")?.value).length > 1)) {
        group.get("code")?.setErrors({ conflict: true });
      }

      group.get("code")?.valueChanges.subscribe(value => {
        if ((this.allPersonCodes.includes(value)) && (this.allPersonCodes.filter(code => code === value).length > 1)) {
          group.get("code")?.setErrors({ conflict: true });
        }
      })
    })
  }

  private onAddPersons(personList: Person[]): void {
    this.addPersonsLoading = true;

    this.personService.addPersons({ persons: personList }).subscribe(
      result => {
        this.closeDialog(true);
        this.addPersonsLoading = false;
      },
      error => {
        this.closeDialog();
        this.addPersonsLoading = false;
      }
    );
  }

  private onReadExcel(excelWorkBook: XLSX.WorkBook): void {
    const worksheet: XLSX.WorkSheet = excelWorkBook.Sheets[excelWorkBook.SheetNames[0]];

    const rowData = XLSX.utils.sheet_to_json(worksheet);

    for (let i = 0; i < rowData.length; i++) {
      const field: Record<string, string> = rowData[i] as Record<string, string>;

      if (field['کد طرف حساب *']) {
        const newPersonObject: Person = {
          id: 0,
          code: Number(field['کد طرف حساب *'] ?? 0),
          personName: field['نام طرف حساب *'],
          personType: (Number(field['نوع طرف حساب *']) as PersonType),
          nationalId: '',
          economicCode: '',
          tel: field['شماره ثابت'],
          mobile: field['شماره موبایل'],
          zipCode: field['کد پستی'],
          address: field['آدرس و مکان']
        }

        if (newPersonObject.personType === PersonType.Legal) {
          newPersonObject.economicCode = field['کدملی / کد اقتصادی / کد اتباع *']
        }
        else {
          newPersonObject.nationalId = field['کدملی / کد اقتصادی / کد اتباع *']
        }

        const fromControlFromPersonObject: FormGroup = this.fb.group({
          code: [newPersonObject.code, Validators.required],
          personName: [newPersonObject.personName, Validators.required],
          personType: [newPersonObject.personType, [Validators.required, Validators.pattern(/^[1-5]$/)]],
          tel: [Number(newPersonObject.tel), CustomValidators.homePhoneNumber],
          mobile: [Number(newPersonObject.mobile), CustomValidators.phoneNumber],
          nationalId: [Number(newPersonObject.nationalId), CustomValidators.nationalId],
          economicCode: [Number(newPersonObject.economicCode), CustomValidators.economicCode],
          zipCode: [Number(newPersonObject.zipCode), CustomValidators.zipCode],
          address: [newPersonObject.address],
        })
        this.personsFromArray.push(fromControlFromPersonObject);
      }
    }
    
    this.initPersonsFormArraySubscriptions();
    
    this.excelReaded = true;
    this.readExcelLoading = false;
  }

  public personTypeTextByNumber(personType: PersonType): string {
    return this.personTypes.find(person => person.value === personType)?.display ?? "نامعتبر";
  }

  public onImportPersons(): void {
    const validPersonFormGroups: FormGroup[] = this.personsFromArray.controls.filter(control => control.valid);
    const invalidPersonsCount: number = this.personsFromArray.controls.filter(control => control.invalid).length;
    const validPersons: Person[] = validPersonFormGroups.map(control => {
      const personObject: Person = {
        id: 0,
        code: control.value,
        personName: control.value,
        personType: control.value,
        nationalId: control.value ? control.value + '' : null,
        economicCode: control.value ? control.value + '' : null,
        tel: control.value ? control.value + '' : null,
        mobile: control.value ? control.value + '' : null,
        zipCode: control.value ? control.value + '' : null,
        address: control.value ? control.value + '' : null
      }

      return personObject;
    })

    if (validPersons.length < 1) {
      this.dialog.openAlertDialog({
        dialogName: 'فراخوانی از اکسل',
        title: 'خطا: هیچ ردیف معتبری پیدا نشد',
        message: 'هیچ ردیف معتبری برای فراخوانی پیدا نشد، لطفا ابتدا خطا های مربوطه را رفع و سپس دوباره تلاش کنید',
        alertType: AlertDialogType.Error,
        hasCancel: false
      })
    }
    else if (validPersons.length === this.personsFromArray.controls.length) {
      this.dialog.openAlertDialog({
        dialogName: 'فراخوانی از اکسل',
        title: `تایید فراخوانی ${validPersons.length} طرف حساب`,
        message: 'در صورت تایید تمام طرف حساب های نمایش داده شده در پیش نمایش به لیست طرف حساب ها اصافه میشوند',
        alertType: AlertDialogType.Info,
        hasCancel: true
      }).afterClosed().subscribe(result => {
        if (result) {
          this.onAddPersons(validPersons);
        }
      });
    }
    else {
      this.dialog.openAlertDialog({
        dialogName: 'فراخوانی از اکسل',
        title: 'اخطار: ' + invalidPersonsCount + ' طرف حساب نامعتبر میباشد',
        message: invalidPersonsCount + ' طرف حساب نامعتبر میباشد و در فراخوانی خوانده نمیشود',
        alertType: AlertDialogType.Warning,
        hasCancel: true
      }).afterClosed().subscribe(result => {
        if (result) {
          this.onAddPersons(validPersons);
        }
      });
    }
  }

  public onExcelUploaded(file: File): void {
    this.readExcelLoading = true;
    file.arrayBuffer()
      .then(arrayBuffer => {
        const excelWorkBook: XLSX.WorkBook = XLSX.read(arrayBuffer);

        this.onReadExcel(excelWorkBook);
      })
      .catch(error => {
        this.utility.message("خواندن اکسل با خطا مواجه شد", 'بستن')
        this.readExcelLoading = false;
      })
  }

  public closeDialog(value?: any): void {
    this.dialogRef.close(value ?? null);
  }

  public onRemoveReadedExcel(): void {
    this.personsFromArray.clear();

    this.excelReaded = false;
  }
}
