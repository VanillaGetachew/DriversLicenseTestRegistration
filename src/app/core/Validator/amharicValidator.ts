import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[amharicOnly]',
  standalone: true
})
export class AmharicOnlyDirective {
  private regex: RegExp = /^[\u1200-\u137F\s]*$/;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: any) {
    const input = this.el.nativeElement.value;
    if (!this.regex.test(input)) {
      this.el.nativeElement.value = input.replace(/[^\u1200-\u137F\s]/g, '');
      event.stopPropagation();
    }
  }
}
