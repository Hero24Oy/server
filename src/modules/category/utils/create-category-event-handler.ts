import { PubSub } from 'graphql-subscriptions';
import { CategoryDB } from 'hero24-types';

import { CategoryObject } from '../graphql';

import { FirebaseSnapshot } from '$modules/firebase/firebase.types';

export const createCategoriesEventHandler =
  (eventEmitter: (pubsub: PubSub, categories: CategoryObject) => void) =>
  (pubsub: PubSub) =>
  (snapshot: FirebaseSnapshot<CategoryDB>) => {
    const category = snapshot.val();

    if (!snapshot.key || !category) {
      return;
    }

    eventEmitter(
      pubsub,
      CategoryObject.adapter.toExternal({ ...category, id: snapshot.key }),
    );
  };
