import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KeyDatePicker } from './key-date';

@Component({
  selector: 'key-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent {
  @Input('date')
  public userDate: Date = new Date();

  @Input('fullWidth')
  public fullWidth: boolean = true;

  public keyDate: KeyDatePicker = new KeyDatePicker(this.userDate);
  
  @Output('dateSelected')
  private dateSelected: EventEmitter<string> = new EventEmitter<string>();
  
  public dateModel: string = this.keyDate.toString();
  
  constructor( ) {}

  public onDateSelected(date: number): void {
    this.keyDate.selectedDate({ jYear: this.keyDate.year, jMonth: this.keyDate.month, jDate: date });

    this.dateModel = this.keyDate.toString();
    this.dateSelected.emit(this.keyDate.toISODate());
  }
}
