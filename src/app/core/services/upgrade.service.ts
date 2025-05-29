import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class UpgradeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // getDriver(grade:string, licence: string): Observable<Driver[]> {
  //   return this.http.get<Driver[]>(`${this.apiUrl}/driver/LicenseNo?licenseNo=${licence}&licenseCategory=${grade}`);
  // }

  getDriver(grade: string, licence: string): Observable<Driver[]> {
  const params = new HttpParams()
    .set('licenseNo', licence)
    .set('licenseCategory', grade);

  return this.http.get<Driver[]>(`${this.apiUrl}/driver/LicenseNo`, { params });
}
  
  // getRegistrations(
  //   page = 0, 
  //   pageSize = 10, 
  //   sortField = 'createdAt', 
  //   sortDirection = 'desc',
  //   searchTerm = ''
  // ): Observable<{ items: Registration[], totalCount: number }> {
  //   let params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('pageSize', pageSize.toString())
  //     .set('sortField', sortField)
  //     .set('sortDirection', sortDirection);
    
  //   if (searchTerm) {
  //     params = params.set('searchTerm', searchTerm);
  //   }
    
  //   return this.http.get<{ items: Registration[], totalCount: number }>(
  //     this.apiUrl,
  //     { params }
  //   );
  // }

  // getRegistrationById(id: number): Observable<Registration> {
  //   return this.http.get<Registration>(`${this.apiUrl}/${id}`);
  // }

  // createRegistration(registration: RegistrationRequest): Observable<Registration> {
  //   return this.http.post<Registration>(`${this.apiUrl}/create`, registration);
  // }

  // updateRegistration(id: number, registration: RegistrationRequest): Observable<Registration> {
  //   return this.http.put<Registration>(`${this.apiUrl}/${id}`, registration);
  // }

  // deleteRegistration(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // }
}
