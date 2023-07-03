import { Module } from '@nestjs/common';
import { OfferRequestResolver } from './offer-request.resolver';
import { OfferRequestService } from './offer-request.service';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  providers: [OfferRequestResolver, OfferRequestService],
})
export class OfferRequestModule {}
