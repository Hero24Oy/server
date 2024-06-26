import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AdminGuard } from '../auth/guards/admin.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';

import { SellerProfileCreationArgs } from './dto/creation/seller-profile-creation.args';
import { SellerProfileDataEditingArgs } from './dto/editing/seller-profile-data-editing.args';
import { SellerProfileDto } from './dto/seller/seller-profile.dto';
import { SellerProfileFilterInput } from './dto/seller/seller-profile-filter.input';
import { SellerProfileListDto } from './dto/sellers/seller-profile-list.dto';
import { SellersArgs } from './dto/sellers/sellers.args';
import { SELLER_PROFILE_UPDATED_SUBSCRIPTION } from './seller.constants';
import { SellerService } from './seller.service';
import { SellerProfileSubscriptionFilter } from './seller.utils/seller-subscription-filter.util';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
export class SellerResolver {
  constructor(
    private readonly sellerService: SellerService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  @Query(() => SellerProfileDto, { nullable: true })
  @UseGuards(AuthGuard)
  async seller(@Args('id') id: string): Promise<SellerProfileDto | null> {
    return this.sellerService.getSellerById(id);
  }

  @Query(() => SellerProfileListDto)
  @UseGuards(AuthGuard)
  async sellers(@Args() args: SellersArgs): Promise<SellerProfileListDto> {
    return this.sellerService.getSellers(args);
  }

  @Query(() => Boolean)
  @UseGuards(AuthGuard)
  async isSellerApproved(@Args('id') id: string): Promise<boolean> {
    return this.sellerService.isSellerApproved(id);
  }

  @Mutation(() => SellerProfileDto, { nullable: true })
  @UseGuards(AuthGuard)
  async createSeller(
    @Args() args: SellerProfileCreationArgs,
  ): Promise<SellerProfileDto | null> {
    return this.sellerService.createSeller(args);
  }

  @Mutation(() => SellerProfileDto, { nullable: true })
  @UseGuards(AuthGuard)
  async editSellerData(
    @Args() args: SellerProfileDataEditingArgs,
  ): Promise<SellerProfileDto | null> {
    return this.sellerService.editSellerData(args);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async attachCategoryToSeller(
    @Args('sellerId') sellerId: string,
    @Args('categoryId') categoryId: string,
  ): Promise<boolean> {
    return this.sellerService.attachCategoryToSeller(sellerId, categoryId);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async unattachCategoryFromSeller(
    @Args('sellerId') sellerId: string,
    @Args('categoryId') categoryId: string,
  ): Promise<boolean> {
    return this.sellerService.unattachCategoryFromSeller(sellerId, categoryId);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async removeReviewFromSeller(
    @Args('sellerId') sellerId: string,
    @Args('reviewId') reviewId: string,
  ): Promise<boolean> {
    return this.sellerService.removeReviewFromSeller(sellerId, reviewId);
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AdminGuard)
  async setIsSellerApproved(
    @Args('sellerId') sellerId: string,
    @Args('isApproved') isApproved: boolean,
  ): Promise<boolean> {
    return this.sellerService.setIsSellerApproved(sellerId, isApproved);
  }

  @Subscription(() => SellerProfileDto, {
    name: SELLER_PROFILE_UPDATED_SUBSCRIPTION,
    filter: SellerProfileSubscriptionFilter(
      SELLER_PROFILE_UPDATED_SUBSCRIPTION,
    ),
  })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  subscribeOnSellerProfileUpdate(
    @Args('filter') _filter: SellerProfileFilterInput,
  ): AsyncIterator<unknown> {
    return this.pubSub.asyncIterator(SELLER_PROFILE_UPDATED_SUBSCRIPTION);
  }
}
