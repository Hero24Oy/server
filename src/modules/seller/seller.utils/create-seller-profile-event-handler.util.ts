import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';
import { SellerProfileDB } from 'hero24-types';

import { SellerProfileDto } from '../dto/seller/seller-profile.dto';

export const createReviewEventHandler =
  (eventEmitter: (pubsub: PubSub, seller: SellerProfileDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }

    const sellerProfileDB: SellerProfileDB = snapshot.val();

    eventEmitter(
      pubsub,
      SellerProfileDto.adapter.toExternal({
        ...sellerProfileDB,
        id: snapshot.key,
      }),
    );
  };
