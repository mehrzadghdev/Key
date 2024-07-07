import { AfterViewInit, Directive, ElementRef, ViewChild } from '@angular/core';

@Directive({
  selector: '[keyAutoFocus]'
})
export class AutoFocusDirective implements AfterViewInit {

  constructor(private hostElement: ElementRef<HTMLInputElement>) { }

  ngAfterViewInit(): void {
    this.hostElement.nativeElement.focus();
  }
}
