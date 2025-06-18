import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
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
import { AmharicOnlyDirective } from '../../../core/Validator/amharicValidator';
import { minAgeValidator } from '../../../core/Validator/validator';
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
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    AmharicOnlyDirective,
    TranslateModule,
    MatSnackBarModule
  ]
})
export class RegistrationFormComponent implements OnInit {
  registrationForm: FormGroup;
  isSubmitted = false;
  isDragging = false;
  // photoFile: File | null = null;
  photoPreviewUrl: string | null = null;
  nationality:nationality[] = [];
  bloodType:nationality[] = [];
  region: address[] = [];
  town: address[] = [];
  woreda: address[] = [];
  kebele: address[] = [];
  parentCode: string | null = null;
  sex: sex[]=[];
  education: education[]=[];
  language: language[]=[];
  licenceCategory: licenceCategory[]=[];
  imagePreview: string | ArrayBuffer | null = null;
  documentPreviews: {
    idCard?: string;
    birthCertificate?: string;
    medicalCertificate?: string;
    educationCertificate?: string;
  } = {};
  idCardFileName: string = '';
  birthCertificateFileName: string = '';
  medicalCertificateFileName: string = '';
  educationCertificateFileName: string = '';

  constructor(private fb: FormBuilder,
    private dropdown: DropdownService,
    private reg: RegistrationService,
    private languageService: LanguageService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private router: Router) {
    this.registrationForm = this.fb.group({
      // Personal Information

      firstNameAmh: ['', Validators.required],
      fatherNameAmh: ['', Validators.required],
      grandNameAmh: ['', Validators.required],
      firstName: ['', Validators.required],
      fatherName: ['', Validators.required],
      grandName: ['', Validators.required],
      sex: ['', Validators.required],
      birthDate: ['', [Validators.required, minAgeValidator(18)]],
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
      // photo: ['']
      photoBase64: new FormControl('', Validators.required),
      // Documents
      idCard: new FormControl('', Validators.required),
      birthCertificate: new FormControl('', Validators.required),
      medicalCertificate: new FormControl('', Validators.required),
      educationCertificate: new FormControl('', Validators.required)
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

  private showToast(messageKey: string, actionKey: string, duration: number, type: 'success' | 'error' | 'default' = 'default'): void {
    this.languageService.getTranslation(messageKey).subscribe(message => {
      this.languageService.getTranslation(actionKey).subscribe(action => {
        const panelClass = ['custom-toast'];
        if (type === 'success') {
          panelClass.push('success-toast');
        } else if (type === 'error') {
          panelClass.push('error-toast');
        }
        
        this.snackBar.open(message, action, { 
          duration,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass
        });
      });
    });
  }

  onPhotoSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.showToast('registration.photoUpload.invalidType', 'common.close', 3000, 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.showToast('registration.photoUpload.sizeLimit', 'common.close', 3000, 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        this.imagePreview = reader.result;
        this.registrationForm.patchValue({ photoBase64: base64 });
        this.registrationForm.get('photoBase64')?.updateValueAndValidity();
        
        this.showToast('registration.photoUpload.success', 'common.close', 2000, 'success');
      };
      reader.readAsDataURL(file);
    }
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.registrationForm.reset();
    this.imagePreview = null;
    this.documentPreviews = {};
    this.idCardFileName = '';
    this.birthCertificateFileName = '';
    this.medicalCertificateFileName = '';
    this.educationCertificateFileName = '';
    this.showToast('registration.formReset', 'common.close', 2000, 'success');
  }

  onSubmit(): void {
    this.isSubmitted = true;
    
    if (this.registrationForm.valid) {
      const formData = {
      ...this.registrationForm.value,
        documents: {
          idCard: this.documentPreviews.idCard,
          birthCertificate: this.documentPreviews.birthCertificate,
          medicalCertificate: this.documentPreviews.medicalCertificate,
          educationCertificate: this.documentPreviews.educationCertificate
        },
      photo: this.registrationForm.get('photoBase64')?.value
      };

      this.reg.createRegistration(formData).subscribe({
        next: (res) => {
          this.showToast('registration.success', 'common.close', 3000, 'success');
          // this.router.navigate(['/profile']);
        },
        error: (error) => {
          const msg = error.error?.message || 'Unexpected error occurred';
          this.showToast(msg, 'Close', 5000, 'error' );
        }
      });
    } else {
      Object.keys(this.registrationForm.controls).forEach(field => {
        const control = this.registrationForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      
      this.showToast('registration.validationError', 'common.close', 3000, 'error');
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

  onRegionChange(siteCode: string): void {
    this.parentCode = siteCode;
    this.getTown(siteCode);
    this.woreda=[];
    this.kebele=[];
  }

  getTown(siteCode: string): void {
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

  onTownChange(siteCode: string): void {
    this.parentCode = siteCode;
    this.getWoreda(siteCode);
    this.kebele=[];
  }

  getWoreda(siteCode: string): void {
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

  onWoredaChange(siteCode: string): void {
    this.parentCode = siteCode;
    this.getKebele(siteCode);
  }

  getKebele(siteCode: string): void {
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
  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    
    input.value = value;
    this.registrationForm.get('phone')?.setValue(value, { emitEvent: false });
  }

  isImageURL(url: string | undefined): boolean {
    return url?.startsWith('data:image/') ?? false;
  }

  isPdfURL(url: string | undefined): boolean {
    return url?.startsWith('data:application/pdf') ?? false;
  }

  triggerFileInput(inputId: string): void {
    document.getElementById(inputId)?.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent, documentType: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileEvent = { target: { files: [file] } } as unknown as Event;
      this.onFileSelected(fileEvent, documentType);
    }
  }

  onFileSelected(event: Event, documentType: string) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (this.isValidFileType(file)) {
        if (this.isValidFileSize(file)) {
          this.handleFileUpload(file, documentType);
          this.snackBar.open(
            this.translate.instant('profile.documents.uploadSuccess'),
            'Close',
            { 
              duration: 3000,
              panelClass: ['success-snackbar'],
              horizontalPosition: 'end',
              verticalPosition: 'top'
            }
          );
        } else {
          this.snackBar.open(
            this.translate.instant('profile.documents.fileTooLarge'),
            'Close',
            { 
              duration: 3000,
              panelClass: ['error-snackbar'],
              horizontalPosition: 'end',
              verticalPosition: 'top'
            }
          );
        }
      } else {
        this.snackBar.open(
          this.translate.instant('profile.documents.invalidFileType'),
          'Close',
          { 
            duration: 3000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'end',
            verticalPosition: 'top'
          }
        );
      }
    }
  }

  private isValidFileType(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    return validTypes.includes(file.type);
  }

  private isValidFileSize(file: File): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
  }

  private handleFileUpload(file: File, documentType: string) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64 = e.target.result;
      this.documentPreviews = {
        ...this.documentPreviews,
        [documentType]: base64
      };
      
      // Update the form control
      const controlName = `${documentType}Base64`;
      if (this.registrationForm.get(controlName)) {
        this.registrationForm.get(controlName)?.setValue(base64);
      }
      };
      reader.readAsDataURL(file);
  }
}
