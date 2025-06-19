import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noFutureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const today = new Date();
  const inputDate = new Date(control.value);

  // Strip time portion for accurate comparison
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate > today ? { futureDate: true } : null;
}
