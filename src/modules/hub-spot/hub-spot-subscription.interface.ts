import {
  SubscriptionService,
  Unsubscribe,
} from '../subscription-manager/subscription-manager.types';

import { Config } from '$config';

export abstract class HubSpotSubscription implements SubscriptionService {
  protected abstract config: Config;

  public isDisabled(): boolean {
    return this.config.hubSpot.disabled;
  }

  public abstract subscribe(): Promise<Unsubscribe> | Unsubscribe;
}
