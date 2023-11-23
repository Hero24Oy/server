import { Module } from '@nestjs/common';

import { MangopayCardResolver } from './resolvers';
import {
  MangopayBankService,
  MangopayCardService,
  MangopayDocumentService,
  MangopayInstanceService,
  MangopayPayInService,
  MangopayPayOutService,
  MangopayTransactionService,
  MangopayUserService,
  MangopayWalletService,
} from './services';

import { BuyerModule } from '$modules/buyer/buyer.module';
import { TransactionModule } from '$modules/transaction/module';
import { TransactionSubjectModule } from '$modules/transaction-subject/module';

@Module({
  imports: [TransactionModule, TransactionSubjectModule, BuyerModule],
  providers: [
    MangopayInstanceService,
    MangopayUserService,
    MangopayWalletService,
    MangopayTransactionService,
    MangopayCardService,
    MangopayPayInService,
    MangopayPayOutService,
    MangopayBankService,
    MangopayDocumentService,
    MangopayCardResolver,
  ],
  exports: [
    MangopayInstanceService,
    MangopayUserService,
    MangopayWalletService,
    MangopayTransactionService,
    MangopayCardService,
    MangopayPayInService,
    MangopayPayOutService,
    MangopayBankService,
    MangopayDocumentService,
  ],
})
export class MangopayModule {}
