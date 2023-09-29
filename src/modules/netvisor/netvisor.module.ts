import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { NetvisorService } from './netvisor.service';

import { OfferModule } from '$modules/offer/offer.module';
import { OfferRequestModule } from '$modules/offer-request/offer-request.module';

@Module({
  imports: [ScheduleModule.forRoot(), OfferModule, OfferRequestModule],
  providers: [NetvisorService],
  exports: [NetvisorService],
})
export class NetvisorModule {}
