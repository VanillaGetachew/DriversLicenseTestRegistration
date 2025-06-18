import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule, TranslateModule],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="language-button">
      <mat-icon>language</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="changeLanguage('en')">
        {{ 'profile.language.english' | translate }}
      </button>
      <button mat-menu-item (click)="changeLanguage('am')">
        {{ 'profile.language.amharic' | translate }}
      </button>
    </mat-menu>
  `,
  styles: [`
    .language-button {
      display: flex;
      color:white;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  currentLang$: any;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.currentLang$ = this.languageService.getCurrentLang();
  }

  changeLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
  }
}