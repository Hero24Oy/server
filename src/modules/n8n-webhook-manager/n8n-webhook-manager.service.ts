import { Injectable } from '@nestjs/common';

import { N8nWebhookSubscriptionService } from './n8n-webhook-manager.interface';

@Injectable()
export class N8nWebhookManagerService implements N8nWebhookSubscriptionService {
  private n8nSubscriptions: N8nWebhookSubscriptionService[];

  constructor(...n8nSubscriptions: N8nWebhookSubscriptionService[]) {
    this.n8nSubscriptions = n8nSubscriptions;
  }

  subscribe() {
    const unsubscribes = this.n8nSubscriptions.map((subscriber) =>
      subscriber.subscribe(),
    );

    return async () =>
      unsubscribes.reduce(
        (promise, unsubscribe) => promise.then(unsubscribe),
        Promise.resolve(),
      );
  }
}
