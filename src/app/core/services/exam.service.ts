import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppointmentPeriod } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = `${environment.apiUrl}/appointment/Appointment`;

  constructor(private http: HttpClient) { }

  getAppointmentById(id: number): Observable<AppointmentPeriod[]> {
    return this.http.get<AppointmentPeriod[]>(`${this.apiUrl}`, {
      params: { nationalId: id.toString() }
    });
  }
} 