type Unsubscribe = () => Promise<void> | void;

export interface N8nWebhookSubscriptionService {
  subscribe(): Promise<Unsubscribe> | Unsubscribe;
}
