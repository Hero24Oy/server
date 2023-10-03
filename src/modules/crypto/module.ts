import { Module } from '@nestjs/common';

import { CryptoService } from './service';

@Module({
  imports: [],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
