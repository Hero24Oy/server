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
import { CommonOfferService } from '../services/common-offer.service';
import { OfferRole } from '../dto/offer/offer-role.enum';
import { hasMatchingRole } from '../offer.utils/has-matching-role.util';

@Resolver()
export class CommonOfferResolver {
  constructor(
    private readonly commonOfferService: CommonOfferService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => OfferListDto)
  @UseFilters(FirebaseExceptionFilter)
  offers(
    @AuthIdentity() identity: Identity,
    @Args({ type: () => OfferArgs }) args: OfferArgs,
    @Args('role', {
      type: () => OfferRole,
      nullable: true,
    })
    role?: OfferRole,
  ): Promise<OfferListDto> {
    if (!role && !identity.isAdmin) {
      throw new UnauthorizedException();
    }

    return this.commonOfferService.getOffers(args, identity, role);
  }

  @UseGuards(AuthGuard)
  @Subscription(() => OfferDto, {
    name: OFFER_UPDATED_SUBSCRIPTION,
    filter: (
      payload: { [OFFER_UPDATED_SUBSCRIPTION]: OfferDto },
      variables: { offerIds: string[]; role: OfferRole },
      { identity }: AppGraphQLContext,
    ) => {
      // ? what if provided offerId is not related to the user
      // if ids are provided, filter by them
      if (variables.offerIds) {
        return variables.offerIds.includes(
          payload[OFFER_UPDATED_SUBSCRIPTION].id,
        );
      }

      if (identity?.isAdmin) {
        return true;
      }

      return hasMatchingRole(
        payload[OFFER_UPDATED_SUBSCRIPTION],
        identity,
        variables.role,
      );
    },
  })
  @UseFilters(FirebaseExceptionFilter)
  subscribeOnOfferUpdated(
    @AuthIdentity() { isAdmin }: Identity,
    @Args('offerIds', { type: () => [String], nullable: true })
    _offerIds?: string[],
    @Args('role', {
      type: () => OfferRole,
      nullable: true,
    })
    role?: OfferRole,
  ) {
    if (!role && !isAdmin) {
      throw new UnauthorizedException();
    }

    return this.pubSub.asyncIterator(OFFER_UPDATED_SUBSCRIPTION);
  }
}
