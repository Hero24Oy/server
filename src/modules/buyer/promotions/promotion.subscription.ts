import { Inject, Injectable } from '@nestjs/common';
import { Reference } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';

import { skipFirst } from '../../common/common.utils';
import { PUBSUB_PROVIDER } from '../../graphql-pubsub/graphql-pubsub.constants';
import { FirebaseService } from '../../firebase/firebase.service';
import { FirebaseDatabasePath } from '../../firebase/firebase.constants';
import { subscribeOnFirebaseEvent } from '../../firebase/firebase.utils';
import { SubscriptionService } from '../../subscription-manager/subscription-manager.interface';
import {
  createPromotionsAddedEventHandler,
  createPromotionsRemovedEventHandler,
  createPromotionsUpdatedEventHandler,
} from './promotion.event-handler';

@Injectable()
export class PromotionSubscription implements SubscriptionService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  public async subscribe(): Promise<() => Promise<void>> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();
    const rootPromotionRef = database.ref(FirebaseDatabasePath.PROMOTIONS);

    const subscriptions = await Promise.all([
      this.subscribeOnPromotionUpdates(rootPromotionRef, this.pubSub),
      this.subscribeOnPromotionCreation(rootPromotionRef, this.pubSub),
      this.subscribeOnPromotionRemoved(rootPromotionRef, this.pubSub),
    ]);

    return async () => {
      await Promise.all(subscriptions.map((unsubscribe) => unsubscribe()));
    };
  }

  private async subscribeOnPromotionUpdates(
    rootPromotionRef: Reference,
    pubsub: PubSub,
  ) {
    return subscribeOnFirebaseEvent(
      rootPromotionRef,
      'child_changed',
      createPromotionsUpdatedEventHandler(pubsub),
    );
  }

  private async subscribeOnPromotionCreation(
    rootPromotionRef: Reference,
    pubsub: PubSub,
  ) {
    return subscribeOnFirebaseEvent(
      // Firebase child added event calls on every exist item first, than on every creation event.
      // So we should skip every exists items using limit to last 1 so as not to retrieve all items
      rootPromotionRef.limitToLast(1),
      'child_added',
      skipFirst(createPromotionsAddedEventHandler(pubsub)),
    );
  }

  private async subscribeOnPromotionRemoved(
    rootPromotionRef: Reference,
    pubsub: PubSub,
  ) {
    return subscribeOnFirebaseEvent(
      rootPromotionRef,
      'child_removed',
      createPromotionsRemovedEventHandler(pubsub),
    );
  }
}
