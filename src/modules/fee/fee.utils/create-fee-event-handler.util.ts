import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';
import { FeeDB } from 'hero24-types';

import { FeeDto } from '../dto/fee/fee.dto';

export const createFeeEventHandler =
  (eventEmitter: (pubsub: PubSub, fee: FeeDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }

    const fees: FeeDB = snapshot.val();

    eventEmitter(
      pubsub,
      FeeDto.adapter.toExternal({ ...fees, id: snapshot.key }),
    );
  };
