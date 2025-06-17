import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { UserDataService } from '../../core/services/user-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialogComponent } from './edit-profile-dialog.component';
import { RegistrationService } from '../../core/services/registration.service';
import { DocumentDTO } from '../../core/models/document.model';
import { DocumentService } from '../../core/services/document.service';
import { DropdownService } from '../../core/services/dropdown.service';
import { address, education, language, licenceCategory, nationality, sex } from '../../core/models/dropdown.model';
import { forkJoin, switchMap, tap } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { ExamService} from '../../core/services/exam.service';
import { AppointmentPeriod } from '../../core/models/appointment.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userData: any = null;
  
  photoUrl: string | null = null;
  searchId: string = '';
  phoneNumber: string = '';
  searchName: string =''
  searchFirstName: string = '';
  searchFatherName: string = '';
  searchGrandfatherName: string = '';
  searchResult: any = null;
  showProfileSection: boolean = false;
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

  
    documentTypeId!: number;
    file!: File | null;


  documents: DocumentDTO[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;

  documentTypeMap: Record<string, number> = {
    idCard: 4,
    birthCertificate: 6,
    medicalCertificate: 3,
    educationCertificate: 5
  };
  
  selectedFiles: Record<string, File> = {};

  displayedColumns: string[] = ['examType', 'appointmentDate', 'startDate', 'endDate', 'period', 'result'];

  // appointmentPeriod!: AppointmentPeriod;
  appointmentPeriod: AppointmentPeriod [] = []

  constructor(
    private userDataService: UserDataService,
    private dropdown:DropdownService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private reg: RegistrationService,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private translate: TranslateService,
    private examService: ExamService
  ) { }

  ngOnInit(): void {
     this.route.paramMap.subscribe((params) => {
      const nationalId = String(params.get('id'));
      // console.log('Pet ID from Params:', petId);

      if (!nationalId || nationalId == null) {
        console.warn('Invalid National ID:', nationalId);
        return;
      }

      this.showProfile(nationalId);
    });
    
    // this.userDataService.getUserData().subscribe(data => {
    //   this.userData = data;
    //   this.loadLookups();
    //   this.loadLookupswithParam();
    //   console.log('Profile loaded user data:', this.userData);
    // });

    // this.searchId = this.route.snapshot.paramMap.get('nationalId') || '';

    // if (!this.searchId) {
    //   this.errorMessage = 'National ID is missing from the URL.';
    //   return;
    // }

    this.fetchDocuments();
  }
clickhandle():void{
  this.goToProfileSection();
  this.fetchDocuments();
}


  // Helper method to check if URL is an image
  isImageURL(url: string): boolean {
    if (!url) return false;
    return url.match(/\.(jpeg|jpg|gif|png)$/i) !== null || url.startsWith('data:image/');
  }
  
  // Helper method to check if URL is a PDF
  isPdfURL(url: string): boolean {
    if (!url) return false;
    return url.match(/\.pdf$/i) !== null || url.startsWith('data:application/pdf');
  }


  // Edit a specific section of the profile
  editSection(section: string): void {
    console.log(`Editing section: ${section}`);
    
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '800px',
      data: {
        userData: this.userData,
        section: section
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        this.reg.getRegistrationById(this.searchId).subscribe({
          next: updatedData => {
            this.userData = updatedData;
            this.setPhotoUrl(updatedData.photo);
            this.fetchDocuments();
            
            this.languageService.getTranslation('profile.updateSuccess').subscribe(translatedText => {
              this.snackBar.open(translatedText, this.translate.instant('common.close'), {
                duration: 3000
              });
            });
          },
          error: (err) => {
            console.error('Error reloading profile:', err);
            this.languageService.getTranslation('profile.updateError').subscribe(translatedText => {
              this.snackBar.open(translatedText, this.translate.instant('common.close'), {
                duration: 3000
              });
            });
          }
        });
      }
    });
  }

  showProfile(nationalId: any): void {
    this.showProfileSection = false;
    this.userData = null;
    this.searchResult = null;

    if (!nationalId || nationalId <= 0) {
      this.languageService.getTranslation('profile.searchError').subscribe(translatedText => {
        this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
      });
      return;
    }

      this.reg.getRegistrationById(nationalId).subscribe({
        next: (data) => {
          this.userData = data;
          this.setPhotoUrl(data.photo);
          this.showProfileSection = true;
          this.loadExamSchedule();
        }
      },
    );
  }

  searchProfile(): void {
    this.showProfileSection = false;
    this.userData = null;
    this.searchResult = null;
  //   this.searchName = [this.searchFirstName, this.searchFatherName, this.searchGrandfatherName]
  // .map(s => s.trim()).filter(s => s.length > 0).join(' ');  
    // if (!this.searchId && !this.searchName) {
    if (!this.searchId && !this.phoneNumber) {
      this.languageService.getTranslation('profile.searchError').subscribe(translatedText => {
        this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
      });
      return;
    }
    if (this.searchId) {
      this.reg.getRegistrationById(this.searchId).subscribe({
        next: (data) => {
          this.searchResult = data;
          this.userData = data;
           this.setPhotoUrl(data.photo);
        },
        error: (error) => {
          const msg = 'Applicant Not Found'
          this.showToast(msg, 'Close', 5000, 'error' );
        }
      },
    );
    } 
    
    // if (this.searchName) {
    //   this.reg.getRegistrationByName(this.searchName).subscribe(data => {
    //     if (data) {
    //       this.searchResult = data;
    //       this.userData = data;
    //        this.setPhotoUrl(data.photo);
    //     } else {
    //       this.languageService.getTranslation('profile.noProfileFoundId').subscribe(translatedText => {
    //         this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
    //       });
    //     }
    //   });
    // }
    if (this.phoneNumber) {
      this.reg.getRegistrationByPhone(this.phoneNumber).subscribe({
        next: (data) => {
          this.searchResult = data;
          this.userData = data;
           this.setPhotoUrl(data.photo);
        },
        error: (error) => {
          const msg = 'Applicant Not Found'
          this.showToast(msg, 'Close', 5000, 'error' );
        } 
      });
    }
    // else {
    //   // For demo: fallback to localStorage and match by names
    //   const storedData = localStorage.getItem('user_registration_data');
    //   if (storedData) {
    //     const userData = JSON.parse(storedData);
    //     if (
    //       (!this.searchFirstName || userData.firstName?.toLowerCase() === this.searchFirstName.toLowerCase()) &&
    //       (!this.searchFatherName || userData.fatherName?.toLowerCase() === this.searchFatherName.toLowerCase()) &&
    //       (!this.searchGrandfatherName || userData.grandfatherName?.toLowerCase() === this.searchGrandfatherName.toLowerCase())
    //     ) {
    //       // this.searchResults = userData; // Add single result to array
    //     } else {
    //       this.languageService.getTranslation('profile.noProfileFoundNames').subscribe(translatedText => {
    //         this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
    //       });
    //     }
    //   } else {
    //     this.languageService.getTranslation('profile.noProfileFound').subscribe(translatedText => {
    //       this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
    //     });
    //   }
    // }
  }
  
setPhotoUrl(photoBase64: string): void {
  if (!photoBase64) {
    this.photoUrl = null;
    return;
  }

  this.photoUrl = `data:image/jpeg;base64,${photoBase64}`;
  // If your backend sends PNG instead, change to image/png
}

  goToProfileSection(): void {
    if (this.searchResult) {
      this.userData = this.searchResult;
      this.showProfileSection = true;
      this.loadExamSchedule();
    }
  }

  backToSearch(): void {
    this.showProfileSection = false;
    this.userData = null;
  }


  triggerFileInput(inputId: string): void {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
  

  onFileSelected(event: Event, documentKey: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
  
    const file = input.files[0];
  
    // Check file type first
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      this.snackBar.open('Unsupported file type', 'Close', { duration: 2000 });
      return;
    }
  
    // Read file locally for preview
    const reader = new FileReader();
    reader.onload = () => {
      if (!this.userData.documentPreviews) {
        this.userData.documentPreviews = {};
      }
      this.userData.documentPreviews[documentKey] = reader.result;
  
      // Optionally persist locally, e.g. cache or save UI state
      this.userDataService.setUserData(this.userData);
  
      // Show preview first, then upload
      this.snackBar.open(`${documentKey} preview loaded, uploading...`, 'Close', { duration: 1500 });
  
      // Upload file to backend
      const documentTypeId = this.documentTypeMap[documentKey];
console.log(this.userData.nationalId);
      this.removeDocuments(this.userData.nationalId, documentTypeId);
      this.documentService.addDocument(this.userData.nationalId, documentTypeId, file).subscribe({
        next: () => {
          this.fetchDocuments(); // refresh documents from backend
          this.snackBar.open(`${documentKey} uploaded successfully!`, 'Close', { duration: 2000 });
        },
        error: (err) => {
          this.errorMessage = err.message || 'Upload failed';
          this.snackBar.open(`Error uploading ${documentKey}: ${this.errorMessage}`, 'Close', { duration: 3000 });
        }
      });
    };
  
    reader.readAsDataURL(file);
  }
  
  
  fetchDocuments(): void {
    this.isLoading = true;
    if (this.userData?.nationalId) {
      this.documentService.getDocumentById(this.userData.nationalId).subscribe({
        next: (docs) => {
          this.mapDocuments(docs);
          this.documents = docs;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to fetch documents.';
          this.isLoading = false;
        }
      });
    }
  }

  removeDocuments(searchId: string, documentTypeId: number): void {
    // event.preventDefault();
  
    // const documentTypeId = this.documentTypeMap[documentKey];

    this.isLoading = true;

    this.documentService.deleteRegistration(searchId, documentTypeId).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to delete documents.';
        this.isLoading = false;
      }
    });
  }

  mapDocuments(docs: DocumentDTO[]): void {
    if (!this.userData.documentPreviews) {
      this.userData.documentPreviews = {};
    }
  
    for (const doc of docs) {
      switch (doc.documentTypeId) {
        case 4:
          this.userData.documentPreviews.idCard = doc.fileUrl;
          break;
        case 6:
          this.userData.documentPreviews.birthCertificate = doc.fileUrl;
          break;
        case 3:
          this.userData.documentPreviews.medicalCertificate = doc.fileUrl;
          break;
        case 5:
          this.userData.documentPreviews.educationCertificate = doc.fileUrl;
          break;
        default:
          console.warn('Unknown documentTypeId:', doc.documentTypeId);
      }
    }
  
    console.log('Document previews:', this.userData.documentPreviews);
  }
  get medicalCertificateFileName(): string | null {
    const url = this.userData?.documentPreviews?.medicalCertificate;
    if (!url) return null;
    const doc = this.documents.find(d => d.fileUrl === url);
    return doc ? doc.fileName : null;
  }
  get educationCertificateFileName(): string | null {
    const url = this.userData?.documentPreviews?.educationCertificate;
    if (!url) return null;
    const doc = this.documents.find(d => d.fileUrl === url);
    return doc ? doc.fileName : null;
  }
  get birthCertificateFileName(): string | null {
    const url = this.userData?.documentPreviews?.birthCertificate;
    if (!url) return null;
    const doc = this.documents.find(d => d.fileUrl === url);
    return doc ? doc.fileName : null;
  }
  get idCardFileName(): string | null {
    const url = this.userData?.documentPreviews?.idCard;
    if (!url) return null;
    const doc = this.documents.find(d => d.fileUrl === url);
    return doc ? doc.fileName : null;
  }



  loadLookups(): void {
    this.dropdown.getNationality().subscribe(data => this.nationality = data);
    this.dropdown.getSex().subscribe(data => this.sex = data);
    this.dropdown.getEducation().subscribe(data => this.education = data);
    this.dropdown.getBloodType().subscribe(data => this.bloodType = data);
    this.dropdown.getRegion().subscribe(data => this.region = data);
    this.dropdown.getLanguage().subscribe(data => this.language = data);
    this.dropdown.getLicenceCategory().subscribe(data => this.licenceCategory = data);
  }

loadLookupswithParam(): void {
  this.dropdown.getRegion().pipe(
    tap(regionData => this.region = regionData),
    switchMap(regionData => {
      const regionId = regionData[0]?.code;
      if (!regionId) throw new Error('Region ID not found');
      return this.dropdown.getZone(regionId);
    }),
    tap(zoneData => this.town = zoneData),
    switchMap(zoneData => {
      const zoneId = zoneData[0]?.code;
      console.log('Zone ID being passed to getWoreda:', zoneId);
      if (!zoneId) throw new Error('Zone ID not found');
      return this.dropdown.getWoreda(zoneId);
    }),
    tap(woredaData => this.woreda = woredaData),
    switchMap(woredaData => {
      const woredaId = woredaData[0]?.code;
      if (!woredaId) throw new Error('Woreda ID not found');
      return this.dropdown.getKebele(woredaId);
    })
  ).subscribe({
    next: kebeleData => this.kebele = kebeleData,
    error: err => console.error('Error loading lookups', err)
  });
}
  
  getNationalityLabel(code: string): string {
     if (code == null) {
    return 'Unknown';
    }
    return this.nationality.find(n => n.code === code)?.amdescription || code;
  }
  getSexLabel(id: number): string {
     if (id == null) {
    return 'Unknown';
    }
    return this.sex.find(s => s.id === id)?.nameAmharic || id.toString();
  }
  getEducationLabel(id: number): string {
     if (id == null) {
    return 'Unknown';
    }
    return this.education.find(e => e.id === id)?.nameAmharic || id.toString();
  }
  getBloodType(code: string): string {
     if (code == null) {
    return 'Unknown';
    }
    return this.bloodType.find(b => b.code === code)?.amdescription || code;
  }
  getRegionLabel(code: string): string {
     if (code == null) {
    return 'Unknown';
    }
    return this.region.find(e => e.code === code)?.amDescription || code;
  }
  getTownLabel(code: string): string {
     if (code == null) {
    return 'Unknown';
    }
    return this.town.find(e => e.code === code)?.amDescription || code;
  }
  getWoredaLabel(code: string): string {
     if (code == null) {
    return 'Unknown';
    }
    return this.woreda.find(e => e.code === code)?.amDescription || code;
  }
  getKebeleLabel(code: string): string {
     if (code == null) {
    return 'Unknown';
    }
    return this.kebele.find(e => e.code === code)?.amDescription || code;
  }
  getLanguageLabel(id: number): string {
     if (id == null) {
    return 'Unknown';
    }
    return this.language.find(l => l.id === id)?.nameAmharic || id.toString();
  }
  getLicenceLabel(code: number | string): string {
     if (code == null) {
    return 'Unknown';
    }
  const codeNum = typeof code === 'string' ? parseInt(code, 10) : code;
  const found = this.licenceCategory.find(l => l.code === codeNum);
  return found?.displayNameAmh || codeNum.toString();
  }

  private loadExamSchedule(): void {
    if (this.userData?.nationalId) {
      this.examService.getAppointmentById(this.userData.nationalId)
        .subscribe({
          next: (res: AppointmentPeriod[]) => {
            console.log('Received appointmentPeriod:', res);
            this.appointmentPeriod= res;
          },
          error: (error) => {
            console.error('Error loading exam schedule:', error);
          }
        });
    }
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
}