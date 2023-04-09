import { Module } from '@nestjs/common';
import { OfferRequestResolver } from './offer-request.resolver';
import { OfferRequestService } from './offer-request.service';

@Module({
  providers: [OfferRequestResolver, OfferRequestService],
})
export class OfferRequestModule {}
