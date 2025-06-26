// input-dialog.component.ts
import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Enter Required Input</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="fill" class="w-full">
        <mat-label>Input</mat-label>
        <input matInput formControlName="userInput" />
        <mat-error *ngIf="userInput.invalid && userInput.touched">Required</mat-error>
      </mat-form-field>

      <div class="actions">
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Submit</button>
      </div>
    </form>
  `,
  styles: [`
    .w-full { width: 100%; }
    .actions { margin-top: 16px; display: flex; justify-content: flex-end; }
  `]
})
export class InputDialogComponent {
  dialogRef = inject(MatDialogRef<InputDialogComponent>);
  fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    userInput: ['', Validators.required]
  });

  get userInput(): FormControl {
    return this.form.get('userInput') as FormControl;
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.userInput.value);
    }
  }
}
