import { Module } from '@nestjs/common';

import {
  MangopayCardResolver,
  MangopayPayInResolver,
  MangopayPayOutResolver,
} from './resolvers';
import { MangopayDocumentResolver } from './resolvers/document';
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

import { JwtModule } from '$modules/jwt/module';
import { SellerModule } from '$modules/seller/seller.module';
import { TransactionModule } from '$modules/transaction/module';
import { TransactionSubjectModule } from '$modules/transaction-subject/module';

@Module({
  imports: [
    TransactionModule,
    TransactionSubjectModule,
    SellerModule,
    JwtModule,
    TransactionModule,
  ],
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
    MangopayPayInResolver,
    MangopayPayOutResolver,
    MangopayDocumentResolver,
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
