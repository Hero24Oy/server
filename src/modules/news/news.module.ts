import { Inject, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { skipFirst } from '../common/common.utils';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseModule } from '../firebase/firebase.module';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseAdminAppInstance } from '../firebase/firebase.types';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';

import {
  createNewsAddedEventHandler,
  createNewsRemovedEventHandler,
  createNewsUpdatedEventHandler,
} from './news.event-handlers';
import { NewsResolver } from './news.resolver';
import { NewsService } from './news.service';

@Module({
  imports: [FirebaseModule, GraphQlPubsubModule],
  providers: [NewsService, NewsResolver],
})
export class NewsModule {
  static unsubscribes: Array<() => Promise<void> | void> = [];

  constructor(
    private firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  onApplicationBootstrap() {
    this.subscribeOnNewsUpdates(
      this.firebaseService.getDefaultApp(),
      this.pubSub,
    );
  }

  subscribeOnNewsUpdates(app: FirebaseAdminAppInstance, pubsub: PubSub) {
    const database = app.database();
    const rootNewsRef = database.ref(FirebaseDatabasePath.NEWS);

    const unsubscribes = [
      subscribeOnFirebaseEvent(
        rootNewsRef,
        'child_changed',
        createNewsUpdatedEventHandler(pubsub),
      ),
      subscribeOnFirebaseEvent(
        // Firebase child added event calls on every exist item first, than on every creation event.
        // So we should skip every exists items using limit to last 1 so as not to retrieve all items
        rootNewsRef.limitToLast(1),
        'child_added',
        skipFirst(createNewsAddedEventHandler(pubsub)),
      ),
      subscribeOnFirebaseEvent(
        rootNewsRef,
        'child_removed',
        createNewsRemovedEventHandler(pubsub),
      ),
    ];

    NewsModule.unsubscribes.push(...unsubscribes);
  }

  async beforeApplicationShutdown() {
    await Promise.all(
      NewsModule.unsubscribes.map((unsubscribe) => unsubscribe()),
    );

    NewsModule.unsubscribes = [];
  }
}
