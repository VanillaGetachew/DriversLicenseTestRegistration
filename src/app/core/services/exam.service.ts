import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppointmentPeriod } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = `${environment.apiUrl}/appointment`;

  constructor(private http: HttpClient) { }

  getAppointmentById(id: number): Observable<AppointmentPeriod[]> {
    return this.http.get<AppointmentPeriod[]>(`${this.apiUrl}/Appointment`, {
      params: { nationalId: id.toString() }
    });
  }

  getAppointmentByApplicantId(id: number): Observable<AppointmentPeriod[]> {
    return this.http.get<AppointmentPeriod[]>(`${this.apiUrl}/AppointmentwithId`, {
      params: { applicantId: id.toString() }
    });
  }
} 