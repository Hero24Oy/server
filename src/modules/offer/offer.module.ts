import { Inject, Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { OfferHubSpotModule } from './offer-hub-spot/offer-hub-spot.module';
import { OfferService } from './offer.service';
import { OfferResolver } from './offer.resolver';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { PubSub } from 'graphql-subscriptions';
import { FirebaseService } from '../firebase/firebase.service';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAdminAppInstance } from '../firebase/firebase.types';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { updateOfferEventHandler } from './offer.event-handlers';
import { OfferRequestService } from '../offer-request/offer-request.service';

@Module({
  imports: [FirebaseModule, OfferHubSpotModule, GraphQLPubsubModule],
  providers: [OfferService, OfferResolver, OfferRequestService],
  exports: [OfferService],
})
export class OfferModule {
  static unsubscribes: Array<() => Promise<void> | void> = [];

  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  onApplicationBootstrap() {
    this.subscribeOnOfferUpdates(
      this.firebaseService.getDefaultApp(),
      this.pubSub,
    );
  }

  subscribeOnOfferUpdates(app: FirebaseAdminAppInstance, pubsub: PubSub) {
    const database = app.database();
    const offersRef = database.ref(FirebaseDatabasePath.OFFERS);

    const unsubscribes = [
      subscribeOnFirebaseEvent(
        offersRef,
        'child_changed',
        updateOfferEventHandler(pubsub),
      ),
    ];

    OfferModule.unsubscribes.push(...unsubscribes);
  }

  async beforeApplicationShutdown() {
    await Promise.all(
      OfferModule.unsubscribes.map((unsubscribe) => unsubscribe()),
    );

    OfferModule.unsubscribes = [];
  }
}
