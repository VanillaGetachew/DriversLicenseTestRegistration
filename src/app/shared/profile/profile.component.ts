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
} 