import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownService } from '../../../core/services/dropdown.service';
import { address, education, language, licenceCategory, nationality, sex } from '../../../core/models/dropdown.model';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RegistrationService } from '../../../core/services/registration.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

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
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    TranslateModule,
    MatSnackBarModule
  ]
})
export class RegistrationFormComponent implements OnInit {
  registrationForm: FormGroup;
  // photoFile: File | null = null;
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

  constructor(private fb: FormBuilder,
    private dropdown: DropdownService,
    private reg: RegistrationService,
    private languageService: LanguageService,
    private snackBar: MatSnackBar,
    private translate: TranslateService) {
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
        forkJoin({
          message: this.languageService.getTranslation('registration.photoUpload.invalidType'),
          close: this.languageService.getTranslation('common.close')
        }).subscribe(({ message, close }) => {
          this.snackBar.open(message, close, {
            duration: 3000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        });
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        forkJoin({
          message: this.languageService.getTranslation('registration.photoUpload.sizeLimit'),
          close: this.languageService.getTranslation('common.close')
        }).subscribe(({ message, close }) => {
          this.snackBar.open(message, close, {
            duration: 3000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        this.imagePreview = reader.result;
        this.registrationForm.patchValue({photo: base64});
        this.registrationForm.get('photo')?.updateValueAndValidity();
        
        forkJoin({
          message: this.languageService.getTranslation('registration.photoUpload.success'),
          close: this.languageService.getTranslation('common.close')
        }).subscribe(({ message, close }) => {
          this.snackBar.open(message, close, {
            duration: 3000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        });
      };
      reader.readAsDataURL(file);
    }
  }

  resetForm(): void {
    this.registrationForm.reset();
    this.imagePreview = null;
    forkJoin({
      message: this.languageService.getTranslation('registration.formReset'),
      close: this.languageService.getTranslation('common.close')
    }).subscribe(({ message, close }) => {
      this.snackBar.open(message, close, {
        duration: 3000,
        panelClass: ['info-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formData = {
        ...this.registrationForm.value
      };
      this.reg.createRegistration(formData).subscribe({
        next: (res) => {
          forkJoin({
            message: this.languageService.getTranslation('registration.success'),
            close: this.languageService.getTranslation('common.close')
          }).subscribe(({ message, close }) => {
            this.snackBar.open(message, close, {
              duration: 5000,
              panelClass: ['success-snackbar'],
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          });
          this.resetForm();
        },
        error: (error) => {
          forkJoin({
            message: this.languageService.getTranslation('registration.error'),
            close: this.languageService.getTranslation('common.close')
          }).subscribe(({ message, close }) => {
            this.snackBar.open(message, close, {
              duration: 5000,
              panelClass: ['error-snackbar'],
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          });
          console.error('Registration error:', error);
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registrationForm.controls).forEach(field => {
        const control = this.registrationForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      
      forkJoin({
        message: this.languageService.getTranslation('registration.validationError'),
        close: this.languageService.getTranslation('common.close')
      }).subscribe(({ message, close }) => {
        this.snackBar.open(message, close, {
          duration: 5000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      });
    }
  }

  removePhoto(): void {
    this.imagePreview = null;
    this.registrationForm.get('photo')?.setValue(null);
    forkJoin({
      message: this.languageService.getTranslation('registration.photoUpload.removed'),
      close: this.languageService.getTranslation('common.close')
    }).subscribe(({ message, close }) => {
      this.snackBar.open(message, close, {
        duration: 3000,
        panelClass: ['info-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    });
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
