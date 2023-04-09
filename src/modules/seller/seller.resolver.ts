import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { SellerProfileCreationArgs } from './dto/creation/seller-profile-creation.args';
import { SellerProfileDataEditingArgs } from './dto/editing/seller-profile-data-editing.args';
import { SellerProfileDto } from './dto/seller/seller-profile.dto';

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
}
