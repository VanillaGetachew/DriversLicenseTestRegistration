import { DocumentDTO } from "./document.model";

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
}

export interface GetRegistration {
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

export interface ApplicantwithFourDTO {
  firstNameAmh: string;
  fatherNameAmh: string;
  grandNameAmh: string;
  firstName: string;
  fatherName: string;
  grandName: string;
  sex: number;
  birthDate: string;
  birthPlace: string;
  bloodType: number;
  region: string;
  town: string;
  woreda: string;
  kebele: string;
  houseNo: string;
  nationality: number;
  tel1: string;
  photo: File;
  isTheoryExamEnglish: number;
  licenceGrade: string;
  education: number;
  nationalId: string;

  documentTypeId1: number;
  file1: File;
  documentTypeId2: number;
  file2: File;
  documentTypeId3: number;
  file3: File;
  documentTypeId4: number;
  file4: File;
}
export interface ApplicantwithDocDTO {
  id?: number;
  firstNameAmh?: string;
  fatherNameAmh?: string;
  grandNameAmh?: string;
  firstName?: string;
  fatherName?: string;
  grandName?: string;
  sex?: number;
  birthDate?: string;
  birthPlace?: string;
  bloodType?: number;
  region?: string;
  town?: string;
  woreda?: string;
  kebele?: string;
  houseNo?: string;
  nationality?: number;
  tel1?: string;
  photo?: string;
  isTheoryExamEnglish?: number;
  licenceGrade?: string;
  education?: number;
  nationalId?: string;
  documents: DocumentDTO[];
}
export interface GetRegistrationPreview {
  id: number;
  firstNameAmh: string;
  fatherNameAmh: string;
  grandNameAmh: string;
  nationalId: string;
  licenceGrade: string;
}