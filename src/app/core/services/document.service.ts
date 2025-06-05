import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registration, RegistrationRequest } from '../models/registration.model';
import { environment } from '../../../environments/environment';
import { DocumentDTO } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/Document`;

  constructor(private http: HttpClient) { }

  getDocumentById(id: string): Observable<DocumentDTO[]> {
    return this.http.get<DocumentDTO[]>(`${this.apiUrl}/NationalId`, {
      params: { nationalId: id.toString() }
    });
  }

  createRegistration(registration: Registration): Observable<Registration> {
    return this.http.post<Registration>(`${this.apiUrl}/create`, registration);
  }

  updateRegistration(id: number, registration: RegistrationRequest): Observable<Registration> {
    return this.http.put<Registration>(`${this.apiUrl}/${id}`, registration);
  }

  deleteRegistration(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
