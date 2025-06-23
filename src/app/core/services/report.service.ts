import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportFilter, RegistrationSummary, LicenseTypeSummary } from '../models/report.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) { }

  getRegistrationSummary(filter?: ReportFilter): Observable<RegistrationSummary> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.startDate) {
        params = params.set('startDate', filter.startDate.toISOString());
      }
      if (filter.endDate) {
        params = params.set('endDate', filter.endDate.toISOString());
      }
      if (filter.licenseType) {
        params = params.set('licenseType', filter.licenseType);
      }
      if (filter.status) {
        params = params.set('status', filter.status);
      }
    }
    
    return this.http.get<RegistrationSummary>(
      `${this.apiUrl}/registration-summary`,
      { params }
    );
  }

  getLicenseTypeSummary(filter?: ReportFilter): Observable<LicenseTypeSummary[]> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.startDate) {
        params = params.set('startDate', filter.startDate.toISOString());
      }
      if (filter.endDate) {
        params = params.set('endDate', filter.endDate.toISOString());
      }
      if (filter.status) {
        params = params.set('status', filter.status);
      }
    }
    
    return this.http.get<LicenseTypeSummary[]>(
      `${this.apiUrl}/license-type-summary`,
      { params }
    );
  }

  getMonthlyRegistrations(year: number): Observable<any[]> {
    const params = new HttpParams().set('year', year.toString());
    
    return this.http.get<any[]>(
      `${this.apiUrl}/monthly-registrations`,
      { params }
    );
  }
}
