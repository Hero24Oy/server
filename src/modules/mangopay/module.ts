import { Module } from '@nestjs/common';

import {
  MangopayInstanceService,
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
  ],
  exports: [
    MangopayInstanceService,
    MangopayUserService,
    MangopayWalletService,
    MangopayTransactionService,
  ],
})
export class MangopayModule {}
