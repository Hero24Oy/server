import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { FirebaseAppInstance } from '../firebase/firebase.types';
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
export class SellerResolver {
  constructor(
    private readonly sellerService: SellerService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  @Query(() => SellerProfileDto, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async seller(@Args('id') id: string): Promise<SellerProfileDto | null> {
    return this.sellerService.getSellerById(id);
  }

  @Query(() => SellerProfileListDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async sellers(
    @Args() args: SellersArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<SellerProfileListDto> {
    return this.sellerService.getSellers(args, app);
  }

  @Query(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async isSellerApproved(
    @Args('id') id: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<boolean> {
    return this.sellerService.isSellerApproved(id, app);
  }

  @Mutation(() => SellerProfileDto, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async createSeller(@Args() args: SellerProfileCreationArgs) {
    return this.sellerService.createSeller(args);
  }

  @Mutation(() => SellerProfileDto, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async editSellerData(@Args() args: SellerProfileDataEditingArgs) {
    return this.sellerService.editSellerData(args);
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async attachCategoryToSeller(
    @Args('sellerId') sellerId: string,
    @Args('categoryId') categoryId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ) {
    return this.sellerService.attachCategoryToSeller(sellerId, categoryId, app);
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async unattachCategoryFromSeller(
    @Args('sellerId') sellerId: string,
    @Args('categoryId') categoryId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ) {
    return this.sellerService.unattachCategoryFromSeller(
      sellerId,
      categoryId,
      app,
    );
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async removeReviewFromSeller(
    @Args('sellerId') sellerId: string,
    @Args('reviewId') reviewId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ) {
    return this.sellerService.removeReviewFromSeller(sellerId, reviewId, app);
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async setIsSellerApproved(
    @Args('sellerId') sellerId: string,
    @Args('isApproved') isApproved: boolean,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<boolean> {
    return this.sellerService.setIsSellerApproved(sellerId, isApproved, app);
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
  ) {
    return this.pubSub.asyncIterator(SELLER_PROFILE_UPDATED_SUBSCRIPTION);
  }
}
