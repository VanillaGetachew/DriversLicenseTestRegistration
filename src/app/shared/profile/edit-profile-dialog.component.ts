import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.module';
import { DropdownService } from '../../core/services/dropdown.service';
import { address, education, language, licenceCategory, nationality, sex } from '../../core/models/dropdown.model';
import { forkJoin } from 'rxjs';
import { RegistrationService } from '../../core/services/registration.service';
import { Router } from '@angular/router';
import { AmharicOnlyDirective, amharicValidator } from '../../core/Validator/amharicValidator';
import { minAgeValidator } from '../../core/Validator/minAgeValidator';
import { TranslateModule } from '@ngx-translate/core';
import { EnglishOnlyDirective, englishValidator } from '../../core/Validator/englishValidator';
import { noFutureDateValidator } from '../../core/Validator/futureDateValidator';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, MatDialogModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{'profile.title' | translate}}</h2>
    <mat-dialog-content>
      <form [formGroup]="editForm" class="edit-form">
        <!-- Photo Upload Section -->

        <div class="photo-section" *ngIf="data.section === 'all' || data.section === 'personal'">
          <div class="photo-preview">
            <img *ngIf="photoPreview" [src]="photoPreview" alt="Profile photo">
            <div *ngIf="!photoPreview" class="no-photo">
              <mat-icon>account_circle</mat-icon>
            </div>
          </div>
          <div class="photo-actions">
            <input type="file" accept="image/*" (change)="onPhotoSelected($event)" id="photoUpload" hidden>
            <button mat-stroked-button color="primary" (click)="triggerPhotoUpload()">
              <mat-icon>photo_camera</mat-icon>
              {{ (imagePreview ? 'profile.photo.change': 'profile.photo.upload') | translate }}
            </button>
            <button *ngIf="photoPreview" mat-stroked-button color="warn" (click)="removePhoto()">
              <mat-icon>delete</mat-icon>
              {{'common.remove' | translate}}
            </button>
          </div>
          <input type="hidden" formControlName="photoBase64">
        </div>

        <div class="form-grid">
          <!-- Personal Info -->
          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>ስም</mat-label>
            <input matInput formControlName="firstNameAmh" type="text">
            <mat-error *ngIf="editForm.get('firstNameAmh')?.hasError('amharicOnly')">
              {{ 'common.amharicOnly' | translate }}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>የአባት ስም</mat-label>
            <input matInput formControlName="fatherNameAmh" type="text">
            <mat-error *ngIf="editForm.get('fatherNameAmh')?.hasError('amharicOnly')">
              {{ 'common.amharicOnly' | translate }}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>የአያት ስም</mat-label>
            <input matInput formControlName="grandNameAmh" type="text">
            <mat-error *ngIf="editForm.get('grandNameAmh')?.hasError('amharicOnly')">
              {{ 'common.amharicOnly' | translate }}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" required type="text">
            <mat-error *ngIf="editForm.get('firstName')?.hasError('englishOnly')">
              {{ 'common.englishOnly' | translate }}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>Father's Name</mat-label>
            <input matInput formControlName="fatherName" required type="text">
            <mat-error *ngIf="editForm.get('fatherName')?.hasError('englishOnly')">
              {{ 'common.englishOnly' | translate }}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>Grandfather's Name</mat-label>
            <input matInput formControlName="grandName" required type="text">
            <mat-error *ngIf="editForm.get('grandName')?.hasError('englishOnly')">
              {{ 'common.englishOnly' | translate }}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>{{ 'profile.personal.sex' | translate }}</mat-label>
            <mat-select formControlName="sex">
              <mat-option *ngFor="let st of sex" [value]="st.id">{{st.nameAmharic}}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>{{ 'profile.personal.birthDate' | translate }}</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="birthDate">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="birthDate?.hasError('minAge') && !birthDate?.hasError('required')">
              {{'common.age' | translate}}
            </mat-error>

            <mat-error *ngIf="editForm.get('birthDate')?.hasError('futureDate')">
              {{'common.future' | translate}}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>{{ 'profile.personal.birthPlace' | translate }}</mat-label>
            <input matInput formControlName="birthPlace">
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>{{ 'profile.personal.bloodType' | translate }}</mat-label>
            <mat-select formControlName="bloodType">
              <mat-option *ngFor="let st of bloodType" [value]="st.code">{{st.amdescription}}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
              <mat-label>{{ 'profile.personal.nationality' | translate }}</mat-label>
              <mat-select formControlName="nationality">
                <mat-option *ngFor="let st of nationality" [value]="st.code">{{st.amdescription}}</mat-option>
              </mat-select>
            </mat-form-field>


          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>{{ 'profile.personal.education' | translate }}</mat-label>
            <mat-select formControlName="education">
              <mat-option *ngFor="let st of education" [value]="st.id">{{st.nameAmharic}}</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Contact Info -->
          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'contact'">
            <mat-label>{{ 'profile.contact.phoneNumber' | translate }}</mat-label>
            <input matInput type="text" formControlName="tel1" (input)="onPhoneInput($event)" maxlength="10" required/>
            <mat-error *ngIf="editForm.get('tel1')?.hasError('pattern')">
              {{'common.phoneDigit' | translate}}
            </mat-error>
          </mat-form-field>
            

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>{{ 'profile.contact.region' | translate }}</mat-label>
            <mat-select (selectionChange)="onRegionChange($event.value)" formControlName="region">
              <mat-option *ngFor="let st of region" [value]="st.code">{{st.amDescription}}</mat-option>
            </mat-select>
          </mat-form-field>
     

        
          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>{{ 'profile.contact.town' | translate }}</mat-label>
            <mat-select  (selectionChange)="onTownChange($event.value)" formControlName="town">
              <mat-option *ngFor="let st of town" [value]="st.code">{{st.amDescription}}</mat-option>
            </mat-select>
          </mat-form-field>
        
          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>{{ 'profile.contact.woreda' | translate }}</mat-label>
            <mat-select [disabled]="!woreda.length" (selectionChange)="onWoredaChange($event.value)" formControlName="woreda">
              <mat-option *ngFor="let st of woreda" [value]="st.code">{{st.amDescription}}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>{{ 'profile.contact.kebele' | translate }}</mat-label>
            <mat-select [disabled]="!kebele.length" formControlName="kebele">
              <mat-option *ngFor="let st of kebele" [value]="st.code">{{st.amDescription}}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'contact'">
            <mat-label>{{ 'profile.contact.houseNo' | translate }}</mat-label>
            <input matInput formControlName="houseNo">
          </mat-form-field>

          <!-- License Info -->
          <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
            <mat-label>{{ 'profile.license.grade' | translate }}</mat-label>
            <mat-select formControlName="licenceGrade">
              <mat-option *ngFor="let st of licenceCategory" [value]="st.code.toString()">{{st.displayNameAmh}}</mat-option>
            </mat-select>
          </mat-form-field>

            <mat-form-field appearance="outline" *ngIf="data.section === 'all' || data.section === 'personal'">
              <mat-label>{{ 'profile.license.examLanguage' | translate }}</mat-label>
              <mat-select formControlName="isTheoryExamEnglish">
                <mat-option *ngFor="let st of language" [value]="st.id">{{st.nameAmharic}}</mat-option>
              </mat-select>
            </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{'common.cancel' | translate}}</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!editForm.valid">{{'common.save' | translate}}</button>
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
    .photo-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 24px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .photo-preview {
      width: 150px;
      height: 180px;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 16px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .photo-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .no-photo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: #f0f0f0;
    }
    .no-photo mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #bdbdbd;
    }
    .photo-actions {
      display: flex;
      gap: 8px;
    }
  `]
})
export class EditProfileDialogComponent implements OnInit {
  editForm: FormGroup;
  photoPreview: string | null = null;
  selectedPhoto: File | null = null;
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
  constructor(
    private fb: FormBuilder,
    private dropdown: DropdownService,
    private reg: RegistrationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userData: any, section: string, searchNationalIds: string, searchApplicantIds: string}
  ) {
    this.editForm = this.fb.group({
      // Personal Info
      firstNameAmh: ['', amharicValidator],
      fatherNameAmh: ['', amharicValidator],
      grandNameAmh: ['', amharicValidator],
      firstName: ['', englishValidator],
      fatherName: ['', englishValidator],
      grandName: ['', englishValidator],
      sex: [''],
      birthDate: ['', [minAgeValidator(18), noFutureDateValidator]],
      birthPlace: [''],
      bloodType: [''],
      nationality: [''],
      education: [''],
      
      // Contact Info
      tel1: ['', Validators.pattern(/^[0-9]{10}$/)],
      region: [''],
      town: [''],
      woreda: [''],
      kebele: [''],
      houseNo: [''],
      photoBase64: new FormControl(''),
      
      // License Info
      licenceGrade: [''],
      isTheoryExamEnglish: [''],
      nationalId: ['']
    });
    
  }

  ngOnInit(): void {
this.loadDropdowns();
this.loadDropdownsAndPatch();
  }

  loadDropdowns(): void {
    forkJoin({
      nationality: this.dropdown.getNationality(),
      bloodType: this.dropdown.getBloodType(),
      sex: this.dropdown.getSex(),
      education: this.dropdown.getEducation(),
      language: this.dropdown.getLanguage(),
      licenceCategory: this.dropdown.getLicenceCategory(),
      region: this.dropdown.getRegion()
    }).subscribe(result => {
      this.nationality = result.nationality;
      this.bloodType = result.bloodType;
      this.sex = result.sex;
      this.education = result.education;
      this.language = result.language;
      this.licenceCategory = result.licenceCategory;
      this.region = result.region;
  
      const patchedData = {
        ...this.data.userData,
        nationality: this.data.userData.nationality ? this.data.userData.nationality.toString() : '',
        bloodType: this.data.userData.bloodType ? this.data.userData.bloodType.toString() : ''
      };
      this.editForm.patchValue(patchedData);
  
        if (this.data.userData.photo) {
         this.photoPreview = `data:image/jpeg;base64,${this.data.userData.photo}`;
        }
        this.cdr.detectChanges();
      }
    );
  }

  loadDropdownsAndPatch(): void {
    this.dropdown.getRegion().subscribe(regions => {
      this.region = regions;
  
      if (this.data.userData?.region) {
        this.editForm.patchValue({ region: this.data.userData.region });

        this.dropdown.getZone(this.data.userData.region).subscribe(towns => {
          this.town = towns;
  
          if (this.data.userData?.town) {
            this.editForm.patchValue({ town: this.data.userData.town });

            this.dropdown.getWoreda(this.data.userData.town).subscribe(woredas => {
              this.woreda = woredas;
  
              if (this.data.userData?.woreda) {
                this.editForm.patchValue({ woreda: this.data.userData.woreda });

                this.dropdown.getKebele(this.data.userData.woreda).subscribe(kebeles => {
                  this.kebele = kebeles;
  
                  if (this.data.userData?.kebele) {
                    this.editForm.patchValue({ kebele: this.data.userData.kebele });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
  triggerPhotoUpload(): void {
    document.getElementById('photoUpload')?.click();
  }


onPhotoSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Only JPG or PNG files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit');
      return;
    }

    this.selectedPhoto = file;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      this.photoPreview = reader.result as string; // ✅ Set for display
      this.editForm.patchValue({ photoBase64: base64 });
      this.editForm.get('photoBase64')?.updateValueAndValidity();

      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }
}


  removePhoto(): void {
    this.photoPreview = null;
    this.selectedPhoto = null;
    this.editForm.patchValue({ photoBase64: '' });
  }
  
  private getIdentifiers() {
  return {
    nationalId: this.editForm.value.nationalId || this.data.userData?.nationalId || this.data.searchNationalIds,
    applicantId: this.data.searchApplicantIds
  };
}
onSave(): void {
  if (this.editForm.valid) {

    const formData = {
      ...this.editForm.value,
      photo: this.editForm.get('photoBase64')?.value
    };

delete formData.photoBase64; // ✅ Prevent backend confusion
// const nationalIds = formData.nationalId || this.data.userData.nationalId || this.data.searchNationalIds;
// const applicantIds = this.data.searchApplicantIds

// if(nationalIds){
//     this.reg.updateRegistration(nationalIds, formData).subscribe({
//       next: (res) => {
//         this.dialogRef.close(formData);
//         // this.router.navigate(['/profile', nationalIds]);
//       },
//       error: (err) => {
//         console.error('Error updating registration:', err);
//         alert("Update failed");
//       }
//     });
//   }
//   else
//     this.reg.updateRegistrationbyApplicantId(applicantIds, formData).subscribe({
//       next: (res) => {
//         this.dialogRef.close(formData);
//       },
//       error:(err) =>{
//         console.error('Error updating registration:', err);
//         alert("Update failed");
//       }
//     });
const { nationalId, applicantId } = this.getIdentifiers();

const update$ = nationalId 
  ? this.reg.updateRegistration(nationalId, formData)
  : this.reg.updateRegistrationbyApplicantId(applicantId, formData);

update$.subscribe({
  next: () => this.dialogRef.close(formData),
  error: (err) => {
    console.error('Error updating registration:', err);
    alert("Update failed");
  }
});

  } else {
    Object.keys(this.editForm.controls).forEach(field => {
      const control = this.editForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}


  onCancel(): void {
    this.dialogRef.close();
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
  this.editForm.get('tel1')?.setValue(value, { emitEvent: false });
}
get birthDate() {
  return this.editForm.get('birthDate');
}
} 