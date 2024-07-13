import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'farsiNumber'
})
export class FarsiNumberPipe implements PipeTransform {

  transform(value: number): unknown {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return value.toString().replace(/\d/g, (match) => persianNumbers[parseInt(match)]);
  }

}
