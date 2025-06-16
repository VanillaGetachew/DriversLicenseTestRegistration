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
import { forkJoin } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';

// Define an interface for exam appointments
interface ExamAppointment {
  date: Date;
  time: string;
  examType: string;
  location: string;
}

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
  examAppointment: ExamAppointment | null = null;
  searchId: string = '';
  searchFirstName: string = '';
  searchFatherName: string = '';
  searchGrandfatherName: string = '';
  searchResult: any = null; // Holds the result after search
  showProfileSection: boolean = false; // Controls when to show the full profile section
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
    private translate: TranslateService // Inject TranslateService
  ) { }

  ngOnInit(): void {
    // Subscribe to user data changes
    this.userDataService.getUserData().subscribe(data => {
      this.userData = data;
      this.loadLookups();
      console.log('Profile loaded user data:', this.userData);
      
      // Example: Load a mock appointment
      if (this.userData && !this.examAppointment) {
        // Simulating appointment data retrieval
        // In a real application, this would come from a service
        this.loadMockAppointment();
      }
    });

    this.searchId = this.route.snapshot.paramMap.get('nationalId') || '';

    if (!this.searchId) {
      this.errorMessage = 'National ID is missing from the URL.';
      return;
    }

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

  // Load a mock appointment for demo purposes
  loadMockAppointment(): void {
    // 50% chance of having an appointment for demo
    if (!this.userData) return;
    if (Math.random() > 0.5) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 14) + 1);
      
      this.examAppointment = {
        date: futureDate,
        time: '10:00 AM',
        examType: this.userData.englishExam ? 'Theory Exam (English)' : 'Theory Exam (Amharic)',
        location: 'Main Testing Center, Addis Ababa'
      };
    }
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
console.log(this.userData);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        try {
          // Update the user data with the edited values
          this.userData = { ...this.userData, ...result };
          
          // Save the updated data
          this.languageService.getTranslation('profile.updateSuccess').subscribe(translatedText => {
            this.snackBar.open(translatedText, this.translate.instant('common.close'), {
              duration: 3000
            });
          });
        } catch (error) {
          console.error('Error updating profile:', error);
          this.languageService.getTranslation('profile.updateError').subscribe(translatedText => {
            this.snackBar.open(translatedText, this.translate.instant('common.close'), {
              duration: 3000
            });
          });
        }
      }
    });
  }

  // Schedule a new exam appointment
  scheduleExam(): void {
    console.log('Scheduling exam');
    // In a real application, this would open a scheduling dialog or navigate to a scheduling page
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    
    this.examAppointment = {
      date: futureDate,
      time: '10:00 AM',
      examType: this.userData.englishExam ? 'Theory Exam (English)' : 'Theory Exam (Amharic)',
      location: 'Main Testing Center, Addis Ababa'
    };
    
    this.languageService.getTranslation('profile.examScheduled').subscribe(translatedText => {
      this.snackBar.open(translatedText, this.translate.instant('common.close'), {
        duration: 3000
      });
    });
  }

  // Reschedule an existing exam appointment
  rescheduleExam(): void {
    console.log('Rescheduling exam');
    // In a real application, this would open a rescheduling dialog
    
    if (this.examAppointment) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 14);
      
      this.examAppointment.date = futureDate;
      this.examAppointment.time = '2:00 PM';
      
      this.languageService.getTranslation('profile.examRescheduled').subscribe(translatedText => {
        this.snackBar.open(translatedText, this.translate.instant('common.close'), {
          duration: 3000
        });
      });
    } else {
      this.scheduleExam();
    }
  }

  // Cancel an existing exam appointment
  cancelExam(): void {
    console.log('Canceling exam');
    // In a real application, this would show a confirmation dialog before canceling
    
    this.examAppointment = null;
    
    this.languageService.getTranslation('profile.examCanceled').subscribe(translatedText => {
      this.snackBar.open(translatedText, this.translate.instant('common.close'), {
        duration: 3000
      });
    });
  }

  searchProfile(): void {
    this.showProfileSection = false;
    this.userData = null;
    this.searchResult = null;
    if (!this.searchId && !this.searchFirstName && !this.searchFatherName && !this.searchGrandfatherName) {
      this.languageService.getTranslation('profile.searchError').subscribe(translatedText => {
        this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
      });
      return;
    }
    if (this.searchId) {
      this.reg.getRegistrationById(this.searchId).subscribe(data => {
        if (data) {
          this.searchResult = data;
          this.userData = data;
           this.setPhotoUrl(data.photo);
        } else {
          this.languageService.getTranslation('profile.noProfileFoundId').subscribe(translatedText => {
            this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
          });
        }
      });
    } else {
      // For demo: fallback to localStorage and match by names
      const storedData = localStorage.getItem('user_registration_data');
      if (storedData) {
        const userData = JSON.parse(storedData);
        if (
          (!this.searchFirstName || userData.firstName?.toLowerCase() === this.searchFirstName.toLowerCase()) &&
          (!this.searchFatherName || userData.fatherName?.toLowerCase() === this.searchFatherName.toLowerCase()) &&
          (!this.searchGrandfatherName || userData.grandfatherName?.toLowerCase() === this.searchGrandfatherName.toLowerCase())
        ) {
          this.searchResult = userData;
        } else {
          this.languageService.getTranslation('profile.noProfileFoundNames').subscribe(translatedText => {
            this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
          });
        }
      } else {
        this.languageService.getTranslation('profile.noProfileFound').subscribe(translatedText => {
          this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
        });
      }
    }
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
    this.userData = this.searchResult;
    this.showProfileSection = true;
    this.loadMockAppointment();
  }

  backToSearch(): void {
    this.showProfileSection = false;
    this.userData = null;
    this.examAppointment = null;
    // Optionally, keep search fields and last search result, or clear them as needed
  }

  // --- File Upload Logic for Documents ---

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

      this.removeDocuments(this.searchId.toString(), documentTypeId);
      this.documentService.addDocument(this.searchId.toString(), documentTypeId, file).subscribe({
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
    this.documentService.getDocumentById(this.searchId).subscribe({
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
      this.userData.documentPreviews = {}; // ← This line is crucial
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

  // uploadDocument(): void {
  //   const formData = new FormData();
  //   formData.append('file', file);

  
  //   this.documentService.addDocument(this.searchId, this.documentTypeId, formData).subscribe({
  //     next: () => this.fetchDocuments(), // Refresh list
  //     error: err => this.errorMessage = err.message
  //   });
  // }

  // uploadDocument(): void {
  //   if (!this.file) {
  //     this.errorMessage = 'No file selected.';
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('file', this.file);

  //   this.documentService.addDocument(this.searchId, this.documentTypeId, formData).subscribe({
  //     next: () => this.fetchDocuments(),
  //     error: err => this.errorMessage = err.message || 'File upload failed'
  //   });
  // }



  loadLookups(): void {
    this.dropdown.getNationality().subscribe(data => this.nationality = data);
    this.dropdown.getSex().subscribe(data => this.sex = data);
    this.dropdown.getEducation().subscribe(data => this.education = data);
    this.dropdown.getBloodType().subscribe(data => this.bloodType = data);
    this.dropdown.getRegion().subscribe(data => this.region = data);
    // this.dropdown.getKebele().subscribe(data => this.kebele = data);
    // this.dropdown.getWoreda().subscribe(data => this.woreda = data);
    // this.dropdown.getZone().subscribe(data => this.town = data);
    this.dropdown.getLanguage().subscribe(data => this.language = data);
    this.dropdown.getLicenceCategory().subscribe(data => this.licenceCategory = data);
  }

  // loadLookups(): void {
  //   const regionId = 1; // Replace with the actual ID you need
  //   const zoneId = 1;
  //   const woredaId = 1;
  
  //   forkJoin({
  //     nationality: this.dropdown.getNationality(),
  //     sex: this.dropdown.getSex(),
  //     education: this.dropdown.getEducation(),
  //     bloodType: this.dropdown.getBloodType(),
  //     region: this.dropdown.getRegion(),
  //     // kebele: this.dropdown.getKebele(woredaId),
  //     // woreda: this.dropdown.getWoreda(zoneId),
  //     // town: this.dropdown.getZone(regionId),
  //     language: this.dropdown.getLanguage(),
  //     licenceCategory: this.dropdown.getLicenceCategory()
  //   }).subscribe(result => {
  //     this.nationality = result.nationality;
  //     this.sex = result.sex;
  //     this.education = result.education;
  //     this.bloodType = result.bloodType;
  //     this.region = result.region;
  //     // this.kebele = result.kebele;
  //     // this.woreda = result.woreda;
  //     // this.town = result.town;
  //     this.language = result.language;
  //     this.licenceCategory = result.licenceCategory;
  //   });
  // }
  
  getNationalityLabel(code: string): string {
    return this.nationality.find(n => n.code === code)?.amdescription || code;
  }
  getSexLabel(id: number): string {
    return this.sex.find(s => s.id === id)?.nameAmharic || id.toString();
  }
  getEducationLabel(id: number): string {
    return this.education.find(e => e.id === id)?.nameAmharic || id.toString();
  }
  getBloodType(code: string): string {
    return this.bloodType.find(b => b.code === code)?.amdescription || code;
  }
  getRegionLabel(code: string): string {
    return this.region.find(e => e.code === code)?.amDescription || code;
  }
  getLanguageLabel(id: number): string {
    return this.language.find(l => l.id === id)?.nameAmharic || id.toString();
  }
  getLicenceLabel(code: number): string {
    return this.licenceCategory.find(l => l.code === code)?.displayNameAmh || code.toString();
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