import { Module } from '@nestjs/common';
import { BuyerResolver } from './buyer.resolver';
import { BuyerService } from './buyer.service';

@Module({
  providers: [BuyerResolver, BuyerService],
})
export class BuyerModule {}
