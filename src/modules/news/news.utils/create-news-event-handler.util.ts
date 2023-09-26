import { PubSub } from 'graphql-subscriptions';
import { NewsDB } from 'hero24-types';

import { NewsDto } from '../dto/news/news.dto';

import { FirebaseSnapshot } from '$/modules/firebase/firebase.types';

export const createNewsEventHandler =
  (eventEmitter: (pubsub: PubSub, news: NewsDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: FirebaseSnapshot<NewsDB>): void => {
    const news = snapshot.val();

    if (!snapshot.key || !news) {
      return;
    }

    eventEmitter(pubsub, NewsDto.convertFromFirebaseType(news, snapshot.key));
  };
