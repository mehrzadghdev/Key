import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jdate'
})
export class JdatePipe implements PipeTransform {

  transform(value: string | Date, format: Intl.DateTimeFormatOptions = {  year: 'numeric', month: "2-digit", day: "2-digit" }): string {
    const date = new Date(value);

    return date.toLocaleDateString("fa", format);
  }

}
