import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';
import { CustomerProfile } from 'hero24-types';

import { BuyerProfileDto } from '../dto/buyer/buyer-profile.dto';

export const createBuyerProfileEventHandler =
  (eventEmitter: (pubsub: PubSub, user: BuyerProfileDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }

    const buyer: CustomerProfile = snapshot.val();

    eventEmitter(
      pubsub,
      BuyerProfileDto.adapter.toExternal({ ...buyer, id: snapshot.key }),
    );
  };
