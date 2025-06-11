import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { address, education, language, licenceCategory, nationality, sex } from '../models/dropdown.model';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  url: string = environment.apiUrl;
  // list: Form[]=[];
  // formData: Form = new Form();
  constructor(private http: HttpClient){}

  getNationality(): Observable<nationality[]> {
    return this.http.get<nationality[]>(`${this.url}/Addresses/Nationality`);
  }
  getRegion(): Observable<address[]> {
    return this.http.get<address[]>(`${this.url}/Addresses/Region`);
  }
  getZone(id: number): Observable<address[]> {
    return this.http.get<address[]>(`${this.url}/Addresses/Zone`, {
    params: { regionCode: id.toString() }
  });
  }
  getWoreda(id: number): Observable<address[]> {
    return this.http.get<address[]>(`${this.url}/Addresses/Woreda`, {
    params: { zoneCode: id.toString() }
  });
  }
  getKebele(id: number): Observable<address[]> {
    return this.http.get<address[]>(`${this.url}/Addresses/Kebele`, {
    params: { woredaCode: id.toString() }
  });
  }

  getBloodType(): Observable<nationality[]> {
    return this.http.get<nationality[]>(`${this.url}/BloodType/BloodType`);
  }
  
  getSex(): Observable<sex[]> {
    return this.http.get<sex[]>(`${this.url}/Enum/Sex`);
  }
  getEducation(): Observable<education[]> {
    return this.http.get<education[]>(`${this.url}/Enum/Education`);
  }
  getLanguage(): Observable<language[]> {
    return this.http.get<language[]>(`${this.url}/Enum/Language`);
  }

  getLicenceCategory(): Observable<licenceCategory[]> {
    return this.http.get<licenceCategory[]>(`${this.url}/Licence`);
  }


        refreshList(){
            this.http.get(this.url).subscribe({
              next: res =>{
                console.log(res)
              },
              error: err =>{
                console.log(err)
              }
            })
        }
  postDefendant(){
    // return this.http.post(this.url, this.formData);
  }
}
