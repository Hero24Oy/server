import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { OfferRequestService } from '../offer-request.service';

import {
  OPEN_OFFER_REQUEST_LIST_ITEM_ADDED,
  OPEN_OFFER_REQUEST_LIST_ITEM_REMOVED,
} from './open-offer-request.constants';

import { FirebaseReference } from '$/modules/firebase/firebase.types';
import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { PUBSUB_PROVIDER } from '$modules/graphql-pubsub/graphql-pubsub.constants';
import { createSubscriptionEventEmitter } from '$modules/graphql-pubsub/graphql-pubsub.utils';

type OfferRequestId = string;

@Injectable()
export class OpenOfferRequestService {
  readonly openOfferRequestTableRef: FirebaseReference<
    Record<OfferRequestId, boolean>
  >;

  constructor(
    private readonly offerRequestService: OfferRequestService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
    firebaseService: FirebaseService,
  ) {
    const database = firebaseService.getDefaultApp().database();

    this.openOfferRequestTableRef = database.ref(
      FirebaseDatabasePath.OPEN_OFFER_REQUESTS,
    );
  }

  private emitItemRemoved = createSubscriptionEventEmitter(
    OPEN_OFFER_REQUEST_LIST_ITEM_REMOVED,
  );

  private emitItemAdded = createSubscriptionEventEmitter(
    OPEN_OFFER_REQUEST_LIST_ITEM_ADDED,
  );

  public emitOpenOfferRequestListItemRemoved(id: string): void {
    this.emitItemRemoved(this.pubSub, id);
  }

  public async emitOpenOfferRequestListItemAdded(id: string): Promise<void> {
    const offerRequest =
      await this.offerRequestService.strictGetOfferRequestById(id);

    this.emitItemAdded(this.pubSub, offerRequest);
  }
}
