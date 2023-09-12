import { Inject, Injectable } from '@nestjs/common';
import { Reference } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';

import { skipFirst } from '../common/common.utils';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { SubscriptionService } from '../subscription-manager/subscription-manager.interface';

import {
  createUserCreatedEventHandler,
  createUserUpdatedEventHandler,
} from './user.event-handler';

@Injectable()
export class UserSubscription implements SubscriptionService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  public async subscribe(): Promise<() => Promise<void>> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();
    const rootFeesRef = database.ref(FirebaseDatabasePath.USERS);

    const subscriptions = await Promise.all([
      this.subscribeOnUserUpdates(rootFeesRef, this.pubSub),
      this.subscribeOnUserCreation(rootFeesRef, this.pubSub),
    ]);

    return async () => {
      await Promise.all(subscriptions.map((unsubscribe) => unsubscribe()));
    };
  }

  private subscribeOnUserUpdates(rootFeesRef: Reference, pubsub: PubSub) {
    return subscribeOnFirebaseEvent(
      rootFeesRef,
      'child_changed',
      createUserUpdatedEventHandler(pubsub),
    );
  }

  private subscribeOnUserCreation(rootFeesRef: Reference, pubsub: PubSub) {
    return subscribeOnFirebaseEvent(
      // Firebase child added event calls on every exist item first, than on every creation event.
      // So we should skip every exists items using limit to last 1 so as not to retrieve all items
      rootFeesRef.limitToLast(1),
      'child_added',
      skipFirst(createUserCreatedEventHandler(pubsub)),
    );
  }
}
