import { PubSub } from 'graphql-subscriptions';
import { FeeDB } from 'hero24-types';

import { FeeDto } from '../dto/fee/fee.dto';

import { FirebaseSnapshot } from '$/modules/firebase/firebase.types';

export const createFeeEventHandler =
  (eventEmitter: (pubsub: PubSub, fee: FeeDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: FirebaseSnapshot<FeeDB>): void => {
    const fee = snapshot.val();

    if (!snapshot.key || !fee) {
      return;
    }

    eventEmitter(
      pubsub,
      FeeDto.adapter.toExternal({ ...fee, id: snapshot.key }),
    );
  };
