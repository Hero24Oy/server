import { Inject, Module } from '@nestjs/common';
import { UserMergeResolver } from './user-merge.resolver';
import { UserMergeService } from './user-merge.service';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { PubSub } from 'graphql-subscriptions';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { FirebaseAdminAppInstance } from '../firebase/firebase.types';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import {
  createUserMergeAddedEventHandler,
  createUserMergeUpdatedEventHandler,
} from './user-merge.event-handlers';
import { skipFirst } from '../common/common.utils';

@Module({
  imports: [FirebaseModule, GraphQLPubsubModule],
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
