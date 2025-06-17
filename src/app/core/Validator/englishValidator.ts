import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[englishOnly]',
  standalone: true
})
export class EnglishOnlyDirective {
  private regex: RegExp = /^[\u0041-\u005A\u0061-\u007A\s]*$/;
  

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: any) {
    const input = this.el.nativeElement.value;
    if (!this.regex.test(input)) {
      this.el.nativeElement.value = input.replace(/[^\u0041-\u005A\u0061-\u007A\s]/g, '');
      event.stopPropagation();
    }
  }
}
