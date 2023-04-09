import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUBSUB_PROVIDER } from './graphql-pubsub.constants';

const PubSubProvider = {
  provide: PUBSUB_PROVIDER,
  useValue: new PubSub(),
};

@Module({
  providers: [PubSubProvider],
  exports: [PubSubProvider],
})
export class GraphqlPubsubModule {}
