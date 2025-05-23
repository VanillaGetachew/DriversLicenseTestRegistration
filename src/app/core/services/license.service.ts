import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { License, LicenseUpgradeRequest } from '../models/license.model';
import { environment } from '../../../environments/environment';

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
}
