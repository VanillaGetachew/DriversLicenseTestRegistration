import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';
import { Gend, Gend1, Site } from '../../../core/models/dashboard.model';
import { DashboardModule } from '../dashboard.module';
import { DashboardService } from '../../../core/services/dashboard.service';
import { NgxChartsModule, Color } from '@swimlane/ngx-charts';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    NgxChartsModule,
    TranslateModule
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  // Summary stats
  totalPatients = 3256;
  availableStaff = 394;
  avgTreatmentCost = 2536;
  availableCars = 38;

  selectedId: number = -5;
  parentCode: number = -1;
  schoolParentCode: number = -1;

  site: Site[] = [];
  site2: Site[] = [];
  school: Site[] = [];
  gend: Gend[] =[];
  gend1: Gend1[] =[];
  gend2: Gend[] =[];
  gend3: Gend[] =[];

  genderChartData: any[] = [];
  passfailChartData: any[] = [];
  barChartData: any[] = [];

  // Division data
  divisions = [
    { name: 'Cardiology', patients: 247 },
    { name: 'Neurology', patients: 164 },
    { name: 'Surgery', patients: 86 }
  ];

  // Stats data
  applicantsCount = 2845;
  passRate = 68;
  upcomingTests = 124;
  availableVehicles = 42;
  
  // Registration data
  registrationData = [
    { label: 'Type A', value: 843, percentage: 65, color: '#3498db' },
    { label: 'Type B', value: 421, percentage: 35, color: '#2ecc71' },
    { label: 'Type C', value: 965, percentage: 80, color: '#e74c3c' },
    { label: 'Type D', value: 616, percentage: 45, color: '#f39c12' }
  ];
  
  // License Types data
  licenseTypes = [
    { label: 'Class B', percentage: 45, color: '#3498db', offset: 0 },
    { label: 'Class C', percentage: 30, color: '#2ecc71', offset: 45 },
    { label: 'Class A', percentage: 15, color: '#e74c3c', offset: 75 },
    { label: 'Other', percentage: 10, color: '#f39c12', offset: 90 }
  ];
colorScheme: Color = {
  name: 'custom',
  selectable: true,
  group: 'ordinal' as any,
  domain: ['#E44D25', '#3182bd', '#ffc658', '#a1d99b']
};
  constructor(private dashboard: DashboardService) { }

  ngOnInit(): void {
    // this.getSites();
    this.getGenderSummary();
    this.getLicenceGradeSummary();
    this.getPassfailSummary();
    this.getApplicantSummary();
    this.getPassPercentage();
    this.getUpcomingExam();
    this.getVehicleNumber();
    this.getSchool();
  }
  
onSelectedIdChange(): void {
  this.getGenderSummary();
  this.getLicenceGradeSummary();
  this.getPassfailSummary();
  this.getApplicantSummary();
  this.getPassPercentage();
  this.getUpcomingExam();
  this.getVehicleNumber();
}


  getGenderSummary(): void {
    this.dashboard.getGenderSummary(this.selectedId).subscribe({
      next: (res: Gend[]) => {
        this.genderChartData = res.map((item: Gend) => ({
          name: item.name,
          value: item.value
        }));
      },
      error: (err) => console.error('Gender summary error:', err),
    });
  }
  getApplicantSummary(): void {
    this.dashboard.getApplicantCount(this.selectedId).subscribe({
      next: (res: Gend[]) => {
        this.gend = res.map((item: Gend) => ({
          name: item.name,
          value: item.value
        }));
      },
      error: (err) => console.error('Applicant Count error:', err),
    });
  }
  getPassPercentage(): void {
    this.dashboard.getPassPercentage(this.selectedId).subscribe({
      next: (res: Gend1) => {
        
        this.gend1 = [{
          name: res.name,
          value: res.value
        }];
        
      },
      error: (err) => console.error('Pass Percentage error:', err),
    });
  }

  getUpcomingExam(): void {
    this.dashboard.getUpcomingExam(this.selectedId).subscribe({
      next: (res: Gend[]) => {
        this.gend2 = res.map((item: Gend) => ({
          name: item.name,
          value: item.value
        }));
      },
      error: (err) => console.error('Upcoming Exam error:', err),
    });
  }
  getVehicleNumber(): void {
    this.dashboard.getVehicleAmount(this.selectedId).subscribe({
      next: (res: Gend[]) => {
        this.gend3 = res.map((item: Gend) => ({
          name: item.name,
          value: item.value
        }));
      },
      error: (err) => console.error('Car Amount error:', err),
    });
  }

  getPassfailSummary(): void {
    this.dashboard.getPassfailSummary(this.selectedId).subscribe({
      next: (res: Gend[]) => {
        this.passfailChartData = res.map((item: Gend) => ({
          name: item.name,
          value: item.value
        }));
      },
      error: (err) => console.error('Pass/fail summary error:', err),
    });
  }

  getLicenceGradeSummary(): void {
    this.dashboard.getLicenceGradeSummary(this.selectedId).subscribe({
      next: (res: Gend[]) => {
        this.barChartData = res.map((item: Gend) => ({
          name: item.name,
          value: item.value
        }));
      },
      error: (err) => console.error('Licence grade summary error:', err),
    });
  }

  getSites(): void {
    this.dashboard.getSites(this.parentCode).subscribe({
      next: (res: Site[]) => {
        this.site = res;
      }
    });
  }

  onSiteChange(siteCode: number): void {
    this.schoolParentCode = siteCode;
    this.getSites2(siteCode);
  }

  getSites2(siteCode: number): void {
    this.dashboard.getSites2(siteCode).subscribe({
      next: (res: Site[]) => {
        this.site2 = res;
      },
      error: (err) => {
        console.error('Error fetching child sites:', err);
        this.site2 = [];
      }
    });
  }
  getSchool(): void {
    this.dashboard.getSchool().subscribe({
      next: (res: Site[]) => {
        this.school = res;
      }
    });
  }
}
