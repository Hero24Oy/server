import { Module } from '@nestjs/common';

import { MangopayInstanceService, MangopayUserService } from './services';

@Module({
  imports: [],
  providers: [MangopayInstanceService, MangopayUserService],
  exports: [MangopayInstanceService, MangopayUserService],
})
export class MangopayModule {}
