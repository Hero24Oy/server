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

@Module({
  imports: [],
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
