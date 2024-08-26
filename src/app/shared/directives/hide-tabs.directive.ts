import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[keyHideTabsTitle]'
})
export class HideTabsDirective {

  constructor(private eleRef: ElementRef) {}

  ngOnInit(): void {
    this.eleRef.nativeElement.children[0].style.display = "none";
  }
}
