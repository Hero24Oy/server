import { Injectable } from '@nestjs/common';
import { user as MangoPayUser } from 'mangopay2-nodejs-sdk';

import { MangopayPersonType, MangopayProfessionalPersonType } from '../enums';

import { MangopayInstanceService } from './instance';

import { MangopaySearchParameters } from '$modules/mangopay/types';

@Injectable()
export class MangopayUserService {
  constructor(private readonly api: MangopayInstanceService) {}

  async createIndividualUser(
    user: MangoPayUser.CreateUserNaturalData,
  ): Promise<MangoPayUser.UserNaturalData> {
    return this.api.Users.create({
      ...user,
      TermsAndConditionsAccepted: true,
      PersonType: MangopayPersonType.INDIVIDUAL,
    });
  }

  async createProfessionalUser(
    user: MangoPayUser.CreateUserLegalData,
  ): Promise<MangoPayUser.UserLegalData> {
    return this.api.Users.create({
      ...user,
      TermsAndConditionsAccepted: true,
      PersonType: MangopayPersonType.PROFESSIONAL,
      LegalPersonType: MangopayProfessionalPersonType.BUSINESS,
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
