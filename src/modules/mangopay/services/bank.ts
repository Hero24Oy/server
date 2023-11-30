import { Injectable } from '@nestjs/common';
import { bankAccount as MangopayBankAccount } from 'mangopay2-nodejs-sdk';

import { MangopaySearchParameters } from '../types';

import { MangopayInstanceService } from './instance';

@Injectable()
export class MangopayBankService {
  constructor(private readonly api: MangopayInstanceService) {}

  async createBankAccount(
    userId: string,
    data: Omit<MangopayBankAccount.IBANDetails, 'Type'>,
  ): Promise<MangopayBankAccount.IBANData> {
    return this.api.Users.createBankAccount(userId, { ...data, Type: 'IBAN' });
  }

  async deactivateBankAccount(
    userId: string,
    bankAccountId: string,
  ): Promise<MangopayBankAccount.Data> {
    return this.api.Users.deactivateBankAccount(userId, bankAccountId);
  }

  async getBankAccount(
    userId: string,
    bankAccountId: string,
  ): Promise<MangopayBankAccount.Data> {
    return this.api.Users.getBankAccount(userId, bankAccountId);
  }

  async getAllBankAccountByUserId(
    id: string,
    parameters?: MangopaySearchParameters,
  ): Promise<MangopayBankAccount.Data[]> {
    return this.api.Users.getBankAccounts(id, { parameters });
  }
}
