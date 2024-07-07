import { Component, OnInit } from '@angular/core';
import { AddUnitBody, Unit, UpdateUnitBody } from '../../types/unit.type';
import { UnitService } from '../../services/unit.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {
  public unitListLoaded: boolean = false;
  public unitList: Unit[] = [];
  public tableColumns: string[] = ['ایدی واحد', 'نام واحد', 'کد واحد', 'عملیات'];
  public addUnitForm: FormGroup;
  public validationLastCheck: boolean = false;
  public addUnitLoading: boolean = false;
  public updateMode: boolean = false
  public updateUnitLoading: boolean = false;

  constructor(private unitService: UnitService, private fb: FormBuilder, private utility: UtilityService, private dialog: DialogService) {
    this.addUnitForm = fb.group({
      code: [null, [Validators.required]],
      name: ['', Validators.required],
      id: null
    })
  }

  ngOnInit(): void {
    this.loadUnitList()
  }

  public loadUnitList(): void {
    this.unitListLoaded = false;

    this.unitService.getUnitList().subscribe(res => {
      this.unitList = res;
      this.unitListLoaded = true;
    })
  }

  public onDeleteUnit(unitCodeToDelete: number): void {
    this.dialog.openAcceptDeleteDialog().afterClosed().subscribe(result => {
      if (result) {
        this.unitService.deleteUnit({ code: unitCodeToDelete }).subscribe(res => {
          this.utility.message('واحد با موفقیت حذف شد.', 'بستن');
          this.loadUnitList();
        })
      }
    })
  }

  public onAddUnit(): void {
    if (this.addUnitForm.valid) {
      this.addUnitLoading = true;
      const addUnitBody: AddUnitBody = {
        code: this.addUnitForm.controls["code"].value,
        name: this.addUnitForm.controls["name"].value,
      }

      this.unitService.addUnit(addUnitBody).subscribe(res => {
        this.addUnitLoading = false;
        this.validationLastCheck = false;
        this.utility.message('واحد با موفقیت ایجاد شد.', 'بستن');
        this.loadUnitList();
      },
      err => {
        this.addUnitLoading = false
      })
    }
    else {
      this.validationLastCheck = true;
    }
  }

  public onUpdateUnit(): void {
    if (this.addUnitForm.valid) {
      this.updateUnitLoading = true;
      const updateUnitBody: UpdateUnitBody = {
        id: this.addUnitForm.controls["id"].value,
        code: this.addUnitForm.controls["code"].value,
        name: this.addUnitForm.controls["name"].value
      }

      this.unitService.updateUnit(updateUnitBody).subscribe(res => {
        this.updateUnitLoading = false;
        this.validationLastCheck = false;
        this.utility.message('واحد با موفقیت ویرایش شد.', 'بستن');
        this.loadUnitList();
        this.onCancelUpdateMode();
      })
    }
    else {
      this.validationLastCheck = true;
    }
  }

  public onUpdateMode(unit: Unit): void {
    this.updateMode = true;

    this.addUnitForm.patchValue({
      code: unit.code,
      name: unit.name,
      id: unit.id
    })

    this.addUnitForm.get("code")?.disable();
  }

  public onCancelUpdateMode(): void {
    this.updateMode = false;

    this.addUnitForm.patchValue({
      code: null,
      name: '',
      id: null
    })

    this.addUnitForm.get("code")?.markAsUntouched();
    this.addUnitForm.get("name")?.markAsUntouched();
    this.addUnitForm.get("id")?.markAsUntouched();
    this.addUnitForm.get("code")?.enable();
  }

  public onSearch(searchQuery: string) {
    if (searchQuery && this.unitListLoaded) {
      const filteredData = this.unitList.filter(unit => {
        for (const [key, value] of Object.entries(unit)) {
          if (typeof value === 'string' && value.includes(searchQuery)) {
            return true
          }
          if (typeof value === 'number'&& value.toString().includes(searchQuery)) {
            return true
          }
        }
  
        return;
      })
  
      this.unitList = filteredData;
    }
    else {
      this.loadUnitList();
    }
  }
}
