import { Resolver, Subscription, Query, Args } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Inject, UseFilters, UseGuards } from '@nestjs/common';

import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from 'src/modules/firebase/firebase.exception.filter';
import { Identity } from 'src/modules/auth/auth.types';
import { AuthIdentity } from 'src/modules/auth/auth.decorator';
import { OfferRole } from 'src/modules/offer/dto/offer/offer-role.enum';

import { OfferRequestListDto } from '../dto/offer-request-list/offer-request-list.dto';
import { OpenOfferRequestListInput } from './dto/open-offer-request-list.input';
import { OfferRequestService } from '../offer-request.service';
import { OfferRequestStatus } from '../offer-request.constants';
import { OfferRequestDto } from '../dto/offer-request/offer-request.dto';
import {
  OPEN_OFFER_REQUEST_LIST_ITEM_ADDED,
  OPEN_OFFER_REQUEST_LIST_ITEM_REMOVED,
} from './open-offer-request.constants';

@Resolver()
@UseGuards(AuthGuard)
@UseFilters(FirebaseExceptionFilter)
export class OpenOfferRequestResolver {
  constructor(
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
    private readonly offerRequestService: OfferRequestService,
  ) {}

  @Query(() => OfferRequestListDto)
  openOfferRequestList(
    @Args('input') input: OpenOfferRequestListInput,
    @AuthIdentity() identity: Identity,
  ): Promise<OfferRequestListDto> {
    return this.offerRequestService.getOfferRequestList(
      {
        ...input,
        filter: {
          status: [OfferRequestStatus.OPEN],
        },
        role: OfferRole.SELLER,
      },
      identity,
    );
  }

  @Subscription(() => OfferRequestDto, {
    name: OPEN_OFFER_REQUEST_LIST_ITEM_ADDED,
  })
  subscribeToOpenOfferRequestListItemAdded() {
    return this.pubSub.asyncIterator(OPEN_OFFER_REQUEST_LIST_ITEM_ADDED);
  }

  @Subscription(() => String, {
    name: OPEN_OFFER_REQUEST_LIST_ITEM_REMOVED,
  })
  subscribeToOpenOfferRequestListItemRemoved() {
    return this.pubSub.asyncIterator(OPEN_OFFER_REQUEST_LIST_ITEM_REMOVED);
  }
}
