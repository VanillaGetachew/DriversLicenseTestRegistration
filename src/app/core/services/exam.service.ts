import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ExamSchedule {
  appointmentDate: Date;
  examType: string;
  startDate: Date;
  endDate: Date;
  period: string;
  result: 'Pass' | 'Fail' | 'Pending';
}

export interface ExamScheduleResponse {
  items: ExamSchedule[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = `${environment.apiUrl}/appointment/Appointment`;

  constructor(private http: HttpClient) { }

  getExamSchedule(
    nationalId: string,
    page = 0,
    pageSize = 10,
    sortField = 'appointmentDate',
    sortDirection = 'desc'
  ): Observable<ExamScheduleResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sortField', sortField)
      .set('sortDirection', sortDirection)
      .set('nationalId', nationalId);

    return this.http.get<ExamScheduleResponse>(
      this.apiUrl,
      { params }
    );
  }

  getExamById(id: number): Observable<ExamSchedule> {
    return this.http.get<ExamSchedule>(`${this.apiUrl}/${id}`);
  }

  createExamSchedule(schedule: ExamSchedule): Observable<ExamSchedule> {
    return this.http.post<ExamSchedule>(this.apiUrl, schedule);
  }

  updateExamSchedule(id: number, schedule: ExamSchedule): Observable<ExamSchedule> {
    return this.http.put<ExamSchedule>(`${this.apiUrl}/${id}`, schedule);
  }

  deleteExamSchedule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 