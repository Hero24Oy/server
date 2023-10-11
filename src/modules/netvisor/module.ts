import { Module } from '@nestjs/common';

import { NetvisorFetcher } from './fetcher';
import { NetvisorSchedule } from './schedule';

import { CryptoModule } from '$modules/crypto/module';
import { OfferModule } from '$modules/offer/offer.module';
import { OfferRequestModule } from '$modules/offer-request/offer-request.module';
import { XmlJsModule } from '$modules/xml-js/module';

@Module({
  imports: [OfferModule, OfferRequestModule, CryptoModule, XmlJsModule],
  providers: [NetvisorSchedule, NetvisorFetcher],
  exports: [NetvisorFetcher],
})
export class NetvisorModule {}
