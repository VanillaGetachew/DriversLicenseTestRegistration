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
import { amharicValidator } from '../../../core/Validator/amharicValidator';
import { minAgeValidator } from '../../../core/Validator/minAgeValidator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { englishValidator } from '../../../core/Validator/englishValidator';
import { noFutureDateValidator } from '../../../core/Validator/futureDateValidator';

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
    // AmharicOnlyDirective,
    // EnglishOnlyDirective,
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

  selectedPhotoFile: File | null = null;
  idCardFile: File | null = null;
  birthCertificateFile: File | null = null;
  medicalCertificateFile: File | null = null;
  educationCertificateFile: File | null = null;

  constructor(private fb: FormBuilder,
    private dropdown: DropdownService,
    private reg: RegistrationService,
    private languageService: LanguageService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private router: Router) {
    this.registrationForm = this.fb.group({
      // Personal Information

      firstNameAmh: ['', [Validators.required, amharicValidator]],
      fatherNameAmh: ['', [Validators.required, amharicValidator]],
      grandNameAmh: ['', [Validators.required, amharicValidator]],
      firstName: ['', [Validators.required, englishValidator]],
      fatherName: ['', [Validators.required, englishValidator]],
      grandName: ['', [Validators.required, englishValidator]],
      sex: ['', Validators.required],
      birthDate: ['', [Validators.required, minAgeValidator(18), noFutureDateValidator]],
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

  // onPhotoSelected(event: Event): void {
  //   const fileInput = event.target as HTMLInputElement;
  //   if (fileInput.files && fileInput.files.length > 0) {
  //     const file = fileInput.files[0];

  //     if (!['image/jpeg', 'image/png'].includes(file.type)) {
  //       this.showToast('registration.photoUpload.invalidType', 'common.close', 3000, 'error');
  //       return;
  //     }

  //     if (file.size > 5 * 1024 * 1024) {
  //       this.showToast('registration.photoUpload.sizeLimit', 'common.close', 3000, 'error');
  //       return;
  //     }

  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const base64 = (reader.result as string).split(',')[1];
  //       this.imagePreview = reader.result;
  //       this.registrationForm.patchValue({ photoBase64: base64 });
  //       this.registrationForm.get('photoBase64')?.updateValueAndValidity();
        
  //       this.showToast('registration.photoUpload.success', 'common.close', 2000, 'success');
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

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

    this.selectedPhotoFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      // Optional: still keep base64 in form if needed
      const base64 = (reader.result as string).split(',')[1];
      this.registrationForm.patchValue({ photoBase64: base64 });
      this.registrationForm.get('photoBase64')?.updateValueAndValidity();
    };
    reader.readAsDataURL(file);

    this.showToast('registration.photoUpload.success', 'common.close', 2000, 'success');
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

  // onSubmit(): void {
  //   this.isSubmitted = true;
    
  //   if (this.registrationForm.valid) {
  //     const formData = {
  //     ...this.registrationForm.value,
  //       documents: {
  //         idCard: this.documentPreviews.idCard,
  //         birthCertificate: this.documentPreviews.birthCertificate,
  //         medicalCertificate: this.documentPreviews.medicalCertificate,
  //         educationCertificate: this.documentPreviews.educationCertificate
  //       },
  //     photo: this.registrationForm.get('photoBase64')?.value
  //     };

  //     this.reg.createRegistration(formData).subscribe({
  //       next: (res) => {
  //         this.showToast('registration.success', 'common.close', 3000, 'success');
  //         this.router.navigate(['/profile', res?.nationalId || formData.nationalId]);
  //       },
  //       error: (error) => {
  //         const msg = error.error?.message || 'Unexpected error occurred';
  //         this.showToast(msg, 'Close', 5000, 'error' );
  //       }
  //     });
  //   } else {
  //     Object.keys(this.registrationForm.controls).forEach(field => {
  //       const control = this.registrationForm.get(field);
  //       control?.markAsTouched({ onlySelf: true });
  //     });
      
  //     this.showToast('registration.validationError', 'common.close', 3000, 'error');
  //   }
  // }


onSubmit(): void {
  if (this.registrationForm.invalid) {
    this.isSubmitted = true;
    return;
  }

  const form = this.registrationForm.value;
  const formData = new FormData();

  // Append applicant info
  formData.append('FirstNameAmh', form.firstNameAmh);
  formData.append('FatherNameAmh', form.fatherNameAmh);
  formData.append('GrandNameAmh', form.grandNameAmh);
  formData.append('FirstName', form.firstName);
  formData.append('FatherName', form.fatherName);
  formData.append('GrandName', form.grandName);
  formData.append('Sex', form.sex);
  formData.append('BirthDate', form.birthDate.toISOString());
  formData.append('BirthPlace', form.birthPlace);
  formData.append('BloodType', form.bloodType);
  formData.append('Region', form.region);
  formData.append('Town', form.town);
  formData.append('Woreda', form.woreda);
  formData.append('Kebele', form.kebele);
  formData.append('HouseNo', form.houseNo);
  formData.append('Nationality', form.nationality);
  formData.append('Tel1', form.tel1);
  formData.append('IsTheoryExamEnglish', form.isTheoryExamEnglish);
  formData.append('LicenceGrade', form.licenceGrade);
  formData.append('Education', form.education);
  formData.append('NationalId', form.nationalId);

  // Photo
  if (this.selectedPhotoFile) {
    formData.append('Photo', this.selectedPhotoFile);
  }

  // Documents
  if (this.idCardFile) {
  formData.append('DocumentTypeId1', '4');
  formData.append('file1', this.idCardFile);
  }
  if (this.birthCertificateFile) {
  formData.append('DocumentTypeId2', '6');
  formData.append('file2', this.birthCertificateFile);
  }
  if (this.medicalCertificateFile) {
  formData.append('DocumentTypeId3', '3');
  formData.append('file3', this.medicalCertificateFile);
  }
  if (this.educationCertificateFile) {
  formData.append('DocumentTypeId4', '5');
  formData.append('file4', this.educationCertificateFile);
  }
  this.reg.addApplicant(formData).subscribe({
    next: (res: any) => {
      // console.log('Successfully submitted!', res);
      this.showToast('registration.success', 'common.close', 3000, 'success');
      this.router.navigate(['/profile', res?.nationalId || formData.get('NationalId')]);
    },
    error: (error) => {
      // console.error('Submission error:', err);
      const msg = error.error?.message || 'Unexpected error occurred';
      this.showToast(msg, 'Close', 5000, 'error' );
    },
  });
}

 //   if (this.registrationForm.valid) {
  //     const formData = {
  //     ...this.registrationForm.value,
  //       documents: {
  //         idCard: this.documentPreviews.idCard,
  //         birthCertificate: this.documentPreviews.birthCertificate,
  //         medicalCertificate: this.documentPreviews.medicalCertificate,
  //         educationCertificate: this.documentPreviews.educationCertificate
  //       },
  //     photo: this.registrationForm.get('photoBase64')?.value
  //     };

  //     this.reg.createRegistration(formData).subscribe({
  //       next: (res) => {
  //         this.showToast('registration.success', 'common.close', 3000, 'success');
  //         this.router.navigate(['/profile', res?.nationalId || formData.nationalId]);
  //       },
  //       error: (error) => {
  //         const msg = error.error?.message || 'Unexpected error occurred';
  //         this.showToast(msg, 'Close', 5000, 'error' );
  //       }
  //     });
  //   } else {
  //     Object.keys(this.registrationForm.controls).forEach(field => {
  //       const control = this.registrationForm.get(field);
  //       control?.markAsTouched({ onlySelf: true });
  //     });
      
  //     this.showToast('registration.validationError', 'common.close', 3000, 'error');
  //   }



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
  if (!input) return;

  let value = input.value.replace(/\D/g, '').substring(0, 10);

  // Only update the form control, let Angular bind it back to the input
  this.registrationForm.get('tel1')?.setValue(value, { emitEvent: false });
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

  
  // onFileSelected(event: Event, documentType: string) {
  //   const file = (event.target as HTMLInputElement).files?.[0];
  //   if (file) {
  //     if (this.isValidFileType(file)) {
  //       if (this.isValidFileSize(file)) {
  //         this.handleFileUpload(file, documentType);
  //         this.snackBar.open(
  //           this.translate.instant('profile.documents.uploadSuccess'),
  //           'Close',
  //           { 
  //             duration: 3000,
  //             panelClass: ['success-snackbar'],
  //             horizontalPosition: 'end',
  //             verticalPosition: 'top'
  //           }
  //         );
  //       } else {
  //         this.snackBar.open(
  //           this.translate.instant('profile.documents.fileTooLarge'),
  //           'Close',
  //           { 
  //             duration: 3000,
  //             panelClass: ['error-snackbar'],
  //             horizontalPosition: 'end',
  //             verticalPosition: 'top'
  //           }
  //         );
  //       }
  //     } else {
  //       this.snackBar.open(
  //         this.translate.instant('profile.documents.invalidFileType'),
  //         'Close',
  //         { 
  //           duration: 3000,
  //           panelClass: ['error-snackbar'],
  //           horizontalPosition: 'end',
  //           verticalPosition: 'top'
  //         }
  //       );
  //     }
  //   }
  // }

  // private isValidFileType(file: File): boolean {
  //   const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  //   return validTypes.includes(file.type);
  // }

  // private isValidFileSize(file: File): boolean {
  //   const maxSize = 5 * 1024 * 1024; // 5MB
  //   return file.size <= maxSize;
  // }

  // private handleFileUpload(file: File, documentType: string) {
  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {
  //     const base64 = e.target.result;
  //     this.documentPreviews = {
  //       ...this.documentPreviews,
  //       [documentType]: base64
  //     };
      
  //     // Update the form control
  //     const controlName = `${documentType}Base64`;
  //     if (this.registrationForm.get(controlName)) {
  //       this.registrationForm.get(controlName)?.setValue(base64);
  //     }
  //     };
  //     reader.readAsDataURL(file);
  // }



  onFileSelected(event: Event, documentType: string): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    if (this.isValidFileType(file)) {
      if (this.isValidFileSize(file)) {
        this.setDocumentFile(file, documentType); // Store in class variable
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

private handleFileUpload(file: File, documentType: string): void {
  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result as string;

    // Update document previews
    this.documentPreviews = {
      ...this.documentPreviews,
      [documentType]: base64
    };

    // Update form control if it exists
    const controlName = documentType;
    if (this.registrationForm.get(controlName)) {
      this.registrationForm.get(controlName)?.setValue(base64);
      this.registrationForm.get(controlName)?.updateValueAndValidity();
    }
  };
  reader.readAsDataURL(file);
}

private setDocumentFile(file: File, type: string): void {
  switch (type) {
    case 'idCard':
      this.idCardFile = file;
      break;
    case 'birthCertificate':
      this.birthCertificateFile = file;
      break;
    case 'medicalCertificate':
      this.medicalCertificateFile = file;
      break;
    case 'educationCertificate':
      this.educationCertificateFile = file;
      break;
  }
}
// get medicalCertificateFileNamer(): string | null {
//     const url = this.userData?.documentPreviews?.medicalCertificate;
//     if (!url) return null;
//     const doc = this.documents.find(d => d.fileUrl === url);
//     return doc ? doc.fileName : null;
//   }
//   get educationCertificateFileNamer(): string | null {
//     const url = this.userData?.documentPreviews?.educationCertificate;
//     if (!url) return null;
//     const doc = this.documents.find(d => d.fileUrl === url);
//     return doc ? doc.fileName : null;
//   }
//   get birthCertificateFileNamer(): string | null {
//     const url = this.userData?.documentPreviews?.birthCertificate;
//     if (!url) return null;
//     const doc = this.documents.find(d => d.fileUrl === url);
//     return doc ? doc.fileName : null;
//   }
//   get idCardFileNamer(): string | null {
//     const url = this.userData?.documentPreviews?.idCard;
//     if (!url) return null;
//     const doc = this.documents.find(d => d.fileUrl === url);
//     return doc ? doc.fileName : null;
//   }
// private getFileNameFromPreview(key: keyof typeof this.userData.documentPreviews): string | null {
//   const url = this.userData?.documentPreviews?.[key];
//   if (!url) return null;
//   const filename = url.split('/').pop();
//   const doc = this.documents.find(d => d.fileName === filename);
//   return doc ? doc.fileName : null;
// }

// get medicalCertificateFileName(): string | null {
//   return this.getFileNameFromPreview('medicalCertificate');
// }

// get educationCertificateFileName(): string | null {
//   return this.getFileNameFromPreview('educationCertificate');
// }

// get birthCertificateFileName(): string | null {
//   return this.getFileNameFromPreview('birthCertificate');
// }

// get idCardFileName(): string | null {
//   return this.getFileNameFromPreview('idCard');
// }
get medicalCertificateFileNamer(): string | null {
  return this.medicalCertificateFile ? this.medicalCertificateFile.name : null;
}

get educationCertificateFileNamer(): string | null {
  return this.educationCertificateFile ? this.educationCertificateFile.name : null;
}

get birthCertificateFileNamer(): string | null {
  return this.birthCertificateFile ? this.birthCertificateFile.name : null;
}

get idCardFileNamer(): string | null {
  return this.idCardFile ? this.idCardFile.name : null;
}
get firstNameAmh() {
  return this.registrationForm.get('firstNameAmh');
}
get fatherNameAmh() {
  return this.registrationForm.get('fatherNameAmh');
}
get grandNameAmh() {
  return this.registrationForm.get('grandNameAmh');
}
get firstName() {
  return this.registrationForm.get('firstName');
}
get fatherName() {
  return this.registrationForm.get('fatherName');
}
get grandName() {
  return this.registrationForm.get('grandName');
}
get sexes() {
  return this.registrationForm.get('sex');
}
get birthDate() {
  return this.registrationForm.get('birthDate');
}
get birthPlace() {
  return this.registrationForm.get('birthPlace');
}
get bloodTypes() {
  return this.registrationForm.get('bloodType');
}
get nationalities() {
  return this.registrationForm.get('nationality');
}
get educations() {
  return this.registrationForm.get('education');
}
get tel() {
  return this.registrationForm.get('tel1');
}
get regions() {
  return this.registrationForm.get('region');
}
get towns() {
  return this.registrationForm.get('town');
}
get woredas() {
  return this.registrationForm.get('woreda');
}
get kebeles() {
  return this.registrationForm.get('kebele');
}
get houseNumbers() {
  return this.registrationForm.get('houseNo');
}
get licenceGrades() {
  return this.registrationForm.get('licenceGrade');
}
get nationalId() {
  return this.registrationForm.get('nationalId');
}
get languages() {
  return this.registrationForm.get('isTheoryEnglish');
}
}