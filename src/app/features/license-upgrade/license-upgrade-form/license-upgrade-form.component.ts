import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { LicenseService } from '../../../core/services/license.service';
import { License, LicenseUpgradeRequest } from '../../../core/models/license.model';
import { UpgradeService } from '../../../core/services/upgrade.service';
import { Driver } from '../../../core/models/driver.model';
import { DropdownService } from '../../../core/services/dropdown.service';
import { education, language, licenceCategory } from '../../../core/models/dropdown.model';
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
  driver: Driver| null = null;
  licenseTypes: string[] = [];
  education: education[] = [];
  licenceCategory: licenceCategory[] =[];
  licenceGrade: any;
  isLoading = false;
  isSubmitting = false;
  licenseId!: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private licenseService: LicenseService,
    private snackBar: MatSnackBar,
    private upgrade: UpgradeService,
    private dropdown: DropdownService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.upgradeForm = this.fb.group({
      licenceGrade: ['', Validators.required],
      education: ['', Validators.required],
      nationalId: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      if (params['licenceGrade'] && params['licenceNo']) {
        this.licenceGrade = +params['licenceGrade'];
        this.licenseId = +params['licenceNo'];
        this.loadLicenseData();
      } else {
        this.languageService.getTranslation('licenseUpgrade.noLicenseId').subscribe(translatedText => {
          this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
        });
        this.router.navigate(['/license-upgrade']);
      }
    });
    this.getLicenceCategory();
    this.getEducation();
  }

  loadLicenseData(): void {
    this.isLoading = true;
    this.upgrade.getDriver(this.licenceGrade, this.licenseId).subscribe({
      next: (res: any) => {
        this.driver = res;
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
onSubmit(): void {
    if (this.upgradeForm.valid) {
      const formData = {
        ...this.upgradeForm.value
        }
      this.upgrade.upgradeDriver(this.licenceGrade, this.licenseId, this.upgradeForm.value.nationalId, formData).subscribe({
        next:(res) => {
          // alert("Success");
          this.showToast('registration.success', 'common.close', 3000, 'success');
        },
        error: (error) => {
          const msg = error.error?.message || 'Unexpected error occurred';
          this.showToast(msg, 'Close', 5000, 'error' );
        }
      })
      
      // Save the user data to the service
      // this.userDataService.setUserData(formData);
      
      console.log('Form submitted:', formData);
      
      // Navigate to profile page instead of dashboard
      // this.router.navigate(['/profile']);
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.upgradeForm.controls).forEach(field => {
        const control = this.upgradeForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }
private showToast(messageKey: string, actionKey: string, duration: number, type: 'success' | 'error' | 'default' = 'default'): void {
    this.languageService.getTranslation(messageKey).subscribe(message => {
      this.languageService.getTranslation(actionKey).subscribe(action => {
        const panelClass = ['custom-toast'];
        if (type === 'success') {
          panelClass.push('success-toast');
        } else if (type === 'error') {
          panelClass.push('error-toast');
        }
        
        this.snackBar.open(message, action, { 
          duration,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass
        });
      });
    });
  }


  // submitUpgradeRequest(): void {
  //   if (this.upgradeForm.invalid || !this.license) {
  //     return;
  //   }

  //   const formValue = this.upgradeForm.value;
    
  //   // Don't allow selecting the same license type
  //   if (formValue.newLicenseType === this.license.licenseType) {
  //     this.snackBar.open('Please select a different license type', 'Close', { duration: 3000 });
  //     return;
  //   }

  //   const upgradeRequest: LicenseUpgradeRequest = {
  //     currentLicenseNumber: this.license.licenseNumber,
  //     newLicenseType: formValue.newLicenseType,
  //     requestDate: new Date(),
  //     reason: formValue.reason
  //   };

  //   this.isSubmitting = true;

  //   this.licenseService.requestLicenseUpgrade(upgradeRequest).subscribe({
  //     next: () => {
  //       this.snackBar.open('License upgrade request submitted successfully', 'Close', { duration: 3000 });
  //       this.isSubmitting = false;
  //       this.router.navigate(['/license-upgrade']);
  //     },
  //     error: (error) => {
  //       this.snackBar.open('Error submitting upgrade request', 'Close', { duration: 3000 });
  //       this.isSubmitting = false;
  //       console.error('Submission error:', error);
  //     }
  //   });
  // }

  cancel(): void {
    this.router.navigate(['/license-upgrade']);
  }
  getEducation(): void {
      this.dropdown.getEducation().subscribe({
        next: (res: education[]) => {
          this.education = res;
        }
      });
    }
  
    getLicenceCategory(): void {
      this.dropdown.getLicenceCategory().subscribe({
        next: (res: licenceCategory[]) => {
          this.licenceCategory = res;
        }
      });
    }
}
