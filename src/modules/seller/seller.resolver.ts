import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { SellerProfileCreationArgs } from './dto/creation/seller-profile-creation.args';
import { SellerProfileDataEditingArgs } from './dto/editing/seller-profile-data-editing.args';
import { SellerProfileDto } from './dto/seller/seller-profile.dto';
import { SellerProfilesDto } from './dto/sellers/seller-profiles.dto';
import { SellersArgs } from './dto/sellers/sellers.args';

import { SellerService } from './seller.service';

@Resolver()
export class SellerResolver {
  constructor(private sellerService: SellerService) {}

  @Query(() => SellerProfileDto, { nullable: true })
  async seller(
    @Args('id') sellerId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<SellerProfileDto | null> {
    return this.sellerService.getSellerById(sellerId, app);
  }

  @Query(() => SellerProfilesDto)
  async sellers(
    @Args() args: SellersArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<SellerProfilesDto> {
    return this.sellerService.getSellers(args, app);
  }

  @Query(() => Boolean)
  async isSellerApproved(
    @Args('id') id: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<boolean> {
    return this.sellerService.isSellerApproved(id, app);
  }

  @Mutation(() => SellerProfileDto, { nullable: true })
  async createSeller(
    @Args() args: SellerProfileCreationArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ) {
    return this.sellerService.createSeller(args, app);
  }

  @Mutation(() => SellerProfileDto, { nullable: true })
  async editSellerData(
    @Args() args: SellerProfileDataEditingArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ) {
    return this.sellerService.editSellerData(args, app);
  }

  @Mutation(() => Boolean)
  async attachCategoryToSeller(
    @Args('sellerId') sellerId: string,
    @Args('categoryId') categoryId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ) {
    return this.sellerService.attachCategoryToSeller(sellerId, categoryId, app);
  }

  @Mutation(() => Boolean)
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
  async removeReviewFromSeller(
    @Args('sellerId') sellerId: string,
    @Args('reviewId') reviewId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ) {
    return this.sellerService.removeReviewFromSeller(sellerId, reviewId, app);
  }

  @Mutation(() => Boolean)
  async setIsSellerApproved(
    @Args('sellerId') sellerId: string,
    @Args('isApproved') isApproved: boolean,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<boolean> {
    return this.sellerService.setIsSellerApproved(sellerId, isApproved, app);
  }
}
