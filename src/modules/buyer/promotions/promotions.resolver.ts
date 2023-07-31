import { Args, Query, Resolver } from '@nestjs/graphql';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';
import { PromotionsService } from './promotions.service';
import { PubSub } from 'graphql-subscriptions';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { PromotionDto } from './dto/promotion.dto';
import { Inject, UseGuards } from '@nestjs/common';

@Resolver()
export class PromotionsResolver {
  constructor(
    private promotionsService: PromotionsService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Query(() => [PromotionDto], { nullable: true })
  async getPromotions(): Promise<PromotionDto[]> {
    let promotions = await this.promotionsService.getPromotions();
    return promotions;
  }
  
}
