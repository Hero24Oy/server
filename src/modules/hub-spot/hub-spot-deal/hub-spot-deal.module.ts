import { Module } from '@nestjs/common';

import { HubSpotClientModule } from '../hub-spot-client/hub-spot-client.module';

import { HubSpotDealService } from './hub-spot-deal.service';

@Module({
  imports: [HubSpotClientModule],
  providers: [HubSpotDealService],
  exports: [HubSpotDealService],
})
export class HubSpotDealModule {}
