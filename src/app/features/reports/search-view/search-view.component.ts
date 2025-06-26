import { Component, OnInit, ViewChild } from '@angular/core';
import { RegistrationService } from '../../../core/services/registration.service';
import { GetRegistration, GetRegistrationPreview, Registration } from '../../../core/models/registration.model';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';

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
    FormsModule,
    MatSortModule,
    MatRadioModule,
    CommonModule
  ],
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent implements OnInit {
  displayedColumns: string[] = ['applicantId', 'name', 'nationalId', 'licenceGrade', 'actions'];
  searchForm!: FormGroup;
  dataSource = new MatTableDataSource<GetRegistrationPreview>([]);
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
  sortValue: 'asc' | 'desc' = 'asc';
  searchResult: any;
  searchMode: 'id' | 'name' = 'id';


  search = {
    nationalId: '',
    firstName: '',
    fatherName: '',
    grandName: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: any;

  constructor(private registrationService: RegistrationService, private dialog: MatDialog, private languageService: LanguageService, private translate: TranslateService, private snackBar: MatSnackBar, private fb: FormBuilder, private router: Router) {
    this.searchForm = this.fb.group({
      nationalId: [''],
      firstNameAmh: [''],
      fatherNameAmh: [''],
      grandNameAmh: ['']
    });
  }

  ngOnInit(): void {

  }
//   ngAfterViewInit(): void {
//   this.dataSource.paginator = this.paginator;
//   this.dataSource.sort = this.sort;
// }

searchProfile(): void {
    this.searchResult = null;
    this.pageNumber = this.pageIndex + 1;

    this.searchName = [this.searchFirstName, this.searchFatherName, this.searchGrandfatherName]
    .map(s => s.trim()).filter(s => s.length > 0).join(' ');

    
    if (this.searchMode ==='id') {

      if (!this.searchId) {
        this.languageService.getTranslation('profile.searchError').subscribe(translatedText => {
          this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
        });
        return;
      }

      this.registrationService.getRegistrationBynationalId(this.searchId).subscribe({
        next: (data) => {
          const mappedResults: GetRegistrationPreview[] = [data].map((d: any) => ({
          id: d.id,
          firstNameAmh: d.firstNameAmh,
          fatherNameAmh: d.fatherNameAmh,
          grandNameAmh: d.grandNameAmh,
          nationalId: d.nationalId,
          licenceGrade: d.licenceGrade,
        }));
          this.dataSource.data = mappedResults;
          this.totalCount = 1;
          this.isLoading = false;
        },
        error: (error) => {
          const msg = 'Applicant Not Found'
          this.showToast(msg, 'Close', 5000, 'error' );
        }
      },
    );
    } else if (this.searchMode === 'name') {

      if (!this.searchName) {
        this.languageService.getTranslation('profile.searchError').subscribe(translatedText => {
          this.snackBar.open(translatedText, this.translate.instant('common.close'), { duration: 3000 });
        });
        return;
      }


      this.registrationService.getApplicantsByName(this.searchName, this.sortParam, this.sortValue, this.pageNumber, this.pageSize).subscribe(data => {
        if (data) {
        const mappedResults: GetRegistrationPreview[] = data.items.map((d: any) => ({
          id: d.id,
          firstNameAmh: d.firstNameAmh,
          fatherNameAmh: d.fatherNameAmh,
          grandNameAmh: d.grandNameAmh,
          nationalId: d.nationalId,
          licenceGrade: d.licenceGrade,
        }));

        this.dataSource.data = mappedResults;
        this.totalCount = data.totalCount;
        this.isLoading = false;
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
  }

  private showToast(messageKey: string, actionKey: string, duration: number, type: 'success' | 'error' | 'default' = 'default', count?: number): void {
    let messageObs = this.languageService.getTranslation(messageKey);
    if (count !== undefined) {
      messageObs = this.languageService.getTranslation(messageKey, { count });
    }
    messageObs.subscribe(message => {
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

  onSearchClick(): void {
    this.showToast('searching', 'common.close', 1500, 'default');
  }

  onPageChange(event: PageEvent): void {
   setTimeout(() => {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNumber = this.pageIndex + 1;

    this.searchProfile();
  });
}
onSortChange(event: Sort): void {
  this.sortParam = event.active;
  this.sortValue = event.direction as 'asc' | 'desc';
  this.searchProfile();
}


  onAction(reg: GetRegistrationPreview, action: string): void {

  if (action === 'view') {
    if(reg.nationalId){
      this.router.navigate(['/profile/nid', reg.nationalId]);
    }
    else if(reg.id){
      this.router.navigate(['/profile/aid', reg.id]);
    }
  }
  }
}
