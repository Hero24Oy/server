import { PromotionDB } from 'hero24-types';
import { DataSnapshot } from 'firebase-admin/database';

import { PromotionDto } from '../dto/promotion/promotion.dto';

export const createPromotionsEventHandler =
  (eventEmitter: (promotion: PromotionDto) => void) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }

    const firebasePromotion: PromotionDB = snapshot.val();

    eventEmitter(
      PromotionDto.adapter.toExternal({
        ...firebasePromotion,
        id: snapshot.key,
      }),
    );
  };
