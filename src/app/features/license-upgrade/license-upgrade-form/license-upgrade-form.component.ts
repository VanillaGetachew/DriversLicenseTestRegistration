import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { LicenseService } from '../../../core/services/license.service';
import { License, LicenseUpgradeRequest } from '../../../core/models/license.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-license-upgrade-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, TranslateModule],
  templateUrl: './license-upgrade-form.component.html',
  styleUrls: ['./license-upgrade-form.component.scss']
})
export class LicenseUpgradeFormComponent implements OnInit {
  upgradeForm!: FormGroup;
  license: License | null = null;
  licenseTypes: string[] = [];
  isLoading = false;
  isSubmitting = false;
  licenseId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private licenseService: LicenseService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.upgradeForm = this.fb.group({
      newLicenseType: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.licenseId = +params['id'];
        this.loadLicenseData();
        this.loadLicenseTypes();
      } else {
        this.languageService.getTranslation('licenseUpgrade.noLicenseId').subscribe(translatedText => {
          this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
        });
        this.router.navigate(['/license-upgrade']);
      }
    });
  }

  loadLicenseData(): void {
    this.isLoading = true;
    this.licenseService.getLicenseById(this.licenseId).subscribe({
      next: (license) => {
        this.license = license;
        this.isLoading = false;
      },
      error: (error) => {
        this.languageService.getTranslation('licenseUpgrade.errorLoadingLicense').subscribe(translatedText => {
          this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
        });
        this.isLoading = false;
        this.router.navigate(['/license-upgrade']);
        console.error('License load error:', error);
      }
    });
  }

  loadLicenseTypes(): void {
    this.licenseService.getLicenseTypes().subscribe({
      next: (types) => {
        this.licenseTypes = types;
      },
      error: (error) => {
        console.error('Error loading license types:', error);
        this.languageService.getTranslation('licenseUpgrade.errorLoadingLicenseTypes').subscribe(translatedText => {
          this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
        });
      }
    });
  }

  submitUpgradeRequest(): void {
    if (this.upgradeForm.invalid || !this.license) {
      return;
    }

    const formValue = this.upgradeForm.value;
    
    // Don't allow selecting the same license type
    if (formValue.newLicenseType === this.license.licenseType) {
      this.languageService.getTranslation('licenseUpgrade.selectDifferentLicenseType').subscribe(translatedText => {
        this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
      });
      return;
    }

    const upgradeRequest: LicenseUpgradeRequest = {
      currentLicenseNumber: this.license.licenseNumber,
      newLicenseType: formValue.newLicenseType,
      requestDate: new Date(),
      reason: formValue.reason
    };

    this.isSubmitting = true;

    this.licenseService.requestLicenseUpgrade(upgradeRequest).subscribe({
      next: () => {
        this.languageService.getTranslation('licenseUpgrade.upgradeRequestSubmitted').subscribe(translatedText => {
          this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
        });
        this.isSubmitting = false;
        this.router.navigate(['/license-upgrade']);
      },
      error: (error) => {
        this.languageService.getTranslation('licenseUpgrade.errorSubmittingRequest').subscribe(translatedText => {
          this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
        });
        this.isSubmitting = false;
        console.error('Submission error:', error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/license-upgrade']);
  }
}
