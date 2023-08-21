import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import {
  Inject,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { AppGraphQLContext } from 'src/app.types';
import { AuthIdentity } from 'src/modules/auth/auth.decorator';
import { Identity } from 'src/modules/auth/auth.types';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from 'src/modules/firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';

import { OfferDto } from '../dto/offer/offer.dto';
import { OfferListDto } from '../dto/offers/offer-list.dto';
import { OfferArgs } from '../dto/offers/offers.args';
import { OFFER_UPDATED_SUBSCRIPTION } from '../offer.constants';
import { OfferService } from '../services/offer.service';
import { hasMatchingRole } from '../offer.utils/has-matching-role.util';
import { OfferSubscriptionInput } from '../dto/offers/offers-subsribption.input';
import { Scope } from 'src/modules/auth/auth.constants';

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

  @Subscription(() => OfferDto, {
    name: OFFER_UPDATED_SUBSCRIPTION,
    filter: (
      payload: { [OFFER_UPDATED_SUBSCRIPTION]: OfferDto },
      variables: { input: OfferSubscriptionInput },
      { identity }: AppGraphQLContext,
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
}
