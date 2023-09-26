import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { FeeDB } from 'hero24-types';

import { skipFirst } from '../common/common.utils';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseReference } from '../firebase/firebase.types';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { SubscriptionService } from '../subscription-manager/subscription-manager.types';

import {
  createFeeCreatedEventHandler,
  createFeeUpdatedEventHandler,
} from './fee.event-handler';

@Injectable()
export class FeeSubscription implements SubscriptionService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  public async subscribe(): Promise<() => Promise<void>> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();
    const rootFeesRef = database.ref(FirebaseDatabasePath.FEES);

    const subscriptions = await Promise.all([
      this.subscribeOnFeeUpdates(rootFeesRef, this.pubSub),
      this.subscribeOnFeeCreation(rootFeesRef, this.pubSub),
    ]);

    return async () => {
      await Promise.all(subscriptions.map((unsubscribe) => unsubscribe()));
    };
  }

  private async subscribeOnFeeUpdates(
    rootFeesRef: FirebaseReference<Record<string, FeeDB>>,
    pubsub: PubSub,
  ) {
    return subscribeOnFirebaseEvent(
      rootFeesRef,
      'child_changed',
      createFeeUpdatedEventHandler(pubsub),
    );
  }

  private async subscribeOnFeeCreation(
    rootFeesRef: FirebaseReference<Record<string, FeeDB>>,
    pubsub: PubSub,
  ) {
    return subscribeOnFirebaseEvent(
      // Firebase child added event calls on every exist item first, than on every creation event.
      // So we should skip every exists items using limit to last 1 so as not to retrieve all items
      rootFeesRef.limitToLast(1),
      'child_added',
      skipFirst(createFeeCreatedEventHandler(pubsub)),
    );
  }
}
