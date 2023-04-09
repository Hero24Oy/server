import { UseFilters } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { BuyerService } from './buyer.service';
import { BuyerProfileDto } from './dto/buyer/buyer-profile.dto';
import { BuyerProfileCreationArgs } from './dto/creation/buyer-profile-creation.args';
import { BuyerProfileDataEditingArgs } from './dto/editing/buyer-profile-data-editing.args';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';

@Resolver()
export class BuyerResolver {
  constructor(private buyerService: BuyerService) {}

  @Query(() => BuyerProfileDto, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  async buyer(
    @Args('id') buyerId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<BuyerProfileDto | null> {
    return this.buyerService.getBuyerById(buyerId, app);
  }

  @Mutation(() => BuyerProfileDto)
  @UseFilters(FirebaseExceptionFilter)
  async createBuyer(
    @Args() args: BuyerProfileCreationArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<BuyerProfileDto> {
    return this.buyerService.createBuyer(args, app);
  }

  @Mutation(() => BuyerProfileDto)
  @UseFilters(FirebaseExceptionFilter)
  async editBuyer(
    @Args() args: BuyerProfileDataEditingArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<BuyerProfileDto> {
    return this.buyerService.editBuyer(args, app);
  }
}
