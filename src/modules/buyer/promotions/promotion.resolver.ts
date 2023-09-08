import { Inject, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

import { PromotionService } from './promotion.service';
import {
  PROMOTION_ADDED_SUBSCRIPTION,
  PROMOTION_REMOVED_SUBSCRIPTION,
  PROMOTION_UPDATED_SUBSCRIPTION,
} from './promotion.constants';
import { PromotionEditingInput } from './dto/promotion-editing.input';
import { PromotionDto } from './dto/promotion.dto';
import { PromotionCreationInput } from './dto/promotion-creation.input';

// TODO move to module folder
// TODO separate for admin
@Resolver()
export class PromotionResolver {
  constructor(
    private readonly promotionService: PromotionService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  // TODO rename resolvers
  @Query(() => PromotionDto, { nullable: true })
  @UseGuards(AuthGuard)
  getPromotion(@Args('id') promotionId: string): Promise<PromotionDto | null> {
    return this.promotionService.getPromotion(promotionId);
  }

  @Query(() => [PromotionDto], { nullable: true })
  @UseGuards(AuthGuard)
  getPromotions(): Promise<PromotionDto[]> {
    return this.promotionService.getPromotions();
  }

  @Mutation(() => PromotionDto)
  @UseGuards(AdminGuard)
  createPromotion(
    @Args('input') input: PromotionCreationInput,
  ): Promise<PromotionDto> {
    return this.promotionService.createPromotion(input);
  }

  @Mutation(() => PromotionDto)
  @UseGuards(AdminGuard)
  editPromotion(
    @Args('input') input: PromotionEditingInput,
  ): Promise<PromotionDto> {
    return this.promotionService.updatePromotion(input);
  }

  @Mutation(() => Boolean)
  @UseGuards(AdminGuard)
  removePromotion(@Args('id') promotionId: string): Promise<boolean> {
    return this.promotionService.deletePromotion(promotionId);
  }

  @Subscription(() => PromotionDto, {
    name: PROMOTION_ADDED_SUBSCRIPTION,
  })
  @UseGuards(AuthGuard)
  promotionAdded() {
    return this.pubSub.asyncIterator(PROMOTION_ADDED_SUBSCRIPTION);
  }

  @Subscription(() => PromotionDto, {
    name: PROMOTION_UPDATED_SUBSCRIPTION,
  })
  @UseGuards(AuthGuard)
  promotionUpdated() {
    return this.pubSub.asyncIterator(PROMOTION_UPDATED_SUBSCRIPTION);
  }

  @Subscription(() => PromotionDto, {
    name: PROMOTION_REMOVED_SUBSCRIPTION,
  })
  @UseGuards(AuthGuard)
  promotionRemoved() {
    return this.pubSub.asyncIterator(PROMOTION_REMOVED_SUBSCRIPTION);
  }
}
