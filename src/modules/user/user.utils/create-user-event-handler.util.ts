import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';
import { UserDB } from 'hero24-types';

import { UserDto } from '../dto/user/user.dto';

export const createUserEventHandler =
  (eventEmitter: (pubsub: PubSub, user: UserDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot): void => {
    if (!snapshot.key) {
      return;
    }

    const user: UserDB = snapshot.val();

    eventEmitter(
      pubsub,
      UserDto.adapter.toExternal({ ...user, id: snapshot.key }),
    );
  };
