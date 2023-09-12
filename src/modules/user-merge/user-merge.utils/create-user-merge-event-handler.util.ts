import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';
import { UserMergeDB } from 'hero24-types';

import { UserMergeDto } from '../dto/user-merge/user-merge.dto';

export const createUserMergeEventHandler =
  (eventEmitter: (pubsub: PubSub, userMerge: UserMergeDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }

    const userMerge: UserMergeDB = snapshot.val();

    eventEmitter(pubsub, UserMergeDto.adapter.toExternal(userMerge));
  };
