import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { UserSubscription } from './user.subscription';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';
import { HubSpotModule } from '../hub-spot/hub-spot.module';

@Module({
  imports: [
    FirebaseModule,
    GraphQLPubsubModule,
    SubscriptionManagerModule.forFeature({
      imports: [GraphQLPubsubModule, HubSpotModule, UserModule],
      subscriptions: [UserSubscription],
    }),
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
