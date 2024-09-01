import { Pipe, PipeTransform } from '@angular/core';
import { DateISO } from '../types/common.type';
import * as moment from 'jalali-moment';

@Pipe({
  name: 'daysBetweenDates'
})
export class DaysBetweenDatesPipe implements PipeTransform {

  transform(start: DateISO, end: DateISO | false): number {
      let date1 = new Date(start);
      let date2 = new Date();

      if (end !== false) {
        date2 = new Date(end);
      }
  
      // One day in milliseconds
      const oneDay = 1000 * 60 * 60 * 24;
  
      // Calculating the time difference between two dates
      const diffInTime = date2.getTime() - date1.getTime();
  
      // Calculating the no. of days between two dates
      const diffInDays = Math.round(diffInTime / oneDay);
  
      return diffInDays;
  }
}
