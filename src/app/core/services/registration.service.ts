import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registration, RegistrationRequest } from '../models/registration.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = `${environment.apiUrl}/applicant`;

  constructor(private http: HttpClient) { }

  getRegistrations(
    page = 0, 
    pageSize = 10, 
    sortField = 'createdAt', 
    sortDirection = 'desc',
    searchTerm = ''
  ): Observable<{ items: Registration[], totalCount: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sortField', sortField)
      .set('sortDirection', sortDirection);
    
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }
    
    return this.http.get<{ items: Registration[], totalCount: number }>(
      this.apiUrl,
      { params }
    );
  }

  getRegistrationById(id: string): Observable<Registration> {
    return this.http.get<Registration>(`${this.apiUrl}/NationalID`, {
      params: { nationalId: id.toString() }
    });
  }

  createRegistration(registration: Registration): Observable<Registration> {
    return this.http.post<Registration>(`${this.apiUrl}/create`, registration);
  }

  updateRegistration(id: string, data: Registration): Observable<Registration> {
    return this.http.patch<Registration>(`${this.apiUrl}/Update/NationalId`, data, {
      params: { nationalId: id }
    });
  }

  deleteRegistration(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
