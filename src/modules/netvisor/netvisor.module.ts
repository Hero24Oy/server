import { Module } from '@nestjs/common';

import { NetvisorSchedule } from './netvisor.schedule';
import { NetvisorService } from './netvisor.service';

import { CryptoModule } from '$modules/crypto/crypto.module';
import { OfferModule } from '$modules/offer/offer.module';
import { OfferRequestModule } from '$modules/offer-request/offer-request.module';

@Module({
  imports: [OfferModule, OfferRequestModule, CryptoModule],
  providers: [NetvisorService, NetvisorSchedule],
  exports: [NetvisorService],
})
export class NetvisorModule {}
