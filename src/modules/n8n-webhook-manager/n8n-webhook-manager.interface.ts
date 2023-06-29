type Unsubscribe = () => Promise<void>;

export interface N8nWebhookSubscriptionService {
  subscribe(): Unsubscribe;
}
