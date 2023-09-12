import { Module } from '@nestjs/common';

import { HubSpotClientModule } from '../hub-spot-client/hub-spot-client.module';

import { HubSpotContactService } from './hub-spot-contact.service';

@Module({
  imports: [HubSpotClientModule],
  providers: [HubSpotContactService],
  exports: [HubSpotContactService],
})
export class HubSpotContactModule {}
