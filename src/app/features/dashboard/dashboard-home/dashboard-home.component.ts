import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
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

  constructor() { }

  ngOnInit(): void {
    // In a real application, you would fetch this data from a service
  }
}
