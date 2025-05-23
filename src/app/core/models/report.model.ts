export interface ReportFilter {
  startDate?: Date;
  endDate?: Date;
  licenseType?: string;
  status?: string;
}

export interface RegistrationSummary {
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  rejectedRegistrations: number;
}

export interface LicenseTypeSummary {
  licenseType: string;
  count: number;
}