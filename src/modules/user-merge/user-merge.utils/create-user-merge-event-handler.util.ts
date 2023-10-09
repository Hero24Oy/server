import { PubSub } from 'graphql-subscriptions';
import { UserMergeDB } from 'hero24-types';

import { UserMergeDto } from '../dto/user-merge/user-merge.dto';

import { FirebaseSnapshot } from '$/modules/firebase/firebase.types';

export const createUserMergeEventHandler =
  (eventEmitter: (pubsub: PubSub, userMerge: UserMergeDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: FirebaseSnapshot<UserMergeDB>) => {
    const userMerge = snapshot.val();

    if (!snapshot.key || !userMerge) {
      return;
    }

    eventEmitter(pubsub, UserMergeDto.adapter.toExternal(userMerge));
  };
