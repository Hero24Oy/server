import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CategoriesDB } from 'hero24-types';

import { skipFirst } from '../common/common.utils';
import { FirebaseReference } from '../firebase/firebase.types';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import {
  SubscriptionService,
  Unsubscribe,
} from '../subscription-manager/subscription-manager.types';

import {
  createCategoriesCreatedEventHandler,
  createCategoriesUpdatedEventHandler,
} from './event-handler';
import { CategoryService } from './service';

@Injectable()
export class CategorySubscription implements SubscriptionService {
  constructor(
    private readonly categoryService: CategoryService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  public async subscribe(): Promise<Unsubscribe> {
    const { categoriesTableRef } = this.categoryService;

    const unsubscribes = [
      await this.subscribeOnCategoryUpdates(categoriesTableRef),
      await this.subscribeOnCategoriesCreation(categoriesTableRef),
    ];

    return async () => {
      await Promise.all(unsubscribes.map((unsubscribe) => unsubscribe()));
    };
  }

  private async subscribeOnCategoryUpdates(
    rootFeesRef: FirebaseReference<CategoriesDB>,
  ): Promise<Unsubscribe> {
    return subscribeOnFirebaseEvent(
      rootFeesRef,
      'child_changed',
      createCategoriesUpdatedEventHandler(this.pubSub),
    );
  }

  private async subscribeOnCategoriesCreation(
    rootFeesRef: FirebaseReference<CategoriesDB>,
  ): Promise<Unsubscribe> {
    return subscribeOnFirebaseEvent(
      // Firebase child added event calls on every exist item first, than on every creation event.
      // So we should skip every exists items using limit to last 1 so as not to retrieve all items
      rootFeesRef.limitToLast(1),
      'child_added',
      skipFirst(createCategoriesCreatedEventHandler(this.pubSub)),
    );
  }
}
