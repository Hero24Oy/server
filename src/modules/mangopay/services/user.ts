import { Injectable } from '@nestjs/common';
import { user as MangoPayUser } from 'mangopay2-nodejs-sdk';

import {
  MangopayPersonType,
  MangopayProfessionalPersonType,
  MangopayUserCategory,
} from '../enums';

import { MangopayInstanceService } from './instance';

import {
  CreateIndividualCustomerParameters,
  CreateProfessionalCustomerParameters,
  CreateProfessionalHeroParameters,
  MangopaySearchParameters,
} from '$modules/mangopay/types';

@Injectable()
export class MangopayUserService {
  constructor(private readonly api: MangopayInstanceService) {}

  async createIndividualCustomerUser(
    user: CreateIndividualCustomerParameters,
  ): Promise<MangoPayUser.UserNaturalData> {
    return this.api.Users.create({
      ...user,
      UserCategory: MangopayUserCategory.CUSTOMER,
      TermsAndConditionsAccepted: true,
      PersonType: MangopayPersonType.INDIVIDUAL,
    });
  }

  async createProfessionalCustomerUser(
    user: CreateProfessionalCustomerParameters,
  ): Promise<MangoPayUser.UserLegalData> {
    return this.api.Users.create({
      ...user,
      UserCategory: MangopayUserCategory.CUSTOMER,
      TermsAndConditionsAccepted: true,
      PersonType: MangopayPersonType.PROFESSIONAL,
      LegalPersonType: MangopayProfessionalPersonType.BUSINESS,
    });
  }

  async createBusinessHeroUser(
    user: CreateProfessionalHeroParameters,
  ): Promise<MangoPayUser.UserLegalData> {
    return this.api.Users.create({
      ...user,
      UserCategory: MangopayUserCategory.HERO,
      TermsAndConditionsAccepted: true,
      PersonType: MangopayPersonType.PROFESSIONAL,
      LegalPersonType: MangopayProfessionalPersonType.BUSINESS,
    });
  }

  async createSoletraderHeroUser(
    user: CreateProfessionalHeroParameters,
  ): Promise<MangoPayUser.UserLegalData> {
    return this.api.Users.create({
      ...user,
      UserCategory: MangopayUserCategory.HERO,
      TermsAndConditionsAccepted: true,
      PersonType: MangopayPersonType.PROFESSIONAL,
      LegalPersonType: MangopayProfessionalPersonType.SOLETRADER,
    });
  }

  async updateIndividualUser(
    user: MangoPayUser.UpdateUserNaturalData,
  ): Promise<MangoPayUser.UserNaturalData> {
    return this.api.Users.update({
      ...user,
      TermsAndConditionsAccepted: true,
      PersonType: MangopayPersonType.INDIVIDUAL,
    });
  }

  async updateProfessionalUser(
    user: MangoPayUser.UpdateUserLegalData,
  ): Promise<MangoPayUser.UserLegalData> {
    return this.api.Users.update({
      ...user,
      TermsAndConditionsAccepted: true,
      PersonType: MangopayPersonType.PROFESSIONAL,
    });
  }

  async getUserById(
    id: string,
  ): Promise<MangoPayUser.UserLegalData | MangoPayUser.UserNaturalData> {
    return this.api.Users.get(id);
  }

  async getListAllUsers(
    parameters?: MangopaySearchParameters,
  ): Promise<(MangoPayUser.UserLegalData | MangoPayUser.UserNaturalData)[]> {
    return this.api.Users.getAll({
      parameters,
    });
  }
}
