import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';
import { CategoryDto } from './dto/category.dto';

export const createCategoriesEventHandler =
  (eventEmitter: (pubsub: PubSub, categories: CategoryDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }
    console.log('createCategoriesEventHandler', snapshot.val());
    eventEmitter(pubsub, snapshot.val());
  };
