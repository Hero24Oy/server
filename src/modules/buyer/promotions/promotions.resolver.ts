import { Args, Query, Resolver, Mutation, Subscription } from '@nestjs/graphql';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';
import { PromotionsService } from './promotions.service';
import { PubSub } from 'graphql-subscriptions';
import { PromotionDto } from './dto/promotion.dto';
import { Inject, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import {
  PROMOTIONS_ADDED_SUBSCRIPTION,
  PROMOTIONS_REMOVED_SUBSCRIPTION,
  PROMOTIONS_UPDATED_SUBSCRIPTION,
} from './promotions.constants';
import { PromotionEditingInput } from './dto/promotion-editing.input';
import { PromotionsCreationInput } from './dto/promotion-creation.args';

@Resolver()
export class PromotionsResolver {
  constructor(
    private promotionsService: PromotionsService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Query(() => PromotionDto, { nullable: true })
  async getPromotion(
    @Args('id') promotionId: string,
  ): Promise<PromotionDto | null> {
    return this.promotionsService.getPromotion(promotionId);
  }

  @Query(() => [PromotionDto], { nullable: true })
  async getPromotions(): Promise<PromotionDto[]> {
    let promotions = await this.promotionsService.getPromotions();
    return promotions;
  }

  @Mutation(() => PromotionDto)
  @UseGuards(AdminGuard)
  async createPromotion(
    @Args('input') input: PromotionsCreationInput,
  ): Promise<PromotionDto> {
    return this.promotionsService.createPromotion(input);
  }

  @Mutation(() => PromotionDto)
  @UseGuards(AdminGuard)
  async editPromotion(
    @Args('input') input: PromotionEditingInput,
  ): Promise<PromotionDto> {
    return this.promotionsService.updatePromotion(input);
  }

  @Mutation(() => Boolean)
  @UseGuards(AdminGuard)
  async removePromotion(@Args('id') PromotionId: string): Promise<boolean> {
    await this.promotionsService.deletePromotion(PromotionId);

    return true;
  }

  @Subscription(() => PromotionDto, {
    name: PROMOTIONS_ADDED_SUBSCRIPTION,
  })
  async promotionAdded() {
    return this.pubSub.asyncIterator(PROMOTIONS_ADDED_SUBSCRIPTION);
  }

  @Subscription(() => PromotionDto, {
    name: PROMOTIONS_UPDATED_SUBSCRIPTION,
  })
  async promotionUpdated() {
    return this.pubSub.asyncIterator(PROMOTIONS_UPDATED_SUBSCRIPTION);
  }

  @Subscription(() => PromotionDto, {
    name: PROMOTIONS_REMOVED_SUBSCRIPTION,
  })
  async promotionRemoved() {
    return this.pubSub.asyncIterator(PROMOTIONS_REMOVED_SUBSCRIPTION);
  }
}
