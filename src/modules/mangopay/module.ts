import { Module } from '@nestjs/common';

import { MangopayService } from './service';

@Module({
  imports: [],
  providers: [MangopayService],
  exports: [MangopayService],
})
export class MangopayModule {}
