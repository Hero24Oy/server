import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';
import { NewsDB } from 'hero24-types';

import { NewsDto } from '../dto/news/news.dto';

export const createNewsEventHandler =
  (eventEmitter: (pubsub: PubSub, news: NewsDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }

    const news: NewsDB = snapshot.val();

    eventEmitter(pubsub, NewsDto.convertFromFirebaseType(news, snapshot.key));
  };
