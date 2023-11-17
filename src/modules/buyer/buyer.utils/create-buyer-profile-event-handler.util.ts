import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';
import { BuyerProfileDB } from 'hero24-types';

import { BuyerProfileDto, CustomerType } from '../dto/buyer/buyer-profile.dto';

export const createBuyerProfileEventHandler =
  (eventEmitter: (pubsub: PubSub, user: BuyerProfileDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }

    // TODO wait until types are updated
    const buyer: BuyerProfileDB & { type: CustomerType } = snapshot.val(); // TODO remove when types are updated

    eventEmitter(
      pubsub,
      BuyerProfileDto.adapter.toExternal({ ...buyer, id: snapshot.key }),
    );
  };
