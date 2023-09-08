import { Inject, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

import { PromotionDto } from '../dto/promotion/promotion.dto';
import {
  PROMOTION_ADDED_SUBSCRIPTION,
  PROMOTION_UPDATED_SUBSCRIPTION,
  PROMOTION_REMOVED_SUBSCRIPTION,
} from '../promotion.constants';
import { PromotionService } from '../services/promotion.service';

@UseGuards(AuthGuard)
@Resolver()
export class PromotionResolver {
  constructor(
    private readonly promotionService: PromotionService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  @Query(() => PromotionDto, { nullable: true })
  promotion(@Args('id') id: string): Promise<PromotionDto | null> {
    return this.promotionService.getPromotion(id);
  }

  @Query(() => [PromotionDto], { nullable: true })
  promotions(): Promise<PromotionDto[]> {
    return this.promotionService.getPromotions();
  }

  @Subscription(() => PromotionDto, {
    name: PROMOTION_ADDED_SUBSCRIPTION,
  })
  promotionAdded() {
    return this.pubSub.asyncIterator(PROMOTION_ADDED_SUBSCRIPTION);
  }

  @Subscription(() => PromotionDto, {
    name: PROMOTION_UPDATED_SUBSCRIPTION,
  })
  promotionUpdated() {
    return this.pubSub.asyncIterator(PROMOTION_UPDATED_SUBSCRIPTION);
  }

  @Subscription(() => PromotionDto, {
    name: PROMOTION_REMOVED_SUBSCRIPTION,
  })
  promotionRemoved() {
    return this.pubSub.asyncIterator(PROMOTION_REMOVED_SUBSCRIPTION);
  }
}
