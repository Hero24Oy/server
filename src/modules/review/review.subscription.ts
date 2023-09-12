import { Inject, Injectable } from '@nestjs/common';
import { Reference } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { SubscriptionService } from '../subscription-manager/subscription-manager.types';

import { createReviewUpdatedEventHandler } from './review.event-handler';

@Injectable()
export class ReviewSubscription implements SubscriptionService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  public async subscribe(): Promise<() => Promise<void>> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();
    const rootFeesRef = database.ref(FirebaseDatabasePath.REVIEWS);

    const subscriptions = await Promise.all([
      this.subscribeOnReviewUpdates(rootFeesRef, this.pubSub),
    ]);

    return async () => {
      await Promise.all(subscriptions.map((unsubscribe) => unsubscribe()));
    };
  }

  private async subscribeOnReviewUpdates(
    rootFeesRef: Reference,
    pubsub: PubSub,
  ) {
    return subscribeOnFirebaseEvent(
      rootFeesRef,
      'child_changed',
      createReviewUpdatedEventHandler(pubsub),
    );
  }
}
