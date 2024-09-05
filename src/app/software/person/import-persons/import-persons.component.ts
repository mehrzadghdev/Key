import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Person } from '../../types/definitions/person.type';
import * as XLSX from 'xlsx';
import { UtilityService } from 'src/app/shared/services/utilities/utility.service';
import { PersonType } from '../../enums/person-type.enum';
import { DialogService } from 'src/app/shared/services/utilities/dialog.service';
import { AlertDialogType } from 'src/app/shared/types/dialog.type';
import { PersonService } from '../../services/definitions/person.service';

@Component({
  selector: 'app-import-persons',
  templateUrl: './import-persons.component.html',
  styleUrls: ['./import-persons.component.scss']
})
export class ImportPersonsComponent implements OnInit {
  public importPersonsLoading: boolean = false;
  public personsList: Person[] = [];
  public readExcelLoading: boolean = false;
  public addPersonsLoading: boolean = false;
  public tailedTable: boolean = false;
  public excelReaded: boolean = false;
  public tableColumns: string[] = ["کد طرف حساب", "نوع", "نام", "کد ملی یا شماره اقتصادی", "تلفن", "تلفن ثابت", "کد پستی", "آدرس"];

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
    if (window.innerWidth <= 768) {
      this.tailedTable = true;
    }
  }

  public personTypeTextByNumber(personType: PersonType): string {
    return this.personTypes.find(person => person.value === personType)?.display ?? "نامعتبر";
  }

  public isPersonTypeValid(personType: number): boolean {
    if (this.personTypes.find(person => person.value === personType)) {
      return true;
    }

    return false
  }

  public isNationalIdOrEconomicCodeValid(nationalIdOrEconomicCode: string): boolean {
    if (nationalIdOrEconomicCode.length > 10) {
      return true;
    }

    return false
  }

  public isMobileValid(mobileNumber?: string): boolean {
    if (!mobileNumber) {
      return true;
    }

    if (mobileNumber.length === 11) {
      return true;
    }

    return false
  }

  public isZipCodeValid(zipCode?: string): boolean {
    if (!zipCode) {
      return true;
    }

    if (zipCode.length === 10) {
      return true;
    }

    return false
  }

  public isPersonCodeUniqueInExcel(personCode: number): boolean {
    if (this.personsList.filter(person => person.code === personCode).length < 1) {
      return true;
    }

    return false;
  }

  public onImportPersons(): void {
    const validPersons = this.personsList.filter((person: Person) => {
      return this.isPersonTypeValid(person.personType) 
      && this.isNationalIdOrEconomicCodeValid(person.personType === PersonType.Genuine || person.personType === PersonType.NonIranianNotionals ? person.nationalId : person.economicCode)
      && this.isMobileValid(person.mobile)
      && this.isZipCodeValid(person.zipCode)
      && this.isPersonCodeUniqueInExcel(person.code);
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
    else if (validPersons.length === this.personsList.length) {
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
        title: 'اخطار: بعضی از ردیف ها نامعتبر میباشند', 
        message: 'بعضی از ردیف های انتخاب شده خطا دارند و در فراخوانی اضافه نمیشوند', 
        alertType: AlertDialogType.Warning,
         hasCancel: true 
      }).afterClosed().subscribe(result => {
        if (result) {
          this.onAddPersons(validPersons);
        }
      });
    }
  }

  public onAddPersons(personList: Person[]): void {
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
  
  public onReadExcel(excelWorkBook: XLSX.WorkBook): void {
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

        this.personsList.push(newPersonObject);
      }
    }

    this.excelReaded = true;
    this.readExcelLoading = false;
  }
  
  public closeDialog(value?: any): void {
    this.dialogRef.close(value ?? null);
  }

  public onRemoveReadedExcel(): void {
    this.personsList = [];

    this.excelReaded = false;
  }
}
