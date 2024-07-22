import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jdate'
})
export class JdatePipe implements PipeTransform {

  transform(value: string | Date): string {
    const date = new Date(value);

    return date.toLocaleDateString("fa", {  year: 'numeric', month: "2-digit", day: "2-digit" });
  }

}
