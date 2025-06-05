import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Edit Profile Information</h2>
    <mat-dialog-content>
      <form [formGroup]="editForm" class="edit-form">
        <div class="form-grid">
          <!-- Personal Info -->
          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>First Name (Amharic)</mat-label>
            <input matInput formControlName="firstNameAmharic">
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>Father's Name (Amharic)</mat-label>
            <input matInput formControlName="fatherNameAmharic">
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>Grandfather's Name (Amharic)</mat-label>
            <input matInput formControlName="grandfatherNameAmharic">
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" required>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>Father's Name</mat-label>
            <input matInput formControlName="fatherName" required>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>Grandfather's Name</mat-label>
            <input matInput formControlName="grandfatherName" required>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>Sex</mat-label>
            <mat-select formControlName="sex">
              <mat-option value="Male">Male</mat-option>
              <mat-option value="Female">Female</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>Birth Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="birthDate">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>Birth Place</mat-label>
            <input matInput formControlName="birthPlace">
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>Blood Type</mat-label>
            <mat-select formControlName="bloodType">
              <mat-option value="A+">A+</mat-option>
              <mat-option value="A-">A-</mat-option>
              <mat-option value="B+">B+</mat-option>
              <mat-option value="B-">B-</mat-option>
              <mat-option value="AB+">AB+</mat-option>
              <mat-option value="AB-">AB-</mat-option>
              <mat-option value="O+">O+</mat-option>
              <mat-option value="O-">O-</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>Nationality</mat-label>
            <input matInput formControlName="nationality">
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>Education</mat-label>
            <mat-select formControlName="education">
              <mat-option value="None">None</mat-option>
              <mat-option value="Primary">Primary</mat-option>
              <mat-option value="Secondary">Secondary</mat-option>
              <mat-option value="Diploma">Diploma</mat-option>
              <mat-option value="Degree">Degree</mat-option>
              <mat-option value="Masters">Masters</mat-option>
              <mat-option value="PhD">PhD</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Contact Info -->
          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'contact'">
            <mat-label>Phone Number</mat-label>
            <input matInput formControlName="phoneNumber">
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'contact'">
            <mat-label>Region</mat-label>
            <input matInput formControlName="region">
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'contact'">
            <mat-label>Town</mat-label>
            <input matInput formControlName="town">
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'contact'">
            <mat-label>Woreda</mat-label>
            <input matInput formControlName="woreda">
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'contact'">
            <mat-label>Kebele</mat-label>
            <input matInput formControlName="kebele">
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'contact'">
            <mat-label>House No.</mat-label>
            <input matInput formControlName="houseNo">
          </mat-form-field>

          <!-- License Info -->
          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'license'">
            <mat-label>License Grade</mat-label>
            <mat-select formControlName="licenseGrade">
              <mat-option value="A">A</mat-option>
              <mat-option value="B">B</mat-option>
              <mat-option value="C">C</mat-option>
              <mat-option value="D">D</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'license'">
            <mat-label>Exam Language</mat-label>
            <mat-select formControlName="englishExam">
              <mat-option [value]="true">English</mat-option>
              <mat-option [value]="false">Amharic</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!editForm.valid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .edit-form {
      padding: 16px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
    }
    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }
  `]
})
export class EditProfileDialogComponent implements OnInit {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userData: any, section: string }
  ) {
    this.editForm = this.fb.group({
      // Personal Info
      firstNameAmharic: [''],
      fatherNameAmharic: [''],
      grandfatherNameAmharic: [''],
      firstName: ['', Validators.required],
      fatherName: ['', Validators.required],
      grandfatherName: ['', Validators.required],
      sex: [''],
      birthDate: [null],
      birthPlace: [''],
      bloodType: [''],
      nationality: [''],
      education: [''],
      
      // Contact Info
      phoneNumber: [''],
      region: [''],
      town: [''],
      woreda: [''],
      kebele: [''],
      houseNo: [''],
      
      // License Info
      licenseGrade: [''],
      englishExam: [false]
    });
  }

  ngOnInit(): void {
    if (this.data.userData) {
      this.editForm.patchValue(this.data.userData);
    }
  }

  onSave(): void {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 