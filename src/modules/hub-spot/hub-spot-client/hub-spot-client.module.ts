import { Module } from '@nestjs/common';

import { HubSpotClientService } from './hub-spot-client.service';

@Module({
  providers: [HubSpotClientService],
  exports: [HubSpotClientService],
})
export class HubSpotClientModule {}
