import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { AbstractControl, NgControl, ValidationErrors } from '@angular/forms';

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
export function englishValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const englishRegex = /^[A-Za-z]*$/;
  // const englishRegex = /^[\u0041-\u005A\u0061-\u007A]*$/;

  if (!value) return null;
  return englishRegex.test(value) ? null : { englishOnly: true };
}
