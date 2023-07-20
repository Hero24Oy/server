import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';
import { CategoriesDto } from './dto/categories.dto';

export const createCategoriesEventHandler =
  (eventEmitter: (pubsub: PubSub, categories: CategoriesDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }

    eventEmitter(pubsub, snapshot.val());
  };
