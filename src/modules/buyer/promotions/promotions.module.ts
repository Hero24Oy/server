import { Inject, Module } from '@nestjs/common';
import { PUBSUB_PROVIDER } from '../../graphql-pubsub/graphql-pubsub.constants';
import { PubSub } from 'graphql-subscriptions';
import { FirebaseService } from '../../firebase/firebase.service';
import { FirebaseModule } from '../../firebase/firebase.module';
import { GraphQLPubsubModule } from '../../graphql-pubsub/graphql-pubsub.module';
import { FirebaseAdminAppInstance } from '../../firebase/firebase.types';
import { FirebaseDatabasePath } from '../../firebase/firebase.constants';
import { subscribeOnFirebaseEvent } from '../../firebase/firebase.utils';
import { PromotionsResolver } from './promotions.resolver';
import { PromotionsService } from './promotions.service';
import { createPromotionsAddedEventHandler, createPromotionsUpdatedEventHandler } from './promotions.event-handlers';

@Module({
  imports: [FirebaseModule, GraphQLPubsubModule],
  providers: [PromotionsService, PromotionsResolver],
})
export class PromotionsModule {
  static unsubscribes: Array<() => Promise<void> | void> = [];

  constructor(
    private firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  onApplicationBootstrap() {
    this.subscribeOnPromotionUpdates(
      this.firebaseService.getDefaultApp(),
      this.pubSub,
    );
  }

  subscribeOnPromotionUpdates(app: FirebaseAdminAppInstance, pubsub: PubSub) {
    const database = app.database();

    const rootPromotionsRef = database.ref(FirebaseDatabasePath.PROMOTIONS);

      PromotionsModule.unsubscribes = [
          subscribeOnFirebaseEvent(
              rootPromotionsRef,
              'child_changed',
              createPromotionsUpdatedEventHandler(pubsub),
          ),
          subscribeOnFirebaseEvent(
                // Firebase child added event calls on every exist item first, than on every creation event.
                // So we should skip every exists items using limit to last 1 so as not to retrieve all items
              rootPromotionsRef.limitToLast(1),
              'child_added',
              createPromotionsAddedEventHandler(pubsub),
          ),
          subscribeOnFirebaseEvent(
              rootPromotionsRef,
              'child_removed',
              createPromotionsUpdatedEventHandler(pubsub),
          ),
    ];
  }

  async beforeApplicationShutdown() {
    await Promise.all(
      PromotionsModule.unsubscribes.map((unsubscribe) => unsubscribe()),
    );

    PromotionsModule.unsubscribes = [];
  }
}
