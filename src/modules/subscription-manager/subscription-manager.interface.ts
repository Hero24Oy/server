type Unsubscribe = () => Promise<void> | void;

export interface SubscriptionService {
  subscribe(): Promise<Unsubscribe> | Unsubscribe;
}
