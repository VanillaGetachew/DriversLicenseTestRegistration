export interface Registration {
firstNameAmh: string,

fatherNameAmh: string,

grandNameAmh: string,

firstName: string,

fatherName: string,

grandName: string,

sex: number,

birthDate: string,

birthPlace: string,

bloodType: number,

region: string,

town: string,

woreda: string,

kebele: string,

houseNo: string,

nationality: number,

tel1: string,

photo: string,

isTheoryExamEnglish: number,

licenceGrade: string,

education: number,

nationalId: string,

dataApproved: string,

registrationNo: string
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