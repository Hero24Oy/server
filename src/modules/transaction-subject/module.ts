import { Module } from '@nestjs/common';

import { TransactionSubjectService } from './service';

import { FeeModule } from '$modules/fee/fee.module';
import { OfferModule } from '$modules/offer/offer.module';
import { OfferService } from '$modules/offer/services/offer.service';

@Module({
  imports: [FeeModule, OfferModule, OfferService],
  providers: [TransactionSubjectService],
  exports: [TransactionSubjectService],
})
export class TransactionSubjectModule {}
