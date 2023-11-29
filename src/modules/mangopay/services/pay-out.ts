import { Injectable } from '@nestjs/common';
import { MangoPayHero } from 'hero24-types';
import {
  payOut as MangopayPayOut,
  transaction as MangopayTransaction,
} from 'mangopay2-nodejs-sdk';

import {
  MangopayCurrency,
  MangopayPayoutPaymentType,
  MangopayTransactionType,
} from '../enums';
import { MakePayOutInput } from '../graphql';
import {
  AccountPayoutInfo,
  MangopaySearchParameters,
  PayOutParameters,
} from '../types';
import { isBusinessHero, isIndividualHero, isProfessionalHero } from '../utils';

import { MangopayInstanceService } from './instance';

import { SellerService } from '$modules/seller/seller.service';

@Injectable()
export class MangopayPayOutService {
  constructor(
    private readonly api: MangopayInstanceService,
    private readonly sellerService: SellerService,
  ) {}

  async createPayOut(
    parameters: PayOutParameters,
  ): Promise<MangopayPayOut.PayOutData> {
    return this.api.PayOuts.create({
      AuthorId: parameters.authorId,
      DebitedFunds: {
        Currency: MangopayCurrency.EUR,
        Amount: parameters.amount,
      },
      Fees: {
        Currency: MangopayCurrency.EUR,
        Amount: parameters.fee,
      },
      BankAccountId: parameters.bankId,
      DebitedWalletId: parameters.walletId,
      PaymentType: MangopayPayoutPaymentType.BANK_WIRE,
    });
  }

  async getPayOutById(id: string): Promise<MangopayPayOut.PayOutData> {
    return this.api.PayOuts.get(id);
  }

  async getAllPayOutsByUserId(
    id: string,
    parameters?: MangopaySearchParameters,
  ): Promise<MangopayTransaction.TransactionData[]> {
    const transactions = await this.api.Users.getTransactions(id, {
      parameters,
    });

    return transactions.filter((transaction) => {
      return transaction.Type === MangopayTransactionType.PAYOUT;
    });
  }

  async getAllPayOutsByWalletId(
    id: string,
    parameters?: MangopaySearchParameters,
  ): Promise<MangopayTransaction.TransactionData[]> {
    const transactions = await this.api.Wallets.getTransactions(id, {
      parameters,
    });

    return transactions.filter((transaction) => {
      return transaction.Type === MangopayTransactionType.PAYOUT;
    });
  }

  async getAllPayOutsByBankId(
    id: string,
    parameters?: MangopaySearchParameters,
  ): Promise<MangopayTransaction.TransactionData[]> {
    return this.api.BankAccounts.getTransactions(id, {
      parameters,
    });
  }

  private async getAccountInfoForMakePayOut(
    hero: MangoPayHero,
  ): Promise<AccountPayoutInfo> {
    let authorId: string | undefined;
    let bankId: string | undefined;
    let walletId: string | undefined;

    if (isIndividualHero(hero)) {
      const { mangopay: companyRepresentative } =
        await this.sellerService.strictGetSellerById(
          hero.companyRepresentativeId,
        );

      if (!companyRepresentative) {
        throw new Error('Hero does not have mangopay account');
      }

      if (!isBusinessHero(companyRepresentative)) {
        throw new Error('Company representative is not business account');
      }

      authorId = companyRepresentative.id;
      walletId = companyRepresentative.walletId;
      bankId = companyRepresentative.bankId;
    }

    if (isProfessionalHero(hero)) {
      authorId = hero.id;
      walletId = hero.walletId;
      bankId = hero.bankId;
    }

    if (!authorId || !walletId || !bankId) {
      throw new Error('Failed to make pay out');
    }

    return {
      authorId,
      bankId,
      walletId,
    };
  }

  async makePayOut(input: MakePayOutInput): Promise<boolean> {
    const { heroId, amount } = input;

    const { mangopay: hero } = await this.sellerService.strictGetSellerById(
      heroId,
    );

    if (!hero) {
      throw new Error('Hero does not have mangopay account');
    }

    const accountInfo = await this.getAccountInfoForMakePayOut(hero);

    await this.createPayOut({
      fee: 0,
      amount,
      ...accountInfo,
    });

    return true;
  }
}
