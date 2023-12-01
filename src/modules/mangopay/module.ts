import { Module } from '@nestjs/common';

import {
  MangopayCardResolver,
  MangopayDocumentResolver,
  MangopayPayInResolver,
  MangopayPayOutResolver,
  MangopayUserResolver,
} from './resolvers';
import {
  MangopayBankService,
  MangopayCardService,
  MangopayDocumentService,
  MangopayInstanceService,
  MangopayPayInService,
  MangopayPayOutService,
  MangopayTransactionService,
  MangopayUserCreationService,
  MangopayUserService,
  MangopayWalletService,
} from './services';

import { BuyerModule } from '$modules/buyer/buyer.module';
import { JwtModule } from '$modules/jwt/module';
import { SellerModule } from '$modules/seller/seller.module';
import { TransactionModule } from '$modules/transaction/module';
import { TransactionSubjectModule } from '$modules/transaction-subject/module';
import { UserModule } from '$modules/user/user.module';

@Module({
  imports: [
    TransactionModule,
    TransactionSubjectModule,
    SellerModule,
    BuyerModule,
    UserModule,
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
    MangopayUserCreationService,
    MangopayCardResolver,
    MangopayPayInResolver,
    MangopayPayOutResolver,
    MangopayDocumentResolver,
    MangopayUserResolver,
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
    MangopayUserCreationService,
  ],
})
export class MangopayModule {}
