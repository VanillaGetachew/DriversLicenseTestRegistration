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

  // addDocument(id: string, documentId: number, document: FormData): Observable<DocumentDTO[]> {
  //   return this.http.post<DocumentDTO[]>(`${this.apiUrl}/upload`, document, {
  //     params: { nationalId: id.toString(), documentId: documentId.toString() }
  //   });
  // }
  addDocument(id: string, documentId: number, file: File): Observable<DocumentDTO[]> {
    console.log(id, documentId);
    const formData = new FormData();
    formData.append('nationalId', id);
    formData.append('documentTypeId', documentId.toString());
    formData.append('file', file);
    
  
    return this.http.post<DocumentDTO[]>(`${this.apiUrl}/upload`, formData);
  }

  deleteRegistration(id: string, documentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Documents`, {
      params: { nationalId: id.toString(), documentTypeId: documentId.toString() }
    });
  }
}
