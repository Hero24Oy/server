import { Inject, Injectable } from '@nestjs/common';
import { PromotionDB } from 'hero24-types';
import { PubSub } from 'graphql-subscriptions';

import { FirebaseService } from 'src/modules/firebase/firebase.service';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';
import { FirebaseDatabasePath } from 'src/modules/firebase/firebase.constants';

import { PromotionDto } from '../dto/promotion/promotion.dto';
import { emitPromotionAddedEvent } from '../promotion.utils/emit-promotion-created-event.util';
import { emitPromotionUpdatedEvent } from '../promotion.utils/emit-promotion-updated-event.util';
import { emitPromotionRemovedEvent } from '../promotion.utils/emit-promotion-removed-event.util';

@Injectable()
export class PromotionService {
  constructor(
    private firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  async getPromotion(id: string): Promise<PromotionDto | null> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    const promotionSnapshot = await database
      .ref(FirebaseDatabasePath.PROMOTIONS)
      .child(id)
      .once('value');

    const promotion: PromotionDB | null = promotionSnapshot.val();

    return promotion && PromotionDto.adapter.toExternal({ ...promotion, id });
  }

  async strictGetPromotion(id: string): Promise<PromotionDto> {
    const promotion = await this.getPromotion(id);

    if (!promotion) {
      throw new Error(`Promotion with id ${id} not found`);
    }

    return promotion;
  }

  async getPromotions(): Promise<PromotionDto[]> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    const promotionsSnapshot = await database
      .ref(FirebaseDatabasePath.PROMOTIONS)
      .once('value');
    const promotions: PromotionDto[] = [];

    promotionsSnapshot.forEach((promotionSnapshot) => {
      if (promotionSnapshot.key) {
        promotions.push(
          PromotionDto.adapter.toExternal({
            ...promotionSnapshot.val(),
            id: promotionSnapshot.key,
          }),
        );
      }
    });

    return promotions;
  }

  async promotionAdded(promotion: PromotionDto): Promise<void> {
    emitPromotionAddedEvent(this.pubSub, promotion);
  }

  async promotionUpdated(promotion: PromotionDto): Promise<void> {
    emitPromotionUpdatedEvent(this.pubSub, promotion);
  }

  async promotionRemoved(promotion: PromotionDto): Promise<void> {
    emitPromotionRemovedEvent(this.pubSub, promotion);
  }
}
