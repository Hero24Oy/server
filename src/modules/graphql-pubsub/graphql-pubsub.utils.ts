import { PubSub } from 'graphql-subscriptions';

export const createSubscriptionEventEmitter =
  (subscriptionName: string, triggerName = subscriptionName) =>
  <Type>(pubsub: PubSub, data: Type) => {
    void pubsub.publish(triggerName, {
      [subscriptionName]: data,
    });
  };

type SubscribeToEventArgs<Data> = {
  eventHandler: (data: Data) => void;
  pubSub: PubSub;
  triggerName: string;
  subscriptionName?: string;
};

export const subscribeToEvent = async <Data>(
  args: SubscribeToEventArgs<Data>,
) => {
  const {
    eventHandler,
    pubSub,
    triggerName,
    subscriptionName = triggerName,
  } = args;

  const subscriptionId = await pubSub.subscribe(
    triggerName,
    (message: Record<typeof subscriptionName, Data>) =>
      eventHandler(message[subscriptionName]),
  );

  return () => pubSub.unsubscribe(subscriptionId);
};
