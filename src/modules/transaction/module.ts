import { Module } from '@nestjs/common';

import { TransactionResolver } from './resolver';
import { TransactionService } from './service';

import { FirebaseModule } from '$modules/firebase/firebase.module';
import { OfferRequestModule } from '$modules/offer-request/offer-request.module';

@Module({
  imports: [FirebaseModule, OfferRequestModule],
  providers: [TransactionService, TransactionResolver],
  exports: [TransactionService],
})
export class TransactionModule {}
