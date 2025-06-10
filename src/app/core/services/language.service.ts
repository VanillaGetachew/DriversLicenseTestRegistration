import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<string>('en');

  constructor(private translate: TranslateService) {
    // Set default language
    translate.setDefaultLang('en');
    
    // Get browser language or use default
    const browserLang = translate.getBrowserLang();
    const initialLang = browserLang?.match(/en|am/) ? browserLang : 'en';
    
    // Set initial language
    this.setLanguage(initialLang);

    // Load translations
    this.loadTranslations();
  }

  private loadTranslations(): void {
    const lang = this.currentLang.value;
    this.translate.getTranslation(lang).subscribe(
      () => console.log(`Loaded translations for ${lang}`),
      error => console.error(`Error loading translations for ${lang}:`, error)
    );
  }

  getCurrentLang(): Observable<string> {
    return this.currentLang.asObservable();
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang.next(lang);
    document.documentElement.lang = lang;
    this.loadTranslations();
  }

  getTranslation(key: string): Observable<string> {
    return this.translate.get(key);
  }
} 