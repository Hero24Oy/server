import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { ReviewDB } from 'hero24-types';

import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import {
  SubscriptionService,
  Unsubscribe,
} from '../subscription-manager/subscription-manager.types';

import { createReviewCreationEventHandler } from './event-handler';
import { ReviewService } from './service';

import { skipFirst } from '$modules/common/common.utils';
import { FirebaseReference } from '$modules/firebase/firebase.types';

@Injectable()
export class ReviewSubscription implements SubscriptionService {
  constructor(
    private readonly reviewService: ReviewService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  public async subscribe(): Promise<Unsubscribe> {
    const { reviewTableRef } = this.reviewService;

    const unsubscribes = [
      await this.subscribeOnReviewCreation(reviewTableRef, this.pubSub),
    ];

    return async () => {
      await Promise.all(unsubscribes.map((unsubscribe) => unsubscribe()));
    };
  }

  private async subscribeOnReviewCreation(
    rootReviewRef: FirebaseReference<Record<string, ReviewDB>>,
    pubsub: PubSub,
  ): Promise<() => void> {
    return subscribeOnFirebaseEvent(
      // Firebase child added event calls on every exist item first, than on every creation event.
      // So we should skip every exists items using limit to last 1 so as not to retrieve all items
      rootReviewRef.limitToLast(1),
      'child_added',
      skipFirst(createReviewCreationEventHandler(pubsub)),
    );
  }
}
