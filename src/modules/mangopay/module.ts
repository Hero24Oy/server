import { Module } from '@nestjs/common';

import {
  MangopayCardService,
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
    MangopayCardService,
  ],
  exports: [
    MangopayInstanceService,
    MangopayUserService,
    MangopayWalletService,
    MangopayTransactionService,
    MangopayCardService,
  ],
})
export class MangopayModule {}
