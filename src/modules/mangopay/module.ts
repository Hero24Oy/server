import { Module } from '@nestjs/common';

import {
  MangopayInstanceService,
  MangopayUserService,
  MangopayWalletService,
} from './services';
import { MangopayTransactionService } from './services/transaction';

@Module({
  imports: [],
  providers: [
    MangopayInstanceService,
    MangopayUserService,
    MangopayWalletService,
    MangopayTransactionService,
  ],
  exports: [
    MangopayInstanceService,
    MangopayUserService,
    MangopayWalletService,
    MangopayTransactionService,
  ],
})
export class MangopayModule {}
