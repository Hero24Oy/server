import { Injectable } from '@nestjs/common';
import { user as MangoPayUser } from 'mangopay2-nodejs-sdk';

import { MangopayPersonType } from '../enums';

import { MangopayInstanceService } from './instance';

import { MangopayParameters } from '$modules/mangopay/types';

@Injectable()
export class MangopayUserService {
  constructor(private readonly api: MangopayInstanceService) {}

  async createSelfEmployedUser(
    user: MangoPayUser.CreateUserNaturalData,
  ): Promise<MangoPayUser.UserNaturalData> {
    return this.api.Users.create({
      ...user,
      TermsAndConditionsAccepted: true,
      PersonType: MangopayPersonType.SELF_EMPLOYED,
    });
  }

  async createCompanyUser(
    user: MangoPayUser.CreateUserLegalData,
  ): Promise<MangoPayUser.UserLegalData> {
    return this.api.Users.create({
      ...user,
      TermsAndConditionsAccepted: true,
      PersonType: MangopayPersonType.COMPANY,
    });
  }

  async updateSelfEmployedUser(
    user: MangoPayUser.UpdateUserNaturalData,
  ): Promise<MangoPayUser.UserNaturalData> {
    return this.api.Users.update({
      ...user,
      TermsAndConditionsAccepted: true,
      PersonType: MangopayPersonType.SELF_EMPLOYED,
    });
  }

  async updateCompanyUser(
    user: MangoPayUser.UpdateUserLegalData,
  ): Promise<MangoPayUser.UserLegalData> {
    return this.api.Users.update({
      ...user,
      TermsAndConditionsAccepted: true,
      PersonType: MangopayPersonType.COMPANY,
    });
  }

  async getUserById(
    id: string,
  ): Promise<
    MangoPayUser.CreateUserLegalData | MangoPayUser.CreateUserNaturalData
  > {
    return this.api.Users.get(id);
  }

  async getListAllUsersById(
    parameters?: MangopayParameters,
  ): Promise<
    (MangoPayUser.CreateUserLegalData | MangoPayUser.CreateUserNaturalData)[]
  > {
    return this.api.Users.getAll({
      parameters,
    });
  }
}
