import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { GetCompaniesPersonListItem, Person } from '../types/person.type';
import { PersonService } from '../services/person.service';
import { Company } from 'src/app/company/types/company.type';
import { PersonType } from '../enums/person-type.enum';
import { CreatePersonComponent } from '../create-person/create-person.component';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { KeyModules } from 'src/app/shared/types/modules.type';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
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
  
  constructor(private authentication: AuthenticationService, private router: Router, private personSerivce: PersonService, private dialog: DialogService) {
    this.authentication.authorize();
  }
    
  public personTypeTextByNumber(personType: PersonType): string {
    return this.personTypes.find(person => person.value === personType)?.display ?? "نامشخص";
  }

  ngOnInit(): void {
    const currentCompany = this.authentication.currentCompany as Company;

    this.personSerivce.getCompaniesPersonList({ databaseId: currentCompany.databaseId }).subscribe(res => {
      console.log(res);
      this.personsList = res;
      this.personListLoaded = true;
    })
  }

  public onDataUpdated(data: KeyModules): void {
    if (data === "person") {
      this.reloadPersonList()
    }
  }

  private reloadPersonList(): void {
    this.personListLoaded = false;
  
    const currentCompany = this.authentication.currentCompany as Company;

    this.personSerivce.getCompaniesPersonList({ databaseId: currentCompany.databaseId }).subscribe(res => {
      this.personsList = res;
      this.personListLoaded = true;
    })
  }

  public onDeletePerson(personCodeToDelete: number): void {
    this.personSerivce.deletePerson({ code: personCodeToDelete }).subscribe(res => {
      this.reloadPersonList();
    })
  }

  public onAddPerson(): void {
    this.dialog.openFormDialog(CreatePersonComponent, {
      width: "456px"
    }).afterClosed().subscribe(res => {
      this.reloadPersonList()
    })
  }
}
