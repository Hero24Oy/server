import { Module } from '@nestjs/common';

import { MangopayInstanceService } from './services/base';

@Module({
  imports: [],
  providers: [MangopayInstanceService],
  exports: [MangopayInstanceService],
})
export class MangopayModule {}
