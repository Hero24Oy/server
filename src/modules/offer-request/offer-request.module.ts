import { Module } from '@nestjs/common';
import { OfferRequestResolver } from './offer-request.resolver';
import { OfferRequestService } from './offer-request.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { SorterModule } from '../sorter/sorter.module';
import { OFFER_REQUEST_SORTERS } from './offer-request.sorters';

@Module({
  imports: [FirebaseModule, SorterModule.create(OFFER_REQUEST_SORTERS)],
  providers: [OfferRequestResolver, OfferRequestService],
})
export class OfferRequestModule {}
