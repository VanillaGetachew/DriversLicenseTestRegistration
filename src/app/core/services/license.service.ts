import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { License, LicenseUpgradeRequest } from '../models/license.model';
import { environment } from '../../../environments/environment';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {
  private apiUrl = `${environment.apiUrl}/licenses`;

  constructor(private http: HttpClient) { }

  getLicenses(page = 0, pageSize = 10): Observable<{ items: License[], totalCount: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<{ items: License[], totalCount: number }>(
      this.apiUrl,
      { params }
    );
  }

  getLicenseById(id: number): Observable<License> {
    // For testing purposes, check if there's any stored license data in localStorage
    const storedLicenseData = localStorage.getItem('user_license_data');
    
    if (storedLicenseData) {
      try {
        const licenseData = JSON.parse(storedLicenseData);
        return of(licenseData).pipe(delay(500)); // Simulate network delay
      } catch (error) {
        console.error('Error parsing stored license data', error);
      }
    }
    
    // If no stored license data or error parsing, proceed with API call
    return this.http.get<License>(`${this.apiUrl}/${id}`);
  }

  getLicenseByUserId(userId: number): Observable<License[]> {
    return this.http.get<License[]>(`${this.apiUrl}/user/${userId}`);
  }

  requestLicenseUpgrade(request: LicenseUpgradeRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/upgrade-request`, request);
  }

  getLicenseTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/types`);
  }
  
  searchLicenses(searchParams: {
    licenseGrade?: string;
    licenseNumber?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
  }): Observable<License[]> {
    // For testing purposes, check if there's any stored license data in localStorage
    const storedLicenseData = localStorage.getItem('user_license_data');
    const storedUserData = localStorage.getItem('user_registration_data');
    
    if (storedLicenseData && storedUserData) {
      try {
        const licenseData = JSON.parse(storedLicenseData);
        const userData = JSON.parse(storedUserData);
        
        // Check if search params match our test user data
        const matches = this.matchesSearchCriteria(licenseData, userData, searchParams);
        
        if (matches) {
          return of([licenseData]).pipe(delay(800)); // Simulate network delay
        }
      } catch (error) {
        console.error('Error parsing stored data for search', error);
      }
    }
    
    // If no stored data, no match, or error parsing, proceed with API call
    let params = new HttpParams();
    
    if (searchParams.licenseGrade) {
      params = params.set('licenseGrade', searchParams.licenseGrade);
    }
    
    if (searchParams.licenseNumber) {
      params = params.set('licenseNumber', searchParams.licenseNumber);
    }
    
    if (searchParams.firstName) {
      params = params.set('firstName', searchParams.firstName);
    }
    
    if (searchParams.middleName) {
      params = params.set('middleName', searchParams.middleName);
    }
    
    if (searchParams.lastName) {
      params = params.set('lastName', searchParams.lastName);
    }
    
    return this.http.get<License[]>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Helper method to check if stored data matches search criteria
   */
  private matchesSearchCriteria(
    licenseData: any, 
    userData: any, 
    searchParams: any
  ): boolean {
    // If no search params are provided, don't match anything
    if (!Object.values(searchParams).some(value => !!value)) {
      return false;
    }
    
    // Check if license grade matches (if provided)
    if (searchParams.licenseGrade && 
        licenseData.licenseType !== searchParams.licenseGrade) {
      return false;
    }
    
    // Check if license number matches (if provided)
    if (searchParams.licenseNumber && 
        !licenseData.licenseNumber.includes(searchParams.licenseNumber)) {
      return false;
    }
    
    // Check names (if provided)
    if (searchParams.firstName && 
        !userData.firstName.toLowerCase().includes(searchParams.firstName.toLowerCase())) {
      return false;
    }
    
    if (searchParams.middleName && 
        !userData.fatherName.toLowerCase().includes(searchParams.middleName.toLowerCase())) {
      return false;
    }
    
    if (searchParams.lastName && 
        !userData.grandfatherName.toLowerCase().includes(searchParams.lastName.toLowerCase())) {
      return false;
    }
    
    // If all specified criteria match, return true
    return true;
  }
}
