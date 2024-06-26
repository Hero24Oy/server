import { Module } from '@nestjs/common';

import { CryptoService } from './service';

@Module({
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
