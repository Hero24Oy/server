import { Inject, Injectable } from '@nestjs/common';
import { Reference } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';

import { skipFirst } from '../common/common.utils';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import {
  SubscriptionService,
  Unsubscribe,
} from '../subscription-manager/subscription-manager.types';

import {
  createFeeCreatedEventHandler,
  createFeeUpdatedEventHandler,
} from './fee.event-handler';
import { FeeService } from './fee.service';

@Injectable()
export class FeeSubscription implements SubscriptionService {
  constructor(
    private readonly feeService: FeeService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  public subscribe(): Unsubscribe {
    const { feeTableRef } = this.feeService;

    const unsubscribes = [
      this.subscribeOnFeeUpdates(feeTableRef, this.pubSub),
      this.subscribeOnFeeCreation(feeTableRef, this.pubSub),
    ];

    return async () => {
      await Promise.all(unsubscribes.map((unsubscribe) => unsubscribe()));
    };
  }

  private subscribeOnFeeUpdates(
    rootFeesRef: Reference,
    pubsub: PubSub,
  ): Unsubscribe {
    return subscribeOnFirebaseEvent(
      rootFeesRef,
      'child_changed',
      createFeeUpdatedEventHandler(pubsub),
    );
  }

  private subscribeOnFeeCreation(
    rootFeesRef: Reference,
    pubsub: PubSub,
  ): Unsubscribe {
    return subscribeOnFirebaseEvent(
      // Firebase child added event calls on every exist item first, than on every creation event.
      // So we should skip every exists items using limit to last 1 so as not to retrieve all items
      rootFeesRef.limitToLast(1),
      'child_added',
      skipFirst(createFeeCreatedEventHandler(pubsub)),
    );
  }
}
