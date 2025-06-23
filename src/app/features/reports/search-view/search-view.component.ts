import { Component, OnInit, ViewChild } from '@angular/core';
import { RegistrationService } from '../../../core/services/registration.service';
import { Registration } from '../../../core/models/registration.model';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-view',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    TranslateModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent implements OnInit {
  displayedColumns: string[] = ['name', 'nationalId', 'licenceGrade', 'actions'];
  dataSource = new MatTableDataSource<Registration>([]);
  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;
  isLoading = false;
  searchName: string = '';
  searchFirstName: string = '';
  searchFatherName: string = '';
  searchGrandfatherName: string = '';
  searchId: string = '';
  pageNumber: number = 1;
  sortParam: string = 'Id';
  sortValue: string = 'asc';
  searchResult: any;
  // pageSize: number = 10;


  search = {
    nationalId: '',
    firstName: '',
    fatherName: '',
    grandName: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private registrationService: RegistrationService, private dialog: MatDialog, private languageService: LanguageService, private translate: TranslateService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // this.loadRegistrations();
  }

//   loadRegistrations(): void {
//     this.isLoading = true;
//     // this.registrationService.getRegistrations(this.pageIndex, this.pageSize, 'createdAt', 'desc', this.searchTerm)
//     //   .subscribe({
//     //     next: (res) => {
//     //       this.dataSource.data = res.items;
//     //       this.totalCount = res.totalCount;
//     //       this.isLoading = false;
//     //     },
//     //     error: () => {
//     //       this.isLoading = false;
//     //     }
//     //   });
//     this.registrationService.getApplicantsByName(this.searchName, this.sortParam, this.sortValue, this.pageNumber, this.pageSize).subscribe({
//   next: (data) => {
//     console.log('Applicants:', data);
//   },
//   error: (err) => {
//     console.error('Error fetching applicants:', err);
//   }
// });
//   }

searchProfile(): void {
    this.searchResult = null;
    this.searchName = [this.searchFirstName, this.searchFatherName, this.searchGrandfatherName]
  .map(s => s.trim()).filter(s => s.length > 0).join(' ');  
    if (!this.searchId && !this.searchName) {
      this.languageService.getTranslation('profile.searchError').subscribe(translatedText => {
        this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
      });
      return;
    }
    if (this.searchId) {
      this.registrationService.getRegistrationById(this.searchId).subscribe({
        next: (data) => {
          this.searchResult = data;
          // this.userData = data;
          //  this.setPhotoUrl(data.photo);
        },
        error: (error) => {
          const msg = 'Applicant Not Found'
          this.showToast(msg, 'Close', 5000, 'error' );
        }
      },
    );
    } 
    
    if (this.searchName) {
      this.registrationService.getApplicantsByName(this.searchName, this.sortParam, this.sortValue, this.pageNumber, this.pageSize).subscribe(data => {
        if (data) {
          this.searchResult = data;
          // this.userData = data;
          //  this.setPhotoUrl(data.photo);
        } else {
          this.languageService.getTranslation('profile.noProfileFoundId').subscribe(translatedText => {
            this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
          });
        }
      });
    }
  }





  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement)?.value || '';
    this.pageIndex = 0;
    // this.searchTerm = value;
    // this.loadRegistrations();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    // this.loadRegistrations();
  }

  // Placeholder for actions (e.g., view, edit, delete)
  onAction(reg: Registration, action: string): void {
    // Implement dialog or navigation as needed
    alert(`${action} for ${reg.nationalId}`);
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
}
