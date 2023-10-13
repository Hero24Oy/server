import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { FirebaseAppInstance } from '../firebase/firebase.types';

import { BuyerService } from './buyer.service';
import { BuyerProfileDto } from './dto/buyer/buyer-profile.dto';
import { BuyerProfileCreationArgs } from './dto/creation/buyer-profile-creation.args';
import { BuyerProfileDataEditingArgs } from './dto/editing/buyer-profile-data-editing.args';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
export class BuyerResolver {
  constructor(private buyerService: BuyerService) {}

  @Query(() => BuyerProfileDto, { nullable: true })
  @UseGuards(AuthGuard)
  async buyer(@Args('id') buyerId: string): Promise<BuyerProfileDto | null> {
    return this.buyerService.getBuyerById(buyerId);
  }

  @Mutation(() => BuyerProfileDto)
  @UseGuards(AuthGuard)
  async createBuyer(
    @Args() args: BuyerProfileCreationArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<BuyerProfileDto> {
    return this.buyerService.createBuyer(args, app);
  }

  @Mutation(() => BuyerProfileDto)
  @UseGuards(AuthGuard)
  async editBuyer(
    @Args() args: BuyerProfileDataEditingArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<BuyerProfileDto> {
    return this.buyerService.editBuyer(args, app);
  }
}
