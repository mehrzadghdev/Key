import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[keyPercentageInput]'
})
export class PercentageInputDirective {

  constructor(private hostElement: ElementRef<HTMLInputElement>) { }

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    if (value > 100) {
      input.value = '100';
    }
    else if (value < 0) {
      input.value = '0';
    }
  }
}
