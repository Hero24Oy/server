import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { UserMergeDB } from 'hero24-types';

import { skipFirst } from '../common/common.utils';
import { FirebaseReference } from '../firebase/firebase.types';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import {
  SubscriptionService,
  Unsubscribe,
} from '../subscription-manager/subscription-manager.types';

import {
  createUserMergeAddedEventHandler,
  createUserMergeUpdatedEventHandler,
} from './user-merge.event-handlers';
import { UserMergeService } from './user-merge.service';

@Injectable()
export class UserMergeSubscription implements SubscriptionService {
  constructor(
    private readonly userMergeService: UserMergeService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  public subscribe(): Unsubscribe {
    const { userMergeTableRef } = this.userMergeService;

    const unsubscribes = [
      this.subscribeOnUserMergeUpdates(userMergeTableRef, this.pubSub),
      this.subscribeOnUserMergeAdding(userMergeTableRef, this.pubSub),
    ];

    return (): void => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }

  private subscribeOnUserMergeUpdates(
    rootUserMergeRef: FirebaseReference<Record<string, UserMergeDB>>,
    pubsub: PubSub,
  ): () => void {
    return subscribeOnFirebaseEvent(
      rootUserMergeRef,
      'child_changed',
      createUserMergeUpdatedEventHandler(pubsub),
    );
  }

  private subscribeOnUserMergeAdding(
    rootUserMergeRef: FirebaseReference<Record<string, UserMergeDB>>,
    pubsub: PubSub,
  ): () => void {
    return subscribeOnFirebaseEvent(
      // Firebase child added event calls on every exist item first, than on every creation event.
      // So we should skip every exists items using limit to last 1 so as not to retrieve all items
      // !IMPORTANT
      // * limitToLast(1) retrieves from database only the last item
      // * Items are ordered by key by default so if added node is not the last one, this event won't trigger
      // * Using firebase push() method to create node ensures that this item will be the last one
      rootUserMergeRef.limitToLast(1),
      'child_added',
      skipFirst(createUserMergeAddedEventHandler(pubsub)),
    );
  }
}
