import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { OfferRequestCreationArgs } from './dto/creation/offer-request-creation.args';
import { OfferRequestDto } from './dto/offer-request/offer-request.dto';
import { OfferRequestService } from './offer-request.service';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { OfferRequestListDto } from './dto/offer-request-list/offer-request-list.dto';
import { OfferRequestListArgs } from './dto/offer-request-list/offer-request-list.args';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AppIdentity } from '../auth/auth.decorator';
import { Identity } from '../auth/auth.types';

@Resolver()
export class OfferRequestResolver {
  constructor(private offerRequestService: OfferRequestService) {}

  @Query(() => OfferRequestDto, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async offerRequest(
    @Args('id') offerRequestId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<OfferRequestDto | null> {
    return this.offerRequestService.getOfferRequestById(offerRequestId, app);
  }

  @Query(() => OfferRequestListDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async offerRequestList(
    @Args() args: OfferRequestListArgs,
    @AppIdentity() identity: Identity,
  ) {
    return this.offerRequestService.getOfferRequestList(args, identity);
  }

  @Mutation(() => OfferRequestDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async createOfferRequest(
    @Args() args: OfferRequestCreationArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<OfferRequestDto> {
    return this.offerRequestService.createOfferRequest(args, app);
  }
}
