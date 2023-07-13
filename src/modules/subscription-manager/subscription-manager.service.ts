import { Inject, Injectable } from '@nestjs/common';

import { SubscriptionService } from './subscription-manager.interface';
import { SUBSCRIPTIONS_PROVIDER } from './subscription-manager.constants';

@Injectable()
export class SubscriptionManagerService implements SubscriptionService {
  constructor(
    @Inject(SUBSCRIPTIONS_PROVIDER)
    private subscriptions: SubscriptionService[],
  ) {}

  async subscribe() {
    const unsubscribes = await Promise.all(
      this.subscriptions.map(async (subscriber) => subscriber.subscribe()),
    );

    return async () => {
      await Promise.all(unsubscribes.map((unsubscribe) => unsubscribe()));
    };
  }
}
