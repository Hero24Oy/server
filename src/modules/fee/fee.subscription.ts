import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { FeeDB } from 'hero24-types';

import { skipFirst } from '../common/common.utils';
import { FirebaseReference } from '../firebase/firebase.types';
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

  public async subscribe(): Promise<Unsubscribe> {
    const { feeTableRef } = this.feeService;

    const unsubscribes = [
      await this.subscribeOnFeeUpdates(feeTableRef, this.pubSub),
      await this.subscribeOnFeeCreation(feeTableRef, this.pubSub),
    ];

    return async () => {
      await Promise.all(unsubscribes.map((unsubscribe) => unsubscribe()));
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
