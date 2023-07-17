import { Module, forwardRef } from '@nestjs/common';

import { GraphQLPubsubModule } from 'src/modules/graphql-pubsub/graphql-pubsub.module';
import { SubscriptionManagerModule } from 'src/modules/subscription-manager/subscription-manager.module';
import { HubSpotContactModule } from 'src/modules/hub-spot/hub-spot-contact/hub-spot-contact.module';

import { UserModule } from '../user.module';
import { UserHubSpotSubscription } from './user-hub-spot.subscription';
import { UserHubSpotService } from './user-hub-spot.service';

// We could add this module to the app module to avoid circular dependencies,
// but this module is part of the user module, and we only needed to split the code on logic blocks.
@Module({
  imports: [
    forwardRef(() => UserModule),
    HubSpotContactModule,
    SubscriptionManagerModule.forFeature({
      imports: [GraphQLPubsubModule, UserHubSpotModule],
      subscriptions: [UserHubSpotSubscription],
    }),
  ],
  providers: [UserHubSpotService],
  exports: [UserHubSpotService],
})
export class UserHubSpotModule {}
