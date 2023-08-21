import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { OfferRequestCreationArgs } from './dto/creation/offer-request-creation.args';
import { OfferRequestDto } from './dto/offer-request/offer-request.dto';
import { OfferRequestPurchaseArgs } from './dto/offer-request-purchase/offer-request-purchase.args';
import { OfferRequestService } from './offer-request.service';

import { AdminGuard } from '../auth/guards/admin.guard';
import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';

@Resolver()
export class OfferRequestResolver {
  constructor(private offerRequestService: OfferRequestService) {}

  @Query(() => OfferRequestDto, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  async offerRequest(
    @Args('id') offerRequestId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<OfferRequestDto | null> {
    return this.offerRequestService.getOfferRequestById(offerRequestId, app);
  }

  @Mutation(() => OfferRequestDto)
  @UseFilters(FirebaseExceptionFilter)
  async createOfferRequest(
    @Args() args: OfferRequestCreationArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<OfferRequestDto> {
    return this.offerRequestService.createOfferRequest(args, app);
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AdminGuard)
  async updateOfferRequestPurchase(
    @Args() { input }: OfferRequestPurchaseArgs,
  ): Promise<true> {
    return this.offerRequestService.updatePurchase(input);
  }
}
