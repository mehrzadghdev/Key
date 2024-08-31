import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DatePickerMode, KeyDatePicker, MonthNumber } from './key-date';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'key-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent {
  @ViewChild('datePickerTabs')
  private datePickerTabs!: MatTabGroup;

  @Input('date')
  public userDate: Date = new Date();
  @Input('fullWidth')
  public fullWidth: boolean = true;

  public keyDate: KeyDatePicker = new KeyDatePicker(this.userDate);

  @Output('dateSelected')
  private dateSelected: EventEmitter<string> = new EventEmitter<string>();

  public dateModel: string = this.keyDate.toString();

  public datePickerMode: DatePickerMode = DatePickerMode.Calendar;
  public get DatePickerModeEnum(): typeof DatePickerMode {
    return DatePickerMode;
  }

  constructor() { }

  public onDateSelected(date: number): void {
    this.keyDate.selectedDate({ jYear: this.keyDate.year, jMonth: this.keyDate.month, jDate: date });

    this.dateModel = this.keyDate.toString();
    this.dateSelected.emit(this.keyDate.toISODate());
  }

  public onGoToday(): void {
    this.keyDate.goToday();
    this.toggleDatePickerTabs(DatePickerMode.Calendar);
  }

  public onSelectDatePickerMonth(monthNumber: number): void {
    const month: MonthNumber = monthNumber as MonthNumber;
    this.keyDate.setMonth(month);
    this.toggleDatePickerTabs();
  }

  public toggleDatePickerTabs(tabToToggle?: DatePickerMode) {
    if (!this.datePickerTabs || !(this.datePickerTabs instanceof MatTabGroup)) return;

    if (tabToToggle) {
      this.datePickerMode = tabToToggle;
      this.datePickerTabs.selectedIndex = tabToToggle;
    }
    else {
      if (this.datePickerTabs.selectedIndex === DatePickerMode.Calendar) {
        this.datePickerMode = DatePickerMode.SelectYear;
        this.datePickerTabs.selectedIndex = DatePickerMode.SelectYear;
      }
      else {
        this.datePickerMode = DatePickerMode.Calendar;
        this.datePickerTabs.selectedIndex = DatePickerMode.Calendar;
      }
    }
  } 
}
