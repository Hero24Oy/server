import { Inject, Injectable, Logger } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { OfferDB } from 'hero24-types';

import { OfferStatusInput } from '../dto/editing/offer-status.input';
import { OfferDto } from '../dto/offer/offer.dto';
import { OfferPurchaseInput } from '../dto/offer-purchase/offer-purchase.input';
import { OfferListDto } from '../dto/offers/offer-list.dto';
import { OfferArgs } from '../dto/offers/offers.args';
import { OfferOrderColumn } from '../dto/offers/offers-order.enum';
import { OfferMirror } from '../offer.mirror';
import { emitOfferUpdatedEvent } from '../offer.utils/emit-offer-updated-event.util';
import { filterOffers } from '../offer.utils/filter-offers.util';
import { hasMatchingRole } from '../offer.utils/has-matching-role.util';

import { FirebaseTableReference } from '$/modules/firebase/firebase.types';
import { Scope } from '$modules/auth/auth.constants';
import { Identity } from '$modules/auth/auth.types';
import { paginate, preparePaginatedResult } from '$modules/common/common.utils';
import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { PUBSUB_PROVIDER } from '$modules/graphql-pubsub/graphql-pubsub.constants';
import { SorterService } from '$modules/sorter/sorter.service';

@Injectable()
export class OfferService {
  private logger = new Logger(OfferService.name);

  readonly offerTableRef: FirebaseTableReference<OfferDB>;

  constructor(
    private offerSorter: SorterService<OfferOrderColumn, OfferDto, null>,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
    private readonly offerMirror: OfferMirror,
    firebaseService: FirebaseService,
  ) {
    const database = firebaseService.getDefaultApp().database();

    this.offerTableRef = database.ref(FirebaseDatabasePath.OFFERS);
  }

  async offerUpdated(offer: OfferDto): Promise<void> {
    emitOfferUpdatedEvent(this.pubSub, offer);
  }

  async getOfferById(offerId: string): Promise<OfferDto | null> {
    const snapshot = await this.offerTableRef.child(offerId).get();

    const offer = snapshot.val();

    return offer && OfferDto.adapter.toExternal({ id: offerId, ...offer });
  }

  async getOffersByInvoiceIds(paidInvoices: string[]): Promise<OfferDto[]> {
    const offers = await this.getAllOffers();

    return offers.filter((offer) =>
      paidInvoices.includes(offer.netvisorPurchaseInvoiceId ?? ''),
    );
  }

  async strictGetOfferById(offerId: string): Promise<OfferDto> {
    const offer = await this.getOfferById(offerId);

    if (!offer) {
      throw new Error(`Offer with id ${offerId} was not found`);
    }

    return offer;
  }

  async setHubSpotDealId(
    offerId: string,
    dealId: string | null,
  ): Promise<void> {
    await this.offerTableRef
      .child(offerId)
      .child('hubSpotDealId')
      // Todo: add support nulls to hero24-types
      .set(dealId as string);
  }

  async updateOfferStatus({
    offerId,
    status,
  }: OfferStatusInput): Promise<boolean> {
    await this.offerTableRef.child(offerId).child('status').set(status);

    return true;
  }

  async getAllOffers(): Promise<OfferDto[]> {
    return this.offerMirror
      .getAll()
      .map(([id, offer]) => ({ id, ...offer }))
      .reduce((resultOffers: OfferDto[], offer) => {
        try {
          // * in case data is corrupted, we we should handle it without crashing the app
          resultOffers.push(OfferDto.adapter.toExternal(offer));
        } catch (error) {
          this.logger.error(`Error while converting offer ${offer.id}`);
          this.logger.error(error);
        }

        return resultOffers;
      }, []);
  }

  async getOffers(args: OfferArgs, identity: Identity): Promise<OfferListDto> {
    const { limit, offset, filter, ordersBy = [], role } = args;

    const allOffers = await this.getAllOffers();

    // * if there are no ids provided, just push all offers (for admin panel)
    const shouldFetchAllOffers = !filter?.ids && identity.scope === Scope.ADMIN;

    let nodes: OfferDto[] = allOffers.filter((offer) => {
      if (shouldFetchAllOffers) {
        return true;
      }

      if (filter?.ids?.includes(offer.id)) {
        return true;
      }

      if (hasMatchingRole(offer, identity, role)) {
        return true;
      }

      return false;
    });

    nodes = filterOffers({ offers: nodes, filter });

    if (ordersBy) {
      nodes = this.offerSorter.sort(nodes, ordersBy, null);
    }

    const total = nodes.length;

    nodes = paginate({ nodes, limit, offset });

    return preparePaginatedResult({
      nodes,
      total,
      limit,
      offset,
    });
  }

  async updatePurchase(purchase: OfferPurchaseInput): Promise<true> {
    const { id } = purchase;

    const updatedInitial = OfferPurchaseInput.adapter.toInternal(purchase);

    try {
      await this.offerTableRef
        .child(id)
        .child('data')
        .child('initial')
        .child('purchase')
        .update(updatedInitial);
    } catch {
      throw new Error('Purchase update failed');
    }

    return true;
  }
}
