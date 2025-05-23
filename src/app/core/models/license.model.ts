export interface License {
  id: number;
  userId: number;
  licenseType: string;
  licenseNumber: string;
  issueDate: Date;
  expiryDate: Date;
  status: string;
}

export interface LicenseUpgradeRequest {
  currentLicenseNumber: string;
  newLicenseType: string;
  requestDate: Date;
  reason: string;
} 