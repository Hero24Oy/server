import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';

import { NewsDto } from '../dto/news/news.dto';

export const createNewsEventHandler =
  (eventEmitter: (pubsub: PubSub, news: NewsDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }

    eventEmitter(
      pubsub,
      NewsDto.convertFromFirebaseType(snapshot.val(), snapshot.key),
    );
  };
