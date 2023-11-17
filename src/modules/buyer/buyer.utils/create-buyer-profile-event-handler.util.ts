import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';
import { BuyerProfileDB } from 'hero24-types';

import { BuyerProfileDto } from '../dto/buyer/buyer-profile.dto';
import { CustomerType } from '../dto/buyer/buyer-profile-data.dto';

export const createBuyerProfileEventHandler =
  (eventEmitter: (pubsub: PubSub, user: BuyerProfileDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }

    // TODO wait until types are updated
    const buyer: BuyerProfileDB & { data: { type: CustomerType } } =
      snapshot.val(); // TODO remove after hero24-types  updated

    eventEmitter(
      pubsub,
      BuyerProfileDto.adapter.toExternal({ ...buyer, id: snapshot.key }),
    );
  };
