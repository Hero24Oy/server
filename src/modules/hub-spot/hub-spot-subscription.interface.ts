import {
  SubscriptionService,
  Unsubscribe,
} from '../subscription-manager/subscription-manager.types';

import { ConfigType } from '$config';

export abstract class HubSpotSubscription implements SubscriptionService {
  protected abstract config: ConfigType;

  public isDisabled(): boolean {
    return this.config.hubSpot.disabled;
  }

  public abstract subscribe(): Promise<Unsubscribe> | Unsubscribe;
}
