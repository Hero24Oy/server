import { Inject, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { NewsService } from './news.service';
import { NewsResolver } from './news.resolver';
import { FirebaseModule } from '../firebase/firebase.module';
import { FirebaseService } from '../firebase/firebase.service';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAdminAppInstance } from '../firebase/firebase.types';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import {
  createNewsAddedEventHandler,
  createNewsRemovedEventHandler,
  createNewsUpdatedEventHandler,
} from './news.event-handlers';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';

@Module({
  imports: [FirebaseModule, GraphQLPubsubModule],
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        rootNewsRef,
        'child_added',
        createNewsAddedEventHandler(pubsub),
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
