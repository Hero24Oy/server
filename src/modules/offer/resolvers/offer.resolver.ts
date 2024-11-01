import {
  Inject,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AdminGuard } from '../../auth/guards/admin.guard';
import { OfferIdInput } from '../dto/editing/offer-id.input';
import { OfferDto } from '../dto/offer/offer.dto';
import { OfferPurchaseArgs } from '../dto/offer-purchase/offer-purchase.args';
import { OfferListDto } from '../dto/offers/offer-list.dto';
import { OfferArgs } from '../dto/offers/offers.args';
import { OfferSubscriptionInput } from '../dto/offers/offers-subsribption.input';
import { OFFER_UPDATED_SUBSCRIPTION } from '../offer.constants';
import { hasMatchingRole } from '../offer.utils/has-matching-role.util';
import { OfferService } from '../services/offer.service';

import { AppGraphQlContext } from '$/app.types';
import { Scope } from '$modules/auth/auth.constants';
import { AuthIdentity } from '$modules/auth/auth.decorator';
import { Identity } from '$modules/auth/auth.types';
import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from '$modules/graphql-pubsub/graphql-pubsub.constants';

@UseGuards(AuthGuard)
@UseFilters(FirebaseExceptionFilter)
@Resolver()
export class OfferResolver {
  constructor(
    private readonly offerService: OfferService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  @Query(() => OfferListDto)
  offers(
    @AuthIdentity() identity: Identity,
    @Args('input') input: OfferArgs,
  ): Promise<OfferListDto> {
    if (!input.role && identity.scope === Scope.USER) {
      throw new UnauthorizedException();
    }

    return this.offerService.getOffers(input, identity);
  }

  @Query(() => OfferDto)
  offer(@Args('input') { offerId }: OfferIdInput): Promise<OfferDto> {
    return this.offerService.strictGetOfferById(offerId);
  }

  @Subscription(() => OfferDto, {
    name: OFFER_UPDATED_SUBSCRIPTION,
    filter: (
      payload: { [OFFER_UPDATED_SUBSCRIPTION]: OfferDto },
      variables: { input: OfferSubscriptionInput },
      { identity }: AppGraphQlContext,
    ) => {
      // ? what if provided offerId is not related to the user
      // if ids are provided, filter by them
      if (variables.input.offerIds) {
        return variables.input.offerIds.includes(
          payload[OFFER_UPDATED_SUBSCRIPTION].id,
        );
      }

      if (identity?.scope === Scope.ADMIN) {
        return true;
      }

      return hasMatchingRole(
        payload[OFFER_UPDATED_SUBSCRIPTION],
        identity,
        variables.input.role,
      );
    },
  })
  subscribeOnOfferUpdated(
    @AuthIdentity() { scope }: Identity,
    @Args('input') input: OfferSubscriptionInput,
  ) {
    if (!input.role && scope === Scope.USER) {
      throw new UnauthorizedException();
    }

    return this.pubSub.asyncIterator(OFFER_UPDATED_SUBSCRIPTION);
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AdminGuard)
  async updateOfferPurchase(
    @Args() { input }: OfferPurchaseArgs,
  ): Promise<boolean> {
    await this.offerService.updatePurchase(input);

    return true;
  }
}
