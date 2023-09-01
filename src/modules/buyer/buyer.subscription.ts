import { Inject, Injectable } from '@nestjs/common';
import { Reference } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';

import { createBuyerProfileUpdatedEventHandler } from './buyer.event-handler';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { SubscriptionService } from '../subscription-manager/subscription-manager.interface';

@Injectable()
export class BuyerProfileSubscription implements SubscriptionService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  public async subscribe(): Promise<() => Promise<void>> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();
    const rootFeesRef = database.ref(FirebaseDatabasePath.BUYER_PROFILES);

    const subscriptions = await Promise.all([
      this.subscribeOnBuyerProfileUpdates(rootFeesRef, this.pubSub),
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
