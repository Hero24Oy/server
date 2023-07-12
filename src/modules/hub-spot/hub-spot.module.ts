import { Module } from '@nestjs/common';

import { HubSpotService } from './hub-spot.service';

@Module({
  providers: [HubSpotService],
  exports: [HubSpotService],
})
export class HubSpotModule {}
