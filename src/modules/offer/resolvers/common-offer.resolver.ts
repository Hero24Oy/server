import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Inject, UseFilters, UseGuards } from '@nestjs/common';
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
import { OfferService } from '../offer.service';

@Resolver()
export class CommonOfferResolver {
  constructor(
    private readonly offerService: OfferService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  @UseGuards(AuthGuard)
  @Subscription(() => OfferDto, {
    name: OFFER_UPDATED_SUBSCRIPTION,
    filter: (
      payload: { [OFFER_UPDATED_SUBSCRIPTION]: OfferDto },
      variables: { offerIds: string[]; isBuyer: boolean },
      { identity }: AppGraphQLContext,
    ) => {
      // if ids are provided, filter by them
      if (variables.offerIds) {
        return variables.offerIds.includes(
          payload[OFFER_UPDATED_SUBSCRIPTION].id,
        );
      }

      if (identity?.isAdmin) {
        return true;
      }

      const { buyerProfileId, sellerProfileId } =
        payload[OFFER_UPDATED_SUBSCRIPTION].data.initial;

      if (variables.isBuyer) {
        return buyerProfileId === identity?.id;
      } else {
        return sellerProfileId === identity?.id;
      }
    },
  })
  @UseFilters(FirebaseExceptionFilter)
  subscribeOnOfferUpdated(
    @Args('offerIds', { type: () => [String], nullable: true })
    _offerIds: string[],
    @Args('isBuyer', { nullable: true })
    _isBuyer: boolean,
    @AuthIdentity() _identity: Identity,
  ) {
    return this.pubSub.asyncIterator(OFFER_UPDATED_SUBSCRIPTION);
  }

  @UseGuards(AuthGuard)
  @Query(() => OfferListDto)
  @UseFilters(FirebaseExceptionFilter)
  offers(
    @AuthIdentity() identity: Identity,
    @Args({ type: () => OfferArgs }) args: OfferArgs,
    @Args('isBuyer', { nullable: true, defaultValue: true }) isBuyer: boolean,
  ): Promise<OfferListDto> {
    return this.offerService.getOffers(args, identity, isBuyer);
  }
}
