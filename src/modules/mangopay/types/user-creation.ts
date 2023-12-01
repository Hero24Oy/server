import { user as MangoPayUser } from 'mangopay2-nodejs-sdk';

export type CreateIndividualCustomerParameters = Pick<
  MangoPayUser.CreateUserNaturalData,
  'FirstName' | 'LastName' | 'Email'
>;

type CreateProfessionalUserParameters = Omit<
  MangoPayUser.CreateUserLegalData,
  | 'TermsAndConditionsAccepted'
  | 'PersonType'
  | 'LegalPersonType'
  | 'UserCategory'
>;

export type CreateProfessionalHeroParameters = CreateProfessionalUserParameters;

export type CreateProfessionalCustomerParameters = Omit<
  CreateProfessionalUserParameters,
  | 'HeadquartersAddress'
  | 'LegalRepresentativeBirthday'
  | 'LegalRepresentativeNationality'
  | 'LegalRepresentativeCountryOfResidence'
  | 'CompanyNumber'
>;
