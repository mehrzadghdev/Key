import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { GetCompaniesPersonListItem, Person } from '../../types/person.type';
import { PersonType } from '../../enums/person-type.enum';
import { CreatePersonComponent } from '../create-person/create-person.component';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { KeyModules } from 'src/app/shared/types/modules.type';
import { PersonService } from '../../services/person.service';
import { Company } from '../../types/company.type';
import { UpdatePersonComponent } from '../update-person/update-person.component';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-list-product-person-company',
  templateUrl: './list-person.component.html',
  styleUrls: ['./list-person.component.scss']
})
export class ListPersonComponent implements OnInit {
  public personsList: GetCompaniesPersonListItem[] = [];
  public personListLoaded: boolean = false;
  public tableColumns: string[] = ["نوع", "نام", "کد ملی یا شماره اقتصادی", "تاریخ ساخت", "تلفن", "کد پستی", "عملیات"];
  public personTypes = [
    { display: 'حقیقی', value: PersonType.Genuine },
    { display: 'حقوقی', value: PersonType.Legal },
    { display: 'مشارکت مدنی', value: PersonType.CivilPartnership },
    { display: 'اتباع غیر ایرانی', value: PersonType.NonIranianNotionals },
    { display: 'مصرف کننده نهایی', value: PersonType.FinalConsumer },
  ]

  constructor(
    private authentication: AuthenticationService,
    private router: Router,
    private personSerivce: PersonService,
    private dialog: DialogService,
    private utility: UtilityService
  ) { }

  public personTypeTextByNumber(personType: PersonType): string {
    return this.personTypes.find(person => person.value === personType)?.display ?? "نامشخص";
  }

  ngOnInit(): void {
    this.loadPersonList();
  }

  public loadPersonList(): void {
    this.personListLoaded = false;

    const currentCompany = this.authentication.currentCompany as Company;

    this.personSerivce.getCompaniesPersonList({ databaseId: currentCompany.databaseId }).subscribe(res => {
      this.personsList = res;
      this.personListLoaded = true;
    })
  }

  public onDeletePerson(personCodeToDelete: number): void {
    this.personSerivce.deletePerson({ code: personCodeToDelete }).subscribe(res => {
      this.utility.message('طرف حساب با موفقیت حذف شد.', 'بستن');
      this.loadPersonList();
    })
  }

  public onAddPerson(): void {
    this.dialog.openFormDialog(CreatePersonComponent, {
      width: "456px"
    }).afterClosed().subscribe(res => {
      this.loadPersonList()
    })
  }

  public onUpdatePerson(code: number) {
    this.dialog.openFormDialog(UpdatePersonComponent, {
      width: "456px",
      data: {
        code: code
      }
    }).afterClosed().subscribe(res => {
      this.loadPersonList()
    })
  }

  public onSearch(searchQuery: string) {
    if (searchQuery && this.personListLoaded) {      
      const filteredData = this.personsList.filter(person => {
        for (const [key, value] of Object.entries(person)) {
          if (typeof value === 'string' && value.includes(searchQuery)) {
            return true
          }
          if (typeof value === 'number'&& value.toString().includes(searchQuery)) {
            return true
          }
        }
        
        return;
      })
      
      this.personsList = filteredData;
    }
    else {
      this.loadPersonList();
    }
  }
}
