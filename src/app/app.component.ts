import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'driving-license-test-registration';

  constructor(private translate: TranslateService) {
    // Get browser language or use default
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang?.match(/en|am/) ? browserLang : 'en');
  }

  ngOnInit() {
    console.log('App component initialized');
  }
}