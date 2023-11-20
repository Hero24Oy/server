import { Module } from '@nestjs/common';

import {
  MangopayInstanceService,
  MangopayUserService,
  MangopayWalletService,
} from './services';

@Module({
  imports: [],
  providers: [
    MangopayInstanceService,
    MangopayUserService,
    MangopayWalletService,
  ],
  exports: [
    MangopayInstanceService,
    MangopayUserService,
    MangopayWalletService,
  ],
})
export class MangopayModule {}
