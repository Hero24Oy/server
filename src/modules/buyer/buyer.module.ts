import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';

import { BuyerContext } from './buyer.context';
import { BuyerMirror } from './buyer.mirror';
import { BuyerResolver } from './buyer.resolver';
import { BuyerService } from './buyer.service';

import { SubscriptionManagerModule } from '$modules/subscription-manager/subscription-manager.module';
import { UserModule } from '$modules/user/user.module';

@Module({
  imports: [
    FirebaseModule,
    UserModule,
    GraphQlContextManagerModule.forFeature({
      imports: [BuyerModule],
      contexts: [BuyerContext],
    }),
    SubscriptionManagerModule.forFeature({
      imports: [FirebaseModule],
      subscriptions: [BuyerMirror],
    }),
  ],
  providers: [BuyerResolver, BuyerService],
  exports: [BuyerService],
})
export class BuyerModule {}
