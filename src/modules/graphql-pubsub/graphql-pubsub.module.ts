import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { PUBSUB_PROVIDER } from './graphql-pubsub.constants';

const pubSubProvider = {
  provide: PUBSUB_PROVIDER,
  useValue: new PubSub(),
};

@Module({
  providers: [pubSubProvider],
  exports: [pubSubProvider],
})
export class GraphQlPubsubModule {}
