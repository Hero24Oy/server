import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { N8nWebhookManagerModule } from '../n8n-webhook-manager/n8n-webhook-manager.module';
import { UserN8nSubscription } from './user.n8n-subscription';

@Module({
  imports: [
    FirebaseModule,
    N8nWebhookManagerModule.forFeature({
      imports: [FirebaseModule],
      subscriptions: [UserN8nSubscription],
    }),
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
