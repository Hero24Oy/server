import { Module } from '@nestjs/common';

import { NetvisorFetcher } from './netvisor.fetcher';
import { NetvisorSchedule } from './netvisor.schedule';

import { CryptoModule } from '$modules/crypto/crypto.module';
import { OfferModule } from '$modules/offer/offer.module';
import { OfferRequestModule } from '$modules/offer-request/offer-request.module';
import { Xml2JsModule } from '$modules/xml2js/xml2js.module';

@Module({
  imports: [OfferModule, OfferRequestModule, CryptoModule, Xml2JsModule],
  providers: [NetvisorSchedule, NetvisorFetcher],
  exports: [],
})
export class NetvisorModule {}
