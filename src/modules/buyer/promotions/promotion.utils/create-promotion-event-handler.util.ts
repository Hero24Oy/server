import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';
import { PromotionDto } from '../dto/promotion.dto';

export const createPromotionsEventHandler =
  (eventEmitter: (pubsub: PubSub, promotion: PromotionDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }
    eventEmitter(
      pubsub,
      PromotionDto.convertFromFirebaseType(snapshot.val(), snapshot.key),
    );
  };
