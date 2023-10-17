import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';

import { UserContext } from './user.context';
import { UserMirror } from './user.mirror';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserHubSpotModule } from './user-hub-spot/user-hub-spot.module';

import { SubscriptionManagerModule } from '$modules/subscription-manager/subscription-manager.module';

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
      imports: [FirebaseModule],
      subscriptions: [UserMirror],
    }),
  ],
  providers: [UserResolver, UserService],
  exports: [UserService, UserHubSpotModule],
})
export class UserModule {}
