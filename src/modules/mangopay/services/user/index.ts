import { Injectable } from '@nestjs/common';
import { user as MangoPayUser } from 'mangopay2-nodejs-sdk';

import { MangopayInstanceService } from '../instance';

import { PersonType } from './enums';
import {
  MangopayLegalUserCreationData,
  MangopayNaturalUserCreationData,
} from './types';

import { ConfigType } from '$config';
import { Config } from '$decorator';
import { MangopayParameters } from '$modules/mangopay/types';

@Injectable()
export class MangopayUserService extends MangopayInstanceService {
  constructor(@Config() config: ConfigType) {
    super(config);
  }

  async createNaturalUser(
    user: MangopayNaturalUserCreationData,
  ): Promise<MangoPayUser.UserNaturalData> {
    return this.api.Users.create({
      ...user,
      PersonType: PersonType.NATURAL,
    });
  }

  async createLegalUser(
    user: MangopayLegalUserCreationData,
  ): Promise<MangoPayUser.UserLegalData> {
    return this.api.Users.create({
      ...user,
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
