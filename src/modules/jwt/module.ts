import { Module } from '@nestjs/common';

import { JwtService } from './service';

@Module({
  imports: [],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
