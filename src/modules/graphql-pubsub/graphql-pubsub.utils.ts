import { PubSub } from 'graphql-subscriptions';

export const createSubscriptionEventEmitter =
  (subscriptionName: string, triggerName = subscriptionName) =>
  <T>(pubsub: PubSub, data: T) => {
    pubsub.publish(triggerName, {
      [subscriptionName]: data,
    });
  };
