// import { Directive, ElementRef, HostListener } from '@angular/core';

// @Directive({
//   selector: '[englishOnly]',
//   standalone: true
// })
// export class EnglishOnlyDirective {
//   private regex: RegExp = /^[\u0041-\u005A\u0061-\u007A\s]*$/;
  

//   constructor(private el: ElementRef) {}

//   @HostListener('input', ['$event']) onInput(event: any) {
//     const input = this.el.nativeElement.value;
//     if (!this.regex.test(input)) {
//       this.el.nativeElement.value = input.replace(/[^\u0041-\u005A\u0061-\u007A\s]/g, '');
//       event.stopPropagation();
//     }
//   }
// }
import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[englishOnly]',
  standalone: true
})
export class EnglishOnlyDirective {
  private el = inject(ElementRef<HTMLInputElement>);
  private control = inject(NgControl);

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputEl = this.el.nativeElement;
    const originalValue = inputEl.value;

    const sanitized = originalValue.replace(/[^A-Za-z\s]/g, '');

    if (originalValue !== sanitized) {
      inputEl.value = sanitized;
    }

    if (this.control.control) {
      this.control.control.setValue(sanitized, {
        emitEvent: false,
      });
      this.control.control.markAsDirty();
      this.control.control.updateValueAndValidity();
    }
  }
}
