import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseFilters, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from 'src/modules/firebase/firebase.exception.filter';

import { OfferChangeInput } from '../dto/editing/offer-change.input';
import { OfferCompletedInput } from '../dto/editing/offer-completed.input';
import { OfferExtendInput } from '../dto/editing/offer-extend.input';
import { OfferStatusInput } from '../dto/editing/offer-status.input';
import { SellerOfferService } from '../services/seller-offer.service';
import { CommonOfferService } from '../services/common-offer.service';
import { OfferDto } from '../dto/offer/offer.dto';
import { OfferInput } from '../dto/creation/offer.input';
import { AcceptanceGuardInput } from '../dto/creation/acceptance-guard.input';
import { AuthIdentity } from 'src/modules/auth/auth.decorator';
import { Identity } from 'src/modules/auth/auth.types';
import { FirebaseApp } from 'src/modules/firebase/firebase.decorator';
import { FirebaseAppInstance } from 'src/modules/firebase/firebase.types';

@Resolver()
export class SellerOfferResolver {
  constructor(
    private readonly sellerOfferService: SellerOfferService,
    private readonly commonOfferService: CommonOfferService,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  markOfferAsSeenBySeller(@Args('offerId') offerId: string): Promise<boolean> {
    return this.sellerOfferService.markOfferAsSeenBySeller(offerId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  extendOfferDuration(
    @Args('offerId') offerId: string,
    @Args('input') input: OfferExtendInput,
  ): Promise<boolean> {
    return this.sellerOfferService.extendOfferDuration(offerId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  cancelRequestToExtend(@Args('offerId') offerId: string): Promise<boolean> {
    return this.sellerOfferService.cancelRequestToExtend(offerId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  markJobCompleted(
    @Args('offerId') offerId: string,
    @Args('input') input: OfferCompletedInput,
  ): Promise<boolean> {
    return this.sellerOfferService.markJobCompleted(offerId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  declineOfferChanges(@Args('offerId') offerId: string): Promise<boolean> {
    return this.sellerOfferService.declineOfferChanges(offerId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  startJob(@Args('offerId') offerId: string): Promise<boolean> {
    return this.sellerOfferService.startJob(offerId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  toggleJobStatus(@Args('offerId') offerId: string): Promise<boolean> {
    return this.sellerOfferService.toggleJobStatus(offerId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  updateOfferStatus(
    @Args('offerId') offerId: string,
    @Args('input') input: OfferStatusInput,
  ): Promise<boolean> {
    return this.commonOfferService.updateOfferStatus(offerId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  acceptOfferChanges(
    @Args('offerId') offerId: string,
    @Args('input') input: OfferChangeInput,
  ): Promise<boolean> {
    return this.sellerOfferService.acceptOfferChanges(offerId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => OfferDto)
  @UseFilters(FirebaseExceptionFilter)
  createOffer(@Args('input') offer: OfferInput): Promise<OfferDto> {
    return this.sellerOfferService.createOffer(offer);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  createAcceptanceGuard(
    @Args('input') acceptanceGuard: AcceptanceGuardInput,
  ): Promise<boolean> {
    return this.sellerOfferService.createAcceptanceGuard(acceptanceGuard);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  declineOfferRequest(
    @Args('offerRequestId') offerRequestId: string,
    @AuthIdentity() { id: sellerId }: Identity,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<boolean> {
    return this.sellerOfferService.declineOfferRequest(
      offerRequestId,
      sellerId,
      app,
    );
  }
}
