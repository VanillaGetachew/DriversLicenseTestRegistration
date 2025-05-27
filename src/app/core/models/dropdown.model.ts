export interface nationality {
  code: string;
  amdescription: string;
}
export interface address {
  code: string;
  amDescription: string;
}
export interface sex{
    id: number,
    nameEnglish: string,
    nameAmharic: string,
    nameAfanOromo: string,
    nameTigrigna: string
}
export interface education{
    id: number,
    nameEnglish: string,
    nameAmharic: string,
}
export interface language{
    id: number,
    nameEnglish: string,
    nameAmharic: string,
    nameAfanOromo: string,
    nameTigrigna: string
    nameAfar: string,
    nameSomali: string
}
export interface licenceCategory{
    code: number,
    displayNameAmh: string,
    minAge: number,
    minEducation: number
}