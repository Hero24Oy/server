import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { FirebaseAppInstance } from '../firebase/firebase.types';

import { SellerProfileCreationArgs } from './dto/creation/seller-profile-creation.args';
import { SellerProfileDataEditingArgs } from './dto/editing/seller-profile-data-editing.args';
import { SellerProfileDto } from './dto/seller/seller-profile.dto';
import { SellerProfileListDto } from './dto/sellers/seller-profile-list.dto';
import { SellersArgs } from './dto/sellers/sellers.args';
import { SellerService } from './seller.service';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
export class SellerResolver {
  constructor(private sellerService: SellerService) {}

  @Query(() => SellerProfileDto, { nullable: true })
  @UseGuards(AuthGuard)
  async seller(@Args('id') sellerId: string): Promise<SellerProfileDto | null> {
    return this.sellerService.getSellerById(sellerId);
  }

  @Query(() => SellerProfileListDto)
  @UseGuards(AuthGuard)
  async sellers(@Args() args: SellersArgs): Promise<SellerProfileListDto> {
    return this.sellerService.getSellers(args);
  }

  @Query(() => Boolean)
  @UseGuards(AuthGuard)
  async isSellerApproved(
    @Args('id') id: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<boolean> {
    return this.sellerService.isSellerApproved(id, app);
  }

  @Mutation(() => SellerProfileDto, { nullable: true })
  @UseGuards(AuthGuard)
  async createSeller(@Args() args: SellerProfileCreationArgs) {
    return this.sellerService.createSeller(args);
  }

  @Mutation(() => SellerProfileDto, { nullable: true })
  @UseGuards(AuthGuard)
  async editSellerData(@Args() args: SellerProfileDataEditingArgs) {
    return this.sellerService.editSellerData(args);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async attachCategoryToSeller(
    @Args('sellerId') sellerId: string,
    @Args('categoryId') categoryId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ) {
    return this.sellerService.attachCategoryToSeller(sellerId, categoryId, app);
  }

  @Mutation(() => Boolean)
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
  @UseGuards(AuthGuard)
  async removeReviewFromSeller(
    @Args('sellerId') sellerId: string,
    @Args('reviewId') reviewId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ) {
    return this.sellerService.removeReviewFromSeller(sellerId, reviewId, app);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async setIsSellerApproved(
    @Args('sellerId') sellerId: string,
    @Args('isApproved') isApproved: boolean,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<boolean> {
    return this.sellerService.setIsSellerApproved(sellerId, isApproved, app);
  }
}
