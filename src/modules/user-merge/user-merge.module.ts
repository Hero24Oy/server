import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';

import { UserMergeResolver } from './user-merge.resolver';
import { UserMergeService } from './user-merge.service';
import { UserMergeSubscription } from './user-merge.subscription';

import { SubscriptionManagerModule } from '$modules/subscription-manager/subscription-manager.module';

@Module({
  imports: [
    FirebaseModule,
    GraphQlPubsubModule,
    SubscriptionManagerModule.forFeature({
      imports: [FirebaseModule, GraphQlPubsubModule, UserMergeModule],
      subscriptions: [UserMergeSubscription],
    }),
  ],
  providers: [UserMergeResolver, UserMergeService],
})
export class UserMergeModule {}
