import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';

import { SellerContext } from './seller.context';
import { SellerMirror } from './seller.mirror';
import { SellerResolver } from './seller.resolver';
import { SellerService } from './seller.service';

import { SubscriptionManagerModule } from '$modules/subscription-manager/subscription-manager.module';

@Module({
  imports: [
    FirebaseModule,
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
