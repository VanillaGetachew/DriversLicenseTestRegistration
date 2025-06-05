import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownService } from '../../../core/services/dropdown.service';
import { address, education, language, licenceCategory, nationality, sex } from '../../../core/models/dropdown.model';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RegistrationService } from '../../../core/services/registration.service';
import { Router } from '@angular/router';
import { UserDataService } from '../../../core/services/user-data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ]
})
export class RegistrationFormComponent implements OnInit {
  registrationForm: FormGroup;
  // photoFile: File | null = null;
  photoPreviewUrl: string | null = null;
  nationality:nationality[] = [];
  bloodType:nationality[] = [];
  region: address[] = [];
  town: address[] = [];
  woreda: address[] = [];
  kebele: address[] = [];
  parentCode: number = -1;
  sex: sex[]=[];
  education: education[]=[];
  language: language[]=[];
  licenceCategory: licenceCategory[]=[];
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private dropdown: DropdownService, private reg: RegistrationService) {
    this.registrationForm = this.fb.group({
      // Personal Information

      firstNameAmh: ['', Validators.required],
      fatherNameAmh: ['', Validators.required],
      grandNameAmh: ['', Validators.required],
      firstName: ['', Validators.required],
      fatherName: ['', Validators.required],
      grandName: ['', Validators.required],
      sex: ['', Validators.required],
      birthDate: ['', Validators.required],
      birthPlace: ['', Validators.required],
      bloodType: ['', Validators.required],
      nationality: ['', Validators.required],
      education: ['', Validators.required],
      
      // Contact & Address
      tel1: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      region: ['', Validators.required],
      town: ['', Validators.required],
      woreda: ['', Validators.required],
      kebele: ['', Validators.required],
      houseNo: [''],
      
      // License Information
      licenceGrade: ['', Validators.required],
      nationalId: ['', Validators.required],
      isTheoryExamEnglish: ['', Validators.required],
      
      // Photo
      photo: ['']
    });
  }

  ngOnInit(): void {
    this.getNationality();
    this.getRegion();
    this.getBloodType();
    this.getSex();
    this.getEducation();
    this.getLanguage();
    this.getLicenceCategory();
  }

  triggerPhotoUpload(): void {
    document.getElementById('photoUpload')?.click();
  }

  onPhotoSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Only JPG or PNG files are allowed');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }
      
      // this.photoFile = file;
      

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        this.imagePreview = reader.result;

      this.registrationForm.patchValue({photo: base64});
      this.registrationForm.get('photo')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  resetForm(): void {
    this.registrationForm.reset();
    // this.photoFile = null;
  }
  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formData = {
        ...this.registrationForm.value
        // photoFile: this.photoFile
      };
      this.reg.createRegistration(formData).subscribe({
        next:(res) => {
          alert("Success");
        }
      })
      
      console.log('Form submitted:', formData);
      // TODO: Send data to backend service
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registrationForm.controls).forEach(field => {
        const control = this.registrationForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  removePhoto(): void {
    this.imagePreview = null;
    this.registrationForm.get('photo')?.setValue(null);
  }

  getNationality(): void {
    this.dropdown.getNationality().subscribe({
      next: (res: nationality[]) => {
        this.nationality = res;
      }
    });
  }
  getRegion(): void {
    this.dropdown.getRegion().subscribe({
      next: (res: address[]) => {
        this.region = res;
      }
    });
  }

  onRegionChange(siteCode: number): void {
    this.parentCode = siteCode;
    this.getTown(siteCode);
    this.woreda=[];
    this.kebele=[];
  }

  getTown(siteCode: number): void {
    this.dropdown.getZone(siteCode).subscribe({
      next: (res: address[]) => {
        this.town = res;
      },
      error: (err) => {
        console.error('Error fetching child sites:', err);
        this.town = [];
      }
    });
  }

  onTownChange(siteCode: number): void {
    this.parentCode = siteCode;
    this.getWoreda(siteCode);
    this.kebele=[];
  }

  getWoreda(siteCode: number): void {
    this.dropdown.getWoreda(siteCode).subscribe({
      next: (res: address[]) => {
        this.woreda = res;
      },
      error: (err) => {
        console.error('Error fetching child sites:', err);
        this.woreda = [];
      }
    });
  }

  onWoredaChange(siteCode: number): void {
    this.parentCode = siteCode;
    this.getKebele(siteCode);
  }

  getKebele(siteCode: number): void {
    this.dropdown.getKebele(siteCode).subscribe({
      next: (res: address[]) => {
        this.kebele = res;
      },
      error: (err) => {
        console.error('Error fetching child sites:', err);
        this.kebele = [];
      }
    });
  }

  getBloodType(): void {
    this.dropdown.getBloodType().subscribe({
      next: (res: nationality[]) => {
        this.bloodType = res;
      }
    });
  }

  getSex(): void {
    this.dropdown.getSex().subscribe({
      next: (res: sex[]) => {
        this.sex = res;
      }
    });
  }

  getEducation(): void {
    this.dropdown.getEducation().subscribe({
      next: (res: education[]) => {
        this.education = res;
      }
    });
  }

  getLanguage(): void {
    this.dropdown.getLanguage().subscribe({
      next: (res: language[]) => {
        this.language = res;
      }
    });
  }

  getLicenceCategory(): void {
    this.dropdown.getLicenceCategory().subscribe({
      next: (res: licenceCategory[]) => {
        this.licenceCategory = res;
      }
    });
  }

}
