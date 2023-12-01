import { Injectable } from '@nestjs/common';
import { wallet as MangoPayWallet } from 'mangopay2-nodejs-sdk';

import { MangopayCurrency } from '../enums';

import { MangopayInstanceService } from './instance';

@Injectable()
export class MangopayWalletService {
  constructor(private readonly api: MangopayInstanceService) {}

  async createWallet(
    data: Omit<MangoPayWallet.CreateWallet, 'Currency'>,
  ): Promise<MangoPayWallet.WalletData> {
    return this.api.Wallets.create({ ...data, Currency: MangopayCurrency.EUR });
  }

  async updateWallet(
    data: MangoPayWallet.UpdateWallet,
  ): Promise<MangoPayWallet.WalletData> {
    return this.api.Wallets.update(data);
  }

  async getWalletById(id: string): Promise<MangoPayWallet.WalletData> {
    return this.api.Wallets.get(id);
  }

  async getWalletsByUserId(id: string): Promise<MangoPayWallet.WalletData[]> {
    return this.api.Users.getWallets(id);
  }
}
