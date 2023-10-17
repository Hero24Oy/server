import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';

import { BUYER_PROFILE_UPDATED_SUBSCRIPTION } from './buyer.constants';
import { BuyerService } from './buyer.service';
import { BuyerProfileSubscriptionFilter } from './buyer.utils/buyer-subscription-filter.util';
import { BuyerProfileDto } from './dto/buyer/buyer-profile.dto';
import { BuyerProfileCreationArgs } from './dto/creation/buyer-profile-creation.args';
import { BuyerProfileDataEditingArgs } from './dto/editing/buyer-profile-data-editing.args';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
export class BuyerResolver {
  constructor(
    private readonly buyerService: BuyerService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  @Query(() => BuyerProfileDto, { nullable: true })
  @UseGuards(AuthGuard)
  async buyer(@Args('id') buyerId: string): Promise<BuyerProfileDto | null> {
    return this.buyerService.getBuyerById(buyerId);
  }

  @Mutation(() => BuyerProfileDto)
  @UseGuards(AuthGuard)
  async createBuyer(
    @Args() args: BuyerProfileCreationArgs,
  ): Promise<BuyerProfileDto> {
    return this.buyerService.createBuyer(args);
  }

  @Mutation(() => BuyerProfileDto)
  @UseGuards(AuthGuard)
  async editBuyer(
    @Args() args: BuyerProfileDataEditingArgs,
  ): Promise<BuyerProfileDto> {
    return this.buyerService.editBuyer(args);
  }

  @Subscription(() => BuyerProfileDto, {
    name: BUYER_PROFILE_UPDATED_SUBSCRIPTION,
    filter: BuyerProfileSubscriptionFilter(BUYER_PROFILE_UPDATED_SUBSCRIPTION),
  })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  subscribeOnUserUpdate(): AsyncIterator<unknown> {
    return this.pubSub.asyncIterator(BUYER_PROFILE_UPDATED_SUBSCRIPTION);
  }
}
