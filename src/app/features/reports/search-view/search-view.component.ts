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
import { TranslateModule } from '@ngx-translate/core';
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

  search = {
    nationalId: '',
    firstName: '',
    fatherName: '',
    grandName: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private registrationService: RegistrationService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadRegistrations();
  }

  loadRegistrations(): void {
    this.isLoading = true;
    this.registrationService.getRegistrations(
      this.pageIndex,
      this.pageSize,
      'createdAt',
      'desc',
      this.search.nationalId,
      this.search.firstName,
      this.search.fatherName,
      this.search.grandName
    ).subscribe({
      next: (res) => {
        this.dataSource.data = res.items;
        this.totalCount = res.totalCount;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearchChange(): void {
    this.pageIndex = 0;
    this.loadRegistrations();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRegistrations();
  }

  // Placeholder for actions (e.g., view, edit, delete)
  onAction(reg: Registration, action: string): void {
    // Implement dialog or navigation as needed
    alert(`${action} for ${reg.nationalId}`);
  }
}
