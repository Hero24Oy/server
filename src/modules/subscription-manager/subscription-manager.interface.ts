// TODO: Resolve cycle dependency
// eslint-disable-next-line import/no-cycle
import { Unsubscribe } from './subscription-manager.types';

export interface SubscriptionService {
  subscribe(): Promise<Unsubscribe> | Unsubscribe;
  disabled?: () => boolean;
}
