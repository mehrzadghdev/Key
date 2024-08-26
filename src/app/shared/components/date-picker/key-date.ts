import * as moment from "jalali-moment";

export class KeyDatePicker {
    private momentDate: moment.Moment = moment(this.gDate);
    public monthList: string[] = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    public weekdayList: string[] = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
    public datePicker: KeyDatePickerDay[] = [];

    get month(): number {
        return this.momentDate.jMonth();
    }

    get monthName(): string {
        return this.monthList[this.momentDate.jMonth()];
    }

    private get monthLength(): number {
        return this.momentDate.jDaysInMonth();
    }

    get monthStartWeekDay(): number {
        const firstDayOfMonth = this.momentDate.startOf('jMonth');

        return firstDayOfMonth.day() + 1;
    }

    get year(): number {
        return this.momentDate.jYear();
    }

    get day(): number {
        return this.momentDate.jDate();
    }

    get weekday(): number {
        return this.momentDate.jDay();
    }

    get weekdayName(): string {
        return this.weekdayList[this.weekday];
    }

    constructor(private gDate: Date = new Date()) {
        this.loadDatePicker();
    }

    private loadDatePicker(): void {
        this.datePicker = [];

        for (let i = 0; i < this.monthLength; i++) {
            const day: KeyDatePickerDay = {
                day: i+1,
                today: this.isToday({ jYear: this.year, jMonth: this.month, jDate: i+1 }),
                weekdayNumber: this.getWeekday({ jYear: this.year, jMonth: this.month, jDate: i+1 }),
                weekday: this.weekdayList[this.getWeekday({ jYear: this.year, jMonth: this.month, jDate: i+1 })],
            } 

            this.datePicker.push(day);
        }
    }

    public selectedDate(dateInput: KeyDateInput): void {
        this.momentDate.jYear(dateInput.jYear);
        this.momentDate.jMonth(dateInput.jMonth)
        this.momentDate.jDate(dateInput.jDate);
    }

    public addMonth(number: number = 1): void {
        this.momentDate.add(number, 'jMonth');
        this.loadDatePicker();
    }

    
    public subtractMonth(number: number = 1): void {
        this.momentDate.subtract(number, 'jMonth');
        this.loadDatePicker();
    }
    
    public setMonth(monthNumber: MonthNumber) {
        this.momentDate.jMonth(monthNumber)
    }
    
    public addYear(number: number = 1): void {
        this.momentDate.add(number, 'jYear');
        this.loadDatePicker();
    }

    public subtractYear(number: number = 1): void {
        this.momentDate.subtract(number, 'jYear');
        this.loadDatePicker();
    }

    private isToday(dateInput: KeyDateInput): boolean {
        const date: moment.Moment = moment();
        date.jYear(dateInput.jYear);
        date.jMonth(dateInput.jMonth)
        date.jDate(dateInput.jDate);

        return date.isSame(moment(), 'jDay');
    }

    private getWeekday(dateInput: KeyDateInput): number {
        const date: moment.Moment = moment();
        date.jYear(dateInput.jYear);
        date.jMonth(dateInput.jMonth)
        date.jDate(dateInput.jDate);

        return date.jDay();
    }

    public goToday(): void {
        this.momentDate = moment(new Date());
        this.loadDatePicker()
    }

    public toString(): string {
        return this.momentDate.format('jYYYY/jMM/jDD');
    }

    public toISODate(): string {
        return this.momentDate.format("YYYY-MM-DD") + 'T00:00:00.000Z';
    }
}

export interface KeyDateInput {
    jYear: number;
    jMonth: number;
    jDate: number
}

export interface KeyDatePickerDay {
    day: number;
    weekday: string;
    weekdayNumber: number;
    today: boolean;
}

export enum DatePickerMode {
    Calendar = 0,
    SelectYear = 1
}

export type MonthNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10| 11;