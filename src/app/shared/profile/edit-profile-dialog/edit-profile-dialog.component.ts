import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, MatDialogModule, TranslateModule],
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss']
})
export class EditProfileDialogComponent implements OnInit {
  editForm: FormGroup;
  photoPreview: string | null = null;
  selectedPhoto: File | null = null;

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
      if (this.data.userData.photoUrl) {
        this.photoPreview = this.data.userData.photoUrl;
      }
    }
  }

  triggerPhotoUpload(): void {
    document.getElementById('photoUpload')?.click();
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedPhoto = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.photoPreview = null;
    this.selectedPhoto = null;
  }

  onSave(): void {
    if (this.editForm.valid) {
      const formData = this.editForm.value;
      if (this.selectedPhoto) {
        formData.photo = this.selectedPhoto;
      }
      if (this.photoPreview === null) {
        formData.removePhoto = true;
      }
      this.dialogRef.close(formData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 