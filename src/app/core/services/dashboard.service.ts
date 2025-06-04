import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gend, Gend1, Site } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

   url: string = environment.apiUrl + '/Dashboard';
  // list: Form[]=[];
  // formData: Form = new Form();
  constructor(private http: HttpClient){}
  
  getGenderSummary(id: number): Observable<Gend[]> {
    return this.http.get<Gend[]>(`${this.url}/GenderSummary`, {
      params: { schoolId: id.toString() }
    });
  }
  getApplicantCount(id: number): Observable<Gend[]> {
    return this.http.get<Gend[]>(`${this.url}/ApplicantCount`, {
      params: { schoolId: id.toString() }
    });
  }
  getUpcomingExam(id: number): Observable<Gend[]> {
    return this.http.get<Gend[]>(`${this.url}/UpcomingExam`, {
      params: { schoolId: id.toString() }
    });
  }
  getPassPercentage(id: number): Observable<Gend1> {
    return this.http.get<Gend1>(`${this.url}/PassPercentage`, {
      params: { schoolId: id.toString() }
    });
  }
  getVehicleAmount(id: number): Observable<Gend[]> {
    return this.http.get<Gend[]>(`${this.url}/CarAmount`, {
      params: { schoolId: id.toString() }
    });
  }
  getPassfailSummary(id: number): Observable<Gend[]> {
    return this.http.get<Gend[]>(`${this.url}/PassFail`, {
      params: { schoolId: id.toString() }
    });
  }

  getLicenceGradeSummary(id: number): Observable<Gend[]> {
    return this.http.get<Gend[]>(`${this.url}/LicenceGradeSummary`, {
      params: { schoolId: id.toString() }
    });
  }

  getSites(id: number): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.url}/Sites`, {
    params: { parentCode: id.toString() }
  });
  }
  getSites2(id: number): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.url}/Sites`, {
    params: { parentCode: id.toString() }
  });
  }
  getSchool(): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.url}/School`);
  }
}
