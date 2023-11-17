import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';

import { CustomerProfileDB } from '../customer.types';
import { BuyerProfileDto } from '../dto/buyer/buyer-profile.dto';

export const createBuyerProfileEventHandler =
  (eventEmitter: (pubsub: PubSub, user: BuyerProfileDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }

    const buyer: CustomerProfileDB = snapshot.val();

    eventEmitter(
      pubsub,
      BuyerProfileDto.adapter.toExternal({ ...buyer, id: snapshot.key }),
    );
  };
