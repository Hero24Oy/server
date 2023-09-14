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
  createUserMergeAddedEventHandler,
  createUserMergeUpdatedEventHandler,
} from './user-merge.event-handlers';
import { UserMergeResolver } from './user-merge.resolver';
import { UserMergeService } from './user-merge.service';

@Module({
  imports: [FirebaseModule, GraphQlPubsubModule],
  providers: [UserMergeResolver, UserMergeService],
})
export class UserMergeModule {
  static unsubscribes: Array<() => Promise<void> | void> = [];

  constructor(
    private firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  onApplicationBootstrap() {
    this.subscribeOnUserMergeUpdates(
      this.firebaseService.getDefaultApp(),
      this.pubSub,
    );
  }

  subscribeOnUserMergeUpdates(app: FirebaseAdminAppInstance, pubsub: PubSub) {
    const database = app.database();

    const rootUserMergeRef = database.ref(FirebaseDatabasePath.USER_MERGES);

    UserMergeModule.unsubscribes = [
      subscribeOnFirebaseEvent(
        rootUserMergeRef,
        'child_changed',
        createUserMergeUpdatedEventHandler(pubsub),
      ),
      subscribeOnFirebaseEvent(
        // Firebase child added event calls on every exist item first, than on every creation event.
        // So we should skip every exists items using limit to last 1 so as not to retrieve all items
        rootUserMergeRef.limitToLast(1),
        'child_added',
        skipFirst(createUserMergeAddedEventHandler(pubsub)),
      ),
    ];
  }

  async beforeApplicationShutdown() {
    await Promise.all(
      UserMergeModule.unsubscribes.map((unsubscribe) => unsubscribe()),
    );

    UserMergeModule.unsubscribes = [];
  }
}
