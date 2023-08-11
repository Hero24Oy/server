import { Args, Query, Resolver, Mutation, Subscription } from '@nestjs/graphql';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';
import { PromotionService } from './promotion.service';
import { PubSub } from 'graphql-subscriptions';
import { PromotionDto } from './dto/promotion.dto';
import { Inject, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import {
  PROMOTION_ADDED_SUBSCRIPTION,
  PROMOTION_REMOVED_SUBSCRIPTION,
  PROMOTION_UPDATED_SUBSCRIPTION,
} from './promotion.constants';
import { PromotionEditingInput } from './dto/promotion-editing.input';
import { PromotionCreationInput } from './dto/promotion-creation.input';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@Resolver()
export class PromotionResolver {
  constructor(
    private promotionService: PromotionService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Query(() => PromotionDto, { nullable: true })
  @UseGuards(AuthGuard)
  async getPromotion(
    @Args('id') promotionId: string,
  ): Promise<PromotionDto | null> {
    return this.promotionService.getPromotion(promotionId);
  }

  @Query(() => [PromotionDto], { nullable: true })
  @UseGuards(AuthGuard)
  async getPromotions(): Promise<PromotionDto[]> {
    let promotions = await this.promotionService.getPromotions();
    return promotions;
  }

  @Mutation(() => PromotionDto)
  @UseGuards(AdminGuard)
  async createPromotion(
    @Args('input') input: PromotionCreationInput,
  ): Promise<PromotionDto> {
    return this.promotionService.createPromotion(input);
  }

  @Mutation(() => PromotionDto)
  @UseGuards(AdminGuard)
  async editPromotion(
    @Args('input') input: PromotionEditingInput,
  ): Promise<PromotionDto> {
    return this.promotionService.updatePromotion(input);
  }

  @Mutation(() => Boolean)
  @UseGuards(AdminGuard)
  async removePromotion(@Args('id') promotionId: string): Promise<boolean> {
    await this.promotionService.deletePromotion(promotionId);

    return true;
  }

  @Subscription(() => PromotionDto, {
    name: PROMOTION_ADDED_SUBSCRIPTION,
  })
  @UseGuards(AuthGuard)
  async promotionAdded() {
    return this.pubSub.asyncIterator(PROMOTION_ADDED_SUBSCRIPTION);
  }

  @Subscription(() => PromotionDto, {
    name: PROMOTION_UPDATED_SUBSCRIPTION,
  })
  @UseGuards(AuthGuard)
  async promotionUpdated() {
    return this.pubSub.asyncIterator(PROMOTION_UPDATED_SUBSCRIPTION);
  }

  @Subscription(() => PromotionDto, {
    name: PROMOTION_REMOVED_SUBSCRIPTION,
  })
  @UseGuards(AuthGuard)
  async promotionRemoved() {
    return this.pubSub.asyncIterator(PROMOTION_REMOVED_SUBSCRIPTION);
  }
}
