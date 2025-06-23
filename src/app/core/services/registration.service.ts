import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Registration, GetRegistration, ApplicantwithFourDTO, ApplicantwithDocDTO} from '../models/registration.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = `${environment.apiUrl}/applicant`;

  constructor(private http: HttpClient) { }

  getRegistrations(page = 0, pageSize = 10, sortField = 'createdAt', sortDirection = 'desc', searchTerm = ''): Observable<{ items: Registration[], totalCount: number }> {
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
    getApplicantsByName(
    name: string,
    sortBy: string,
    sortOrder: string,
    pageNumber: number,
    pageSize: number
  ): Observable<GetRegistration[]> {
    const params = new HttpParams()
      .set('name', name)
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<GetRegistration[]>(`${this.apiUrl}/Names`, { params });
  }

  getRegistrationById(id: string): Observable<GetRegistration> {
    return this.http.get<GetRegistration>(`${this.apiUrl}/NationalID`, {
      params: { nationalId: id.toString() }
    });
  }
  getRegistrationByName(name: string): Observable<GetRegistration> {
    return this.http.get<GetRegistration>(`${this.apiUrl}/Name`, {
      params: { name: name }
    });
  }
  getRegistrationByPhone(phone: string): Observable<GetRegistration> {
    return this.http.get<GetRegistration>(`${this.apiUrl}/Phone`, {
      params: { phone: phone }
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

  // addApplicant(applicant: ApplicantwithFourDTO): Observable<ApplicantwithDocDTO> {
  //   const formData = new FormData();
    
  //   Object.entries(applicant).forEach(([key, value]) => {
  //     if (value instanceof File) {
  //       formData.append(key, value, value.name);
  //     } else {
  //       formData.append(key, value.toString());
  //     }
  //   });

  //   return this.http.post<ApplicantwithDocDTO>(this.apiUrl, formData).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // private handleError(error: HttpErrorResponse) {
  //   console.error('Submission error:', error);
  //   return throwError(() => error.error?.message || 'Server error');
  // }

  addApplicant(formData: FormData) {
    return this.http.post(`${this.apiUrl}/CreatewithDoc`, formData);
  }
}
