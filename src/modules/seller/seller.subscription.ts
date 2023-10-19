import { Inject, Injectable } from '@nestjs/common';
import { Reference } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';

import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { SubscriptionService } from '../subscription-manager/subscription-manager.types';

import { createBuyerProfileUpdatedEventHandler } from './review.event-handler';
import { SellerService } from './seller.service';

@Injectable()
export class SellerProfileSubscription implements SubscriptionService {
  constructor(
    private readonly sellerService: SellerService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  public async subscribe(): Promise<() => Promise<void>> {
    const subscriptions = await Promise.all([
      this.subscribeOnSellerProfileUpdates(
        this.sellerService.sellerTableRef,
        this.pubSub,
      ),
    ]);

    return async () => {
      await Promise.all(subscriptions.map((unsubscribe) => unsubscribe()));
    };
  }

  private async subscribeOnSellerProfileUpdates(
    rootFeesRef: Reference,
    pubsub: PubSub,
  ): Promise<() => void> {
    return subscribeOnFirebaseEvent(
      rootFeesRef,
      'child_changed',
      createBuyerProfileUpdatedEventHandler(pubsub),
    );
  }
}
