import { Injectable } from '@nestjs/common';
import { wallet as MangoPayWallet } from 'mangopay2-nodejs-sdk';

import { MangopayInstanceService } from './instance';

@Injectable()
export class MangopayWalletService {
  constructor(private readonly api: MangopayInstanceService) {}

  async createWallet(
    data: MangoPayWallet.CreateWallet,
  ): Promise<MangoPayWallet.WalletData> {
    return this.api.Wallets.create(data);
  }

  async updateWallet(
    data: MangoPayWallet.UpdateWallet,
  ): Promise<MangoPayWallet.WalletData> {
    return this.api.Wallets.update(data);
  }

  async getWallet(id: string): Promise<MangoPayWallet.WalletData> {
    return this.api.Wallets.get(id);
  }

  async getWalletsByUser(id: string): Promise<MangoPayWallet.WalletData[]> {
    return this.api.Users.getWallets(id);
  }
}
