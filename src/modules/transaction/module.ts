import { Module } from '@nestjs/common';

import { TransactionService } from './service';

import { FirebaseModule } from '$modules/firebase/firebase.module';
import { GraphQlPubsubModule } from '$modules/graphql-pubsub/graphql-pubsub.module';

@Module({
  imports: [FirebaseModule, GraphQlPubsubModule],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
