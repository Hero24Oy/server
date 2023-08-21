import { Unsubscribe } from './subscription-manager.types';

export interface SubscriptionService {
  subscribe(): Promise<Unsubscribe> | Unsubscribe;
  disabled?: () => boolean;
}
