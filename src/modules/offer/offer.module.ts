import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { OfferHubSpotModule } from './offer-hub-spot/offer-hub-spot.module';
import { OfferService } from './offer.service';

@Module({
  imports: [FirebaseModule, OfferHubSpotModule],
  providers: [OfferService],
  exports: [OfferService],
})
export class OfferModule {}
