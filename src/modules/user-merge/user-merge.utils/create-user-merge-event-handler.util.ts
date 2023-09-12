import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';

import { UserMergeDto } from '../dto/user-merge/user-merge.dto';

export const createUserMergeEventHandler =
  (eventEmitter: (pubsub: PubSub, userMerge: UserMergeDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }

    eventEmitter(pubsub, UserMergeDto.adapter.toExternal(snapshot.val()));
  };
