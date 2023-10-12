import { Module } from '@nestjs/common';

import { NetvisorFetcher } from './fetcher';
import { NetvisorSchedule } from './schedule';
import { NetvisorService } from './service';

import { CryptoModule } from '$modules/crypto/module';
import { OfferModule } from '$modules/offer/offer.module';
import { OfferRequestModule } from '$modules/offer-request/offer-request.module';
import { UserModule } from '$modules/user/user.module';
import { XmlJsModule } from '$modules/xml-js/module';

@Module({
  imports: [
    OfferModule,
    OfferRequestModule,
    CryptoModule,
    XmlJsModule,
    UserModule,
  ],
  providers: [NetvisorSchedule, NetvisorFetcher, NetvisorService],
  exports: [NetvisorService],
})
export class NetvisorModule {}
