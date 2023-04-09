import { Args, Query, Resolver } from '@nestjs/graphql';
import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../firebase/firebase.types';
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
}
