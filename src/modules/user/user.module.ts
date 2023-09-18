import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';

import { UserContext } from './user.context';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserSubscription } from './user.subscription';
import { UserHubSpotModule } from './user-hub-spot/user-hub-spot.module';

@Module({
  imports: [
    FirebaseModule,
    GraphQlPubsubModule,
    UserHubSpotModule,
    GraphQlPubsubModule,
    GraphQlContextManagerModule.forFeature({
      contexts: [UserContext],
      imports: [UserModule],
    }),
    SubscriptionManagerModule.forFeature({
      imports: [GraphQlPubsubModule, FirebaseModule],
      subscriptions: [UserSubscription],
    }),
  ],
  providers: [UserResolver, UserService],
  exports: [UserService, UserHubSpotModule],
})
export class UserModule {}
