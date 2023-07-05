import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { N8nWebhookManagerModule } from '../n8n-webhook-manager/n8n-webhook-manager.module';
import { UserN8nSubscription } from './user.n8n-subscription';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';

@Module({
  imports: [
    FirebaseModule,
    GraphQLPubsubModule,
    N8nWebhookManagerModule.forFeature({
      imports: [GraphQLPubsubModule],
      subscriptions: [UserN8nSubscription],
    }),
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
