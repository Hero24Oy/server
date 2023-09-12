import { Inject, Injectable } from '@nestjs/common';
import { Reference } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { SubscriptionService } from '../subscription-manager/subscription-manager.interface';

import { createBuyerProfileUpdatedEventHandler } from './buyer.event-handler';

@Injectable()
export class BuyerProfileSubscription implements SubscriptionService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  public async subscribe(): Promise<() => Promise<void>> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    const rootBuyerProfileRef = database.ref(
      FirebaseDatabasePath.BUYER_PROFILES,
    );

    const subscriptions = await Promise.all([
      this.subscribeOnBuyerProfileUpdates(rootBuyerProfileRef, this.pubSub),
    ]);

    return async () => {
      await Promise.all(subscriptions.map((unsubscribe) => unsubscribe()));
    };
  }

  private async subscribeOnBuyerProfileUpdates(
    rootFeesRef: Reference,
    pubsub: PubSub,
  ) {
    return subscribeOnFirebaseEvent(
      rootFeesRef,
      'child_changed',
      createBuyerProfileUpdatedEventHandler(pubsub),
    );
  }
}
