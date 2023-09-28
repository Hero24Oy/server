import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { HeroPortfolioDB } from 'hero24-types';

import { skipFirst } from '../common/common.utils';
import { FirebaseReference } from '../firebase/firebase.types';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import {
  SubscriptionService,
  Unsubscribe,
} from '../subscription-manager/subscription-manager.types';

import {
  createHeroPortfolioCreatedEventHandler,
  createHeroPortfolioRemovedEventHandler,
} from './hero-portfolio.event-handler';
import { HeroPortfolioService } from './hero-portfolio.service';

@Injectable()
export class HeroPortfolioSubscription implements SubscriptionService {
  private readonly unsubscribes: Array<() => void> = [];

  constructor(
    private readonly heroPortfolioService: HeroPortfolioService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  public async subscribe(): Promise<Unsubscribe> {
    const { heroPortfolioTableRef } = this.heroPortfolioService;

    const heroPortfolioRefs = (await heroPortfolioTableRef.get()).val() ?? [];

    Object.keys(heroPortfolioRefs).forEach(async (sellerId) =>
      this.unsubscribes.push(
        await this.subscribeOnHeroPortfolioCreation(
          heroPortfolioTableRef.child(sellerId),
          this.pubSub,
        ),

        await this.subscribeOnHeroPortfolioRemoval(
          heroPortfolioTableRef.child(sellerId),
          this.pubSub,
        ),
      ),
    );

    return async () => {
      await Promise.all(this.unsubscribes.map((unsubscribe) => unsubscribe()));
    };
  }

  private async subscribeOnHeroPortfolioCreation(
    childHeroPortfolioRef: FirebaseReference<Record<string, HeroPortfolioDB>>,
    pubsub: PubSub,
  ): Promise<() => void> {
    return subscribeOnFirebaseEvent(
      childHeroPortfolioRef.limitToLast(1),
      'child_added',
      skipFirst(createHeroPortfolioCreatedEventHandler(pubsub)),
    );
  }

  private async subscribeOnHeroPortfolioRemoval(
    childHeroPortfolioRef: FirebaseReference<Record<string, HeroPortfolioDB>>,
    pubsub: PubSub,
  ): Promise<() => void> {
    return subscribeOnFirebaseEvent(
      childHeroPortfolioRef,
      'child_removed',
      createHeroPortfolioRemovedEventHandler(pubsub),
    );
  }
}
