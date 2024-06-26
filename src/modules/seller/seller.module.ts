import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';

import { SellerContext } from './seller.context';
import { SellerMirror } from './seller.mirror';
import { SellerResolver } from './seller.resolver';
import { SellerService } from './seller.service';

import { NetvisorModule } from '$modules/netvisor/module';
import { SubscriptionManagerModule } from '$modules/subscription-manager/subscription-manager.module';
import { UserModule } from '$modules/user/user.module';

@Module({
  imports: [
    FirebaseModule,
    GraphQlPubsubModule,
    UserModule,
    NetvisorModule,
    GraphQlContextManagerModule.forFeature({
      imports: [SellerModule],
      contexts: [SellerContext],
    }),
    SubscriptionManagerModule.forFeature({
      imports: [FirebaseModule],
      subscriptions: [SellerMirror],
    }),
  ],
  providers: [SellerResolver, SellerService],
  exports: [SellerService],
})
export class SellerModule {}
