import { Module } from '@nestjs/common';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { GraphQLPubsubModule } from 'src/modules/graphql-pubsub/graphql-pubsub.module';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';
import { CategorySubscription } from './category.subscription';
import { SubscriptionManagerModule } from 'src/modules/subscription-manager/subscription-manager.module';

@Module({
  imports: [
    FirebaseModule,
    GraphQLPubsubModule,
    SubscriptionManagerModule.forFeature({
      imports: [GraphQLPubsubModule, FirebaseModule],
      subscriptions: [CategorySubscription],
    }),
  ],
  providers: [CategoryResolver, CategoryService],
})
export class CategoryModule {}
