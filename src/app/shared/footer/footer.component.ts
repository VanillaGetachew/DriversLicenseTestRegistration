import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  private langSubscription: Subscription = new Subscription();

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Subscribe to language changes
    this.langSubscription = this.languageService.getCurrentLang().subscribe(lang => {
      this.translate.use(lang);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
