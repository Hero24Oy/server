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

    const unsubscribes = [
      subscribeOnFirebaseEvent(
        rootUserMergeRef,
        'child_changed',
        createUserMergeUpdatedEventHandler(pubsub),
      ),
      subscribeOnFirebaseEvent(
        rootUserMergeRef,
        'child_added',
        createUserMergeAddedEventHandler(pubsub),
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
