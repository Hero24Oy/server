import { Injectable } from '@nestjs/common';

import { SubscriptionService } from './subscription-manager.interface';

@Injectable()
export class SubscriptionManagerService implements SubscriptionService {
  private subscriptions: SubscriptionService[];

  constructor(...subscriptions: SubscriptionService[]) {
    this.subscriptions = subscriptions;
  }

  async subscribe() {
    const unsubscribes = await Promise.all(
      this.subscriptions.map(async (subscriber) => subscriber.subscribe()),
    );

    return async () => {
      await Promise.all(unsubscribes.map((unsubscribe) => unsubscribe()));
    };
  }
}
