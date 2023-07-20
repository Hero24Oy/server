import { Inject, Module } from '@nestjs/common';
import { CategoriesResolver } from './categories.resolver';
import { CategoriesService } from './categories.service';
import { GraphQLPubsubModule } from 'src/modules/graphql-pubsub/graphql-pubsub.module';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';
import { FirebaseService } from 'src/modules/firebase/firebase.service';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';
import { PubSub } from 'graphql-subscriptions';
import { FirebaseAdminAppInstance } from 'src/modules/firebase/firebase.types';
import { FirebaseDatabasePath } from 'src/modules/firebase/firebase.constants';
import { subscribeOnFirebaseEvent } from 'src/modules/firebase/firebase.utils';
import { createCategoriesUpdatedEventHandler } from './categories.event-handlers';


@Module({
  imports: [FirebaseModule, GraphQLPubsubModule],
  providers: [CategoriesResolver, CategoriesService],
})
export class CategoriesModule {
  static unsubscribes: Array<() => Promise<void> | void> = [];

  constructor(
    private firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  onApplicationBootstrap() {
    this.subscribeOnCategoriesUpdates(
      this.firebaseService.getDefaultApp(),
      this.pubSub,
    );
  }

  subscribeOnCategoriesUpdates(app: FirebaseAdminAppInstance, pubsub: PubSub) {
    const database = app.database();

    const categoriesRef = database.ref(FirebaseDatabasePath.CATEGORIES);

    const unsubscribes = [
      subscribeOnFirebaseEvent(
        categoriesRef,
        'child_changed',
        createCategoriesUpdatedEventHandler(pubsub),
      ),
      subscribeOnFirebaseEvent(
        categoriesRef,
        'child_added',
        createCategoriesUpdatedEventHandler(pubsub),
      ),
    ];
  }

  async beforeApplicationShutdown() {
    await Promise.all(
      CategoriesModule.unsubscribes.map((unsubscribe) => unsubscribe()),
    );

    CategoriesModule.unsubscribes = [];
  }
}
