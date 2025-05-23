export interface Registration {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  nationalId: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  licenseType: string;
  examDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  nationalId: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  licenseType: string;
  examDate: Date;
} 