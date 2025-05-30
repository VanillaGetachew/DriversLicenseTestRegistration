import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userDataSubject = new BehaviorSubject<any>(null);
  
  // Add a test user profile on service initialization if none exists
  constructor() {
    const storedData = localStorage.getItem('user_registration_data');
    if (!storedData) {
      this.createTestUser();
    } else {
      this.userDataSubject.next(JSON.parse(storedData));
    }
  }

  /**
   * Sets the user registration data
   */
  setUserData(data: any): void {
    // Store in the service
    this.userDataSubject.next(data);
    
    // Also persist to localStorage for page refreshes
    localStorage.setItem('user_registration_data', JSON.stringify(data));
  }

  /**
   * Gets the current user data as an Observable
   */
  getUserData(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  /**
   * Gets the current user data as a direct value
   */
  getUserDataValue(): any {
    return this.userDataSubject.value;
  }

  /**
   * Clears the user data (for logout)
   */
  clearUserData(): void {
    this.userDataSubject.next(null);
    localStorage.removeItem('user_registration_data');
  }
  
  /**
   * Creates a test user with license data for testing
   */
  createTestUser(): void {
    const testUserData = {
      // Personal Information
      firstNameAmharic: 'ሃይሌ',
      fatherNameAmharic: 'ገብረ',
      grandfatherNameAmharic: 'ስላሴ',
      firstName: 'Haile',
      fatherName: 'Gebre',
      grandfatherName: 'Selassie',
      sex: 'Male',
      birthDate: '1990-05-15',
      birthPlace: 'Addis Ababa',
      bloodType: 'O+',
      nationality: 'ethiopian',
      education: 'tertiary',
      
      // Contact & Address
      phoneNumber: '0912345678',
      region: 'addisAbaba',
      town: 'Bole',
      woreda: '03',
      kebele: '07',
      houseNo: '123',
      
      // License Information
      licenseGrade: 'B',
      nationalId: 'ETH1234567890',
      englishExam: true,
      
      // Photo URL (placeholder)
      photoUrl: null,
      
      // Document previews (placeholders)
      documentPreviews: {
        idCard: null,
        birthCertificate: null,
        medicalCertificate: null,
        educationCertificate: null
      }
    };
    
    this.setUserData(testUserData);
    
    console.log('Test user created:', testUserData);
  }

  /**
   * Gets user data by national ID (mock implementation: checks localStorage for matching ID)
   */
  getUserDataByNationalId(nationalId: string): Observable<any> {
    // Try to get user data from localStorage
    const storedData = localStorage.getItem('user_registration_data');
    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData.nationalId && userData.nationalId === nationalId) {
        return new BehaviorSubject(userData).asObservable();
      }
    }
    // Not found
    return new BehaviorSubject(null).asObservable();
  }
}