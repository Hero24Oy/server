import { forwardRef, Module } from '@nestjs/common';

import { UserModule } from '../user.module';

import { UserHubSpotService } from './user-hub-spot.service';
import { UserHubSpotSubscription } from './user-hub-spot.subscription';

import { GraphQlPubsubModule } from '$modules/graphql-pubsub/graphql-pubsub.module';
import { HubSpotContactModule } from '$modules/hub-spot/hub-spot-contact/hub-spot-contact.module';
import { SubscriptionManagerModule } from '$modules/subscription-manager/subscription-manager.module';

// We could add this module to the app module to avoid circular dependencies,
// but this module is part of the user module, and we only needed to split the code on logic blocks.
@Module({
  imports: [
    forwardRef(() => UserModule),
    HubSpotContactModule,
    SubscriptionManagerModule.forFeature({
      imports: [GraphQlPubsubModule, UserHubSpotModule],
      subscriptions: [UserHubSpotSubscription],
    }),
  ],
  providers: [UserHubSpotService],
  exports: [UserHubSpotService],
})
export class UserHubSpotModule {}
