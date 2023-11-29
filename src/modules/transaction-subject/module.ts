import { Module } from '@nestjs/common';

import { BuyerModule } from '../buyer/buyer.module';

import { TransactionSubjectService } from './service';

import { FeeModule } from '$modules/fee/fee.module';
import { OfferModule } from '$modules/offer/offer.module';
import { OfferRequestModule } from '$modules/offer-request/offer-request.module';

@Module({
  imports: [FeeModule, OfferModule, OfferRequestModule, BuyerModule],
  providers: [TransactionSubjectService],
  exports: [TransactionSubjectService],
})
export class TransactionSubjectModule {}
