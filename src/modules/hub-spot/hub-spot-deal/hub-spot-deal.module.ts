import { Module } from '@nestjs/common';

import { HubSpotDealService } from './hub-spot-deal.service';
import { HubSpotClientModule } from '../hub-spot-client/hub-spot-client.module';

@Module({
  imports: [HubSpotClientModule],
  providers: [HubSpotDealService],
  exports: [HubSpotDealService],
})
export class HubSpotDealModule {}
