import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { UserDataService } from '../../core/services/user-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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
    ReactiveFormsModule
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
  searchResult: any = null; // Holds the result after search
  showProfileSection: boolean = false; // Controls when to show the full profile section

  constructor(
    private userDataService: UserDataService,
    private snackBar: MatSnackBar,
    private router: Router
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
    
    // In a real application, this would open a dialog or navigate to an edit form
    switch (section) {
      case 'personal':
        this.router.navigate(['/registration'], { 
          queryParams: { edit: true, section: 'personal' } 
        });
        break;
      case 'contact':
        this.router.navigate(['/registration'], { 
          queryParams: { edit: true, section: 'contact' } 
        });
        break;
      case 'license':
        this.router.navigate(['/registration'], { 
          queryParams: { edit: true, section: 'license' } 
        });
        break;
      case 'documents':
        this.router.navigate(['/registration'], { 
          queryParams: { edit: true, section: 'documents' } 
        });
        break;
      default:
        this.snackBar.open('Edit functionality not available yet', 'Close', {
          duration: 3000
        });
    }
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
    
    this.snackBar.open('Exam scheduled successfully!', 'Close', {
      duration: 3000
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
      
      this.snackBar.open('Exam rescheduled successfully!', 'Close', {
        duration: 3000
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
    
    this.snackBar.open('Exam canceled successfully', 'Close', {
      duration: 3000
    });
  }

  searchProfile(): void {
    this.showProfileSection = false;
    this.userData = null;
    this.searchResult = null;
    if (!this.searchId && !this.searchFirstName && !this.searchFatherName && !this.searchGrandfatherName) {
      this.snackBar.open('Please enter at least one search field.', 'Close', { duration: 3000 });
      return;
    }
    // For demo: only search by National ID (extend as needed)
    if (this.searchId) {
      this.userDataService.getUserDataByNationalId(this.searchId).subscribe(data => {
        if (data) {
          this.searchResult = data;
        } else {
          this.snackBar.open('No profile found for this National ID.', 'Close', { duration: 3000 });
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
          this.snackBar.open('No profile found for the provided names.', 'Close', { duration: 3000 });
        }
      } else {
        this.snackBar.open('No profile found.', 'Close', { duration: 3000 });
      }
    }
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
}