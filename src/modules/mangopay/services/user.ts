import { Injectable } from '@nestjs/common';
import { user as MangoPayUser } from 'mangopay2-nodejs-sdk';

import { PersonType } from '../enums';

import { MangopayInstanceService } from './instance';

import { MangopayParameters } from '$modules/mangopay/types';

@Injectable()
export class MangopayUserService {
  constructor(private readonly api: MangopayInstanceService) {}

  async createNaturalUser(
    user: MangoPayUser.CreateUserNaturalData,
  ): Promise<MangoPayUser.UserNaturalData> {
    return this.api.Users.create({
      ...user,
      TermsAndConditionsAccepted: true,
      PersonType: PersonType.NATURAL,
    });
  }

  async createLegalUser(
    user: MangoPayUser.CreateUserLegalData,
  ): Promise<MangoPayUser.UserLegalData> {
    return this.api.Users.create({
      ...user,
      TermsAndConditionsAccepted: true,
      PersonType: PersonType.LEGAL,
    });
  }

  async getUser(
    id: string,
  ): Promise<
    MangoPayUser.CreateUserLegalData | MangoPayUser.CreateUserNaturalData
  > {
    return this.api.Users.get(id);
  }

  async getListAllUsers(
    parameters?: MangopayParameters,
  ): Promise<
    (MangoPayUser.CreateUserLegalData | MangoPayUser.CreateUserNaturalData)[]
  > {
    return this.api.Users.getAll({
      parameters,
    });
  }
}
