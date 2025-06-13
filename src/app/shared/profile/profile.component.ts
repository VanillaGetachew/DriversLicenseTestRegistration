import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { UserDataService } from '../../core/services/user-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialogComponent } from './edit-profile-dialog/edit-profile-dialog.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { ExamService, ExamSchedule, ExamScheduleResponse } from '../../core/services/exam.service';

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
  examAppointment: ExamAppointment | null = null;
  searchId: string = '';
  searchFirstName: string = '';
  searchFatherName: string = '';
  searchGrandfatherName: string = '';
  searchResults: any[] = []; // Changed from searchResult to searchResults array
  showProfileSection: boolean = false; // Controls when to show the full profile section
  displayedColumns: string[] = ['appointmentDate', 'examType', 'startDate', 'endDate', 'period', 'result'];
  examSchedule: ExamSchedule[] = [];

  constructor(
    private userDataService: UserDataService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private languageService: LanguageService,
    private translate: TranslateService,
    private examService: ExamService
  ) { }

  ngOnInit(): void {
    // Subscribe to user data changes
    this.userDataService.getUserData().subscribe(data => {
      this.userData = data;
      console.log('Profile loaded user data:', this.userData);
      
      // Example: Load a mock appointment
      if (this.userData && !this.examAppointment) {
        // Simulating appointment data retrieval
        // In a real application, this would come from a service
        this.loadMockAppointment();
      }
    });
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
  searchProfile(): void {
    this.showProfileSection = false;
    this.userData = null;
    this.searchResults = []; // Reset search results array
    if (!this.searchId && !this.searchFirstName && !this.searchFatherName && !this.searchGrandfatherName) {
      this.languageService.getTranslation('profile.searchError').subscribe(translatedText => {
        this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
      });
      return;
    }

    // For demo: search by National ID
    if (this.searchId) {
      this.userDataService.getUserDataByNationalId(this.searchId).subscribe(data => {
        if (data) {
          this.searchResults = [data]; // Add single result to array
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
          this.searchResults = [userData]; // Add single result to array
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

  selectProfile(profile: any): void {
    this.userData = profile;
    this.showProfileSection = true;
    // Load exam schedule when profile is loaded
    this.loadExamSchedule();
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

  onFileSelected(event: Event, docType: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    // Simulate upload (replace with real upload logic)
    const reader = new FileReader();
    reader.onload = () => {
      // Save the file as a data URL (for demo)
      if (!this.userData.documentPreviews) {
        this.userData.documentPreviews = {};
      }
      this.userData.documentPreviews[docType] = reader.result;
      // Persist the change (simulate API call)
    };
    reader.readAsDataURL(file);
  }

  hasDocuments(): boolean {
    return this.userData?.documentPreviews && Object.keys(this.userData.documentPreviews).length > 0;
  }

  private loadExamSchedule(): void {
    if (this.userData?.nationalId) {
      this.examService.getExamSchedule(this.userData.nationalId)
        .subscribe({
          next: (response: ExamScheduleResponse) => {
            this.examSchedule = response.items;
          },
          error: (error) => {
            console.error('Error loading exam schedule:', error);
            // TODO: Add proper error handling/notification
          }
        });
    }
  }
}