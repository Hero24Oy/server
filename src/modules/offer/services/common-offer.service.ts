import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { OfferDB } from 'hero24-types';
import { Identity } from 'src/modules/auth/auth.types';
import {
  paginate,
  preparePaginatedResult,
} from 'src/modules/common/common.utils';
import { FirebaseDatabasePath } from 'src/modules/firebase/firebase.constants';
import { FirebaseService } from 'src/modules/firebase/firebase.service';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';
import { SorterService } from 'src/modules/sorter/sorter.service';

import { OfferStatusInput } from '../dto/editing/offer-status.input';
import { OfferDto } from '../dto/offer/offer.dto';
import { OfferListDto } from '../dto/offers/offer-list.dto';
import { OfferOrderColumn } from '../dto/offers/offers-order.enum';
import { OfferArgs } from '../dto/offers/offers.args';
import { OFFER_UPDATED_SUBSCRIPTION } from '../offer.constants';
import { filterOffers } from '../offer.utils/filter-offers.util';

@Injectable()
export class CommonOfferService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private offerSorter: SorterService<OfferOrderColumn, OfferDto, null>,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  async offerUpdated(offer: OfferDto): Promise<void> {
    return this.pubSub.publish(OFFER_UPDATED_SUBSCRIPTION, {
      [OFFER_UPDATED_SUBSCRIPTION]: offer,
    });
  }

  async getOfferById(offerId: string): Promise<OfferDto | null> {
    const database = this.firebaseService.getDefaultApp().database();

    const snapshot = await database
      .ref(FirebaseDatabasePath.OFFERS)
      .child(offerId)
      .get();

    const offer: OfferDB | null = snapshot.val();

    return offer && OfferDto.adapter.toExternal({ id: offerId, ...offer });
  }

  async strictGetOfferById(offerId: string): Promise<OfferDto> {
    const offer = await this.getOfferById(offerId);

    if (!offer) {
      throw new Error(`Offer with id ${offerId} was not found`);
    }

    return offer;
  }

  async setHubSpotDealId(offerId: string, dealId: string | null) {
    const database = this.firebaseService.getDefaultApp().database();

    await database
      .ref(FirebaseDatabasePath.OFFERS)
      .child(offerId)
      .child('hubSpotDealId')
      .set(dealId);
  }

  async updateOfferStatus(
    offerId: string,
    input: OfferStatusInput,
  ): Promise<boolean> {
    console.log('input', input);
    console.log('offerId', offerId);
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    await offerRef.child('status').set(input.status);

    return true;
  }

  async startJob(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerDataRef = database
      .ref(FirebaseDatabasePath.OFFERS)
      .child(offerId)
      .child('data');

    const timestamp = Date.now();

    await offerDataRef.update({
      actualStartTime: timestamp,
      isPaused: false,
      workTime: [
        {
          startTime: timestamp,
          endTime: null,
        },
      ],
    });

    return true;
  }

  async getOffers(
    args: OfferArgs,
    identity: Identity,
    isBuyer = true,
  ): Promise<OfferListDto> {
    const database = this.firebaseService.getDefaultApp().database();
    const { limit, offset, filter, ordersBy = [] } = args;

    const offersSnapshot = await database
      .ref(FirebaseDatabasePath.OFFERS)
      .once('value');

    let nodes: OfferDto[] = [];

    // * if there are no ids provided, just push all offers (for admin panel)
    const shouldFetchAllOffers = !filter?.ids && identity.isAdmin;

    offersSnapshot.forEach((snapshot) => {
      if (!snapshot.key) {
        return;
      }

      const offer: OfferDB = snapshot.val();
      const offerConverted = OfferDto.adapter.toExternal({
        ...offer,
        id: snapshot.key,
      });

      if (shouldFetchAllOffers) {
        nodes.push(offerConverted);
        return;
      }

      if (filter?.ids?.includes(snapshot.key)) {
        nodes.push(offerConverted);
        return;
      }

      // fetch buyer offers by default
      if (
        isBuyer &&
        offerConverted.data.initial.buyerProfileId === identity.id
      ) {
        nodes.push(offerConverted);
        return;
      }

      if (
        !isBuyer &&
        offerConverted.data.initial.sellerProfileId === identity.id
      ) {
        nodes.push(offerConverted);
        return;
      }
    });

    // * we don't need to filter by id, as we did it in forEach loop above
    nodes = filterOffers({ offers: nodes, filter });
    nodes = this.offerSorter.sort(nodes, ordersBy, null);

    const total = nodes.length;
    nodes = paginate({ nodes, limit, offset });

    return preparePaginatedResult({
      nodes,
      total,
      limit,
      offset,
    });
  }
}
