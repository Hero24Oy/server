import { Module } from '@nestjs/common';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserHubSpotModule } from './user-hub-spot/user-hub-spot.module';
import { UserSubscription } from './user.subscription';
import { UserContext } from './user.context';
import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { GraphQLContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';

@Module({
  imports: [
    FirebaseModule,
    GraphQLPubsubModule,
    UserHubSpotModule,
    GraphQLContextManagerModule.forFeature({
      contexts: [UserContext],
      imports: [UserModule],
    }),
    SubscriptionManagerModule.forFeature({
      imports: [GraphQLPubsubModule, FirebaseModule],
      subscriptions: [UserSubscription],
    }),
  ],
  providers: [UserResolver, UserService],
  exports: [UserService, UserHubSpotModule],
})
export class UserModule {}
