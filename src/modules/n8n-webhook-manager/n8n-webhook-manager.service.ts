import { Injectable } from '@nestjs/common';

import { N8nWebhookSubscriptionService } from './n8n-webhook-manager.interface';

@Injectable()
export class N8nWebhookManagerService implements N8nWebhookSubscriptionService {
  private n8nSubscriptions: N8nWebhookSubscriptionService[];

  constructor(...n8nSubscriptions: N8nWebhookSubscriptionService[]) {
    this.n8nSubscriptions = n8nSubscriptions;
  }

  async subscribe() {
    const unsubscribes = await Promise.all(
      this.n8nSubscriptions.map((subscriber) => subscriber.subscribe()),
    );

    return async () => {
      await Promise.all(unsubscribes.map((unsubscribe) => unsubscribe()));
    };
  }
}
