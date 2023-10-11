import { Module } from '@nestjs/common';

import { NetvisorFetcher } from './fetcher';
import { NetvisorSchedule } from './schedule';

import { CryptoModule } from '$modules/crypto/module';
import { CustomScheduleModule } from '$modules/custom-schedule/module';
import { OfferModule } from '$modules/offer/offer.module';
import { OfferRequestModule } from '$modules/offer-request/offer-request.module';
import { Xml2JsModule } from '$modules/xml2js/module';

@Module({
  imports: [
    OfferModule,
    OfferRequestModule,
    CryptoModule,
    Xml2JsModule,
    CustomScheduleModule,
  ],
  providers: [NetvisorSchedule, NetvisorFetcher],
  exports: [],
})
export class NetvisorModule {}
