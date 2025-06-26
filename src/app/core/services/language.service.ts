import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<string>('en');

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');

    const savedLang = localStorage.getItem('lang');
    
    const browserLang = translate.getBrowserLang();

    const initialLang = savedLang || (browserLang?.match(/en|am/) ? browserLang : 'en');

      this.setLanguage(initialLang);
  }

  getCurrentLang(): Observable<string> {
    return this.currentLang.asObservable();
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang.next(lang);
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }

  getTranslation(key: string, params?: any): Observable<string> {
    return this.translate.get(key, params);
  }
} 