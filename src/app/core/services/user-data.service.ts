import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userDataSubject = new BehaviorSubject<any>(null);
  
  constructor() {
    // Check if user data exists in localStorage on initialization
    const storedData = localStorage.getItem('user_registration_data');
    if (storedData) {
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
} 